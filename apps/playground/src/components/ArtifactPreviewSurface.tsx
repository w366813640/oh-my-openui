import { Sparkles } from '@oh/icons';

export function ArtifactPreviewSurface({
  eyebrow = 'Artifact preview',
  description = 'A live React surface with success, empty, and connector error states.',
}: {
  eyebrow?: string;
  description?: string;
}) {
  const metrics = [
    ['Focus', '142m', 'happy'],
    ['Debug', '28m', 'low'],
    ['Coffee', '2 cups', 'steady'],
  ];

  return (
    <div className="h-full w-full overflow-auto bg-[var(--color-surface)]">
      <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-col px-7 py-7 max-[640px]:px-5">
        <header className="flex items-start justify-between gap-5 border-b border-[var(--color-border)] pb-6">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-[25px] font-serif leading-tight text-[var(--color-text)]">
              Coding habits pet
            </h2>
            <p className="mt-1 max-w-[420px] text-[13px] leading-relaxed text-[var(--color-text-muted)]">
              {description}
            </p>
          </div>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
            <Sparkles size={20} />
          </span>
        </header>

        <section className="grid grid-cols-3 border-b border-[var(--color-border)] max-[560px]:grid-cols-1">
          {metrics.map(([label, value, meta], idx) => (
            <div
              key={label}
              className={[
                'py-5',
                idx === 0
                  ? ''
                  : 'border-l border-[var(--color-border)] pl-5 max-[560px]:border-l-0 max-[560px]:border-t max-[560px]:pl-0',
                idx < metrics.length - 1 ? 'pr-5' : '',
              ].join(' ')}
            >
              <div className="text-[11px] text-[var(--color-text-subtle)]">{label}</div>
              <div className="mt-1 text-[17px] font-semibold text-[var(--color-text)]">{value}</div>
              <div className="text-[11px] text-[var(--color-text-muted)]">{meta}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-0 border-b border-[var(--color-border)] sm:grid-cols-2">
          <div className="border-r border-[var(--color-border)] py-5 pr-5 max-sm:border-r-0 max-sm:border-b max-sm:pr-0">
            <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Empty state</h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-text-muted)]">
              No activity yet. Start a focus session to wake the pet.
            </p>
          </div>
          <div className="py-5 pl-5 max-sm:pl-0">
            <div className="border-l-2 border-[var(--color-warning)] pl-3">
              <h3 className="text-[13px] font-semibold text-[var(--color-text)]">
                Connector paused
              </h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-text-muted)]">
                GitHub sync failed. Local editor events are still feeding the model.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
