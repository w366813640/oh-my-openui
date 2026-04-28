import { Asterisk } from '@oh/icons';
import type { ReactNode } from 'react';
import { Button } from '../primitives/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/Dialog';
import { cn } from '../utils';

export interface CelebrationOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Custom illustration; defaults to a glowing asterisk. */
  illustration?: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Tint the surface with the accent color (subtle wash). */
  tint?: 'accent' | 'neutral';
}

export function CelebrationOverlay({
  open,
  onOpenChange,
  title,
  description,
  illustration,
  primaryLabel = 'Continue',
  onPrimary,
  secondaryLabel,
  onSecondary,
  tint = 'accent',
}: CelebrationOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="md"
        className={cn(
          'p-0 overflow-hidden text-center',
          tint === 'accent' &&
            'bg-gradient-to-b from-[var(--color-accent-soft)] to-[var(--color-surface-raised)]',
        )}
      >
        <div className="px-8 pt-10 pb-8">
          <div className="flex justify-center mb-6">
            {illustration ?? (
              <span className="relative inline-flex items-center justify-center h-24 w-24 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-accent)] shadow-[var(--shadow-card)]">
                <Asterisk size={56} />
                <span className="absolute inset-0 rounded-full ring-1 ring-[var(--color-accent)]/20" />
              </span>
            )}
          </div>
          <DialogHeader className="mb-3 pr-0 items-center text-center">
            <DialogTitle className="text-[22px] font-serif">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-[14px] max-w-[420px] mx-auto">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogFooter className="mt-6 justify-center">
            {secondaryLabel ? (
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  onSecondary?.();
                  onOpenChange(false);
                }}
              >
                {secondaryLabel}
              </Button>
            ) : null}
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onPrimary?.();
                onOpenChange(false);
              }}
            >
              {primaryLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
