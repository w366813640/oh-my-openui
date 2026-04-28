import { ArrowLeft, MoreHorizontal, Plus, Star } from '@oh/icons';
import type { ReactNode } from 'react';
import { IconButton } from '../primitives/IconButton';
import { cn } from '../utils';

export interface ProjectDetailLayoutProps {
  /** Breadcrumb-style back-link "← All projects" */
  backLabel?: string;
  onBack?: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Topbar action buttons (star, more, etc.). */
  actions?: ReactNode;
  /** The composer component instance. */
  composer: ReactNode;
  /** Body slot — typically the chat history list. */
  children: ReactNode;
  /** Right rail — Instructions / Files / Members. */
  sideRail?: ReactNode;
  className?: string;
  /** Width of the right rail. */
  railWidth?: number;
}

export function ProjectDetailLayout({
  backLabel = 'All projects',
  onBack,
  title,
  description,
  actions,
  composer,
  children,
  sideRail,
  className,
  railWidth = 300,
}: ProjectDetailLayoutProps) {
  return (
    <div className={cn('w-full max-w-[1080px] mx-auto px-6 pt-6 pb-12', className)}>
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            'inline-flex items-center gap-1 text-[12.5px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            'mb-3',
          )}
        >
          <ArrowLeft size={12} />
          {backLabel}
        </button>
      ) : null}

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <header className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-[26px] leading-tight font-serif text-[var(--color-text)] truncate">
                {title}
              </h1>
              {description ? (
                <p className="mt-1.5 text-[13.5px] text-[var(--color-text-muted)] max-w-[640px] leading-relaxed">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-1">
              {actions ?? (
                <>
                  <IconButton size="md" label="More">
                    <MoreHorizontal />
                  </IconButton>
                  <IconButton size="md" label="Star">
                    <Star />
                  </IconButton>
                </>
              )}
            </div>
          </header>

          <div className="mt-5">{composer}</div>

          <div className="mt-6">{children}</div>
        </div>

        {sideRail ? (
          <aside style={{ width: railWidth }} className="flex-shrink-0">
            {sideRail}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

/** Right-rail panel block (Instructions / Files). */
export function ProjectRailCard({
  title,
  onAdd,
  children,
  className,
}: {
  title: ReactNode;
  onAdd?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] mb-3',
        className,
      )}
    >
      <header className="flex items-center justify-between px-3.5 pt-3 pb-2">
        <h3 className="text-[13px] font-semibold text-[var(--color-text)]">{title}</h3>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-6 w-6 items-center justify-center rounded-[6px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
            aria-label="Add"
          >
            <Plus size={14} />
          </button>
        ) : null}
      </header>
      <div className="px-3.5 pb-3.5">{children}</div>
    </section>
  );
}

/** Empty state inside a rail card. */
export function ProjectRailEmpty({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-[10px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] py-8 text-center">
      <p className="text-[12px] text-[var(--color-text-muted)] px-4 leading-relaxed">{children}</p>
    </div>
  );
}
