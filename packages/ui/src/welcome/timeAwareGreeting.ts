/**
 * Time-aware greeting generator.
 *
 * Combines the user's name + a time-of-day phrase + occasional contextual
 * variants ("returns", "what's new"). Designed to be deterministic per
 * (date, slot) so it doesn't change while the user is staring at the screen.
 */

export type GreetingContext = {
  /** Display name of the user (e.g., "Sam"). Falls back to "there". */
  name?: string;
  /** Override the current time. Useful for tests / snapshotting. */
  now?: Date;
  /** "returning" if user previously had sessions today. "new" if first session. */
  recency?: 'new' | 'returning' | 'longabsent';
  /** Locale for time bucketing. Defaults to en-US. */
  locale?: string;
  /**
   * Optional translator. When provided, generated phrases come from the keys
   * `greeting.morning|afternoon|evening|night|returning|welcome|whatsNew`.
   * The `{name}` placeholder will be substituted automatically.
   */
  t?: (key: string, vars?: Record<string, string | number>) => string;
};

export type TimeBucket = 'earlyMorning' | 'morning' | 'afternoon' | 'evening' | 'night';

export function getTimeBucket(date: Date): TimeBucket {
  const h = date.getHours();
  if (h < 5) return 'night';
  if (h < 9) return 'earlyMorning';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
}

const greetingTemplatesByBucket: Record<TimeBucket, string[]> = {
  earlyMorning: ['Early bird, {name}', 'Good morning, {name}', 'Morning, {name}'],
  morning: ['Morning, {name}', 'Good morning, {name}', "What's on your mind, {name}?"],
  afternoon: ['Afternoon, {name}', "What's new, {name}?", 'How can I help, {name}?'],
  evening: ['Evening, {name}', 'Good evening, {name}', 'Welcome back, {name}'],
  night: ['Burning the midnight oil, {name}?', 'Late night, {name}?', 'Evening, {name}'],
};

const recencyOverrides: Record<NonNullable<GreetingContext['recency']>, string[]> = {
  new: ['Hi, {name}', "Let's get started, {name}", 'Welcome, {name}'],
  returning: ['{name} returns!', 'Welcome back, {name}', 'Good to see you, {name}'],
  longabsent: ["It's been a while, {name}", 'Welcome back, {name}', 'Long time no chat, {name}!'],
};

export interface GreetingResult {
  text: string;
  bucket: TimeBucket;
  /** A stable seed based on the day + bucket — useful for memo. */
  seed: string;
}

/** Map a TimeBucket to its canonical i18n key. */
const bucketToKey: Record<TimeBucket, string> = {
  earlyMorning: 'greeting.morning',
  morning: 'greeting.morning',
  afternoon: 'greeting.afternoon',
  evening: 'greeting.evening',
  night: 'greeting.night',
};

const recencyToKey: Record<NonNullable<GreetingContext['recency']>, string> = {
  new: 'greeting.welcome',
  returning: 'greeting.returning',
  longabsent: 'greeting.welcome',
};

export function generateGreeting(ctx: GreetingContext = {}): GreetingResult {
  const date = ctx.now ?? new Date();
  const name = (ctx.name ?? 'there').trim();
  const bucket = getTimeBucket(date);
  const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const seed = `${dayKey}-${bucket}-${ctx.recency ?? 'auto'}`;

  // Choose template pool: when recency is supplied, give it ~50% chance to be
  // selected, otherwise default to time bucket.
  const useRecency =
    ctx.recency && hashSeed(`${seed}-pool`) % 2 === 0 && recencyOverrides[ctx.recency].length > 0;

  // i18n branch: when a translator is supplied, lookup a single canonical key.
  if (ctx.t) {
    const key = useRecency ? recencyToKey[ctx.recency!] : bucketToKey[bucket];
    const text = ctx.t(key, { name });
    return { text, bucket, seed };
  }

  const pool = useRecency ? recencyOverrides[ctx.recency!] : greetingTemplatesByBucket[bucket];
  const idx = hashSeed(seed) % pool.length;
  const template = pool[idx]!;
  const text = template.replace(/\{name\}/g, name);
  return { text, bucket, seed };
}

/** Tiny FNV-1a hash for deterministic template selection. */
function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
