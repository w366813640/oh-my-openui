import type { ReactNode } from 'react';

export type ComposerStatus = 'idle' | 'sending' | 'streaming' | 'disabled';

export interface ComposerAttachment {
  id: string;
  name: string;
  /** Optional MIME-ish type, used to pick an icon. */
  kind?: 'image' | 'file' | 'pdf' | 'doc' | 'sheet' | 'code' | 'audio' | 'video' | 'link';
  /** Display size (e.g., "1.2 MB"). */
  size?: string;
  /** Object URL or remote URL to thumbnail. */
  thumbUrl?: string;
}

export interface ComposerModelOption {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  group?: string;
}

export interface ComposerSubmitPayload {
  text: string;
  attachments: ComposerAttachment[];
  modelId: string;
  /** Whichever toggle chips are active (research, etc.). */
  toggles: Record<string, boolean>;
}

export interface ComposerHostProps {
  /** Controlled text value (optional). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;

  /**
   * Placeholder text. Pass an array to cycle through several hints with a
   * gentle cross-fade while the composer is empty + unfocused.
   */
  placeholder?: string | string[];
  /** Milliseconds between rotating placeholder strings. Default 3500. */
  placeholderRotateMs?: number;

  /** Available model options for the picker. */
  models?: ComposerModelOption[];
  /** Currently selected model id. */
  modelId?: string;
  onModelChange?: (id: string) => void;

  /** Active attachments (controlled). */
  attachments?: ComposerAttachment[];
  onAttachmentsChange?: (next: ComposerAttachment[]) => void;
  /** Max number of attachments allowed. */
  maxAttachments?: number;

  /** Bottom-left action buttons (after the "+" menu and sliders). */
  toolbarLeft?: ReactNode;
  /** Toggle chips like "Research" / "Web search". */
  toggles?: ComposerToggleConfig[];

  /** Quick prompt chips rendered below the composer. */
  quickActions?: QuickAction[];
  onQuickActionClick?: (id: string) => void;

  /** Called when the user submits via Enter / Send button. */
  onSubmit?: (payload: ComposerSubmitPayload) => void | Promise<void>;
  /** External status. If `sending` or `streaming` the send button shows the spinner. */
  status?: ComposerStatus;
  /** Optionally cancel an in-progress request (renders a stop button). */
  onStop?: () => void;
  /** Disable the entire composer. */
  disabled?: boolean;
  /** Render attached project / context chip in the toolbar. */
  contextChip?: ReactNode;

  className?: string;
  /** Auto-focus the textarea on mount. */
  autoFocus?: boolean;
}

export interface ComposerToggleConfig {
  id: string;
  label: string;
  icon?: ReactNode;
  defaultPressed?: boolean;
  description?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Optional tooltip-style description. */
  description?: string;
  /** Tone / accent color for the icon glyph. */
  tint?: 'neutral' | 'accent' | 'green' | 'blue' | 'amber' | 'purple';
}
