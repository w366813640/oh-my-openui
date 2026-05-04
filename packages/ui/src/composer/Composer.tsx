import {
  ArrowUp,
  Asterisk,
  Camera,
  FolderOpen,
  Github,
  HardDrive,
  Paperclip,
  Plus,
  Sliders,
  Square,
} from '@oh/icons';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { Chip } from '../primitives/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../primitives/DropdownMenu';
import { IconButton } from '../primitives/IconButton';
import { Textarea } from '../primitives/Input';
import { Tooltipped } from '../primitives/Tooltip';
import { cn } from '../utils';
import { AttachmentChip } from './AttachmentChip';
import { ModelPicker } from './ModelPicker';
import type { ComposerAttachment, ComposerHostProps, ComposerSubmitPayload } from './types';

export interface ComposerHandle {
  focus: () => void;
  clear: () => void;
  setText: (text: string) => void;
}

const DEFAULT_MODELS = [
  { id: 'sonnet', label: 'Sonnet 4', description: 'Smart, efficient model for everyday use' },
  { id: 'opus', label: 'Opus 4.1', description: 'Powerful, large model for complex challenges' },
];

let attachmentIdCounter = 0;
function nextAttachmentId() {
  attachmentIdCounter += 1;
  return `att-${Date.now().toString(36)}-${attachmentIdCounter}`;
}

