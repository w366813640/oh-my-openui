import { ArrowRight, MessageSquare, Search, Sparkles, X } from '@oh/icons';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { Kbd } from '../primitives/Kbd';
import { cn } from '../utils';

export interface SearchPaletteItem {
  id: string;
  /** Primary label rendered for the row. */
  label: string;
  /** Optional secondary line (timestamp, project name, etc.). */
  description?: string;
  /** Optional left icon. Defaults to a chat bubble for `kind: 'chat'`. */
  icon?: ReactNode;
  /** Free-form category tag, e.g. "Recent" / "Suggestion". Affects grouping. */
  group?: string;
  /** When set, this string is what we match against (defaults to label). */
  searchKey?: string;
  /** Treat as command vs content row — affects icon defaulting. */
  kind?: 'chat' | 'command' | 'project' | 'page';
  /** Right-aligned hint, e.g. shortcut. */
  trailing?: ReactNode;
}

export interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SearchPaletteItem[];
  /** Called when the user selects an item (Enter or click). */
  onSelect?: (item: SearchPaletteItem) => void;
  placeholder?: string;
  /** Optional empty-state node, shown when `query` matches nothing. */
  emptyState?: ReactNode;
  /** When provided, replaces the default fuzzy filter. */
  filter?: (item: SearchPaletteItem, query: string) => boolean;
}

function defaultFilter(item: SearchPaletteItem, q: string): boolean {
  if (!q) return true;
  const hay = (item.searchKey ?? `${item.label} ${item.description ?? ''}`).toLowerCase();
  const needle = q.toLowerCase();
  let i = 0;
  for (const ch of hay) {
    if (ch === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return false;
}

function defaultIconFor(kind: SearchPaletteItem['kind']) {
  switch (kind) {
    case 'project':
      return <Sparkles size={14} />;
    case 'command':
      return <ArrowRight size={14} />;
    case 'page':
      return <ArrowRight size={14} />;
    default:
      return <MessageSquare size={14} />;
  }
}

/**
 * Spotlight / Cmd+K-style command palette. Designed to mirror Claude
 * Desktop's Search overlay: warm modal, single search field, grouped results,
 * keyboard-driven navigation.
 */
export function SearchPalette({
  open,
  onOpenChange,
  items,
  onSelect,
  placeholder,
  emptyState,
  filter = defaultFilter,
}: SearchPaletteProps) {
  const { t } = useI18n();
  const resolvedPlaceholder = placeholder ?? t('search.placeholder');
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputId = useId();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => items.filter((it) => filter(it, query)), [items, query, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchPaletteItem[]>();
    for (const it of filtered) {
      const key = it.group ?? 'Results';
      const list = map.get(key);
      if (list) list.push(it);
      else map.set(key, [it]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, flatList.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = flatList[activeIndex];
        if (target) {
          onSelect?.(target);
          onOpenChange(false);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    },
    [activeIndex, flatList, onOpenChange, onSelect],
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="fixed inset-0 z-[400] bg-[var(--color-overlay)] backdrop-blur-[3px]"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 28,
                  mass: 0.85,
                }}
                className={cn(
                  'fixed left-1/2 top-[20vh] z-[410] -translate-x-1/2',
                  'w-[calc(100%-2rem)] max-w-[640px]',
                  'bg-[var(--color-surface-raised)] border border-[var(--color-border)]',
                  'shadow-[var(--shadow-modal)] rounded-[16px] overflow-hidden',
                )}
              >
                <DialogPrimitive.Title className="sr-only">Search</DialogPrimitive.Title>

                <div className="flex items-center gap-2.5 px-4 h-12 border-b border-[var(--color-border)]">
                  <Search size={16} className="text-[var(--color-text-muted)] shrink-0" />
                  <input
                    ref={inputRef}
                    id={inputId}
                    role="combobox"
                    aria-expanded
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-activedescendant={`${listboxId}-${activeIndex}`}
                    type="text"
                    placeholder={resolvedPlaceholder}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    className={cn(
                      'flex-1 bg-transparent border-0 outline-none text-[15px]',
                      'placeholder:text-[var(--color-text-subtle)] text-[var(--color-text)]',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      'inline-flex items-center justify-center h-7 w-7 rounded-[6px]',
                      'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                      'hover:bg-[var(--color-surface-muted)] transition-colors',
                    )}
                    aria-label="Close search"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div
                  id={listboxId}
                  role="listbox"
                  tabIndex={-1}
                  className="max-h-[60vh] overflow-y-auto py-2"
                >
                  {flatList.length === 0 ? (
                    <div className="px-4 py-12 text-center text-[13px] text-[var(--color-text-muted)]">
                      {emptyState ??
                        (query ? `No matches for "${query}"` : 'Start typing to search')}
                    </div>
                  ) : (
                    grouped.map(([group, rows]) => (
                      <div key={group} className="px-2 pb-2 last:pb-0">
                        <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-[0.06em] font-semibold text-[var(--color-text-subtle)]">
                          {group}
                        </div>
                        <ul className="flex flex-col">
                          {rows.map((item) => {
                            const flatIdx = flatList.indexOf(item);
                            const isActive = flatIdx === activeIndex;
                            return (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  id={`${listboxId}-${flatIdx}`}
                                  role="option"
                                  aria-selected={isActive}
                                  onMouseEnter={() => setActiveIndex(flatIdx)}
                                  onClick={() => {
                                    onSelect?.(item);
                                    onOpenChange(false);
                                  }}
                                  className={cn(
                                    'group relative flex items-center w-full gap-3 px-3 h-10 rounded-[8px]',
                                    'text-[13.5px] text-left',
                                    isActive
                                      ? 'bg-[var(--color-surface-muted)] text-[var(--color-text)]'
                                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
                                    'transition-colors duration-[80ms]',
                                  )}
                                >
                                  <span
                                    className={cn(
                                      'inline-flex items-center justify-center h-5 w-5 shrink-0',
                                      isActive
                                        ? 'text-[var(--color-accent)]'
                                        : 'text-[var(--color-text-subtle)]',
                                    )}
                                  >
                                    {item.icon ?? defaultIconFor(item.kind)}
                                  </span>
                                  <span className="flex-1 min-w-0 flex items-baseline gap-2">
                                    <span className="truncate">{item.label}</span>
                                    {item.description ? (
                                      <span className="text-[11.5px] text-[var(--color-text-subtle)] truncate">
                                        {item.description}
                                      </span>
                                    ) : null}
                                  </span>
                                  {item.trailing ? (
                                    <span className="ml-auto shrink-0 text-[var(--color-text-subtle)]">
                                      {item.trailing}
                                    </span>
                                  ) : null}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))
                  )}
                </div>

                <footer className="flex items-center justify-between gap-3 px-4 h-10 border-t border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[11px] text-[var(--color-text-subtle)]">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Kbd>↑</Kbd>
                      <Kbd>↓</Kbd>
                      <span>navigate</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Kbd>↵</Kbd>
                      <span>open</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Kbd>esc</Kbd>
                      <span>close</span>
                    </span>
                  </div>
                  <span className="text-[var(--color-text-subtle)]">
                    {flatList.length} {flatList.length === 1 ? 'result' : 'results'}
                  </span>
                </footer>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

/**
 * Convenience hook: registers Cmd/Ctrl+K to toggle a search palette.
 * Returns the open state + setter so the consumer can render `<SearchPalette>`.
 */
export function useCommandKToggle(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const cmd = isMac ? e.metaKey : e.ctrlKey;
      if (cmd && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { open, setOpen } as const;
}
