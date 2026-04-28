import { type ReactNode, useMemo } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { BrandMark } from '../primitives/BrandMark';
import { cn } from '../utils';
import { type GreetingContext, generateGreeting } from './timeAwareGreeting';

export interface GreetingProps extends GreetingContext {
  className?: string;
  /** Override the rendered text entirely. */
  text?: ReactNode;
  /** Show the asterisk leading glyph. */
  showAsterisk?: boolean;
  /** Glyph color. Defaults to the brand asterisk variable. */
  asteriskClassName?: string;
  size?: 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  md: 'text-[24px] leading-tight',
  lg: 'text-[30px] leading-tight',
  xl: 'text-[34px] leading-tight',
};

const asteriskSizes = {
  md: 22,
  lg: 26,
  xl: 30,
};

export function Greeting({
  className,
  text,
  showAsterisk = true,
  asteriskClassName,
  size = 'lg',
  name,
  recency,
  now,
  locale,
  t: ctxT,
}: GreetingProps) {
  const { t } = useI18n();
  const translator = ctxT ?? t;
  // The translator identity changes when the active locale changes, so
  // depending on it covers the i18n update without a separate `locale` dep.
  const greeting = useMemo(
    () => generateGreeting({ name, recency, now, locale, t: translator }),
    [name, recency, now, locale, translator],
  );
  return (
    <h1
      className={cn(
        'flex items-center justify-center gap-2.5 font-serif text-[var(--color-text)]',
        sizeClasses[size],
        className,
      )}
    >
      {showAsterisk ? (
        <BrandMark size={asteriskSizes[size]} motion="idle-pulse" className={asteriskClassName} />
      ) : null}
      <span>{text ?? greeting.text}</span>
    </h1>
  );
}
