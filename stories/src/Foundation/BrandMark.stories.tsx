import { BrandMark } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BrandMark> = {
  title: 'Foundation/BrandMark',
  component: BrandMark,
};
export default meta;
type Story = StoryObj<typeof BrandMark>;

function Stage({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      {children}
      <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--color-text-subtle)]">
        {label}
      </span>
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6">
      <Stage label="Static">
        <BrandMark size={36} motion="none" />
      </Stage>
      <Stage label="Hover (try it)">
        <BrandMark size={36} motion="hover" />
      </Stage>
      <Stage label="Idle pulse">
        <BrandMark size={36} motion="idle-pulse" />
      </Stage>
      <Stage label="Streaming">
        <BrandMark size={36} motion="streaming" />
      </Stage>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-6 p-6">
      {[16, 22, 30, 44, 60].map((s) => (
        <BrandMark key={s} size={s} motion="hover" />
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="grid place-items-center p-12">
      <BrandMark
        size={64}
        motion="hover"
        onClick={() => alert('Brand click!')}
        ariaLabel="Open brand"
      />
      <p className="mt-3 text-[12px] text-[var(--color-text-muted)]">Click me · keyboard accessible</p>
    </div>
  ),
};
