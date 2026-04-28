import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { auroraBrand, BrandProvider, builtInBrands } from './BrandProvider';
import type { BrandTheme } from './types';

/**
 * Stateful wrapper around `<BrandProvider>` so the active brand can be swapped
 * at runtime by any descendant via `useBrandSwitcher()`. Keeps the brand list
 * (built-in + caller-provided) in context so a `<BrandSwitcher>` UI can render.
 */

export interface BrandSwitcherState {
  brand: BrandTheme;
  brands: readonly BrandTheme[];
  setBrandById: (name: string) => void;
}

const BrandSwitcherContext = createContext<BrandSwitcherState | null>(null);

export interface BrandSwitcherProviderProps {
  initialBrandName?: string;
  /** Append your own brands; built-ins are merged automatically. */
  extraBrands?: readonly BrandTheme[];
  children: ReactNode;
}

export function BrandSwitcherProvider({
  initialBrandName,
  extraBrands = [],
  children,
}: BrandSwitcherProviderProps) {
  const brands = useMemo<readonly BrandTheme[]>(() => {
    const all = [...builtInBrands, ...extraBrands];
    const seen = new Set<string>();
    return all.filter((b) => {
      if (seen.has(b.name)) return false;
      seen.add(b.name);
      return true;
    });
  }, [extraBrands]);

  const [activeName, setActiveName] = useState<string>(
    initialBrandName ?? auroraBrand.name,
  );

  const brand = useMemo(
    () => brands.find((b) => b.name === activeName) ?? auroraBrand,
    [brands, activeName],
  );

  const setBrandById = useCallback((name: string) => {
    setActiveName(name);
  }, []);

  const value = useMemo<BrandSwitcherState>(
    () => ({ brand, brands, setBrandById }),
    [brand, brands, setBrandById],
  );

  return (
    <BrandSwitcherContext.Provider value={value}>
      <BrandProvider brand={brand}>{children}</BrandProvider>
    </BrandSwitcherContext.Provider>
  );
}

export function useBrandSwitcher(): BrandSwitcherState {
  const ctx = useContext(BrandSwitcherContext);
  if (!ctx) {
    throw new Error('useBrandSwitcher() must be used within <BrandSwitcherProvider>');
  }
  return ctx;
}

/**
 * Pure presentational picker — render anywhere inside `<BrandSwitcherProvider>`
 * and clicking a swatch swaps the active brand. The accent color animates
 * smoothly via CSS transition on the `BrandProvider` wrapper.
 */
export interface BrandSwitcherProps {
  className?: string;
  /** Layout: `swatches` (color circles) or `pills` (named buttons). */
  variant?: 'swatches' | 'pills';
}

export function BrandSwitcher({ className, variant = 'swatches' }: BrandSwitcherProps) {
  const { brand, brands, setBrandById } = useBrandSwitcher();

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className ?? ''}`}>
        {brands.map((b) => {
          const active = b.name === brand.name;
          return (
            <button
              key={b.name}
              type="button"
              onClick={() => setBrandById(b.name)}
              aria-pressed={active}
              className={[
                'inline-flex items-center gap-2 h-8 px-3 rounded-full text-[12.5px] font-medium',
                'border transition-colors duration-[180ms]',
                active
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]',
              ].join(' ')}
            >
              <span
                className="inline-block h-3 w-3 rounded-full ring-1 ring-inset ring-black/5"
                style={{ background: b.palette?.accent ?? 'var(--color-accent)' }}
              />
              {b.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Brand palette"
      className={`flex items-center gap-2 ${className ?? ''}`}
    >
      {brands.map((b) => {
        const active = b.name === brand.name;
        const swatch = b.palette?.accent ?? 'var(--color-accent)';
        return (
          <button
            key={b.name}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setBrandById(b.name)}
            title={b.name}
            className={[
              'group/swatch relative inline-flex items-center justify-center',
              'h-9 w-9 rounded-full transition-transform duration-[160ms] ease-[var(--ease-spring)]',
              'hover:scale-110 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
            ].join(' ')}
          >
            <span
              className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/5 dark:ring-white/10"
              style={{ background: swatch }}
            />
            {active ? (
              <span
                aria-hidden="true"
                className="relative h-2 w-2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
