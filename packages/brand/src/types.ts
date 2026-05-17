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
  /**
   * Optional desktop-host metadata. Used by the Electron main process to
   * paint the splash window and Win11 titlebar overlay in your brand
   * palette. Live values are read from `apps/desktop/brand.config.json`
   * by the main process — this type is the contract.
   */
  desktop?: BrandDesktopConfig;
}

export interface BrandDesktopConfig {
  /** Splash window inline-painted while the React renderer is booting. */
  splash?: {
    /** Background fill (light surface tone). */
    background?: string;
    /** Foreground tone for the wordmark/brand glyph. */
    foreground?: string;
    /** Accent color for the brand glyph stroke. */
    accent?: string;
    /** Same fields again for the dark variant. Defaults flip from light. */
    backgroundDark?: string;
    foregroundDark?: string;
    accentDark?: string;
  };
  /** Win11 titleBarOverlay paint. The OS draws min/max/close in these tones. */
  titlebar?: {
    lightBg?: string;
    lightSymbol?: string;
    darkBg?: string;
    darkSymbol?: string;
  };
}
