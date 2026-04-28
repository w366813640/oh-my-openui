import { ArrowRight, FileIcon, FileText, ImageIcon, Paperclip } from '@oh/icons';
import type { ReactNode } from 'react';
import { cn } from '../utils';
import type { MessageAttachment } from './types';

export interface AttachmentsProps {
  attachments: MessageAttachment[];
  className?: string;
  /** Display mode: `cards` (default) or `compact` (single-line chips). */
  variant?: 'cards' | 'compact';
}

/**
 * File attachment row rendered beneath an assistant message body. Each card
 * shows an icon (auto-picked by `kind`), the filename, and an optional
 * size/kind sublabel; clicking calls `onOpen` (handy for opening the artifact
 * pane or downloading the file).
 */
export function Attachments({ attachments, className, variant = 'cards' }: AttachmentsProps) {
  if (!attachments.length) return null;
  return (
    <div
      className={cn(
        variant === 'cards' ? 'mt-3 grid gap-2 sm:grid-cols-2' : 'mt-3 flex flex-wrap gap-2',
        className,
      )}
    >
      {attachments.map((a) =>
        variant === 'compact' ? (
          <CompactAttachmentChip key={a.id} attachment={a} />
        ) : (
          <AttachmentCard key={a.id} attachment={a} />
        ),
      )}
    </div>
  );
}

function attachmentIcon(kind: string | undefined): ReactNode {
  if (!kind) return <Paperclip size={16} />;
  const k = kind.toLowerCase();
  if (k.startsWith('image') || /(png|jpe?g|gif|webp|svg)/.test(k)) return <ImageIcon size={16} />;
  if (/pdf|md|markdown|doc|docx|txt|rtf/.test(k)) return <FileText size={16} />;
  return <FileIcon size={16} />;
}

function AttachmentCard({ attachment }: { attachment: MessageAttachment }) {
  const Tag = attachment.onOpen ? 'button' : 'div';
  const interactive = Boolean(attachment.onOpen);
  return (
    <Tag
      {...(interactive ? { type: 'button' as const, onClick: attachment.onOpen } : {})}
      className={cn(
        'group/attach flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left',
        'border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
        'transition-all duration-[140ms] ease-[var(--ease-standard)]',
        interactive &&
          'hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-card)]',
        'focus-visible:outline-none',
      )}
    >
      {attachment.thumbUrl ? (
        <img
          src={attachment.thumbUrl}
          alt=""
          className="h-9 w-9 rounded-[8px] object-cover flex-shrink-0 border border-[var(--color-border)]"
        />
      ) : (
        <div
          className={cn(
            'flex-shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-[10px]',
            'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]',
            interactive && 'group-hover/attach:text-[var(--color-text)] transition-colors',
          )}
        >
          {attachment.icon ?? attachmentIcon(attachment.kind)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[var(--color-text)] truncate">
          {attachment.name}
        </div>
        {attachment.kind || attachment.size ? (
          <div className="text-[11.5px] text-[var(--color-text-subtle)] truncate">
            {[attachment.kind, attachment.size].filter(Boolean).join(' · ')}
          </div>
        ) : null}
      </div>
      {interactive ? (
        <ArrowRight
          size={14}
          className={cn(
            'opacity-0 -translate-x-1 text-[var(--color-text-subtle)]',
            'group-hover/attach:opacity-100 group-hover/attach:translate-x-0',
            'transition-[opacity,transform] duration-[180ms] ease-[var(--ease-spring)]',
          )}
        />
      ) : null}
    </Tag>
  );
}

function CompactAttachmentChip({ attachment }: { attachment: MessageAttachment }) {
  const Tag = attachment.onOpen ? 'button' : 'div';
  const interactive = Boolean(attachment.onOpen);
  return (
    <Tag
      {...(interactive ? { type: 'button' as const, onClick: attachment.onOpen } : {})}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-1',
        'text-[12px]',
        'border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
        'text-[var(--color-text-muted)]',
        interactive && 'hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)]',
        'transition-colors duration-[140ms]',
      )}
    >
      <span className="inline-flex items-center justify-center h-4 w-4 text-[var(--color-text-muted)]">
        {attachment.icon ?? attachmentIcon(attachment.kind)}
      </span>
      <span className="max-w-[160px] truncate">{attachment.name}</span>
    </Tag>
  );
}
