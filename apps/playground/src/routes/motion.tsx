import { Asterisk } from '@oh/icons';
import { StreamingShimmer, durations, springs } from '@oh/motion';
import { Button, MainArea } from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';

export const Route = createFileRoute('/motion')({
  component: MotionPage,
});

function MotionPage() {
  const [tick, setTick] = useState(0);
  return (
    <AppFrame>
      <MainArea topbar={<PlaygroundNav />} maxWidth={null}>
        <div className="mx-auto w-full max-w-[860px] py-10 space-y-12">
          <header>
            <h1 className="text-[28px] font-serif">Motion</h1>
            <p className="text-[13.5px] text-[var(--color-text-muted)] mt-1">
              Spring presets, durations, and the streaming shimmer placeholder.
            </p>
          </header>

          <section>
            <h2 className="text-[15px] font-semibold mb-3">Springs</h2>
            <div className="flex items-center gap-3 mb-4">
              <Button variant="outline" size="sm" onClick={() => setTick((t) => t + 1)}>
                Replay
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(springs).map(([name, spring]) => (
                <div
                  key={name}
                  className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <div className="text-[12px] font-mono text-[var(--color-text-muted)] mb-3">
                    {name}
                  </div>
                  <motion.div
                    key={`${name}-${tick}`}
                    initial={{ x: 0, scale: 0.9, opacity: 0 }}
                    animate={{ x: 80, scale: 1, opacity: 1 }}
                    transition={spring}
                    className="h-12 w-12 rounded-[14px] bg-[var(--color-accent)] text-white flex items-center justify-center"
                  >
                    <Asterisk size={20} />
                  </motion.div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold mb-3">Durations</h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(durations).map(([name, secs]) => (
                <div
                  key={name}
                  className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                >
                  <div className="text-[12px] font-mono text-[var(--color-text-muted)]">{name}</div>
                  <div className="text-[18px] font-semibold mt-1">{Math.round(secs * 1000)}ms</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold mb-3">Streaming shimmer</h2>
            <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <StreamingShimmer />
            </div>
          </section>
        </div>
      </MainArea>
    </AppFrame>
  );
}
