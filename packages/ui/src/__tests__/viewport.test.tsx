import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useViewport } from '../shell/useViewport';

describe('useViewport', () => {
  const originalWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1280,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalWidth,
    });
  });

  it('classifies the three breakpoints', () => {
    Object.defineProperty(window, 'innerWidth', { value: 360, writable: true });
    let { result } = renderHook(() => useViewport());
    expect(result.current.breakpoint).toBe('xs');
    expect(result.current.isXs).toBe(true);

    Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
    ({ result } = renderHook(() => useViewport()));
    expect(result.current.breakpoint).toBe('sm');

    Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true });
    ({ result } = renderHook(() => useViewport()));
    expect(result.current.breakpoint).toBe('md');
  });

  it('keeps a stable reference until the breakpoint changes', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    const { result } = renderHook(() => useViewport());
    const first = result.current;
    /* width changes within the same breakpoint should not re-render. */
    await act(async () => {
      Object.defineProperty(window, 'innerWidth', { value: 1100, writable: true });
      window.dispatchEvent(new Event('resize'));
      await new Promise((r) => requestAnimationFrame(r));
    });
    expect(result.current).toBe(first);
  });
});
