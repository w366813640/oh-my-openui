import { FolderOpen, Plus, Search, Trash2 } from '@oh/icons';
import { type ReactNode, useState } from 'react';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { cn } from '../utils';

export interface ListPageRow {
  id: string;
  /** Title text. */
  title: ReactNode;
  /** Secondary metadata (e.g., "Last message 2 minutes ago"). */
  meta?: ReactNode;
  /** Trailing slot (e.g., "..."). */
  trailing?: ReactNode;
  /** Item-level click handler (whole row). */
  onClick?: () => void;
}

export interface ListPageLayoutProps {
  title: ReactNode;
  /** Right-side primary action (e.g., "+ New chat"). */
  primaryAction?: { label: string; onClick: () => void; icon?: ReactNode };
  searchPlaceholder?: string;
  /** Empty state content. */
  emptyMessage?: ReactNode;
  rows: ListPageRow[];
  /** Optional header text e.g., "5 chats with Claude · Select" line. */
  meta?: ReactNode;
  /** Allow multi-select with checkbox column. */
  selectable?: boolean;
  /** Selected ids when in selectable mode. */
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  /** Multi-select bulk actions. */
  bulkActions?: { label: string; icon?: ReactNode; onClick: () => void; destructive?: boolean }[];
  className?: string;
}

export function ListPageLayout({
  title,
  primaryAction,
  searchPlaceholder = 'Search...',
  emptyMessage = 'Nothing here yet.',
  rows,
  meta,
  selectable,
  selectedIds = [],
  onSelectedIdsChange,
  bulkActions,
  className,
}: ListPageLayoutProps) {
  const [query, setQuery] = useState('');
  const filtered = query
    ? rows.filter((r) => String(r.title).toLowerCase().includes(query.toLowerCase()))
    : rows;
  const inSelectMode = selectable && (selectedIds.length > 0 || onSelectedIdsChange);

  const toggleAllSelected = () => {
    if (!onSelectedIdsChange) return;
    if (selectedIds.length === filtered.length) onSelectedIdsChange([]);
    else onSelectedIdsChange(filtered.map((r) => r.id));
  };

  const toggleOne = (id: string) => {
    if (!onSelectedIdsChange) return;
    if (selectedIds.includes(id)) onSelectedIdsChange(selectedIds.filter((x) => x !== id));
    else onSelectedIdsChange([...selectedIds, id]);
  };

  return (
    <div className={cn('w-full max-w-[680px] mx-auto px-6 py-8', className)}>
      <header className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-[24px] font-serif text-[var(--color-text)]">{title}</h1>
        {primaryAction ? (
          <Button variant="primary" size="sm" onClick={primaryAction.onClick}>
            {primaryAction.icon ?? <Plus size={14} />}
            {primaryAction.label}
          </Button>
        ) : null}
      </header>

      <div className="relative mb-4">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9 h-10 rounded-[12px]"
        />
      </div>

      {meta || inSelectMode ? (
        <div className="flex items-center justify-between text-[12.5px] text-[var(--color-text-muted)] mb-2 px-1">
          <div className="flex items-center gap-2">
            {selectable ? (
              <button
                type="button"
                onClick={toggleAllSelected}
                className="inline-flex items-center gap-1.5"
              >
                <span
                  className={cn(
                    'inline-flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border',
                    selectedIds.length > 0
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                      : 'border-[var(--color-border-strong)]',
                  )}
                >
                  {selectedIds.length > 0 ? '✓' : null}
                </span>
                <span>{selectedIds.length} selected</span>
              </button>
            ) : (
              <span>{meta}</span>
            )}
          </div>
          {bulkActions && selectedIds.length > 0 ? (
            <div className="flex items-center gap-1">
              {bulkActions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.onClick}
                  className={cn(
                    'inline-flex items-center justify-center h-7 w-7 rounded-[6px]',
                    'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]',
                    a.destructive && 'hover:text-[var(--color-destructive)]',
                  )}
                  aria-label={a.label}
                  title={a.label}
                >
                  {a.icon ?? <Trash2 size={14} />}
                </button>
              ))}
              {onSelectedIdsChange ? (
                <button
                  type="button"
                  onClick={() => onSelectedIdsChange([])}
                  className="text-[12px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] ml-2"
                >
                  ✕
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <ul className="flex flex-col gap-2">
        {filtered.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={row.onClick}
              className={cn(
                'group/row w-full text-left rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)]',
                'px-4 py-3 flex items-center gap-3',
                'transition-colors duration-[120ms]',
                'hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-raised)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
              )}
            >
              {selectable ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOne(row.id);
                  }}
                  className={cn(
                    'inline-flex h-4 w-4 items-center justify-center rounded-[4px] border flex-shrink-0',
                    selectedIds.includes(row.id)
                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white text-[10px]'
                      : 'border-[var(--color-border-strong)]',
                  )}
                >
                  {selectedIds.includes(row.id) ? '✓' : null}
                </span>
              ) : null}
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-[var(--color-text)] truncate">
                  {row.title}
                </div>
                {row.meta ? (
                  <div className="text-[12px] text-[var(--color-text-muted)] mt-0.5 truncate">
                    {row.meta}
                  </div>
                ) : null}
              </div>
              {row.trailing ? (
                <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                  {row.trailing}
                </div>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen size={32} className="mx-auto mb-3 text-[var(--color-text-subtle)]" />
          <p className="text-[13px] text-[var(--color-text-muted)]">{emptyMessage}</p>
        </div>
      ) : null}
    </div>
  );
}
