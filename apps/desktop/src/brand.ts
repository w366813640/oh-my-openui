import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

/**
 * Desktop-host brand palette. Loaded once at app start from
 * `apps/desktop/brand.config.json` (next to the packaged main process) so
 * downstream forks can repaint the splash + Win11 titlebar overlay without
 * editing TypeScript. Fields are optional -- missing entries fall back to
 * the Claude reference defaults.
 *
 * The renderer-side brand swap is handled separately by `<BrandProvider>`
 * from `@oh/brand`; this module is the OS-chrome counterpart.
 */
export interface DesktopBrand {
  splash: {
    background: string;
    foreground: string;
    accent: string;
    backgroundDark: string;
    foregroundDark: string;
    accentDark: string;
  };
  titlebar: {
    lightBg: string;
    lightSymbol: string;
    darkBg: string;
    darkSymbol: string;
  };
}

export const DEFAULT_DESKTOP_BRAND: DesktopBrand = {
  splash: {
    background: '#fbf9f5',
    foreground: '#252623',
    accent: '#c96442',
    backgroundDark: '#252623',
    foregroundDark: '#f3f0e8',
    accentDark: '#d97757',
  },
  titlebar: {
    lightBg: '#fbf9f5',
    lightSymbol: '#262522',
    darkBg: '#252623',
    darkSymbol: '#f3f0e8',
  },
};

function candidateConfigPaths(): string[] {
  /* In dev (`pnpm desktop:dev`) the JSON sits at apps/desktop/brand.config.json
   * relative to the running tsx process. In packaged builds the file is
   * copied next to the main JS bundle by electron-builder (see files: in
   * electron-builder.yml). */
  return [
    path.join(app.getAppPath(), 'brand.config.json'),
    path.join(app.getAppPath(), '..', 'brand.config.json'),
    path.join(__dirname, '..', '..', 'brand.config.json'),
    path.join(__dirname, '..', 'brand.config.json'),
  ];
}

export function loadDesktopBrand(): DesktopBrand {
  for (const candidate of candidateConfigPaths()) {
    if (!existsSync(candidate)) continue;
    try {
      const raw = JSON.parse(readFileSync(candidate, 'utf8')) as Partial<{
        splash: Partial<DesktopBrand['splash']>;
        titlebar: Partial<DesktopBrand['titlebar']>;
      }>;
      return {
        splash: { ...DEFAULT_DESKTOP_BRAND.splash, ...(raw.splash ?? {}) },
        titlebar: { ...DEFAULT_DESKTOP_BRAND.titlebar, ...(raw.titlebar ?? {}) },
      };
    } catch (err) {
      console.warn('[oh/desktop] brand.config.json parse failed; using defaults', err);
      return DEFAULT_DESKTOP_BRAND;
    }
  }
  return DEFAULT_DESKTOP_BRAND;
}
