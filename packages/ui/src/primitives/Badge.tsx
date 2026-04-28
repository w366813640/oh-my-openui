import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '../utils';

export type BadgeTone = 'neutral' | 'accent' | 'project' | 'success' | 'warning' | 'destructive';
export type BadgeSize = 'sm' | 'md';

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-text)] border border-[var(--color-border)]',
  accent: 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border border-transparent',
  project: 'bg-[#E6EEF8] text-[#3F6CB1] border border-[#D4E1F1] dark:bg-[#27313F] dark:text-[#9DB7DF] dark:border-[#34425A]',
  success: 'bg-[rgba(63,152,113,0.12)] text-[var(--color-success)] border border-transparent',
  warning: 'bg-[rgba(200,134,42,0.14)] text-[var(--color-warning)] border border-transparent',
  destructive:
    'bg-[var(--color-destructive-soft)] text-[var(--color-destructive)] border border-transparent',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-5 px-1.5 text-[10px] gap-1 rounded-[6px]',
  md: 'h-6 px-2 text-[12px] gap-1.5 rounded-[8px]',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = 'neutral', size = 'md', icon, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center font-medium select-none whitespace-nowrap',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
});

/**
 * Chip — like Badge but interactive (used for Composer "Research", "From Drive" etc.).
 */
export interface ChipProps extends HTMLAttributes<HTMLButtonElement> {
  tone?: BadgeTone;
  active?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { className, tone = 'neutral', active, icon, trailing, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 h-7 px-2.5 text-[12px] font-medium rounded-full border',
        'transition-colors duration-[120ms]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-bg)]',
        toneClasses[tone],
        'hover:brightness-[0.97]',
        active && 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-soft)]',
        className,
      )}
      {...props}
    >
      {icon ? <span className="-ml-0.5 [&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span> : null}
      {children}
      {trailing}
    </button>
  );
});
