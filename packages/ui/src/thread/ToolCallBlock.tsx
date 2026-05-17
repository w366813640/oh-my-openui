import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Database,
  FileCode,
  Globe2,
  Loader2,
  Terminal,
  Wrench,
  XCircle,
} from '@oh/icons';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { cn } from '../utils';

export type ToolCallStatus = 'running' | 'done' | 'error';

/**
 * A semantic hint that picks a default icon. Consumers can pass any
 * `icon` ReactNode to override; this is here so demo / fixture code can
 * stay one word.
 */
export type ToolCallKind = 'shell' | 'code' | 'web' | 'search' | 'db' | 'file' | 'generic';

export interface ToolCallBlockProps {
  /** Short tool label, e.g. "bash", "web.search", "code.search". */
  title: string;
  /** One-line subtitle / argument summary, e.g. `ls -la /etc`. */
  subtitle?: ReactNode;
  /**
   * Tool family for the default icon. Ignored when `icon` is provided.
   */
  kind?: ToolCallKind;
  /** Custom icon override (16-20px target). */
  icon?: ReactNode;
  /** Render state. */
  status?: ToolCallStatus;
  /** Optional tool output rendered inside the disclosure body. */
  children?: ReactNode;
  /** Open the disclosure by default. */
  defaultOpen?: boolean;
  /** Optional error label rendered next to the status icon when `status="error"`. */
  errorLabel?: string;
  className?: string;
}

function defaultIcon(kind: ToolCallKind = 'generic'): ReactNode {
  switch (kind) {
    case 'shell':
      return <Terminal size={14} />;
    case 'code':
      return <FileCode size={14} />;
    case 'web':
      return <Globe2 size={14} />;
    case 'search':
      return <Globe2 size={14} />;
    case 'db':
      return <Database size={14} />;
    case 'file':
      return <FileCode size={14} />;
    default:
      return <Wrench size={14} />;
  }
}

function statusBadge(status: ToolCallStatus, reduced: boolean | null) {
  if (status === 'running') {
    return (
      <span
        className="inline-flex h-4 w-4 items-center justify-center text-[var(--color-accent)]"
        aria-label="Running"
      >
        <Loader2 size={12} className={cn(!reduced && 'animate-[spin_1.4s_linear_infinite]')} />
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span
        className="inline-flex h-4 w-4 items-center justify-center text-[var(--color-destructive)]"
        aria-label="Errored"
      >
        <XCircle size={14} />
      </span>
    );
  }
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center text-[color-mix(in_srgb,var(--color-accent)_75%,var(--color-text-muted))]"
      aria-label="Completed"
    >
      <CheckCircle2 size={14} />
    </span>
  );
}

/**
 * Inline disclosure for a model tool call. Mirrors Claude / Cursor /
 * ChatGPT "agent" surfaces: a thin pill with an icon, the tool name, a
 * status indicator, and a collapsible body that holds the raw output.
 *
 * Pure presentation — consumers wire `status` and `children` based on
 * their backend's streaming events. The pill is brand-tinted while
 * running, neutral once done, and destructive on error.
 */
export function ToolCallBlock({
  title,
  subtitle,
  kind = 'generic',
  icon,
  status = 'done',
  children,
  defaultOpen = false,
  errorLabel,
  className,
}: ToolCallBlockProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<boolean>(defaultOpen || status === 'error');
  const hasBody = Boolean(children);

  return (
    <div
      className={cn(
        'group/tool my-3 inline-flex w-full max-w-full flex-col items-start',
        className,
      )}
      data-tool-status={status}
    >
      <button
        type="button"
        onClick={() => (hasBody ? setOpen((v) => !v) : undefined)}
        aria-expanded={hasBody ? open : undefined}
        aria-label={hasBody ? `${title} (toggle output)` : title}
        disabled={!hasBody}
        className={cn(
          'inline-flex max-w-full items-center gap-1.5 rounded-[10px] pl-2 pr-2 py-1.5',
          'text-[12px] font-medium tabular-nums',
          'border bg-[var(--color-surface-raised)]',
          'text-[var(--color-text-muted)]',
          hasBody && 'hover:text-[var(--color-text)] cursor-pointer',
          !hasBody && 'cursor-default',
          'transition-[background-color,border-color,color] duration-[140ms] ease-[var(--ease-standard)]',
          status === 'running' &&
            'border-[color-mix(in_srgb,var(--color-accent)_35%,var(--color-border))]',
          status === 'done' &&
            'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
          status === 'error' &&
            'border-[color-mix(in_srgb,var(--color-destructive)_40%,var(--color-border))]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        )}
      >
        <span
          className={cn(
            'inline-flex h-5 w-5 items-center justify-center rounded-[6px]',
            'bg-[var(--color-surface-muted)] text-[var(--color-text)]',
          )}
        >
          {icon ?? defaultIcon(kind)}
        </span>
        <span className="truncate font-mono text-[12px]">{title}</span>
        {subtitle ? (
          <span className="hidden truncate text-[var(--color-text-subtle)] sm:inline-block max-w-[36ch]">
            {subtitle}
          </span>
        ) : null}
        <span className="ml-1 inline-flex items-center gap-1">
          {statusBadge(status, reduced)}
          {status === 'error' && errorLabel ? (
            <span className="text-[11.5px] text-[var(--color-destructive)]">{errorLabel}</span>
          ) : null}
          {hasBody ? (
            <ChevronDown
              size={12}
              className={cn(
                'opacity-60 transition-transform duration-[160ms] ease-[var(--ease-standard)]',
                open && 'rotate-180',
              )}
            />
          ) : null}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && hasBody ? (
          <motion.div
            key="tool-body"
            initial={{ opacity: 0, height: 0, y: -2 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -2 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="self-stretch overflow-hidden"
          >
            <div
              className={cn(
                'mt-2 rounded-[12px] border border-[var(--color-border)]',
                'bg-[var(--color-surface-sunken)] p-3',
                'font-mono text-[12.5px] leading-[18px] text-[var(--color-text-muted)]',
                'whitespace-pre-wrap break-words',
              )}
            >
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
