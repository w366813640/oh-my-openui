import { type ReactNode } from 'react';
import { cn } from '../utils';

export interface SettingsNavItem {
  id: string;
  label: ReactNode;
  /** Optional icon component or node. */
  icon?: ReactNode;
  /** Optional badge/chip on the right (e.g., "New"). */
  trailing?: ReactNode;
}

export interface TwoPaneSettingsLayoutProps {
  title?: ReactNode;
  description?: ReactNode;
  items: SettingsNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** The right-hand detail content for the currently active id. */
  children: ReactNode;
  /** Optional accessory in the page top-right (e.g., search, share). */
  accessory?: ReactNode;
  className?: string;
  /** Width of the left navigation column. */
  navWidth?: number;
}

/**
 * Settings-style layout: page title at top, narrow nav column on the left,
 * scrollable content card on the right.
 */
export function TwoPaneSettingsLayout({
  title,
  description,
  items,
  activeId,
  onSelect,
  children,
  accessory,
  className,
  navWidth = 200,
}: TwoPaneSettingsLayoutProps) {
  return (
    <div className={cn('flex flex-col w-full max-w-[960px] mx-auto px-6 py-8', className)}>
      {(title || description || accessory) ? (
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            {title ? (
              <h1 className="text-[26px] leading-tight font-serif text-[var(--color-text)]">{title}</h1>
            ) : null}
            {description ? (
              <p className="mt-1 text-[13.5px] text-[var(--color-text-muted)]">{description}</p>
            ) : null}
          </div>
          {accessory}
        </header>
      ) : null}

      <div className="flex gap-8">
        <nav style={{ width: navWidth }} className="flex-shrink-0">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      'w-full flex items-center gap-2 h-8 px-3 rounded-[8px] text-[13px]',
                      'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]',
                      'transition-colors duration-[120ms]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
                      active &&
                        'bg-[var(--color-surface-muted)] text-[var(--color-text)] font-medium',
                    )}
                  >
                    {item.icon ? <span className="[&_svg]:h-4 [&_svg]:w-4">{item.icon}</span> : null}
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.trailing}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <section className="flex-1 min-w-0">
          <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

/** Generic settings section header */
export function SettingsSection({
  title,
  description,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('mb-6 last:mb-0', className)}>
      <div className="mb-3">
        <h3 className="text-[15px] font-semibold text-[var(--color-text)]">{title}</h3>
        {description ? (
          <p className="text-[12.5px] text-[var(--color-text-muted)] mt-0.5">{description}</p>
        ) : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

/** A single key-value row inside a settings section */
export function SettingsRow({
  label,
  description,
  trailing,
  className,
}: {
  label: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0',
        'border-b border-[var(--color-border)] last:border-b-0',
        className,
      )}
    >
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-[var(--color-text)]">{label}</div>
        {description ? (
          <p className="text-[12.5px] text-[var(--color-text-muted)] mt-0.5 leading-snug">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex-shrink-0">{trailing}</div>
    </div>
  );
}
