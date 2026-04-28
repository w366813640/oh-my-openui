import { MessageSquare, RefreshCw, Share, Sparkles, Wrench } from '@oh/icons';
import {
  Button,
  Composer,
  MainArea,
  type Message,
  MessageList,
  SelectionToolbar,
  ThreadDisclaimer,
  useToast,
} from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppFrame, PageTopbar } from '../components/AppFrame';
import { mockMessages, mockModelOptions } from '../mocks/data';

export const Route = createFileRoute('/chat-demo')({
  component: ChatDemo,
});

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
  return (
    <AppFrame>
      <ChatDemoContent />
    </AppFrame>
  );
}

function ChatDemoContent() {
  const threadRef = useRef<HTMLDivElement>(null);
  const { show } = useToast();

  // Locally clone the seed messages so we can mutate the assistant body during
  // a "replay streaming" session without touching the shared mock fixture.
  const [messages, setMessages] = useState<Message[]>(() => mockMessages.map((m) => ({ ...m })));
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
  // assistant body. A short "thinking" pause precedes the first token to
  // showcase the StreamingShimmer pre-token state.
  useEffect(() => {
    if (stream.index < 0) return;
    if (stream.thinking) {
      const t = setTimeout(() => {
        setStream((s) => ({ ...s, thinking: false }));
      }, 720);
      return () => clearTimeout(t);
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
          ? { ...m, content: '', streaming: true }
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
              <Button variant="outline" size="sm">
                <Share size={12} /> Share
              </Button>
            </div>
          }
        />
      }
      maxWidth={null}
    >
      <div ref={threadRef} className="mx-auto w-full max-w-[720px] pb-32">
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
