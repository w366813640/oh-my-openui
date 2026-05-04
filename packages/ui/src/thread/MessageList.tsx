import type { ReactNode } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { cn } from '../utils';
import { AssistantMessage, type AssistantMessageProps } from './AssistantMessage';
import { UserMessage, type UserMessageProps } from './UserMessage';
import type { Message } from './types';

export interface MessageListProps {
  messages: Message[];
  className?: string;
  onCopy?: AssistantMessageProps['onCopy'];
  onRetry?: AssistantMessageProps['onRetry'];
  onFeedback?: AssistantMessageProps['onFeedback'];
  /** Hide the assistant action toolbar (copy/like/retry). */
  hideAssistantActions?: boolean;
  /** Custom renderer for arbitrary message types. */
  renderMessage?: (m: Message) => ReactNode;
  /** Slot rendered after the last message (e.g., disclaimer). */
  footer?: ReactNode;
}

export function MessageList({
  messages,
  className,
  onCopy,
  onRetry,
  onFeedback,
  hideAssistantActions,
  renderMessage,
  footer,
}: MessageListProps) {
  return (
    <div className={cn('flex flex-col gap-7 py-8 max-[640px]:gap-6', className)}>
      {messages.map((m) => {
        if (renderMessage) return renderMessage(m);
        if (m.role === 'user') {
          return (
            <UserMessage key={m.id} message={m as Parameters<typeof UserMessage>[0]['message']} />
          );
        }
        if (m.role === 'assistant') {
          return (
            <AssistantMessage
              key={m.id}
              message={m as Parameters<typeof AssistantMessage>[0]['message']}
              onCopy={onCopy}
              onRetry={onRetry}
              onFeedback={onFeedback}
              hideActions={hideAssistantActions}
            />
          );
        }
        return null;
      })}
      {footer}
    </div>
  );
}

/**
 * The tiny fine-print disclaimer below the last assistant message.
 */
export function ThreadDisclaimer({
  children,
  className,
}: { children?: ReactNode; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn('-mt-4 text-center text-[11px] text-[var(--color-text-subtle)]', className)}>
      {children ?? t('thread.disclaimer')}
    </div>
  );
}
