import type { ReactNode } from 'react';
import { cn } from '../utils';

export interface MainAreaProps {
  /** Optional sticky top bar (breadcrumb, conversation title, share button, etc.). */
  topbar?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Constrain main content width. Default 720. Use null for full-width. */
  maxWidth?: number | null;
}

export function MainArea({ topbar, children, className, maxWidth = 720 }: MainAreaProps) {
  return (
    <div className={cn('flex flex-1 min-h-0 flex-col', className)}>
      {topbar ? (
        <div className="app-no-drag sticky top-0 z-[20] bg-[var(--color-bg)]/85 backdrop-blur-md">
          <div className="flex items-center h-14 px-5">{topbar}</div>
        </div>
      ) : null}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className={cn('mx-auto px-6', maxWidth ? '' : 'max-w-full')}
          style={maxWidth ? { maxWidth } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
