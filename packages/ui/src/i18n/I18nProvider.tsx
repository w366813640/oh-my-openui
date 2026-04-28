import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { builtInDictionaries } from './dictionaries';
import type { Dictionary, I18nValue, Locale, TranslateVars } from './types';

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'oh-locale';

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] === undefined ? `{${k}}` : String(vars[k]),
  );
}

export interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
  /**
   * Per-locale dictionary overrides merged on top of the built-in ones.
   * Useful when an app needs to add or override product-specific strings.
   */
  overrides?: Partial<Record<Locale, Dictionary>>;
  /** Persist the picked locale to localStorage. Defaults to true. */
  persist?: boolean;
  /** Sync `<html lang>` to the active locale. Defaults to true. */
  syncHtmlLang?: boolean;
}

/**
 * Lightweight i18n primitive. Intentionally not a full ICU library — it does
 * key lookup, `{name}` interpolation, persistence, and `<html lang>` sync.
 * Anything heavier (plural rules, dates) belongs in the consuming app.
 */
export function I18nProvider({
  children,
  initialLocale = 'en',
  overrides,
  persist = true,
  syncHtmlLang = true,
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (!persist || typeof window === 'undefined') return initialLocale;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    return stored === 'en' || stored === 'zh' ? stored : initialLocale;
  });

  const setLocale = useCallback(
    (l: Locale) => {
      setLocaleState(l);
      if (persist && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, l);
        } catch {
          /* storage may be disabled */
        }
      }
    },
    [persist],
  );

  useEffect(() => {
    if (!syncHtmlLang || typeof document === 'undefined') return;
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
  }, [locale, syncHtmlLang]);

  const dictionary = useMemo<Dictionary>(() => {
    const base = builtInDictionaries[locale] ?? builtInDictionaries.en;
    const merged: Dictionary = { ...base };
    const extra = overrides?.[locale];
    if (extra) Object.assign(merged, extra);
    return merged;
  }, [locale, overrides]);

  const t = useCallback(
    (key: string, vars?: TranslateVars) => {
      const tpl = dictionary[key] ?? builtInDictionaries.en[key] ?? key;
      return interpolate(tpl, vars);
    },
    [dictionary],
  );

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale, t, dictionary }),
    [locale, setLocale, t, dictionary],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;
  // Soft fallback so individual components can be used outside the provider
  // (e.g. inside isolated Storybook stories that haven't wrapped explicitly).
  const t = (key: string, vars?: TranslateVars) =>
    interpolate(builtInDictionaries.en[key] ?? key, vars);
  return {
    locale: 'en',
    setLocale: () => {},
    t,
    dictionary: builtInDictionaries.en,
  };
}

/**
 * Convenience hook returning just `t`. Saves a destructure in component code:
 * `const t = useT()` then `t('copy')`.
 */
export function useT() {
  return useI18n().t;
}
