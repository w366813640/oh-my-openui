import { Asterisk, FolderOpen, Layout, MessageSquare, Plus, Search, Sparkles } from '@oh/icons';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type ComponentType,
  type MouseEvent,
  type ReactNode,
  type SVGProps,
  createElement,
  forwardRef,
  isValidElement,
} from 'react';
import { Tooltipped } from '../primitives/Tooltip';
import { cn } from '../utils';

export type SidebarIconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string }
>;

export interface SidebarProps {
  expanded?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * The sidebar root: a vertical column that swaps between 48px collapsed and 240px
 * expanded. Children opt into the layout via the helper components below.
 */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  { expanded = true, className, children },
  ref,
) {
  return (
    <div
      ref={ref}
      data-expanded={expanded ? 'true' : 'false'}
      className={cn(
        'group/sidebar flex h-full flex-col select-none bg-[var(--color-surface-sunken)]',
        className,
      )}
    >
      {children}
    </div>
  );
});

export function SidebarHeader({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('app-no-drag flex flex-col gap-1.5 px-2 pt-2 pb-1.5', className)}>
      {children}
    </div>
  );
}

export function SidebarBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn('app-no-drag flex-1 overflow-y-auto overflow-x-hidden px-2 py-2', className)}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'app-no-drag border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)] px-2 py-2',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Brand block — Logo + (when expanded) product name. Visible at the top.
 */
export function SidebarBrand({
  expanded,
  logo,
  name,
}: {
  expanded?: boolean;
  logo?: ReactNode;
  name?: ReactNode;
}) {
  return (
    <div className="flex h-8 items-center gap-2 px-1.5 mb-1">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] text-[var(--color-asterisk)]">
        {logo ?? <Asterisk size={20} />}
      </span>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.16 }}
            className="font-serif text-[17px] leading-none tracking-tight text-[var(--color-text)]"
          >
            {name ?? 'Aurora'}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * The "+ New chat" primary CTA. Orange when expanded, accent-soft circle when collapsed.
 */
export function SidebarPrimaryAction({
  expanded,
  label = 'New chat',
  icon = <Plus size={16} />,
  onClick,
  active,
}: {
  expanded?: boolean;
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <Tooltipped label={!expanded ? label : null} side="right">
      <button
        type="button"
        onClick={onClick}
          className={cn(
          'group relative flex h-8 w-full items-center rounded-[9px]',
          'transition-[background-color,color,box-shadow,transform] duration-[140ms]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
          expanded
            ? 'gap-2 px-2 text-[13px] font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-soft)] hover:shadow-[var(--shadow-xs)]'
            : 'justify-center text-[var(--color-accent-foreground)]',
        )}
      >
        {expanded ? (
          <>
            <span
              className={cn(
                'inline-flex items-center justify-center h-6 w-6 rounded-full',
                'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[var(--shadow-xs)]',
              )}
            >
              {icon}
            </span>
            <span className="text-[var(--color-text)]">{label}</span>
          </>
        ) : (
          <span
            className={cn(
              'inline-flex items-center justify-center h-7 w-7 rounded-full',
              'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[var(--shadow-xs)]',
              active &&
                'ring-2 ring-[var(--color-accent)] ring-offset-1 ring-offset-[var(--color-bg)]',
            )}
          >
            {icon}
          </span>
        )}
      </button>
    </Tooltipped>
  );
}

/**
 * Generic nav item used for both icon-rail (collapsed) and full row (expanded).
 */
export interface SidebarNavItemProps {
  icon: SidebarIconComponent | ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  trailing?: ReactNode;
  className?: string;
}

export function SidebarNavItem({
  icon,
  label,
  active,
  expanded,
  onClick,
  trailing,
  className,
}: SidebarNavItemProps) {
  // Accept three shapes: an already-built ReactElement, a plain function
  // component, or a forwardRef component (which `typeof === 'object'`, hence
  // the explicit `isValidElement` + factory fallback below).
  const iconNode = isValidElement(icon)
    ? icon
    : icon
      ? createElement(icon as ComponentType<{ size?: number }>, { size: 16 })
      : null;

  const content = (
    <motion.button
      type="button"
      onClick={onClick}
      layout
      transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.8 }}
      className={cn(
        'group/item relative flex w-full items-center rounded-[9px]',
        'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
        'transition-[background-color,color,box-shadow] duration-[120ms]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        expanded ? 'h-8 px-2 gap-2 text-[13px]' : 'h-8 w-8 mx-auto justify-center',
        active &&
          'bg-[var(--color-surface-muted)] text-[var(--color-text)] shadow-[inset_0_0_0_1px_var(--color-border)]',
        !active && 'hover:bg-[var(--color-surface-muted)]',
        className,
      )}
    >
      {active ? (
        <motion.span
          layoutId="sidebar-nav-active-bar"
          aria-hidden="true"
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-full',
            'bg-[var(--color-accent)]',
          )}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        />
      ) : null}
      <motion.span
        layout="position"
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center',
          active && 'text-[var(--color-accent)]',
        )}
      >
        {iconNode}
      </motion.span>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.span
            key="label"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            className="flex-1 text-left truncate overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
      {expanded ? trailing : null}
    </motion.button>
  );

  if (!expanded) {
    return (
      <Tooltipped label={label} side="right">
        {content}
      </Tooltipped>
    );
  }
  return content;
}

/**
 * Section heading — only visible when expanded. Acts like a Recents/Starred label.
 */
export function SidebarSectionLabel({
  children,
  expanded,
  className,
}: {
  children: ReactNode;
  expanded?: boolean;
  className?: string;
}) {
  if (!expanded) return null;
  return (
    <div
      className={cn(
        'px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-subtle)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Compact text-only item used inside Recents/Starred (no icon, just label).
 */
export function SidebarLinkItem({
  label,
  active,
  onClick,
  trailing,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group/link relative flex h-7 w-full items-center rounded-[8px] px-2',
        'text-[12.5px] text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
        'transition-[background-color,color,box-shadow] duration-[120ms] hover:bg-[var(--color-surface-muted)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        active &&
          'bg-[var(--color-surface-muted)] text-[var(--color-text)] shadow-[inset_0_0_0_1px_var(--color-border)]',
      )}
    >
      <span className="flex-1 text-left truncate">{label}</span>
      {trailing}
    </button>
  );
}

/* Pre-baked default icon set so consumers can lift them quickly */
export const SidebarIcons = {
  collapse: Layout,
  search: Search,
  chats: MessageSquare,
  projects: FolderOpen,
  artifacts: Sparkles,
  asterisk: Asterisk,
} as const;