function fileToAttachment(file: File): ComposerAttachment {
  const isImage = file.type.startsWith('image/');
  const kindMap: Record<string, ComposerAttachment['kind']> = {
    'application/pdf': 'pdf',
    'text/csv': 'sheet',
  };
  let kind: ComposerAttachment['kind'] = isImage ? 'image' : (kindMap[file.type] ?? 'file');
  if (file.name.endsWith('.docx')) kind = 'doc';
  if (/\.(ts|tsx|js|jsx|py|go|rs|java|cpp|c|cs)$/i.test(file.name)) kind = 'code';
  return {
    id: nextAttachmentId(),
    name: file.name,
    kind,
    size: formatBytes(file.size),
    thumbUrl: isImage ? URL.createObjectURL(file) : undefined,
  };
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export const Composer = forwardRef<ComposerHandle, ComposerHostProps>(function Composer(
  {
    value: controlledValue,
    defaultValue,
    onValueChange,
    placeholder,
    placeholderRotateMs = 3500,
    models = DEFAULT_MODELS,
    modelId: controlledModelId,
    onModelChange,
    attachments: controlledAttachments,
    onAttachmentsChange,
    maxAttachments = 12,
    toolbarLeft,
    toggles,
    quickActions,
    onQuickActionClick,
    onSubmit,
    status = 'idle',
    onStop,
    disabled,
    contextChip,
    className,
    autoFocus,
  },
  ref,
) {
  const { t } = useI18n();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const value = isControlled ? controlledValue : internalValue;
  const resolvedPlaceholder: string | string[] = placeholder ?? t('composer.placeholder.default');

  const isModelControlled = controlledModelId !== undefined;
  const [internalModelId, setInternalModelId] = useState<string>(
    () => controlledModelId ?? models[0]?.id ?? '',
  );
  const modelId = isModelControlled ? controlledModelId : internalModelId;

  const isAttachmentsControlled = controlledAttachments !== undefined;
  const [internalAttachments, setInternalAttachments] = useState<ComposerAttachment[]>([]);
  const attachments = isAttachmentsControlled ? controlledAttachments : internalAttachments;

  const initialToggles: Record<string, boolean> = {};
  for (const t of toggles ?? []) initialToggles[t.id] = Boolean(t.defaultPressed);
  const [toggleState, setToggleState] = useState<Record<string, boolean>>(initialToggles);

  const [focused, setFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadInputId = useId();

  const placeholders = Array.isArray(resolvedPlaceholder)
    ? resolvedPlaceholder
    : [resolvedPlaceholder];
  const isRotating = placeholders.length > 1;
  const showOverlayPlaceholder = isRotating && !value && !focused;
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    if (!isRotating) return;
    if (focused || value) return;
    const id = window.setInterval(
      () => {
        setPlaceholderIdx((i) => (i + 1) % placeholders.length);
      },
      Math.max(1500, placeholderRotateMs),
    );
    return () => window.clearInterval(id);
  }, [focused, isRotating, placeholderRotateMs, placeholders.length, value]);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    clear: () => {
      if (!isControlled) setInternalValue('');
      onValueChange?.('');
    },
    setText: (text) => {
      if (!isControlled) setInternalValue(text);
      onValueChange?.(text);
    },
  }));

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const updateValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const updateModel = useCallback(
    (id: string) => {
      if (!isModelControlled) setInternalModelId(id);
      onModelChange?.(id);
    },
    [isModelControlled, onModelChange],
  );

  const updateAttachments = useCallback(
    (next: ComposerAttachment[]) => {
      const clipped = next.slice(0, maxAttachments);
      if (!isAttachmentsControlled) setInternalAttachments(clipped);
      onAttachmentsChange?.(clipped);
    },
    [isAttachmentsControlled, maxAttachments, onAttachmentsChange],
  );

  const addFiles = useCallback(
    (files: FileList | File[] | null | undefined) => {
      if (!files) return;
      const list: File[] = Array.from(files);
      if (list.length === 0) return;
      const newOnes = list.map(fileToAttachment);
      updateAttachments([...attachments, ...newOnes]);
    },
    [attachments, updateAttachments],
  );

  const removeAttachment = useCallback(
    (id: string) => {
      const target = attachments.find((a) => a.id === id);
      if (target?.thumbUrl?.startsWith('blob:')) URL.revokeObjectURL(target.thumbUrl);
      updateAttachments(attachments.filter((a) => a.id !== id));
    },
    [attachments, updateAttachments],
  );

  const handleSubmit = useCallback(() => {
    if (status === 'sending' || status === 'streaming' || disabled) return;
    if (!value.trim() && attachments.length === 0) return;
    const payload: ComposerSubmitPayload = {
      text: value.trim(),
      attachments,
      modelId,
      toggles: toggleState,
    };
    void onSubmit?.(payload);
    if (!isControlled) setInternalValue('');
    onValueChange?.('');
  }, [
    attachments,
    disabled,
    isControlled,
    modelId,
    onSubmit,
    onValueChange,
    status,
    toggleState,
    value,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLTextAreaElement>) => {
      const files: File[] = [];
      for (const item of e.clipboardData.items) {
        if (item.kind === 'file') {
          const f = item.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        addFiles(files);
      }
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      setDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      addFiles(e.target.files);
      e.target.value = '';
    },
    [addFiles],
  );

  const sending = status === 'sending' || status === 'streaming';
  const canSubmit = !disabled && !sending && (value.trim().length > 0 || attachments.length > 0);

  return (
    <motion.div
      className={cn('w-full', className)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-focused={focused ? 'true' : 'false'}
        data-dragover={dragOver ? 'true' : 'false'}
        className={cn(
          'relative w-full rounded-[20px] bg-[var(--color-surface-raised)]',
          'border border-[var(--color-border)]',
          'shadow-[var(--shadow-composer)]',
          'transition-[box-shadow,border-color,background-color,transform] duration-[200ms] ease-[var(--ease-spring)]',
          'hover:border-[var(--color-border-strong)]',
          /* On focus: lift slightly + accent border + accent halo shadow. */
          'data-[focused=true]:shadow-[var(--shadow-composer-focus)]',
          'data-[focused=true]:border-[var(--color-accent)]/45',
          'data-[focused=true]:-translate-y-[1px]',
          'data-[dragover=true]:border-transparent',
          disabled && 'opacity-60 pointer-events-none',
        )}
      >
        {/* Marching-ants drag border (SVG overlay) */}
        <AnimatePresence>
          {dragOver ? (
            <motion.svg
              key="drag-border"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="19"
                ry="19"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeDasharray="8 6"
                style={{ animation: 'dash-flow 800ms linear infinite' }}
              />
            </motion.svg>
          ) : null}
        </AnimatePresence>

        {/* Attachments row */}
        {attachments.length > 0 ? (
          <div className="flex flex-wrap gap-2 px-3.5 pt-3 -mb-1">
            {attachments.map((att) => (
              <AttachmentChip key={att.id} attachment={att} onRemove={removeAttachment} />
            ))}
          </div>
        ) : null}

        {/* Text input area */}
        <div className="relative px-4 pt-3.5 pb-2.5">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => updateValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={isRotating ? '' : (placeholders[0] ?? '')}
            rows={1}
            className="min-h-[24px] max-h-[260px] py-0"
            disabled={disabled}
          />
          {/* Animated placeholder overlay (only when array variant is in use) */}
          <AnimatePresence mode="wait" initial={false}>
            {showOverlayPlaceholder ? (
              <motion.span
                key={placeholders[placeholderIdx]}
                aria-hidden="true"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
                className={cn(
                  'pointer-events-none absolute left-4 right-4 top-3.5',
                  'text-[15px] leading-[24px] text-[var(--color-text-subtle)]',
                  'truncate',
                )}
              >
                {placeholders[placeholderIdx]}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Bottom toolbar */}
        <div className="mx-2 flex items-center gap-1 border-t border-[var(--color-border)] px-0 pt-2 pb-2">
          {/* Left: + menu */}
          <ComposerPlusMenu onPickFiles={() => fileInputRef.current?.click()} />

          <Tooltipped label="Settings" side="top">
            <IconButton label="Settings" size="md" variant="ghost">
              <Sliders />
            </IconButton>
          </Tooltipped>

          {/* Toggle chips (Research, Web search, etc.) */}
          {toggles?.map((t) => {
            const pressed = toggleState[t.id];
            return (
              <Chip
                key={t.id}
                tone="neutral"
                active={pressed}
                icon={t.icon}
                onClick={() => setToggleState((prev) => ({ ...prev, [t.id]: !prev[t.id] }))}
                aria-pressed={pressed}
              >
                {t.label}
              </Chip>
            );
          })}

          {/* Optional context chip slot (selected project, etc.) */}
          {contextChip}

          {/* Pass-through left toolbar slot */}
          {toolbarLeft}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: model picker + send */}
          <ModelPicker models={models} value={modelId} onChange={updateModel} />

          <motion.button
            type="button"
            aria-label={sending && onStop ? 'Stop' : 'Send'}
            disabled={sending && onStop ? false : !canSubmit}
            onClick={sending && onStop ? onStop : handleSubmit}
            layout
            transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.7 }}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'relative inline-flex items-center justify-center h-8 w-8 rounded-full ml-1',
              'transition-[background-color,color,box-shadow,opacity] duration-[140ms]',
              sending && onStop
                ? 'bg-[var(--color-text)] text-[var(--color-bg)] shadow-[var(--shadow-xs)]'
                : canSubmit
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[var(--shadow-xs)] hover:bg-[var(--color-accent-hover)]'
                  : 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] opacity-70 cursor-not-allowed',
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {sending && onStop ? (
                <motion.span
                  key="stop"
                  initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
                  transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                  className="inline-flex"
                >
                  <Square size={12} />
                </motion.span>
              ) : sending ? (
                <motion.span
                  key="spin"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex"
                >
                  <Asterisk size={14} className="animate-[spin-asterisk_1.4s_linear_infinite]" />
                </motion.span>
              ) : (
                <motion.span
                  key="send"
                  initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 45 }}
                  transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                  className="inline-flex"
                >
                  <ArrowUp size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <input
          ref={fileInputRef}
          id={uploadInputId}
          type="file"
          multiple
          onChange={handleFileInput}
          className="sr-only"
        />

        {/* Drag overlay hint */}
        <AnimatePresence>
          {dragOver ? (
            <motion.div
              key="drop-hint"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center',
                'text-[13px] font-medium text-[var(--color-accent)]',
                'bg-[var(--color-accent-soft)]/70 backdrop-blur-[1px] rounded-[20px]',
              )}
            >
              <Paperclip size={14} className="mr-1.5" /> {t('composer.dropToAttach')}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Quick action chips below the composer */}
      {quickActions && quickActions.length > 0 ? (
        <motion.div
          className="mt-3 flex flex-wrap items-center justify-center gap-2 px-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } },
          }}
        >
          {quickActions.map((qa) => (
            <motion.div
              key={qa.id}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
              }}
            >
              <QuickActionButton action={qa} onClick={() => onQuickActionClick?.(qa.id)} />
            </motion.div>
          ))}
        </motion.div>
      ) : null}
    </motion.div>
  );
});

