import type { BundledLanguage, BundledTheme } from 'shiki';
import { type HighlighterCore, createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

/**
 * Lazy, singleton Shiki highlighter — built on `shiki/core` + the JS regex
 * engine so the initial renderer bundle stays small (no oniguruma WASM, no
 * eagerly-bundled languages).
 *
 * Trade-offs:
 *   - `engine-javascript` is slightly less accurate than oniguruma for exotic
 *     grammars, but removes the ~600 KB WASM blob — the right call for an
 *     in-app chat renderer where snippets are simple.
 *   - Languages and themes are listed as static `() => import(...)` refs so
 *     Vite/Rollup can code-split each into its own chunk; only chunks for
 *     languages/themes that actually appear on the page are downloaded.
 *   - The initial JS payload contains only Shiki core + the JS regex engine
 *     (~40–60 KB) plus these tiny loader records.
 */

type ShikiModuleLoader = () => Promise<unknown>;

/**
 * Curated set of languages we eagerly expose (still loaded lazily!). The list
 * mirrors what users will paste in chat: web, systems, scripting, markup,
 * data, infra. Add more as needed; uncommon langs gracefully fall through to
 * plain `text` rendering.
 */
const langLoaders: Partial<Record<BundledLanguage, ShikiModuleLoader>> = {
  bash: () => import('shiki/langs/bash.mjs'),
  c: () => import('shiki/langs/c.mjs'),
  cpp: () => import('shiki/langs/cpp.mjs'),
  csharp: () => import('shiki/langs/csharp.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
  dockerfile: () => import('shiki/langs/dockerfile.mjs'),
  go: () => import('shiki/langs/go.mjs'),
  graphql: () => import('shiki/langs/graphql.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  java: () => import('shiki/langs/java.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  kotlin: () => import('shiki/langs/kotlin.mjs'),
  lua: () => import('shiki/langs/lua.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  php: () => import('shiki/langs/php.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  ruby: () => import('shiki/langs/ruby.mjs'),
  rust: () => import('shiki/langs/rust.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  svelte: () => import('shiki/langs/svelte.mjs'),
  swift: () => import('shiki/langs/swift.mjs'),
  toml: () => import('shiki/langs/toml.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  vue: () => import('shiki/langs/vue.mjs'),
  xml: () => import('shiki/langs/xml.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  zig: () => import('shiki/langs/zig.mjs'),
};

const themeLoaders: Partial<Record<BundledTheme, ShikiModuleLoader>> = {
  'github-light': () => import('shiki/themes/github-light.mjs'),
  'github-dark': () => import('shiki/themes/github-dark.mjs'),
};

const ALIASES: Record<string, BundledLanguage> = {
  shell: 'bash',
  sh: 'bash',
  zsh: 'bash',
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  rs: 'rust',
  yml: 'yaml',
  md: 'markdown',
  cs: 'csharp',
  rb: 'ruby',
  kt: 'kotlin',
  htm: 'html',
};

let highlighterPromise: Promise<HighlighterCore> | null = null;
const loadedLangs = new Set<BundledLanguage | 'text'>(['text']);
const inflightLoads = new Map<BundledLanguage, Promise<void>>();

function unwrap<T = unknown>(mod: unknown): T {
  return ((mod as { default?: T }).default ?? (mod as T)) as T;
}

export async function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const themeMods = await Promise.all(
        Object.values(themeLoaders).map(async (load) => unwrap(await load!())),
      );
      return await createHighlighterCore({
        themes: themeMods as never,
        langs: [],
        engine: createJavaScriptRegexEngine(),
      });
    })();
  }
  return highlighterPromise;
}

export function normalizeLang(input: string | undefined | null): BundledLanguage | 'text' {
  if (!input) return 'text';
  const lower = input.toLowerCase().trim();
  if (lower === 'text' || lower === 'plain' || lower === 'plaintext') return 'text';
  return ALIASES[lower] ?? (lower as BundledLanguage);
}

export async function ensureLanguage(lang: BundledLanguage | 'text'): Promise<void> {
  if (lang === 'text') return;
  if (loadedLangs.has(lang)) return;
  const loader = langLoaders[lang];
  if (!loader) return;
  let inflight = inflightLoads.get(lang);
  if (!inflight) {
    inflight = (async () => {
      try {
        const hl = await getHighlighter();
        const mod = await loader();
        await hl.loadLanguage(unwrap(mod) as never);
        loadedLangs.add(lang);
      } catch {
        // unknown language — silently fall through; renderer will treat as text
      } finally {
        inflightLoads.delete(lang);
      }
    })();
    inflightLoads.set(lang, inflight);
  }
  await inflight;
}

export interface HighlightResult {
  /** Pre-rendered HTML string (theme-aware). */
  html: string;
  language: BundledLanguage | 'text';
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function highlight(
  code: string,
  rawLang: string | undefined,
  theme: 'light' | 'dark' = 'light',
): Promise<HighlightResult> {
  const lang = normalizeLang(rawLang);
  if (lang === 'text') {
    return {
      html: `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`,
      language: lang,
    };
  }
  await ensureLanguage(lang);
  const hl = await getHighlighter();
  const themeName = theme === 'dark' ? 'github-dark' : 'github-light';
  if (!loadedLangs.has(lang)) {
    return {
      html: `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`,
      language: 'text',
    };
  }
  try {
    const html = hl.codeToHtml(code, { lang, theme: themeName });
    return { html, language: lang };
  } catch {
    return {
      html: `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`,
      language: 'text',
    };
  }
}
