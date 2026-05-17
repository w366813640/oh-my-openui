import type { Transition } from 'motion/react';

/**
 * Pre-tuned spring presets matching the design language.
 *
 * - `gentle`  — modal scale-in, popovers, side panels
 * - `snappy`  — buttons, chips, dropdowns
 * - `bouncy`  — celebratory overlays, success badges
 * - `silky`   — long sweeps (sidebar collapse, artifact width drag)
 */
export const springs = {
  gentle: { type: 'spring', stiffness: 190, damping: 30, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 280, damping: 32, mass: 0.75 },
  bouncy: { type: 'spring', stiffness: 260, damping: 24, mass: 1.0 },
  silky: { type: 'spring', stiffness: 160, damping: 30, mass: 1.0 },
} as const satisfies Record<string, Transition>;

export type SpringName = keyof typeof springs;

export const easings = {
  standard: [0.2, 0, 0, 1] as [number, number, number, number],
  emphasized: [0.3, 0, 0, 1] as [number, number, number, number],
  decelerate: [0, 0, 0.2, 1] as [number, number, number, number],
  accelerate: [0.4, 0, 1, 1] as [number, number, number, number],
} as const;

export const durations = {
  instant: 0.06,
  fast: 0.12,
  base: 0.18,
  medium: 0.24,
  slow: 0.32,
  slower: 0.48,
} as const;