function ComposerPlusMenu({ onPickFiles }: { onPickFiles: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Add" size="md" variant="ghost">
          <Plus />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="min-w-[220px]">
        <DropdownMenuItem onSelect={onPickFiles}>
          <Paperclip size={14} className="text-[var(--color-text-muted)]" /> Upload a file
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Camera size={14} className="text-[var(--color-text-muted)]" /> Take a screenshot
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Github size={14} className="text-[var(--color-text-muted)]" /> Add from GitHub
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HardDrive size={14} className="text-[var(--color-text-muted)]" /> Add from Drive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <FolderOpen size={14} className="text-[var(--color-text-muted)]" /> Use a project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function QuickActionButton({
  action,
  onClick,
}: {
  action: import('./types').QuickAction;
  onClick: () => void;
}) {
  const tintClass: Record<NonNullable<import('./types').QuickAction['tint']>, string> = {
    neutral: 'text-[var(--color-text-muted)]',
    accent: 'text-[var(--color-accent)]',
    green: 'text-[var(--color-success)]',
    blue: 'text-[var(--color-info)]',
    amber: 'text-[var(--color-warning)]',
    purple: 'text-[#9871D1]',
  };
  return (
    <Tooltipped label={action.description} side="top">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 h-8 px-3 rounded-[10px]',
          'bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]',
          'text-[12.5px] text-[var(--color-text)] font-medium',
          'transition-[background-color,border-color,box-shadow,transform] duration-[140ms]',
          'hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-strong)]',
          'hover:-translate-y-px',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        )}
      >
        {action.icon ? (
          <span className={cn('[&_svg]:h-3.5 [&_svg]:w-3.5', tintClass[action.tint ?? 'neutral'])}>
            {action.icon}
          </span>
        ) : null}
        {action.label}
      </button>
    </Tooltipped>
  );
}
