import { CodeIcon, Sparkles } from '@oh/icons';
import {
  ArtifactPane,
  Button,
  CodeBlock,
  Composer,
  MainArea,
  MessageList,
  ThreadDisclaimer,
  useArtifactPane,
} from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import type { Message } from '@oh/ui';
import { useMemo } from 'react';
import { AppFrame, PageTopbar } from '../components/AppFrame';
import { mockMessages, mockModelOptions } from '../mocks/data';

export const Route = createFileRoute('/artifact-demo')({
  component: ArtifactDemo,
});

function ArtifactDemo() {
  const pane = useArtifactPane(true);
  const enriched = useMemo<Message[]>(() => {
    return mockMessages.map((m) => {
      if (m.role === 'assistant' && m.artifact) {
        return { ...m, artifact: { ...m.artifact, onOpen: pane.show } };
      }
      return m;
    });
  }, [pane.show]);

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
          preview={
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#5577B8]/15 via-[var(--color-surface)] to-[var(--color-surface-raised)]">
              <div className="text-center px-8">
                <Sparkles size={48} className="mx-auto mb-4 text-[var(--color-info)]" />
                <h2 className="text-[22px] font-serif text-[var(--color-text)] mb-2">
                  Live Artifact Preview
                </h2>
                <p className="text-[13px] text-[var(--color-text-muted)] max-w-[320px] mx-auto leading-relaxed">
                  Render any embeddable preview here — React component, HTML iframe,
                  Markdown document, or interactive sandbox.
                </p>
              </div>
            </div>
          }
          code={
            <div className="p-4 h-full">
              <CodeBlock
                language="tsx"
                filename="CodingPet.tsx"
                maxHeight={1000}
                code={`import { useEffect, useState } from 'react';
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
  if (energy > 0.6 && stress < 0.3) return 'happy';
  if (stress > 0.6) return 'stressed';
  if (caffeine > 0.8) return 'wired';
  return 'neutral';
}

export function CodingPet(props: PetProps) {
  const [mood, setMood] = useState(() => computeMood(props));
  useEffect(() => {
    setMood(computeMood(props));
  }, [props.focus, props.debug, props.coffee]);

  return (
    <div className="rounded-2xl p-4 bg-amber-50 shadow-sm">
      <Avatar mood={mood} />
      <Stats focus={props.focus} debug={props.debug} coffee={props.coffee} />
    </div>
  );
}`}
              />
            </div>
          }
        />
      }
    >
      <MainArea
        topbar={
          <PageTopbar
            title="Digital Coding Pet"
            trailing={
              !pane.open ? (
                <Button variant="outline" size="sm" onClick={pane.show}>
                  <CodeIcon size={12} /> Open artifact
                </Button>
              ) : null
            }
          />
        }
        maxWidth={null}
      >
        <div className="mx-auto w-full max-w-[680px] pb-32">
          <MessageList
            messages={enriched}
            onCopy={(id) => console.log('copy', id)}
            onRetry={(id) => console.log('retry', id)}
            footer={<ThreadDisclaimer />}
          />
        </div>

        <div className="sticky bottom-0 left-0 right-0 mx-auto w-full max-w-[680px] pb-4 pt-2 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent">
          <Composer
            placeholder="Reply to assistant..."
            models={mockModelOptions}
          />
        </div>
      </MainArea>
    </AppFrame>
  );
}
