import { Brain, ChevronDown } from '@oh/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '../utils';

export interface ThinkingTraceProps {
  /** Whether the model is still actively thinking (renders pulsing dot). */
  active?: boolean;
  /** Reasoning steps; each rendered as a paragraph in the disclosure. */
  steps?: string[];
  /** Total thinking time in ms — formats to "Thought for Ns". */
  durationMs?: number;
  /** Open the disclosure by default. Live "active" runs honor this when true. */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Inline reasoning disclosure that mirrors Claude's "extended thinking" UI.
 *
 * Two visual states:
 *   1. Active     — pulsing brand dot + "Thinking…" label, optional live steps.
 *   2. Resolved   — static pill "Thought for Ns" with chevron disclosure.
 *
 * Renders inline above the assistant body, takes minimal horizontal space,
 * and never traps focus when collapsed.
 */
export function ThinkingTrace({
  active,
  steps = [],
  durationMs,
  defaultOpen = false,
  className,
}: ThinkingTraceProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen || Boolean(active));

  // While actively thinking we keep the disclosure auto-open so steps stream
  // into view; once thinking resolves we leave it whatever the user last set.
  useEffect(() => {
    if (active) setOpen(defaultOpen || true);
  }, [active, defaultOpen]);

  if (!active && steps.length === 0 && durationMs == null) return null;

  const seconds = durationMs != null ? Math.max(1, Math.round(durationMs / 1000)) : null;
  const label = active ? 'Thinking…' : seconds != null ? `Thought for ${seconds}s` : 'Reasoning';

  return (
    <div className={cn('mb-3 inline-flex max-w-full flex-col items-start', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'group/think inline-flex items-center gap-1.5 rounded-full pl-2 pr-2 py-1',
          'text-[11.5px] font-medium tabular-nums',
          'border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
          'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
          'hover:border-[var(--color-border-strong)]',
          'transition-colors duration-[140ms] ease-[var(--ease-standard)]',
          active && 'border-[color-mix(in_srgb,var(--color-accent)_30%,var(--color-border))]',
        )}
      >
        <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
          <Brain size={11} className={active ? 'text-[var(--color-accent)]' : ''} />
          {active ? (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-ping"
            />
          ) : null}
        </span>
        <span>{label}</span>
        {steps.length > 0 ? (
          <ChevronDown
            size={11}
            className={cn(
              'opacity-60 transition-transform duration-[160ms] ease-[var(--ease-standard)]',
              open && 'rotate-180',
            )}
          />
        ) : null}
      </button>

      <AnimatePresence initial={false}>
        {open && steps.length > 0 ? (
          <motion.div
            key="trace"
            initial={{ opacity: 0, height: 0, y: -2 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -2 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden self-stretch"
          >
            <ol
              className={cn(
                'mt-2 space-y-1.5 border-l-2 pl-3 ml-1.5',
                'border-[color-mix(in_srgb,var(--color-accent)_25%,var(--color-border))]',
                'text-[12.5px] leading-[18px] text-[var(--color-text-muted)]',
              )}
            >
              {steps.map((step, i) => (
                <motion.li
                  key={`step-${i}-${step.slice(0, 12)}`}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.16, delay: active ? i * 0.04 : 0 }}
                >
                  {step}
                </motion.li>
              ))}
              {active ? (
                <motion.li
                  key="ellipsis"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[var(--color-text-subtle)]"
                >
                  <span className="inline-flex gap-0.5">
                    <span className="animate-pulse">·</span>
                    <span className="animate-pulse [animation-delay:120ms]">·</span>
                    <span className="animate-pulse [animation-delay:240ms]">·</span>
                  </span>
                </motion.li>
              ) : null}
            </ol>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
