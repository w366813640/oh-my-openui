import { Menu, X } from '@oh/icons';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useEffect } from 'react';
import { IconButton } from '../primitives/IconButton';
import { cn } from '../utils';
import { type Breakpoint, useViewport } from './useViewport';

export type SidebarMode = 'auto' | 'expanded' | 'collapsed' | 'drawer';

export interface AppShellProps {
  /** Vertical icon rail / expanded sidebar. */
  sidebar: ReactNode;
  /** Main scrollable workspace. */
  children: ReactNode;
  /** Optional right pane (e.g., Artifact split view). */
  artifact?: ReactNode;
  /** Optional top region reserved for the OS chrome titlebar overlay. Default 36px. */
  titlebarHeight?: number;
  /** Whether the sidebar is in expanded state (for layout width calc). */
  sidebarExpanded?: boolean;
  /**
   * Force a sidebar layout strategy. Defaults to `'auto'` which picks based
   * on the current viewport breakpoint:
   *   - xs (<600px)  → `'drawer'` (off-canvas; consumer wires the trigger)
   *   - sm (600-960) → `'collapsed'` (60px icon rail; ignores `sidebarExpanded`)
   *   - md (≥960px)  → respects `sidebarExpanded` (240 / 60)
   */
  sidebarMode?: SidebarMode;
  /**
   * Drawer state when the effective mode is `'drawer'`. Controlled — pair
   * with `onSidebarDrawerChange`. Defaults to closed.
   */
  sidebarDrawerOpen?: boolean;
  onSidebarDrawerChange?: (open: boolean) => void;
  className?: string;
}

function resolveMode(
  mode: SidebarMode,
  breakpoint: Breakpoint,
  expanded: boolean,
): 'expanded' | 'collapsed' | 'drawer' {
  if (mode !== 'auto') return mode;
  if (breakpoint === 'xs') return 'drawer';
  if (breakpoint === 'sm') return 'collapsed';
  return expanded ? 'expanded' : 'collapsed';
}

/**
 * The root frame that lays out [sidebar | main | artifact?].
 * The custom Win11 titlebar lives at the very top via a dedicated drag region,
 * not as a real grid row — it floats over the layout to keep main area pixel-perfect.
 *
 * Responsive strategy (P1-B1):
 *   - At ≥960px wide the shell behaves as before (240 / 60 sidebar split).
 *   - From 600 to 959 the sidebar locks to the 60px collapsed rail so the
 *     thread keeps its breathing room.
 *   - Below 600 the sidebar pops out of layout entirely and becomes an
 *     overlay drawer (translate-x animated) so the thread and composer get
 *     the full screen. Consumers render their own hamburger trigger and
 *     toggle the drawer via `sidebarDrawerOpen` / `onSidebarDrawerChange`.
 */
