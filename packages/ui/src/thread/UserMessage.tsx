import type { ReactNode } from 'react';
import { AvatarInitials } from '../primitives/Avatar';
import { cn } from '../utils';
import type { UserMessageData } from './types';

export interface UserMessageProps {
  message: UserMessageData;
  className?: string;
  /** Pass children to override the bubble body completely. */
  children?: ReactNode;
}

export function UserMessage({ message, className, children }: UserMessageProps) {
  return (
    <div className={cn('flex gap-3 group', className)} data-message-role="user">
      <div className="flex-shrink-0 pt-1">
        <AvatarInitials initials={message.initials ?? 'U'} size="sm" tone="dark" />
      </div>

      <div className="flex-1 min-w-0">
        {message.attachments && message.attachments.length > 0 ? (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="inline-flex items-center gap-2 h-7 px-2 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[12px]"
              >
                {att.thumbUrl ? (
                  <img src={att.thumbUrl} alt="" className="h-4 w-4 rounded-sm object-cover" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-subtle)]" />
                )}
                <span className="truncate max-w-[180px]">{att.name}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div
          className={cn(
            'inline-block px-3.5 py-2.5 rounded-[14px] max-w-full',
            'border border-transparent bg-[var(--color-user-bg)] text-[var(--color-user)]',
            'text-[15px] leading-[22px] font-sans',
            'whitespace-pre-wrap break-words',
          )}
        >
          {children ?? message.content}
        </div>
      </div>
    </div>
  );
}
