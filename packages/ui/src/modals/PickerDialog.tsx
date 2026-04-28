import { Search } from '@oh/icons';
import { type ReactNode, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../primitives/Dialog';
import { Input } from '../primitives/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../primitives/Tabs';
import { cn } from '../utils';

export interface PickerItem {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Mark as already-selected / unavailable. */
  selected?: boolean;
  disabled?: boolean;
  /** Optional keyword for fuzzy search. */
  keywords?: string[];
}

export interface PickerTab {
  id: string;
  label: string;
  items: PickerItem[];
}

export interface PickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  tabs: PickerTab[];
  defaultTabId?: string;
  onSelect: (item: PickerItem, tabId: string) => void;
  searchPlaceholder?: string;
  /** Right-side header slot (e.g., "Manage connectors" link). */
  headerAccessory?: ReactNode;
  /** Render an item as 1 or 2 columns. Default 2. */
  columns?: 1 | 2;
}

/**
 * Grid picker (e.g., Connectors, Artifact category, Insert from...).
 */
export function PickerDialog({
  open,
  onOpenChange,
  title,
  description,
  tabs,
  defaultTabId,
  onSelect,
  searchPlaceholder = 'Search...',
  headerAccessory,
  columns = 2,
}: PickerDialogProps) {
  const [query, setQuery] = useState('');
  const initialTab = defaultTabId ?? tabs[0]?.id ?? '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="p-0 overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <DialogHeader className="mb-2 pr-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <DialogTitle>{title}</DialogTitle>
                {description ? <DialogDescription>{description}</DialogDescription> : null}
              </div>
              {headerAccessory}
            </div>
          </DialogHeader>
        </div>

        <Tabs defaultValue={initialTab} className="flex flex-col">
          {tabs.length > 1 ? (
            <div className="px-6">
              <TabsList variant="underline">
                {tabs.map((t) => (
                  <TabsTrigger key={t.id} value={t.id}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          ) : null}

          <div className="px-6 pt-3 pb-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8"
              />
            </div>
          </div>

          {tabs.map((t) => (
            <TabsContent key={t.id} value={t.id} className="mt-0">
              <PickerGrid
                items={t.items}
                query={query}
                columns={columns}
                onSelect={(item) => {
                  onSelect(item, t.id);
                }}
              />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function PickerGrid({
  items,
  query,
  columns,
  onSelect,
}: {
  items: PickerItem[];
  query: string;
  columns: 1 | 2;
  onSelect: (item: PickerItem) => void;
}) {
  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((it) => {
      const hay = [it.title, it.description ?? '', ...(it.keywords ?? [])].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  return (
    <div
      className={cn(
        'grid gap-2 px-6 pb-6 max-h-[440px] overflow-y-auto',
        columns === 2 ? 'grid-cols-2' : 'grid-cols-1',
      )}
    >
      {filtered.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          onClick={() => onSelect(item)}
          className={cn(
            'group/item relative flex items-start gap-3 p-3 rounded-[12px] text-left',
            'border border-[var(--color-border)] bg-[var(--color-surface)]',
            'transition-colors duration-[140ms]',
            'hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-raised)]',
            'disabled:opacity-50 disabled:pointer-events-none',
          )}
        >
          {item.icon ? (
            <span className="flex-shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-[10px] bg-[var(--color-surface-muted)] [&_svg]:h-5 [&_svg]:w-5">
              {item.icon}
            </span>
          ) : null}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[var(--color-text)] truncate">
              {item.title}
            </div>
            {item.description ? (
              <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5 leading-snug line-clamp-2">
                {item.description}
              </p>
            ) : null}
          </div>
          <div className="flex-shrink-0 self-center">
            {item.selected ? (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-[11px] font-semibold">
                ✓
              </span>
            ) : (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-text-muted)] text-[14px] opacity-0 group-hover/item:opacity-100 transition-opacity">
                +
              </span>
            )}
          </div>
        </button>
      ))}
      {filtered.length === 0 ? (
        <div className="col-span-full text-center text-[13px] text-[var(--color-text-muted)] py-12">
          No matches.
        </div>
      ) : null}
    </div>
  );
}
