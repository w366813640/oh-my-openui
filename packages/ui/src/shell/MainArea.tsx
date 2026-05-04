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
        <div className="app-no-drag sticky top-0 z-[20] border-b border-transparent bg-[var(--color-bg)]/88 backdrop-blur-md">
          <div className="flex min-h-14 items-center px-5 py-2 max-[640px]:px-3">{topbar}</div>
        </div>
      ) : null}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className={cn('mx-auto px-6 max-[640px]:px-4', maxWidth ? '' : 'max-w-full')}
          style={maxWidth ? { maxWidth } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
