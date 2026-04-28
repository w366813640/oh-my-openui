import { Composer, Greeting, WelcomeStage } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = { title: 'Patterns/Welcome' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <WelcomeStage>
      <Greeting name="Sam" size="xl" recency="returning" />
      <Composer />
    </WelcomeStage>
  ),
};
