import { CodeIcon, MessageSquare, RefreshCw, Share, Sparkles, Wrench } from '@oh/icons';
import {
  ArtifactPane,
  Button,
  CodeBlock,
  Composer,
  MainArea,
  type Message,
  MessageList,
  SelectionToolbar,
  ThreadDisclaimer,
  useArtifactPane,
  useToast,
} from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArtifactPreviewSurface } from '../components/ArtifactPreviewSurface';
import { AppFrame, PageTopbar } from '../components/AppFrame';
import { mockMessages, mockModelOptions } from '../mocks/data';

export const Route = createFileRoute('/chat-demo')({
  component: ChatDemo,
});

const PET_SOURCE = `import { useEffect, useState } from 'react';
import { Avatar, Stats } from './internal';

interface PetProps {
  focus: number;   // minutes of uninterrupted coding
  debug: number;   // minutes of debugging
  coffee: number;  // cups today
}

function computeMood({ focus, debug, coffee }: PetProps) {
  const stress = Math.min(1, debug / 90);
  const energy = Math.min(1, focus / 240);
  const caffeine = Math.min(1, coffee / 4);
  if (energy < 0.15 && stress < 0.2) return 'resting';
  if (energy > 0.6 && stress < 0.3) return 'happy';
  if (stress > 0.6) return 'stressed';
  if (caffeine > 0.8) return 'wired';
  return 'resting';
}

export function CodingPet(props: PetProps) {
  const [mood, setMood] = useState(() => computeMood(props));
  useEffect(() => {
    setMood(computeMood(props));
  }, [props.focus, props.debug, props.coffee]);

  return (
    <div className="rounded-2xl border bg-amber-50 p-4 shadow-sm">
      <Avatar mood={mood} />
      <Stats focus={props.focus} debug={props.debug} coffee={props.coffee} />
      {props.focus === 0 ? (
        <p>No activity yet - start a focus session to wake the pet.</p>
      ) : null}
    </div>
  );
}`;

function ArtifactPreview() {
  return (
    <ArtifactPreviewSurface
      eyebrow="Today"
      description="Mood is calibrated from focus streaks, debug load, and recovery breaks."
    />
  );
}

function ArtifactCode() {
  return (
    <div className="p-4 h-full">
      <CodeBlock language="tsx" filename="CodingPet.tsx" maxHeight={1000} code={PET_SOURCE} />
    </div>
  );
}

const THINKING_STEPS = [
  'Read the brief and the user\u2019s constraint: a small habit-tracking pet.',
  'Picked a React component because the user already showed RN-shaped APIs.',
  'Sketched mood as a pure function of focus, debug minutes, and coffee count.',
  'Validated that "stressed" must take precedence over "wired" to feel honest.',
  'Drafted the artifact code and trimmed it to fit a single readable file.',
];

/**
 * Build a typewriter token list (split by whitespace, keep separators) so a
 * streaming replay reveals natural word-by-word, not character-by-character.
 */
function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

interface StreamState {
  /** Index of the assistant message we're replaying (-1 = none). */
  index: number;
  /** Tokens fed into that message so far. */
  fed: string[];
  /** Token list we're working through. */
  total: string[];
  /** The "thinking" pause before tokens start. */
  thinking: boolean;
}

function ChatDemo() {
  // Lift the pane state to the AppFrame layer so the right-hand ArtifactPane
  // is part of the shell grid (not nested in the message column).
  const pane = useArtifactPane(false);
  return (
    <AppFrame
      artifact={
        <ArtifactPane
          open={pane.open}
          onOpenChange={pane.setOpen}
          title="Digital Coding Pet"
          publishLabel="Publish"
          onPublish={() => console.log('publish')}
          onCopy={() => console.log('copy')}
          onRefresh={() => console.log('refresh')}
          preview={<ArtifactPreview />}
          code={<ArtifactCode />}
        />
      }
    >
      <ChatDemoContent paneOpen={pane.open} onOpenPane={pane.show} onClosePane={pane.hide} />
    </AppFrame>
  );
}

