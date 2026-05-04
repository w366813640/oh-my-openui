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
import type { Message } from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
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
            <div className="h-full w-full overflow-auto bg-[var(--color-surface-sunken)] p-5">
              <div className="mx-auto flex w-full max-w-[560px] flex-col gap-4">
                <section className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
                        Artifact preview
                      </p>
                      <h2 className="mt-1 text-[24px] font-serif text-[var(--color-text)]">
                        Coding habits pet
                      </h2>
                      <p className="mt-1 max-w-[360px] text-[13px] leading-relaxed text-[var(--color-text-muted)]">
                        A live React surface with success, empty, and connector error states.
                      </p>
                    </div>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                      <Sparkles size={24} />
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      ['Focus', '142m', 'happy'],
                      ['Debug', '28m', 'low'],
                      ['Coffee', '2 cups', 'steady'],
                    ].map(([label, value, meta]) => (
                      <div
                        key={label}
                        className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3"
                      >
                        <div className="text-[11px] text-[var(--color-text-subtle)]">{label}</div>
                        <div className="mt-1 text-[16px] font-semibold text-[var(--color-text)]">
                          {value}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">{meta}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[14px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-4">
                    <h3 className="text-[13px] font-semibold text-[var(--color-text)]">
                      Empty state
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-text-muted)]">
                      No activity yet. Start a focus session to wake the pet.
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-[rgba(200,134,42,0.32)] bg-[rgba(200,134,42,0.10)] p-4">
                    <h3 className="text-[13px] font-semibold text-[var(--color-text)]">
                      Connector paused
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-text-muted)]">
                      GitHub sync failed. Local editor events are still feeding the model.
                    </p>
                  </div>
                </section>
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
        <div className="mx-auto w-full max-w-[680px] pb-32">
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
