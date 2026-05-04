import { CodeIcon, Copy, Eye, RefreshCw, X } from '@oh/icons';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../primitives/Button';
import { IconButton } from '../primitives/IconButton';
import { TabsList, TabsTrigger } from '../primitives/Tabs';
import { cn } from '../utils';

export interface ArtifactPaneProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  preview: ReactNode;
  code: ReactNode;
  publishLabel?: string;
  onPublish?: () => void;
  onCopy?: () => void;
  onRefresh?: () => void;
  defaultTab?: 'preview' | 'code';
  /** Min and max widths in px. */
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  /**
   * localStorage key to persist user's preferred width across sessions.
   * Set to null to disable persistence.
   */
  persistKey?: string | null;
}

/**
 * The right-hand split-view pane. Slides in from the right; supports
 * drag-to-resize via the left edge, with width persistence and a polished
 * drag affordance that morphs (thin → accent bar) on hover/active.
 */
export function ArtifactPane({
  open,
  onOpenChange,
  title,
  preview,
  code,
  publishLabel = 'Publish',
  onPublish,
  onCopy,
  onRefresh,
  defaultTab = 'preview',
  minWidth = 480,
  maxWidth = 1100,
  initialWidth = 600,
  persistKey = 'oh-artifact-pane-width',
}: ArtifactPaneProps) {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === 'undefined' || !persistKey) return initialWidth;
    try {
      const stored = window.localStorage.getItem(persistKey);
      const parsed = stored ? Number.parseInt(stored, 10) : Number.NaN;
      if (Number.isFinite(parsed)) {
        return Math.min(Math.max(parsed, minWidth), maxWidth);
      }
    } catch {
      /* storage unavailable */
    }
    return initialWidth;
  });
  const [dragging, setDragging] = useState(false);
  const [hoverHandle, setHoverHandle] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number | null>(() =>
    typeof window === 'undefined' ? null : window.innerWidth,
  );
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Persist width on change.
  useEffect(() => {
    if (!persistKey || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(persistKey, String(Math.round(width)));
    } catch {
      /* storage unavailable */
    }
  }, [persistKey, width]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const effectiveWidth =
    viewportWidth != null && viewportWidth <= 900 ? Math.max(0, viewportWidth - 48) : width;

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      dragStateRef.current = { startX: e.clientX, startWidth: width };
      setDragging(true);
    },
    [width],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      const delta = drag.startX - e.clientX; // dragging left increases width
      const next = Math.min(Math.max(drag.startWidth + delta, minWidth), maxWidth);
      setWidth(next);
    },
    [minWidth, maxWidth],
  );

  const handlePointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragStateRef.current = null;
    setDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setWidth(initialWidth);
  }, [initialWidth]);

  // Keyboard shortcut: Esc closes; ←/→ resize when handle is focused.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const handleHandleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setWidth((w) => Math.min(maxWidth, w + 24));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setWidth((w) => Math.max(minWidth, w - 24));
      }
    },
    [minWidth, maxWidth],
  );

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 32, mass: 0.9 }}
          style={{ width: effectiveWidth }}
          className="relative h-full flex-shrink-0 flex flex-col overflow-hidden border-l border-[var(--color-border)] bg-[var(--color-surface-sunken)]"
        >
          {/* Drag handle: a 6px hit-zone with a 1.5px morphing accent bar */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize artifact panel"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerEnter={() => setHoverHandle(true)}
            onPointerLeave={() => setHoverHandle(false)}
            onKeyDown={handleHandleKey}
            onDoubleClick={handleDoubleClick}
            className={cn(
              'group/handle absolute left-0 top-0 bottom-0 z-10',
              'w-2 -ml-1 cursor-col-resize',
              'flex items-center justify-center',
              'focus-visible:outline-none',
            )}
          >
            <motion.span
              aria-hidden="true"
              animate={{
                width: dragging ? 3 : hoverHandle ? 2.5 : 1,
                opacity: dragging ? 1 : hoverHandle ? 0.85 : 0.45,
                backgroundColor:
                  dragging || hoverHandle ? 'var(--color-accent)' : 'var(--color-border)',
              }}
              transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.6 }}
              className="block h-12 rounded-full"
            />
          </div>

          {/* Width readout while dragging */}
          <AnimatePresence>
            {dragging ? (
              <motion.div
                key="readout"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.12 }}
                className={cn(
                  'absolute left-3 top-3 z-10 select-none',
                  'rounded-[6px] px-1.5 py-0.5 text-[10.5px] tabular-nums',
                  'bg-[var(--color-surface-raised)] border border-[var(--color-border)]',
                  'text-[var(--color-text-muted)] shadow-[var(--shadow-card)]',
                )}
              >
                {Math.round(width)}px
              </motion.div>
            ) : null}
          </AnimatePresence>

          <ArtifactToolbar
            title={title}
            publishLabel={publishLabel}
            onPublish={onPublish}
            onCopy={onCopy}
            onRefresh={onRefresh}
            onClose={() => onOpenChange(false)}
            defaultTab={defaultTab}
            preview={preview}
            code={code}
            compact={effectiveWidth < 560}
          />
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

