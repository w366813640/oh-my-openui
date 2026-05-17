import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type ComponentPropsWithoutRef, type ElementRef, type ReactNode, forwardRef } from 'react';
import { cn } from '../utils';

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[300] rounded-[7px] px-2 py-1 text-[12px] leading-none origin-[var(--radix-tooltip-content-transform-origin)]',
          'border border-[var(--color-border)] bg-[var(--color-text)] text-[var(--color-bg)] shadow-[var(--shadow-popover)]',
          /* Subtle scale + fade entry per side; uses Radix's data-state hooks. */
          'will-change-[opacity,transform]',
          'data-[state=delayed-open]:animate-[tooltip-in_140ms_var(--ease-spring)_forwards]',
          'data-[state=instant-open]:animate-[tooltip-in_140ms_var(--ease-spring)_forwards]',
          'data-[state=closed]:animate-[tooltip-out_100ms_var(--ease-standard)_forwards]',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});

/**
 * Convenience wrapper: <Tooltipped label="...">{trigger}</Tooltipped>
 */
export function Tooltipped({
  label,
  children,
  side = 'top',
  /* 250ms feels Claude-like: fast enough to surface intent without feeling
   * twitchy. Override per-call when a longer dwell makes sense. */
  delayDuration = 250,
  asChild = true,
}: {
  label: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  asChild?: boolean;
}) {
  if (!label) return <>{children}</>;
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}
