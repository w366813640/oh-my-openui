import { ArrowUp, Plus, Sparkles, Trash2 } from '@oh/icons';
import { Button } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link button</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">
          <Plus size={12} /> Small
        </Button>
        <Button size="md">
          <Sparkles size={14} /> Medium
        </Button>
        <Button size="lg">
          <ArrowUp size={16} /> Large
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button variant="destructive" size="sm">
          <Trash2 size={12} /> Delete
        </Button>
      </div>
    </div>
  ),
};
