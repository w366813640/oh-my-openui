import { type CSSProperties, type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Tailwind rounded class, default `rounded-[6px]`. */
  rounded?: string;
}

/**
 * Single shimmer line. Uses a CSS `linear-gradient` background that pans
 * via `background-position`, which is GPU-cheap (no layout/paint per
 * frame) and respects `prefers-reduced-motion` via a CSS rule.
 *
 * Color is derived from --color-surface-muted -> --color-surface-sunken
 * so the shimmer reads in both light and dark themes without a JS
 * theme switch.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, rounded = 'rounded-[6px]', style, ...rest },
  ref,
) {
  const mergedStyle: CSSProperties = {
    backgroundImage:
      'linear-gradient(90deg, var(--color-surface-muted) 0%, color-mix(in srgb, var(--color-surface-muted) 50%, var(--color-surface-sunken)) 50%, var(--color-surface-muted) 100%)',
    backgroundSize: '300% 100%',
    backgroundPosition: '100% 0',
    animation: 'skeleton-pan 1.4s ease-in-out infinite',
    ...style,
  };
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('block h-3 w-full', rounded, className)}
      style={mergedStyle}
      {...rest}
    />
  );
});

/**
 * N-row list skeleton matching the ListPage layout dimensions
 * (rounded-12 + 13.5px line height + secondary meta).
 */
export function ListSkeleton({
  rows = 6,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <ul className={cn('flex flex-col gap-2', className)} aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are interchangeable
        <li key={i}>
          <div
            className={cn(
              'w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3',
            )}
          >
            <Skeleton className="h-3 w-[55%]" />
            <Skeleton className="mt-2 h-2.5 w-[35%]" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Composer skeleton placeholder. Same height & corner radius as the real
 * Composer container so the layout doesn't jump when data arrives.
 */
export function ComposerSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-busy="true"
      className={cn(
        'relative w-full rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-raised)]',
        'min-h-[112px] px-4 py-3',
        className,
      )}
    >
      <Skeleton className="h-3 w-[40%]" />
      <Skeleton className="mt-3 h-3 w-[25%]" />
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <Skeleton className="h-6 w-16" rounded="rounded-[10px]" />
        <Skeleton className="h-7 w-7" rounded="rounded-full" />
      </div>
    </div>
  );
}

/**
 * Thread skeleton: alternates user / assistant placeholders so the cold
 * load doesn't read "broken". Lighter than mounting real MessageList
 * with `streaming` because it skips every motion / markdown subtree.
 */
export function ChatSkeleton({
  messages = 3,
  className,
}: {
  messages?: number;
  className?: string;
}) {
  return (
    <div aria-busy="true" className={cn('flex flex-col gap-7 py-8', className)}>
      {Array.from({ length: messages }).map((_, i) => {
        const isUser = i % 2 === 0;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows are interchangeable
          <div key={i} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
            <div className={cn('flex flex-col gap-2', isUser ? 'max-w-[60%]' : 'max-w-[85%]')}>
              <Skeleton className="h-3 w-[80%]" />
              <Skeleton className="h-3 w-[70%]" />
              {!isUser ? <Skeleton className="h-3 w-[55%]" /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
