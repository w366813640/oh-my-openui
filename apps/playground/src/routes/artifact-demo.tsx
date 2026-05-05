import { CodeIcon } from '@oh/icons';
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
import type { Message } from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { AppFrame, PageTopbar } from '../components/AppFrame';
import { ArtifactPreviewSurface } from '../components/ArtifactPreviewSurface';
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
          preview={<ArtifactPreviewSurface />}
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
        <div className="mx-auto w-full max-w-[680px] pb-44">
          <MessageList
            messages={enriched}
            onCopy={(id) => console.log('copy', id)}
            onRetry={(id) => console.log('retry', id)}
            footer={<ThreadDisclaimer />}
          />
        </div>

        <div className="sticky bottom-0 left-0 right-0 mx-auto w-full max-w-[680px] pb-4 pt-2 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent">
          <Composer placeholder="Reply to assistant..." models={mockModelOptions} />
        </div>
      </MainArea>
    </AppFrame>
  );
}
