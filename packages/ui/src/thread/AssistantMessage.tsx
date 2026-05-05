import { ChevronDown, Copy, RefreshCw, ThumbsDown, ThumbsUp } from '@oh/icons';
import { StreamingShimmer } from '@oh/motion';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Markdown } from '../markdown';
import { BrandMark } from '../primitives/BrandMark';
import { IconButton } from '../primitives/IconButton';
import { Tooltipped } from '../primitives/Tooltip';
import { cn } from '../utils';
import { ArtifactCard } from './ArtifactCard';
import { Attachments } from './Attachments';
import { Citations } from './Citations';
import { ThinkingTrace } from './ThinkingTrace';
import type { AssistantMessageData } from './types';

function isContentEmpty(content: ReactNode, children: ReactNode): boolean {
  if (children) return false;
  if (typeof content === 'string') return content.trim().length === 0;
  if (content == null || content === false) return true;
  return false;
}

export interface AssistantMessageProps {
  message: AssistantMessageData;
  className?: string;
  children?: ReactNode;
  onCopy?: (id: string) => void;
  onRetry?: (id: string) => void;
  onFeedback?: (id: string, kind: 'up' | 'down') => void;
  /** Hide the action toolbar entirely. */
  hideActions?: boolean;
}

export function AssistantMessage({
  message,
  className,
  children,
  onCopy,
  onRetry,
  onFeedback,
  hideActions,
}: AssistantMessageProps) {
  const streaming = message.streaming;
  const stringContent = typeof message.content === 'string' ? message.content : null;
  const empty = isContentEmpty(message.content, children);

  // Pre-token state: a streaming message that hasn't produced any visible
  // content yet shows the brand-mark + shimmering line skeleton instead of an
  // empty cursor, mirroring how Claude buys time before tokens arrive.
  if (streaming && empty) {
    return (
      <div className={cn('group', className)} data-message-role="assistant">
        {message.thinking ? (
          <ThinkingTrace
            active={message.thinking.active}
            steps={message.thinking.steps}
            durationMs={message.thinking.durationMs}
            defaultOpen={message.thinking.defaultOpen}
          />
        ) : null}
        <StreamingShimmer lines={3} />
        {!hideActions ? (
          <div className="mt-3 flex items-center justify-between">
            <BrandMark size={18} motion="streaming" />
            <span className="text-[12px] text-[var(--color-text-subtle)]">Generating…</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn('group', className)} data-message-role="assistant">
      {message.thinking ? (
        <ThinkingTrace
          active={message.thinking.active}
          steps={message.thinking.steps}
          durationMs={message.thinking.durationMs}
          defaultOpen={message.thinking.defaultOpen}
        />
      ) : null}
      <div className="font-serif text-[16px] leading-[25px] text-[var(--color-text)] break-words">
        {children ? (
          <div className="whitespace-pre-wrap">{children}</div>
        ) : stringContent ? (
          <Markdown>{stringContent}</Markdown>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
        {streaming ? (
          <span className="inline-block w-[3px] h-[18px] -mb-[3px] bg-[var(--color-accent)] align-middle ml-0.5 animate-[blink_1s_steps(2)_infinite]" />
        ) : null}
      </div>

      {message.artifact ? (
        <div className="mt-3">
          <ArtifactCard
            title={message.artifact.title}
            subtitle={message.artifact.subtitle}
            icon={message.artifact.icon}
            onOpen={message.artifact.onOpen}
          />
        </div>
      ) : null}

      {message.attachments && message.attachments.length > 0 ? (
        <Attachments attachments={message.attachments} />
      ) : null}

      {message.citations && message.citations.length > 0 ? (
        <Citations citations={message.citations} />
      ) : null}

      {!hideActions ? (
        <AssistantActions
          message={message}
          onCopy={onCopy}
          onRetry={onRetry}
          onFeedback={onFeedback}
        />
      ) : null}
    </div>
  );
}

function AssistantActions({
  message,
  onCopy,
  onRetry,
  onFeedback,
}: {
  message: AssistantMessageData;
  onCopy?: (id: string) => void;
  onRetry?: (id: string) => void;
  onFeedback?: (id: string, kind: 'up' | 'down') => void;
}) {
  /**
   * Hover/focus reveal — siblings stagger in from y:6 with a soft spring.
   * Implemented as a CSS-driven group-hover container so we don't need to
   * mount an `AnimatePresence` per message (cheap on long threads).
   */
  return (
    <div className="mt-3 flex items-center justify-between">
      <BrandMark size={18} motion="hover" />

      <motion.div
        className={cn(
          'flex items-center gap-0.5',
          'opacity-0 translate-y-1 pointer-events-none',
          'group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto',
          'focus-within:opacity-100 focus-within:translate-y-0 focus-within:pointer-events-auto',
          'transition-[opacity,transform] duration-[180ms] ease-[var(--ease-spring)]',
        )}
      >
        <Tooltipped label="Copy">
          <IconButton size="sm" label="Copy" onClick={() => onCopy?.(message.id)}>
            <Copy />
          </IconButton>
        </Tooltipped>
        <Tooltipped label="Helpful">
          <IconButton
            size="sm"
            label="Helpful"
            active={message.feedback === 'up'}
            onClick={() => onFeedback?.(message.id, 'up')}
          >
            <ThumbsUp />
          </IconButton>
        </Tooltipped>
        <Tooltipped label="Not helpful">
          <IconButton
            size="sm"
            label="Not helpful"
            active={message.feedback === 'down'}
            onClick={() => onFeedback?.(message.id, 'down')}
          >
            <ThumbsDown />
          </IconButton>
        </Tooltipped>

        {/* Retry split-button */}
        <button
          type="button"
          onClick={() => onRetry?.(message.id)}
          className={cn(
            'inline-flex items-center gap-1 h-7 pl-2 pr-1.5 rounded-[8px]',
            'text-[12px] text-[var(--color-text-muted)]',
            'border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
            'transition-[background-color,border-color,color] duration-[120ms]',
          )}
        >
          <RefreshCw size={12} />
          <span>Retry</span>
          <ChevronDown size={11} className="opacity-60" />
        </button>
      </motion.div>
    </div>
  );
}