function ChatDemoContent({
  paneOpen,
  onOpenPane,
  onClosePane,
}: {
  paneOpen: boolean;
  onOpenPane: () => void;
  onClosePane: () => void;
}) {
  const threadRef = useRef<HTMLDivElement>(null);
  const { show } = useToast();

  // Locally clone the seed messages and wire each assistant artifact card to
  // open the right-hand pane. Cloning prevents mutating the shared fixture
  // during a "replay streaming" session.
  const [messages, setMessages] = useState<Message[]>(() =>
    mockMessages.map((m) => {
      if (m.role === 'assistant' && m.artifact) {
        return { ...m, artifact: { ...m.artifact, onOpen: onOpenPane } };
      }
      return { ...m };
    }),
  );

  // Re-bind the artifact handler whenever it changes (rare, but cheap).
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.role === 'assistant' && m.artifact
          ? { ...m, artifact: { ...m.artifact, onOpen: onOpenPane } }
          : m,
      ),
    );
  }, [onOpenPane]);
  const [stream, setStream] = useState<StreamState>({
    index: -1,
    fed: [],
    total: [],
    thinking: false,
  });

  const lastAssistantIdx = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === 'assistant') return i;
    }
    return -1;
  }, [messages]);

  // Drive the typewriter: every 28ms, push another token into the active
  // assistant body. A short "thinking" pause precedes the first token, during
  // which we stream a few reasoning steps into ThinkingTrace, then resolve the
  // trace ("Thought for Ns") before the body reveal begins.
  useEffect(() => {
    if (stream.index < 0) return;
    if (stream.thinking) {
      const startedAt = Date.now();
      const steps = THINKING_STEPS;
      // Reveal a thinking step every 220ms.
      const stepInterval = 220;
      const totalThinkMs = steps.length * stepInterval + 240;
      const t = setTimeout(() => {
        const elapsed = Date.now() - startedAt;
        setMessages((prev) =>
          prev.map((m, i) =>
            i === stream.index && m.role === 'assistant'
              ? {
                  ...m,
                  thinking: { active: false, steps, durationMs: elapsed },
                }
              : m,
          ),
        );
        setStream((s) => ({ ...s, thinking: false }));
      }, totalThinkMs);

      // Stream individual steps into the trace as they "arrive".
      let revealed = 0;
      const stepTimer = setInterval(() => {
        revealed += 1;
        const visible = steps.slice(0, revealed);
        setMessages((prev) =>
          prev.map((m, i) =>
            i === stream.index && m.role === 'assistant'
              ? { ...m, thinking: { active: true, steps: visible, defaultOpen: true } }
              : m,
          ),
        );
        if (revealed >= steps.length) clearInterval(stepTimer);
      }, stepInterval);
      return () => {
        clearTimeout(t);
        clearInterval(stepTimer);
      };
    }
    if (stream.fed.length >= stream.total.length) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === stream.index && m.role === 'assistant' ? { ...m, streaming: false } : m,
        ),
      );
      setStream({ index: -1, fed: [], total: [], thinking: false });
      return;
    }
    const t = setTimeout(() => {
      setStream((s) => {
        const tok = s.total[s.fed.length];
        if (tok === undefined) return s;
        return { ...s, fed: [...s.fed, tok] };
      });
    }, 28);
    return () => clearTimeout(t);
  }, [stream]);

  // Sync the streamed body back into the message list every tick.
  useEffect(() => {
    if (stream.index < 0) return;
    const body = stream.fed.join('');
    setMessages((prev) =>
      prev.map((m, i) =>
        i === stream.index && m.role === 'assistant' ? { ...m, content: body, streaming: true } : m,
      ),
    );
  }, [stream.fed, stream.index]);

  const handleReplay = useCallback(() => {
    if (lastAssistantIdx < 0) return;
    const original = mockMessages[lastAssistantIdx];
    if (!original || original.role !== 'assistant') return;
    const text = typeof original.content === 'string' ? original.content : '';
    setStream({ index: lastAssistantIdx, fed: [], total: tokenize(text), thinking: true });
    setMessages((prev) =>
      prev.map((m, i) =>
        i === lastAssistantIdx && m.role === 'assistant'
          ? {
              ...m,
              content: '',
              streaming: true,
              thinking: { active: true, steps: [], defaultOpen: true },
            }
          : m,
      ),
    );
  }, [lastAssistantIdx]);

  const isStreaming = stream.index >= 0;

  return (
    <MainArea
      topbar={
        <PageTopbar
          title="Coding habits digital pet"
          trailing={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReplay} disabled={isStreaming}>
                <RefreshCw size={12} />
                {isStreaming ? 'Streaming…' : 'Replay streaming'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={paneOpen ? onClosePane : onOpenPane}
                aria-pressed={paneOpen}
              >
                <CodeIcon size={12} /> {paneOpen ? 'Close artifact' : 'Open artifact'}
              </Button>
              <Button variant="outline" size="sm">
                <Share size={12} /> Share
              </Button>
            </div>
          }
        />
      }
      maxWidth={null}
    >
      <div ref={threadRef} className="mx-auto w-full max-w-[720px] pb-44">
        <MessageList
          messages={messages}
          onCopy={(id) => console.log('copy', id)}
          onRetry={(id) => console.log('retry', id)}
          onFeedback={(id, k) => console.log('fb', id, k)}
          footer={<ThreadDisclaimer />}
        />
      </div>
      <SelectionToolbar
        scopeRef={threadRef}
        actions={[
          {
            id: 'copy',
            label: 'Copy',
            icon: <RefreshCw size={13} />,
            onSelect: (text) => show({ title: 'Copied', description: `${text.slice(0, 40)}…` }),
          },
          {
            id: 'explain',
            label: 'Ask follow-up',
            icon: <MessageSquare size={13} />,
            onSelect: (text) =>
              show({ title: 'Asked follow-up', description: text, tone: 'success' }),
          },
          {
            id: 'improve',
            label: 'Rewrite',
            icon: <Sparkles size={13} />,
            onSelect: (text) => show({ title: 'Rewriting…', description: text }),
          },
          {
            id: 'tools',
            label: 'Send to canvas',
            icon: <Wrench size={13} />,
            onSelect: (text) => show({ title: 'Sent to canvas', description: text }),
          },
        ]}
      />

      <div className="sticky bottom-0 left-0 right-0 mx-auto w-full max-w-[720px] pb-4 pt-2 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent">
        <Composer
          placeholder="Reply to assistant..."
          models={mockModelOptions}
          toggles={[{ id: 'research', label: 'Research' }]}
        />
      </div>
    </MainArea>
  );
}