export function AppShell({
  sidebar,
  children,
  artifact,
  titlebarHeight = 36,
  sidebarExpanded = true,
  sidebarMode = 'auto',
  sidebarDrawerOpen = false,
  onSidebarDrawerChange,
  className,
}: AppShellProps) {
  const viewport = useViewport();
  const effective = resolveMode(sidebarMode, viewport.breakpoint, sidebarExpanded);
  const sidebarWidth = effective === 'expanded' ? 240 : effective === 'collapsed' ? 60 : 0;

  /* Auto-close the drawer if the viewport widens to a regime where the
   * sidebar lives in-flow. Prevents a stale overlay from blocking input
   * when the user un-snaps a window. */
  useEffect(() => {
    if (effective !== 'drawer' && sidebarDrawerOpen) onSidebarDrawerChange?.(false);
  }, [effective, sidebarDrawerOpen, onSidebarDrawerChange]);

  /* Esc closes the drawer (Fluent 2 + Apple HIG convention). */
  useEffect(() => {
    if (effective !== 'drawer' || !sidebarDrawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onSidebarDrawerChange?.(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [effective, sidebarDrawerOpen, onSidebarDrawerChange]);

  return (
    <div
      className={cn(
        'relative flex h-full w-full bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden',
        className,
      )}
    >
      {/* Drag region — invisible strip across the top so the user can drag the window from anywhere along the very top edge. */}
      <div
        className="app-drag fixed inset-x-0 top-0 z-[1000] pointer-events-none"
        style={{ height: titlebarHeight }}
      />

      {/* Sidebar column (in-flow) */}
      {effective !== 'drawer' ? (
        <aside
          className={cn(
            'relative z-20 flex-shrink-0 border-r border-[var(--color-border)]',
            effective === 'expanded' ? 'bg-[var(--color-surface-sunken)]' : 'bg-[var(--color-bg)]',
          )}
          style={{
            width: sidebarWidth,
            paddingTop: titlebarHeight,
            transition: 'width 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className="h-full">{sidebar}</div>
        </aside>
      ) : null}

      {/* Sidebar drawer (overlay) */}
      {effective === 'drawer' ? (
        <AnimatePresence>
          {sidebarDrawerOpen ? (
            <>
              <motion.div
                key="drawer-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="fixed inset-0 z-[40] bg-[var(--color-overlay)]"
                onClick={() => onSidebarDrawerChange?.(false)}
                aria-hidden="true"
              />
              <motion.aside
                key="drawer-panel"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.9 }}
                className={cn(
                  'fixed left-0 top-0 bottom-0 z-[45] flex w-[280px] max-w-[85vw] flex-col',
                  'border-r border-[var(--color-border)] bg-[var(--color-surface-sunken)]',
                  'shadow-[var(--shadow-modal)]',
                )}
                style={{ paddingTop: titlebarHeight }}
                role="dialog"
                aria-label="Navigation"
                aria-modal="true"
              >
                <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-subtle)]">
                    Menu
                  </span>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    label="Close menu"
                    onClick={() => onSidebarDrawerChange?.(false)}
                  >
                    <X />
                  </IconButton>
                </div>
                <div className="min-h-0 flex-1">{sidebar}</div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      ) : null}

      {/* Main column */}
      <main
        className="relative flex-1 min-w-0 flex flex-col"
        style={{ paddingTop: titlebarHeight }}
      >
        {children}
      </main>

      {/* Optional artifact pane */}
      {artifact ? (
        <aside
          className={cn(
            'relative z-10 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden',
            'max-[900px]:absolute max-[900px]:inset-y-0 max-[900px]:right-0 max-[900px]:z-30 max-[900px]:shadow-[var(--shadow-modal)]',
          )}
          style={{ paddingTop: titlebarHeight }}
        >
          {artifact}
        </aside>
      ) : null}
    </div>
  );
}

/**
 * Small hamburger trigger paired with the drawer. Use inside your top-bar
 * (or wherever you want the affordance to live) and bind its `onClick` to
 * the same setter you give to `AppShell.onSidebarDrawerChange`.
 *
 * Only renders at the `xs` breakpoint by default so it disappears on wide
 * screens where the sidebar is always visible.
 */
export function SidebarDrawerTrigger({
  open,
  onOpenChange,
  onlyAt = 'xs',
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Restrict the trigger to a breakpoint range. Defaults to xs-only. */
  onlyAt?: 'xs' | 'xs-sm' | 'always';
  className?: string;
}) {
  const v = useViewport();
  const visible =
    onlyAt === 'always' ||
    (onlyAt === 'xs' && v.isXs) ||
    (onlyAt === 'xs-sm' && (v.isXs || v.isSm));
  if (!visible) return null;
  return (
    <IconButton
      size="sm"
      variant="ghost"
      label={open ? 'Close menu' : 'Open menu'}
      onClick={() => onOpenChange(!open)}
      className={className}
    >
      <Menu />
    </IconButton>
  );
}
