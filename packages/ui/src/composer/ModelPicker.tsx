import { Check, ChevronDown } from '@oh/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../primitives/DropdownMenu';
import { cn } from '../utils';
import type { ComposerModelOption } from './types';

export interface ModelPickerProps {
  models: ComposerModelOption[];
  value: string | undefined;
  onChange: (id: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function ModelPicker({ models, value, onChange, disabled, size = 'md' }: ModelPickerProps) {
  const selected = models.find((m) => m.id === value) ?? models[0];

  // Group by .group when present
  const groups = new Map<string | undefined, ComposerModelOption[]>();
  for (const m of models) {
    const arr = groups.get(m.group) ?? [];
    arr.push(m);
    groups.set(m.group, arr);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-1 rounded-[8px] border border-transparent',
          'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
          'transition-[background-color,border-color,color] duration-[120ms]',
          'hover:border-[var(--color-border-interactive)] hover:bg-[var(--color-surface-muted)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
          size === 'sm' && 'h-7 px-2 text-[12px]',
          size === 'md' && 'h-8 px-2 text-[12.5px]',
          'disabled:opacity-50 disabled:pointer-events-none',
        )}
      >
        <span className="font-medium">{selected?.label ?? 'Model'}</span>
        <ChevronDown size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[260px]">
        {[...groups.entries()].map(([groupName, items], groupIdx) => (
          <div key={groupName ?? `g-${groupIdx}`}>
            {groupIdx > 0 ? <DropdownMenuSeparator /> : null}
            {groupName ? <DropdownMenuLabel>{groupName}</DropdownMenuLabel> : null}
            {items.map((m) => {
              const isActive = m.id === selected?.id;
              return (
                <DropdownMenuItem
                  key={m.id}
                  onSelect={() => onChange(m.id)}
                  className="items-start py-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-medium">{m.label}</span>
                      {m.badge ? (
                        <span className="text-[10px] px-1 py-px rounded-[4px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                          {m.badge}
                        </span>
                      ) : null}
                    </div>
                    {m.description ? (
                      <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5 leading-snug">
                        {m.description}
                      </p>
                    ) : null}
                  </div>
                  {isActive ? (
                    <Check size={14} className="mt-1 text-[var(--color-accent)]" />
                  ) : null}
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
