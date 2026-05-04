import { Sparkles } from '@oh/icons';
import type { ReactNode } from 'react';
import { cn } from '../utils';

export interface ArtifactCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onOpen?: () => void;
  className?: string;
}

/**
 * Inline artifact preview block — renders inside an assistant message and
 * opens the right-hand ArtifactPane on click.
 */
export function ArtifactCard({ title, subtitle, icon, onOpen, className }: ArtifactCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group/artifact w-full text-left',
        'flex items-center gap-3 px-3 py-2.5 rounded-[12px]',
        'border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-xs)]',
        'transition-[background-color,border-color,box-shadow,transform] duration-[160ms] ease-[var(--ease-standard)]',
        'hover:-translate-y-px hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        className,
      )}
    >
      <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-accent-soft)] text-[var(--color-accent)] transition-colors group-hover/artifact:bg-[var(--color-surface-muted)] group-hover/artifact:text-[var(--color-text)]">
        {icon ?? <Sparkles size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-[var(--color-text)] truncate">{title}</div>
        {subtitle ? (
          <div className="text-[12px] text-[var(--color-text-muted)] truncate">{subtitle}</div>
        ) : null}
      </div>
      <div className="text-[var(--color-text-subtle)] group-hover/artifact:text-[var(--color-text-muted)]">
        <Sparkles size={14} />
      </div>
    </button>
  );
}
