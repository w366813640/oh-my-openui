import { Copy, MessageSquare, Sparkles, Wrench } from '@oh/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { Tooltipped } from '../primitives/Tooltip';
import { cn } from '../utils';

export interface SelectionAction {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect?: (text: string) => void;
}

export interface SelectionToolbarProps {
  /**
   * Element to scope the toolbar to. When the user selects text inside this
   * element (or any descendant), the toolbar appears centered above the
   * selection. Defaults to `document.body` if omitted.
   */
  scopeRef?: React.RefObject<HTMLElement | null>;
  /** Custom actions; defaults to a Claude-style Copy / Explain / Improve set. */
  actions?: SelectionAction[];
  /** Hide the toolbar entirely. */
  disabled?: boolean;
  /** Minimum selected character count before showing. Default 3. */
  minChars?: number;
  className?: string;
}

const DEFAULT_ACTIONS: SelectionAction[] = [
  { id: 'copy', label: 'Copy', icon: <Copy size={13} /> },
  { id: 'explain', label: 'Explain', icon: <MessageSquare size={13} /> },
  { id: 'improve', label: 'Improve', icon: <Sparkles size={13} /> },
  { id: 'translate', label: 'Translate', icon: <Wrench size={13} /> },
];

interface ToolbarPos {
  top: number;
  left: number;
}

/**
 * Floating mini-toolbar that appears centered above any text selection inside
 * `scopeRef`. Designed to mirror Claude Desktop's selection actions for
 * assistant messages — Copy / Explain / Improve / Translate — and to stay out
 * of the way otherwise.
 *
 * Pure DOM events under the hood (Selection API), no external deps; rendered
 * absolutely so it sits above any markdown content.
 */
export function SelectionToolbar({
  scopeRef,
  actions = DEFAULT_ACTIONS,
  disabled,
  minChars = 3,
  className,
}: SelectionToolbarProps) {
  const [pos, setPos] = useState<ToolbarPos | null>(null);
  const [text, setText] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  const compute = useCallback(() => {
    if (disabled) return setPos(null);
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return setPos(null);

    const range = sel.getRangeAt(0);
    const selectedText = sel.toString();
    if (selectedText.trim().length < minChars) return setPos(null);

    const container =
      range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : (range.commonAncestorContainer as Element);
    const scope = scopeRef?.current ?? document.body;
    if (container && !scope.contains(container)) return setPos(null);

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return setPos(null);

    setText(selectedText);
    setPos({
      top: window.scrollY + rect.top - 12,
      left: window.scrollX + rect.left + rect.width / 2,
    });
  }, [disabled, minChars, scopeRef]);

  useEffect(() => {
    if (disabled) return;
    const onUp = () => requestAnimationFrame(compute);
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.shiftKey || e.key.startsWith('Arrow')) requestAnimationFrame(compute);
    };
    const onScroll = () => setPos(null);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('selectionchange', onUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('selectionchange', onUp);
      window.removeEventListener('scroll', onScroll);
    };
  }, [compute, disabled]);

  const handleAction = useCallback(
    async (action: SelectionAction) => {
      if (action.id === 'copy') {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard unavailable */
        }
      }
      action.onSelect?.(text);
      window.getSelection()?.removeAllRanges();
      setPos(null);
    },
    [text],
  );

  return (
    <AnimatePresence>
      {pos ? (
        <motion.div
          ref={wrapRef}
          initial={{ opacity: 0, y: 6, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 360, damping: 26, mass: 0.6 }}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 320,
          }}
          className={cn('select-none', className)}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            role="toolbar"
            aria-label="Selection actions"
            className={cn(
              'inline-flex items-center gap-0.5 px-1 py-1 rounded-[10px]',
              'bg-[#1B1A18] text-white shadow-[0_8px_24px_rgba(0,0,0,0.32)]',
              'border border-white/5',
            )}
          >
            {actions.map((a) => (
              <Tooltipped key={a.id} label={a.label} side="top" delayDuration={350}>
                <button
                  type="button"
                  onClick={() => handleAction(a)}
                  className={cn(
                    'inline-flex items-center justify-center h-7 w-7 rounded-[6px]',
                    'text-white/85 hover:text-white hover:bg-white/10',
                    'transition-colors duration-[120ms]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                  )}
                >
                  {a.icon}
                </button>
              </Tooltipped>
            ))}
          </div>
          {/* Caret */}
          <div
            aria-hidden="true"
            className="mx-auto h-0 w-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1B1A18',
              marginTop: -1,
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
