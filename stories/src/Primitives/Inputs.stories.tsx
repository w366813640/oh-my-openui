import { Input, Switch, Textarea } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = { title: 'Primitives/Inputs' };
export default meta;
type Story = StoryObj;

export const TextInput: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-[420px]">
      <Input placeholder="Untitled" />
      <Input defaultValue="With value" />
      <Input placeholder="Invalid" invalid />
      <Input placeholder="Disabled" disabled />
    </div>
  ),
};

export const TextAreaAuto: Story = {
  render: () => (
    <div className="max-w-[640px] rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <Textarea placeholder="Type something — height grows naturally up to a cap." />
    </div>
  ),
};

export const SwitchVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch />
      <Switch defaultChecked />
      <Switch size="sm" />
      <Switch size="sm" defaultChecked />
      <Switch disabled />
    </div>
  ),
};
