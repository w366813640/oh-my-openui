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
}

export type Message = UserMessageData | AssistantMessageData;
