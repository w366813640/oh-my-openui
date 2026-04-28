/**
 * Design tokens — TypeScript representation.
 *
 * The ground truth lives in CSS variables (see `./css/*.css`). These TS exports
 * mirror the shape so consumers can inspect / generate docs / theme programmatically.
 */

export const lightColors = {
  bg: '#F7F3EA',
  surface: '#FFFAF2',
  surfaceMuted: '#EFE8DC',
  surfaceRaised: '#FFFFFF',
  surfaceSunken: '#EBE3D5',
  text: '#2B2926',
  textMuted: '#7B746B',
  textSubtle: '#A8A096',
  border: '#E2D9CB',
  borderStrong: '#CFC4B2',
  accent: '#C96F4A',
  accentHover: '#B85F3D',
  accentSoft: '#F4E1D5',
  accentText: '#FFFFFF',
  destructive: '#D14343',
  destructiveSoft: '#FBE7E7',
  success: '#3F9871',
  warning: '#C8862A',
  info: '#5577B8',
  asterisk: '#D9825F',
  user: '#33312D',
  userBg: '#EEE7DC',
} as const;

export const darkColors = {
  bg: '#1F1E1B',
  surface: '#26241F',
  surfaceMuted: '#2D2A24',
  surfaceRaised: '#34312B',
  surfaceSunken: '#1A1916',
  text: '#F1ECE2',
  textMuted: '#A8A096',
  textSubtle: '#766F66',
  border: '#3A3631',
  borderStrong: '#4D4841',
  accent: '#D9825F',
  accentHover: '#E2926F',
  accentSoft: '#3A2A22',
  accentText: '#FFFFFF',
  destructive: '#E16868',
  destructiveSoft: '#3B1F1F',
  success: '#5BAE85',
  warning: '#D49A45',
  info: '#7C9AD9',
  asterisk: '#E2926F',
  user: '#F1ECE2',
  userBg: '#2D2A24',
} as const;

export type ColorKey = keyof typeof lightColors;

export const radius = {
  none: '0px',
  xs: '6px',
  sm: '8px',
  md: '10px',
  lg: '14px',
  xl: '18px',
  '2xl': '24px',
  full: '9999px',
} as const;

export const space = {
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const fontFamily = {
  serif:
    "'Source Serif 4', 'Source Serif Pro', 'Tiempos Headline', 'Iowan Old Style', 'Apple Garamond', Georgia, 'Times New Roman', serif",
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'SF Mono', Menlo, Consolas, monospace",
} as const;

export const fontSize = {
  '2xs': ['11px', { lineHeight: '14px' }],
  xs: ['12px', { lineHeight: '16px' }],
  sm: ['13px', { lineHeight: '18px' }],
  base: ['14px', { lineHeight: '21px' }],
  md: ['15px', { lineHeight: '23px' }],
  lg: ['17px', { lineHeight: '26px' }],
  xl: ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['30px', { lineHeight: '38px' }],
  '4xl': ['38px', { lineHeight: '46px' }],
} as const;

export const shadow = {
  none: 'none',
  xs: '0 1px 2px rgba(53, 41, 28, 0.05)',
  composer: '0 1px 0 rgba(53,41,28,0.04), 0 8px 24px -12px rgba(53,41,28,0.10)',
  composerFocus: '0 1px 0 rgba(53,41,28,0.06), 0 12px 32px -10px rgba(53,41,28,0.14)',
  popover: '0 8px 28px -8px rgba(53,41,28,0.18), 0 2px 6px rgba(53,41,28,0.06)',
  modal: '0 24px 64px -16px rgba(53,41,28,0.28), 0 8px 16px -8px rgba(53,41,28,0.10)',
  card: '0 1px 2px rgba(53, 41, 28, 0.04)',
} as const;

export const motion = {
  duration: {
    instant: '60ms',
    fast: '120ms',
    base: '180ms',
    medium: '240ms',
    slow: '320ms',
    slower: '480ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.3, 0, 0, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  spring: {
    gentle: { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 },
    snappy: { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 },
    bouncy: { type: 'spring', stiffness: 320, damping: 18, mass: 1 },
  },
} as const;

export const z = {
  base: 0,
  raised: 10,
  sticky: 20,
  dropdown: 100,
  popover: 200,
  tooltip: 300,
  modalBackdrop: 400,
  modal: 410,
  toast: 500,
  titlebar: 1000,
} as const;

export const tokens = {
  colors: { light: lightColors, dark: darkColors },
  radius,
  space,
  fontFamily,
  fontSize,
  shadow,
  motion,
  z,
} as const;
