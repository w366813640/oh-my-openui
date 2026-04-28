import { CodeIcon, FileIcon, FileText, ImageIcon, Paperclip, X } from '@oh/icons';
import { cn } from '../utils';
import type { ComposerAttachment } from './types';

const kindIconMap = {
  image: ImageIcon,
  file: FileIcon,
  pdf: FileText,
  doc: FileText,
  sheet: FileText,
  code: CodeIcon,
  audio: FileIcon,
  video: FileIcon,
  link: Paperclip,
} as const;

export interface AttachmentChipProps {
  attachment: ComposerAttachment;
  onRemove?: (id: string) => void;
}

export function AttachmentChip({ attachment, onRemove }: AttachmentChipProps) {
  const Icon = kindIconMap[attachment.kind ?? 'file'];
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 max-w-[220px] h-8 pl-2 pr-1.5 rounded-[10px]',
        'border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
        'text-[12px] text-[var(--color-text)]',
      )}
    >
      {attachment.thumbUrl ? (
        <img src={attachment.thumbUrl} alt="" className="h-5 w-5 rounded-[4px] object-cover" />
      ) : (
        <Icon size={14} className="text-[var(--color-text-muted)]" />
      )}
      <span className="truncate flex-1 leading-none">{attachment.name}</span>
      {attachment.size ? (
        <span className="text-[var(--color-text-subtle)] text-[11px] leading-none">
          {attachment.size}
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          onClick={() => onRemove(attachment.id)}
          className={cn(
            'inline-flex items-center justify-center h-5 w-5 rounded-[6px] ml-1 -mr-0.5',
            'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
            'transition-colors duration-[100ms]',
          )}
          aria-label={`Remove ${attachment.name}`}
        >
          <X size={12} />
        </button>
      ) : null}
    </div>
  );
}
