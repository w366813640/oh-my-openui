import { radius, shadow } from '@oh/tokens';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = { title: 'Foundation/Radius & Shadow' };
export default meta;
type Story = StoryObj;

export const Radii: Story = {
  render: () => (
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
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-[820px]">
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
  ),
};
