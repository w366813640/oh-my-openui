import { type RefObject, useEffect } from 'react';

export interface ListKeyboardNavOptions {
  /** Active scope (typically a wrapper around the list). */
  scopeRef: RefObject<HTMLElement | null>;
  /**
   * Selector that matches every focusable row inside the scope. Defaults to
   * `[data-list-row]` so consumers can opt rows in by adding that attribute.
   */
  rowSelector?: string;
  /** Called when the user activates the focused row via Enter / Space. */
  onActivate?: (id: string, el: HTMLElement) => void;
  /**
   * Called when the user toggles selection on the focused row via `x`. Only
   * fires when the list is in selectable mode (consumer decides).
   */
  onToggleSelect?: (id: string, el: HTMLElement) => void;
  /**
   * Pass `false` to skip wiring (e.g., when the surrounding screen has its
   * own keyboard handling).
   */
  enabled?: boolean;
}

/**
 * Wire `j` / `k` / `ArrowUp` / `ArrowDown` / `Home` / `End` cycling onto a
 * list of rows. Rows are discovered at keypress time via `rowSelector` so
 * dynamic / filtered lists work without re-registering.
 *
 * Activation:
 *   - `Enter` / `Space` → onActivate (row's id read from `data-list-id`).
 *   - `x` → onToggleSelect (Linear convention).
 *
 * The hook does **not** trap focus; arrow keys inside a `<textarea>`,
 * `<input>`, or `<select>` are left alone so the composer keeps working.
 *
 * Linear-style `j/k` is wired to match `ArrowDown/ArrowUp` exactly so the
 * keyboard map is platform-agnostic.
 */
export function useListKeyboardNav({
  scopeRef,
  rowSelector = '[data-list-row]',
  onActivate,
  onToggleSelect,
  enabled = true,
}: ListKeyboardNavOptions) {
  useEffect(() => {
    if (!enabled) return;
    const scope = scopeRef.current;
    if (!scope) return;

    function move(direction: 1 | -1 | 'first' | 'last') {
      const rows = Array.from(scope!.querySelectorAll<HTMLElement>(rowSelector));
      if (rows.length === 0) return;
      const current = document.activeElement as HTMLElement | null;
      let idx = current ? rows.indexOf(current) : -1;
      if (direction === 'first') idx = 0;
      else if (direction === 'last') idx = rows.length - 1;
      else if (idx < 0) idx = direction === 1 ? 0 : rows.length - 1;
      else idx = (idx + direction + rows.length) % rows.length;
      const next = rows[idx];
      if (next) next.focus();
    }

    function isTypingTarget(e: KeyboardEvent): boolean {
      const t = e.target as HTMLElement | null;
      if (!t) return false;
      const tag = t.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
    }

    function handler(e: KeyboardEvent) {
      if (isTypingTarget(e)) return;
      switch (e.key) {
        case 'ArrowDown':
        case 'j':
          e.preventDefault();
          move(1);
          break;
        case 'ArrowUp':
        case 'k':
          e.preventDefault();
          move(-1);
          break;
        case 'Home':
          e.preventDefault();
          move('first');
          break;
        case 'End':
          e.preventDefault();
          move('last');
          break;
        case 'Enter':
        case ' ': {
          const active = document.activeElement as HTMLElement | null;
          if (!active || !active.matches?.(rowSelector)) return;
          e.preventDefault();
          const id = active.dataset.listId ?? '';
          onActivate?.(id, active);
          break;
        }
        case 'x':
        case 'X': {
          const active = document.activeElement as HTMLElement | null;
          if (!active || !active.matches?.(rowSelector)) return;
          e.preventDefault();
          const id = active.dataset.listId ?? '';
          onToggleSelect?.(id, active);
          break;
        }
        default:
          break;
      }
    }

    scope.addEventListener('keydown', handler);
    return () => scope.removeEventListener('keydown', handler);
  }, [scopeRef, rowSelector, onActivate, onToggleSelect, enabled]);
}
