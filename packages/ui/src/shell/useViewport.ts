import { useEffect, useState } from 'react';

/**
 * Three-tier viewport breakpoints. Picked so that:
 *   - `xs` (≤599) covers narrow desktop snap-windows and most phones.
 *   - `sm` (600–959) covers tablets, half-screen splits, and tucked panels.
 *   - `md` (≥960) is the design target for the full split chat+artifact view.
 *
 * AppShell auto-derives sidebar mode from this hook when no explicit
 * mode is supplied: xs → drawer, sm → collapsed rail, md → expanded.
 */
export type Breakpoint = 'xs' | 'sm' | 'md';

export interface Viewport {
  breakpoint: Breakpoint;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  width: number;
}

function compute(width: number): Viewport {
  let breakpoint: Breakpoint;
  if (width < 600) breakpoint = 'xs';
  else if (width < 960) breakpoint = 'sm';
  else breakpoint = 'md';
  return {
    breakpoint,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    width,
  };
}

/**
 * Track the current viewport. Uses a single resize listener and produces a
 * stable object reference unless the breakpoint changes (so callers using
 * `viewport.breakpoint` won't re-render on every pixel resize). Returns a
 * safe SSR default of `md` when `window` is undefined.
 */
export function useViewport(): Viewport {
  const [v, setV] = useState<Viewport>(() => {
    if (typeof window === 'undefined') return compute(1280);
    return compute(window.innerWidth);
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let frame = 0;
    function onResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = compute(window.innerWidth);
        setV((prev) => (prev.breakpoint === next.breakpoint ? prev : next));
      });
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return v;
}
