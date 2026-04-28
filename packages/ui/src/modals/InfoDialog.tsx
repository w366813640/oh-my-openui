import { type ReactNode } from 'react';
import { Button } from '../primitives/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogSize,
} from '../primitives/Dialog';

export interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Optional content area (e.g., a textarea for feedback). */
  children?: ReactNode;
  size?: DialogSize;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void | Promise<void>;
  onSecondary?: () => void;
  loading?: boolean;
}

export function InfoDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  primaryLabel = 'OK',
  secondaryLabel,
  onPrimary,
  onSecondary,
  loading,
}: InfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
        <DialogFooter>
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
            loading={loading}
            onClick={async () => {
              await onPrimary?.();
              onOpenChange(false);
            }}
          >
            {primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
