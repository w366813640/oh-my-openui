import type { ReactNode } from 'react';
import { cn } from '../utils';

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
  className?: string;
}

/**
 * The root frame that lays out [sidebar | main | artifact?].
 * The custom Win11 titlebar lives at the very top via a dedicated drag region,
 * not as a real grid row — it floats over the layout to keep main area pixel-perfect.
 */
export function AppShell({
  sidebar,
  children,
  artifact,
  titlebarHeight = 36,
  sidebarExpanded = true,
  className,
}: AppShellProps) {
  const sidebarWidth = sidebarExpanded ? 240 : 48;

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

      {/* Sidebar column */}
      <aside
        className="relative z-20 flex-shrink-0 border-r border-[var(--color-border)] bg-[var(--color-bg)]"
        style={{
          width: sidebarWidth,
          paddingTop: titlebarHeight,
          transition: 'width 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="h-full">{sidebar}</div>
      </aside>

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
          className="relative z-10 flex-shrink-0 border-l border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden"
          style={{ paddingTop: titlebarHeight }}
        >
          {artifact}
        </aside>
      ) : null}
    </div>
  );
}
