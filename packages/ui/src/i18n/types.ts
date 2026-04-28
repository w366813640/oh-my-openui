export type Locale = 'en' | 'zh';

export type Dictionary = Record<string, string>;

export type TranslateVars = Record<string, string | number>;

export interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: TranslateVars) => string;
  /** Combine the active dictionary with consumer-provided overrides. */
  dictionary: Dictionary;
}
