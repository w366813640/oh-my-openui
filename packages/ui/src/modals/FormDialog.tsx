import { type FormEvent, type ReactNode, useState } from 'react';
import { Button } from '../primitives/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogSize,
  DialogTitle,
} from '../primitives/Dialog';

export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  size?: DialogSize;
  cancelLabel?: string;
  submitLabel?: string;
  /**
   * Return false / throw to keep the dialog open. Return void / true to close.
   * `void` in the union is intentional — handlers commonly omit a return value
   * and the dialog should treat that as "close".
   */
  // biome-ignore lint/suspicious/noConfusingVoidType: see jsdoc above
  onSubmit: (formData: FormData) => boolean | void | Promise<boolean | void>;
  children: ReactNode;
}

/**
 * Generic form-in-dialog. Wraps children in a <form> and wires Submit/Cancel.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  cancelLabel = 'Cancel',
  submitLabel = 'Save',
  onSubmit,
  children,
}: FormDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const result = await onSubmit(formData);
      if (result !== false) onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={size}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <div className="flex flex-col gap-4">{children}</div>
          <DialogFooter>
            <Button type="button" variant="outline" size="md" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Common labelled form field used inside FormDialog children.
 */
export function FormField({
  label,
  description,
  htmlFor,
  children,
  required,
}: {
  label: ReactNode;
  description?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[12.5px] font-medium text-[var(--color-text)] inline-flex items-center gap-1"
      >
        {label}
        {required ? <span className="text-[var(--color-destructive)]">*</span> : null}
      </label>
      {children}
      {description ? (
        <p className="text-[11.5px] text-[var(--color-text-muted)]">{description}</p>
      ) : null}
    </div>
  );
}
