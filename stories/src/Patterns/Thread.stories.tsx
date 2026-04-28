import { type Message, MessageList, ThreadDisclaimer } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = { title: 'Patterns/MessageList' };
export default meta;
type Story = StoryObj;

const messages: Message[] = [
  {
    id: 'u1',
    role: 'user',
    initials: 'SL',
    content: 'I want you to design a digital pet that reflects my coding habits.',
  },
  {
    id: 'a1',
    role: 'assistant',
    content:
      "I'll create a digital pet that reflects your coding habits! To make this useful for you:\n\n1. What behavior patterns should it track?\n2. Should it reward good habits or reflect current state?\n3. Just visual indicator, or interactive?\n\nOnce you clarify, I'll generate a JS + HTML implementation.",
  },
  {
    id: 'a2',
    role: 'assistant',
    content: 'Here is a runnable starter — open the artifact to inspect or remix it.',
    artifact: { title: 'Digital Coding Pet', subtitle: 'React + JS · interactive' },
  },
];

export const Default: Story = {
  render: () => (
    <div className="max-w-[720px] mx-auto">
      <MessageList messages={messages} footer={<ThreadDisclaimer />} />
    </div>
  ),
};