function ArtifactToolbar({
  title,
  publishLabel,
  onPublish,
  onCopy,
  onRefresh,
  onClose,
  defaultTab,
  preview,
  code,
  compact,
}: {
  title?: ReactNode;
  publishLabel?: string;
  onPublish?: () => void;
  onCopy?: (e: MouseEvent<HTMLButtonElement>) => void;
  onRefresh?: (e: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
  defaultTab: 'preview' | 'code';
  preview: ReactNode;
  code: ReactNode;
  compact?: boolean;
}) {
  const [tab, setTab] = useState<'preview' | 'code'>(defaultTab);

  return (
    <TabsPrimitive.Root
      value={tab}
      onValueChange={(v) => setTab(v as 'preview' | 'code')}
      className="flex flex-col flex-1 min-h-0"
    >
      <header className="relative flex h-12 items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2">
          <TabsList variant="pill" className="h-8">
            <TabsTrigger value="preview" className="gap-1.5 px-2.5">
              <Eye size={14} />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-1.5 px-2.5">
              <CodeIcon size={14} />
              <span className="hidden sm:inline">Code</span>
            </TabsTrigger>
          </TabsList>
          {compact ? (
            <IconButton label="Close" size="sm" onClick={onClose} className="shrink-0">
              <X />
            </IconButton>
          ) : null}
          {title ? (
            <span className="ml-2 hidden truncate text-[12.5px] text-[var(--color-text-muted)] min-[520px]:block">
              {title}
            </span>
          ) : null}
        </div>

        <div className={cn('flex shrink-0 items-center gap-1', compact && 'hidden')}>
          {onRefresh && !compact ? (
            <IconButton label="Refresh" size="sm" onClick={onRefresh}>
              <RefreshCw />
            </IconButton>
          ) : null}
          {onCopy && !compact ? (
            <IconButton label="Copy" size="sm" onClick={onCopy}>
              <Copy />
            </IconButton>
          ) : null}
          {onPublish && !compact ? (
            <Button variant="primary" size="sm" onClick={onPublish}>
              {publishLabel}
            </Button>
          ) : null}
          {!compact ? (
            <IconButton label="Close" size="sm" onClick={onClose}>
              <X />
            </IconButton>
          ) : null}
        </div>
      </header>

      {/* Animated tab switching: crossfade + tiny x-shift driven by the
       * direction of the swap (preview→code goes left, reverse goes right). */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 'code' ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 'code' ? -12 : 12 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="absolute inset-0 overflow-auto bg-[var(--color-surface-raised)]"
          >
            {tab === 'preview' ? preview : code}
          </motion.div>
        </AnimatePresence>
      </div>
    </TabsPrimitive.Root>
  );
}

/**
 * Custom hook for parents to manage open + content of the artifact pane.
 */
export function useArtifactPane(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  return {
    open,
    setOpen,
    show: () => setOpen(true),
    hide: () => setOpen(false),
  };
}

/** Empty preview fallback used when nothing has been opened yet. */
export function ArtifactEmpty({ children }: { children?: ReactNode }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center p-8',
        'text-[13px] text-[var(--color-text-subtle)] text-center',
      )}
    >
      {children ?? 'Open an artifact to preview it here.'}
    </div>
  );
}
