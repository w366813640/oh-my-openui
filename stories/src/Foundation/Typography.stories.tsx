import { fontSize } from '@oh/tokens';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Typography',
};
export default meta;
type Story = StoryObj;

export const SerifAndSans: Story = {
  render: () => (
    <div className="space-y-6 max-w-[860px]">
      <section>
        <h3 className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Serif scale
        </h3>
        <div className="space-y-2">
          {Object.entries(fontSize).map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 text-[11px] font-mono text-[var(--color-text-muted)]">
                {key}
              </span>
              <span style={{ fontSize: value[0] as string }} className="font-serif">
                Knowledge that compounds.
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[12px] uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
          Sans scale
        </h3>
        <div className="space-y-2">
          {Object.entries(fontSize).map(([key, value]) => (
            <div key={key} className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 text-[11px] font-mono text-[var(--color-text-muted)]">
                {key}
              </span>
              <span style={{ fontSize: value[0] as string }} className="font-sans">
                The quick brown fox jumps over the lazy dog.
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
