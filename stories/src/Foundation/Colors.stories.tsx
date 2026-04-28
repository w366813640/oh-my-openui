import { lightColors } from '@oh/tokens';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundation/Colors',
};

export default meta;
type Story = StoryObj;

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div
        className="h-10 w-10 rounded-[8px] border border-[var(--color-border)] flex-shrink-0"
        style={{ background: value }}
      />
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium">{name}</div>
        <div className="text-[11px] text-[var(--color-text-muted)] font-mono uppercase">{value}</div>
      </div>
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-3 max-w-[820px]">
      {Object.entries(lightColors).map(([key, value]) => (
        <Swatch key={key} name={key} value={value as string} />
      ))}
    </div>
  ),
};
