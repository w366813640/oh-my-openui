/**
 * Design tokens — TypeScript representation.
 *
 * The ground truth lives in CSS variables (see `./css/*.css`). These TS exports
 * mirror the shape so consumers can inspect / generate docs / theme programmatically.
 */

export const lightColors = {
  bg: '#FBF9F5',
  surface: '#FFFFFF',
  surfaceMuted: '#EFEEE6',
  surfaceRaised: '#FFFFFF',
  surfaceSunken: '#F5F4ED',
  text: '#262522',
  textMuted: '#6F6A62',
  textSubtle: '#7A7568',
  border: '#DFDDD6',
  borderStrong: '#CBC7BD',
  borderInteractive: '#A6A399',
  accent: '#C96442',
  accentHover: '#B85A3A',
  accentSoft: '#F3DFD3',
  accentText: '#FFFFFF',
  accentSend: '#E4B0A0',
  accentSendHover: '#DDA08E',
  accentSendText: '#FFFFFF',
  destructive: '#C93F3F',
  destructiveSoft: '#FAE4E1',
  success: '#2F8A68',
  warning: '#B97922',
  info: '#4C70B7',
  asterisk: '#D97757',
  user: '#262522',
  userBg: '#EFEEE5',
} as const;

export const darkColors = {
  bg: '#252623',
  surface: '#30302E',
  surfaceMuted: '#383834',
  surfaceRaised: '#36352F',
  surfaceSunken: '#1C1C1A',
  text: '#F3F0E8',
  textMuted: '#C5BFB4',
  textSubtle: '#9A948A',
  border: '#42423D',
  borderStrong: '#5C5A53',
  borderInteractive: '#7A7770',
  accent: '#D97757',
  accentHover: '#E08A6D',
  accentSoft: '#46322A',
  accentText: '#FFFFFF',
  accentSend: '#DCA08F',
  accentSendHover: '#E3AE9E',
  accentSendText: '#FFFFFF',
  destructive: '#E16868',
  destructiveSoft: '#3B1F1F',
  success: '#5BAE85',
  warning: '#D49A45',
  info: '#86A2DF',
  asterisk: '#D97757',
  user: '#F3EFE7',
  userBg: '#30302E',
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
  xs: '0 1px 2px rgba(47, 39, 29, 0.06)',
  composer:
    '0 1px 0 rgba(47,39,29,0.05), 0 8px 22px -16px rgba(47,39,29,0.18), 0 24px 48px -28px rgba(47,39,29,0.26)',
  composerFocus:
    '0 0 0 1px rgba(200,111,74,0.35), 0 0 0 4px rgba(200,111,74,0.13), 0 8px 22px -12px rgba(47,39,29,0.16)',
  popover:
    '0 1px 0 rgba(47,39,29,0.06), 0 10px 24px -14px rgba(47,39,29,0.24), 0 28px 52px -28px rgba(47,39,29,0.32)',
  modal:
    '0 1px 0 rgba(47,39,29,0.08), 0 18px 36px -16px rgba(47,39,29,0.24), 0 42px 88px -32px rgba(47,39,29,0.42)',
  card: '0 1px 0 rgba(47, 39, 29, 0.04), 0 8px 18px -16px rgba(47, 39, 29, 0.22)',
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
