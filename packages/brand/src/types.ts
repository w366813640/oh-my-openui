import type { ReactNode } from 'react';

export interface BrandPalette {
  /** Optional override for the accent color. Defaults to the active theme accent. */
  accent?: string;
  accentHover?: string;
  accentSoft?: string;
  /** Optional override for the asterisk / brand glyph color. */
  asterisk?: string;
}

export interface BrandFonts {
  /** Optional override for the serif font family. */
  serif?: string;
  /** Optional override for the sans font family. */
  sans?: string;
  /** Optional override for the mono font family. */
  mono?: string;
}

export interface BrandTheme {
  /** The display name shown in the sidebar / titlebar. */
  name: string;
  /** Logo node — pass any React element. Defaults to a glowing asterisk. */
  logo?: ReactNode;
  /** Compact logo for the very narrow icon rail (16-20px). */
  logoCompact?: ReactNode;
  /** Color overrides; if omitted falls back to the active design tokens. */
  palette?: BrandPalette;
  /** Font family overrides. */
  fonts?: BrandFonts;
  /** Custom greeting templates. If omitted, uses the built-in time-aware ones. */
  greetings?: {
    morning?: string[];
    afternoon?: string[];
    evening?: string[];
    night?: string[];
    returning?: string[];
  };
  /** Default product disclaimer rendered under chat threads. */
  disclaimer?: ReactNode;
  /** Default placeholder copy for the Composer. */
  composerPlaceholder?: string;
}
