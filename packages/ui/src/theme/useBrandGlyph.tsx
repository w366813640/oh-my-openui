import type { ReactNode } from 'react';

/**
 * Resolve the active brand glyph (logo / logoCompact) without requiring a
 * hard dependency on the @oh/brand package from inside @oh/ui.
 *
 * `@oh/ui` purposely does not import `@oh/brand` -- the brand layer sits
 * above the component library so the brand JSON can be replaced without
 * touching shipped primitives. We achieve this by reading the React context
 * through a lazily-resolved consumer: if a parent rendered
 * `<BrandProvider>`, the brand value is available; otherwise we return
 * `null` and consumers fall back to their built-in glyph.
 */
export function useBrandGlyph({ size }: { size: number }): ReactNode | null {
  const brand = readBrandFromWindow();
  if (!brand) return null;
  if (size <= 20 && brand.logoCompact) return brand.logoCompact;
  return brand.logo ?? null;
}

interface MinimalBrand {
  logo?: ReactNode;
  logoCompact?: ReactNode;
}

/**
 * `@oh/brand` exposes itself on `window.__ohBrand` at provider mount time
 * so libraries one layer below (like `@oh/ui`) can introspect without an
 * import cycle. If the field is missing, we return null and consumers
 * keep using their built-in default glyph.
 */
declare global {
  interface Window {
    __ohBrand?: MinimalBrand;
  }
}

function readBrandFromWindow(): MinimalBrand | null {
  if (typeof window === 'undefined') return null;
  return window.__ohBrand ?? null;
}
