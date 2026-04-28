import { ExternalLink, Globe } from '@oh/icons';
import * as Popover from '@radix-ui/react-popover';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import type { MessageCitation } from './types';

export interface CitationsProps {
  citations: MessageCitation[];
  className?: string;
}

/**
 * Footnote-style citation strip. Renders a row of small numbered chips with a
 * hover popover that reveals the source / title / snippet. Each citation can
 * optionally point at a URL (then the chip becomes a link).
 */
export function Citations({ citations, className }: CitationsProps) {
  if (!citations.length) return null;
  return (
    <div className={cn('mt-4 flex flex-wrap items-center gap-1.5', className)}>
      <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--color-text-subtle)]">
        Sources
      </span>
      {citations.map((c) => (
        <CitationChip key={c.id} citation={c} />
      ))}
    </div>
  );
}

function CitationChip({ citation }: { citation: MessageCitation }) {
  const isLink = Boolean(citation.url);
  const Tag = isLink ? 'a' : 'button';
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Tag
          {...(isLink
            ? { href: citation.url, target: '_blank', rel: 'noopener noreferrer' }
            : { type: 'button' as const })}
          className={cn(
            'group/cite inline-flex items-center gap-1 rounded-full pl-1.5 pr-2 py-0.5',
            'text-[11px] font-medium tabular-nums',
            'border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
            'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            'hover:border-[var(--color-border-strong)]',
            'transition-colors duration-[140ms] ease-[var(--ease-standard)]',
            'focus-visible:outline-none',
          )}
        >
          <span
            className={cn(
              'inline-flex h-4 w-4 items-center justify-center rounded-full',
              // High-contrast filled marker — accent fill, accent-text foreground.
              // Reads cleanly in both light (white on terracotta) and dark
              // (white on deep ember) without dropping below 4.5:1.
              'bg-[var(--color-accent)] text-[var(--color-accent-text,white)]',
              'text-[9.5px] font-bold leading-none tabular-nums',
            )}
          >
            {citation.id}
          </span>
          <span className="max-w-[160px] truncate">{citation.source ?? citation.title}</span>
          {isLink ? <ExternalLink size={10} className="opacity-60" /> : null}
        </Tag>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={6}
          className={cn(
            'z-50 max-w-[320px] origin-[var(--radix-popover-content-transform-origin)]',
            'rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
            'p-3 shadow-[var(--shadow-popover)]',
            'data-[state=open]:animate-[menu-in_var(--duration-base)_var(--ease-spring)]',
            'data-[state=closed]:animate-[menu-out_var(--duration-fast)_var(--ease-standard)]',
          )}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.16 }}
          >
            <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-subtle)] mb-1.5">
              {citation.icon ?? <Globe size={11} />}
              <span className="truncate">{citation.source ?? 'Source'}</span>
            </div>
            <div className="text-[13px] font-semibold text-[var(--color-text)] mb-1.5 leading-snug">
              {citation.title}
            </div>
            {citation.snippet ? (
              <p className="text-[12px] text-[var(--color-text-muted)] leading-relaxed">
                {citation.snippet}
              </p>
            ) : null}
            {citation.url ? (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'mt-2 inline-flex items-center gap-1 text-[11.5px]',
                  'text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]',
                )}
              >
                Open <ExternalLink size={10} />
              </a>
            ) : null}
          </motion.div>
          <Popover.Arrow width={10} height={5} className="fill-[var(--color-surface-raised)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
