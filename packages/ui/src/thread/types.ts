import type { ReactNode } from 'react';

export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageBase {
  id: string;
  role: MessageRole;
  /** Rendered body content (string => paragraph, ReactNode => arbitrary). */
  content: ReactNode;
  createdAt?: Date | string | number;
}

export interface UserMessageData extends MessageBase {
  role: 'user';
  /** User's display initials, e.g. "SL". */
  initials?: string;
  /** Optional avatar URL. */
  avatarUrl?: string;
  /** Attachment chips to display above the bubble. */
  attachments?: { id: string; name: string; thumbUrl?: string }[];
}

/**
 * A citation reference. The `id` is the marker shown inline (e.g. "1");
 * the rest is rendered in the citations strip beneath the body.
 */
export interface MessageCitation {
  id: string;
  title: string;
  /** Optional URL — if set, the chip becomes a link with an external icon. */
  url?: string;
  /** Source domain or label, e.g. "anthropic.com" or "Internal · §3.2". */
  source?: string;
  /** Optional 1-line snippet shown on hover / on the expanded card. */
  snippet?: string;
  /** Favicon / source icon node, optional — defaults to a generic globe. */
  icon?: ReactNode;
}

/** A file attachment card; either a generated file or an inline reference. */
export interface MessageAttachment {
  id: string;
  name: string;
  /** Mime type or short kind label, e.g. "PDF · 2 pages" or "image/png". */
  kind?: string;
  /** Human readable size, e.g. "184 KB". */
  size?: string;
  /** Optional thumbnail URL for image attachments. */
  thumbUrl?: string;
  /** Click handler — open in artifact pane, download, or whatever you wire up. */
  onOpen?: () => void;
  /** Optional icon override. Defaults to a paperclip / file glyph by `kind`. */
  icon?: ReactNode;
}

export interface AssistantMessageData extends MessageBase {
  role: 'assistant';
  /** Whether this message is currently streaming/generating. */
  streaming?: boolean;
  /** Optional model label to display in the footer. */
  modelLabel?: string;
  /** Whether feedback already given (so we can keep the icon active). */
  feedback?: 'up' | 'down' | null;
  /** Embedded artifact preview block. */
  artifact?: {
    title: string;
    subtitle?: string;
    onOpen?: () => void;
    icon?: ReactNode;
  };
  /**
   * Optional reasoning trace, mirroring Claude's "extended thinking" disclosure.
   * - While `streaming` and `thinking.active` is true, a pulsing "Thinking…" pill
   *   appears with the steps streaming in.
   * - Once tokens arrive (or `active` flips false), it collapses into a pill
   *   that reads "Thought for Ns" — click to expand the full reasoning.
   * `steps` are short markdown-friendly lines; `durationMs` is the total time.
   */
  thinking?: {
    /** Whether the model is still actively thinking (vs. finished). */
    active?: boolean;
    /** Reasoning steps; each rendered as a paragraph in the disclosure. */
    steps?: string[];
    /** Total thinking time in ms, used to label the collapsed pill. */
    durationMs?: number;
    /** Open the disclosure by default. */
    defaultOpen?: boolean;
  };
  /**
   * Footnote-style citations. Render as small numbered chips beneath the body,
   * with a hover popover that shows source/title/snippet. Inline `[N]` markers
   * inside `content` are linked to these by id.
   */
  citations?: MessageCitation[];
  /** Inline file attachment cards rendered beneath the body. */
  attachments?: MessageAttachment[];
}

export type Message = UserMessageData | AssistantMessageData;
