import { ChatSkeleton, ComposerSkeleton, ListSkeleton, Skeleton } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Patterns/Skeleton',
};
export default meta;
type Story = StoryObj;

export const Primitives: Story = {
  render: () => (
    <div className="flex max-w-[480px] flex-col gap-3 p-6">
      <Skeleton className="h-4 w-[60%]" />
      <Skeleton className="h-3 w-[40%]" />
      <Skeleton className="h-3 w-[80%]" />
      <Skeleton className="h-10 w-full" rounded="rounded-[10px]" />
    </div>
  ),
};

export const ListLoading: Story = {
  render: () => (
    <div className="mx-auto max-w-[640px] p-6">
      <ListSkeleton rows={6} />
    </div>
  ),
};

export const ComposerLoading: Story = {
  render: () => (
    <div className="mx-auto max-w-[640px] p-6">
      <ComposerSkeleton />
    </div>
  ),
};

export const ChatLoading: Story = {
  render: () => (
    <div className="mx-auto max-w-[720px] p-6">
      <ChatSkeleton messages={5} />
    </div>
  ),
};
