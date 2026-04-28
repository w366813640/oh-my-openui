import { fontSize, lightColors, radius, shadow } from '@oh/tokens';
import { MainArea } from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';

export const Route = createFileRoute('/tokens')({
  component: TokensPage,
});

function TokensPage() {
  return (
    <AppFrame>
      <MainArea topbar={<PlaygroundNav />} maxWidth={null}>
        <div className="mx-auto w-full max-w-[860px] py-10 space-y-12">
          <header>
            <h1 className="text-[28px] font-serif">Design tokens</h1>
            <p className="text-[13.5px] text-[var(--color-text-muted)] mt-1">
              The single source of truth for color, typography, radius, shadow, and motion.
            </p>
          </header>

          <Section title="Color (light theme — dark theme overrides via [data-theme=dark])">
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(lightColors).map(([key, value]) => (
                <Swatch key={key} name={key} value={value as string} />
              ))}
            </div>
          </Section>

          <Section title="Radius">
            <div className="flex flex-wrap items-end gap-4">
              {Object.entries(radius).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center gap-2">
                  <div
                    className="h-16 w-16 bg-[var(--color-surface-muted)] border border-[var(--color-border)]"
                    style={{ borderRadius: value }}
                  />
                  <div className="text-[11px] text-[var(--color-text-muted)] font-mono">
                    {key} · {value}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Typography">
            <div className="space-y-3">
              {Object.entries(fontSize).map(([key, value]) => (
                <div key={key} className="flex items-baseline gap-4">
                  <span className="w-16 text-[11px] text-[var(--color-text-muted)] font-mono shrink-0">
                    {key}
                  </span>
                  <span style={{ fontSize: value[0] as string }} className="font-serif">
                    Knowledge that compounds.
                  </span>
                  <span className="text-[11px] text-[var(--color-text-subtle)] font-mono ml-auto">
                    {value[0] as string}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Shadow">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(shadow).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-[14px] bg-[var(--color-surface)] border border-[var(--color-border)] p-6 text-center"
                  style={{ boxShadow: value }}
                >
                  <div className="text-[12px] font-mono text-[var(--color-text-muted)]">{key}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </MainArea>
    </AppFrame>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[15px] font-semibold mb-3 text-[var(--color-text)]">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
      <div
        className="h-9 w-9 rounded-[8px] border border-[var(--color-border)] flex-shrink-0"
        style={{ background: value }}
      />
      <div className="min-w-0">
        <div className="text-[12px] font-medium truncate">{name}</div>
        <div className="text-[11px] text-[var(--color-text-muted)] font-mono uppercase truncate">
          {value}
        </div>
      </div>
    </div>
  );
}
