import { useEffect, useState } from 'react';

/**
 * Returns true if the user prefers reduced motion. Updates live.
 *
 * Note: Framer Motion already respects `prefers-reduced-motion` for many
 * properties, but this hook is useful when you want to short-circuit
 * imperative animations (e.g., scroll-into-view smoothness).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
