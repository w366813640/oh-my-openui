import {
  type CSSProperties,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { AuroraLogo } from './AuroraLogo';
import type { BrandTheme } from './types';

export const auroraBrand: BrandTheme = {
  name: 'Aurora',
  logo: <AuroraLogo size={24} />,
  logoCompact: <AuroraLogo size={18} />,
  palette: {
    accent: '#c96f4a',
    accentHover: '#b85f3d',
    accentSoft: '#f4e1d5',
    asterisk: '#d9825f',
  },
  composerPlaceholder: 'How can I help you today?',
  disclaimer: 'Responses may contain mistakes. Please double-check important answers.',
};

/**
 * "claude-tribute" is a study/parity brand intended only for local visual
 * comparison against reference screenshots. Use the Aurora brand (or your own)
 * for anything you ever distribute or showcase publicly.
 */
export const claudeTributeBrand: BrandTheme = {
  name: 'Claude (study)',
  // Intentionally re-uses AuroraLogo to avoid bundling Anthropic's exact mark.
  // Replace with your own asset locally if doing pixel comparisons.
  logo: <AuroraLogo size={24} />,
  logoCompact: <AuroraLogo size={18} />,
  palette: {
    accent: '#cc785c',
    accentHover: '#b96849',
    accentSoft: '#f1ddd1',
    asterisk: '#d97757',
  },
  composerPlaceholder: 'How can I help you today?',
  disclaimer: 'Claude can make mistakes. Please double-check responses.',
  greetings: {
    morning: ['Morning, {name}', 'Good morning, {name}'],
    afternoon: ["What's new, {name}?", 'Afternoon, {name}'],
    evening: ['Evening, {name}', 'Welcome back, {name}'],
    night: ['Late night, {name}?'],
    returning: ['{name} returns!'],
  },
};

/** Cool sage-green brand — proves the system works for non-warm palettes. */
export const sageBrand: BrandTheme = {
  name: 'Sage',
  logo: <AuroraLogo size={24} />,
  logoCompact: <AuroraLogo size={18} />,
  palette: {
    accent: '#5e8b6a',
    accentHover: '#4f7a5b',
    accentSoft: '#dde7df',
    asterisk: '#6b9e78',
  },
  composerPlaceholder: 'What are we exploring?',
  disclaimer: 'Sage can make mistakes. Verify before acting on anything important.',
};

/** Cool indigo brand — slate / blue accent for a "developer tool" mood. */
export const indigoBrand: BrandTheme = {
  name: 'Indigo',
  logo: <AuroraLogo size={24} />,
  logoCompact: <AuroraLogo size={18} />,
  palette: {
    accent: '#5a6fc4',
    accentHover: '#4a5fb4',
    accentSoft: '#dde2f2',
    asterisk: '#6c80d0',
  },
  composerPlaceholder: 'Ask anything…',
  disclaimer: 'Double-check generated content before relying on it.',
};

/**
 * The list of brands that ship with the scaffold. Consumers can append their
 * own with `[...builtInBrands, myBrand]` and feed the array to BrandSwitcher.
 */
export const builtInBrands: readonly BrandTheme[] = [
  auroraBrand,
  claudeTributeBrand,
  sageBrand,
  indigoBrand,
];

const BrandContext = createContext<BrandTheme>(auroraBrand);

export interface BrandProviderProps {
  brand?: BrandTheme;
  children: ReactNode;
}

export function BrandProvider({ brand = auroraBrand, children }: BrandProviderProps) {
  const cssVars = useMemo<CSSProperties>(() => {
    const style: Record<string, string> = {};
    const p = brand.palette;
    if (p?.accent) style['--color-accent'] = p.accent;
    if (p?.accentHover) style['--color-accent-hover'] = p.accentHover;
    if (p?.accentSoft) style['--color-accent-soft'] = p.accentSoft;
    if (p?.asterisk) style['--color-asterisk'] = p.asterisk;
    const f = brand.fonts;
    if (f?.serif) style['--font-serif'] = f.serif;
    if (f?.sans) style['--font-sans'] = f.sans;
    if (f?.mono) style['--font-mono'] = f.mono;
    return style as CSSProperties;
  }, [brand]);

  /**
   * Wrap in a non-`contents` element so the CSS variables actually cascade.
   * We use `display: contents` semantically — but that drops `style` from the
   * cascade in some browsers, so we add `transition` to make subsequent
   * accent / font swaps feel intentional rather than abrupt.
   */
  const transitionStyle: CSSProperties = {
    transition:
      'background-color 320ms cubic-bezier(0.2,0,0,1), color 320ms cubic-bezier(0.2,0,0,1)',
  };
  return (
    <BrandContext.Provider value={brand}>
      <div style={{ ...cssVars, ...transitionStyle }} className="contents">
        {children}
      </div>
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandTheme {
  return useContext(BrandContext);
}
