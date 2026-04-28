import { Kbd, SearchPalette, type SearchPaletteItem } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';

const meta: Meta<typeof SearchPalette> = {
  title: 'Patterns/SearchPalette',
  component: SearchPalette,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof SearchPalette>;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[640px] w-full bg-[var(--color-bg)] grid place-items-center text-[var(--color-text-muted)] text-[13px]">
      {children}
    </div>
  );
}

const richItems: SearchPaletteItem[] = [
  { id: 'r1', label: 'Productivity tools exploration', kind: 'chat', group: 'Starred', description: '5h ago' },
  { id: 'r2', label: 'Generate a coding friend', kind: 'chat', group: 'Starred', description: 'Yesterday' },
  { id: 'r3', label: 'Build a dev companion app', kind: 'chat', group: 'Recents', description: 'Mon' },
  { id: 'r4', label: 'Fixing CSS Grid edge cases', kind: 'chat', group: 'Recents', description: 'Last week' },
  { id: 'r5', label: 'Aurora dashboard mockups', kind: 'project', group: 'Projects', description: '3 chats' },
  { id: 'r6', label: 'Internal tools', kind: 'project', group: 'Projects', description: '12 chats' },
  { id: 'c1', label: 'New chat', kind: 'command', group: 'Commands', trailing: <Kbd>⌘N</Kbd> },
  { id: 'c2', label: 'Open settings', kind: 'command', group: 'Commands', trailing: <Kbd>⌘,</Kbd> },
  { id: 'c3', label: 'Toggle theme', kind: 'command', group: 'Commands', trailing: <Kbd>⌘⇧L</Kbd> },
  { id: 'c4', label: 'Sign out', kind: 'command', group: 'Commands' },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const items = useMemo(() => richItems, []);
    return (
      <Frame>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 rounded-[8px] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]"
        >
          Open search palette
        </button>
        <SearchPalette open={open} onOpenChange={setOpen} items={items} />
      </Frame>
    );
  },
};

export const EmptyState: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Frame>
        <SearchPalette open={open} onOpenChange={setOpen} items={[]} placeholder="Search anything…" />
      </Frame>
    );
  },
};

export const SingleGroup: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const items = useMemo<SearchPaletteItem[]>(
      () => [
        { id: '1', label: 'README.md', description: 'Project root', kind: 'page' },
        { id: '2', label: 'CONTRIBUTING.md', description: 'Project root', kind: 'page' },
        { id: '3', label: 'CHANGELOG.md', description: 'Project root', kind: 'page' },
      ],
      [],
    );
    return (
      <Frame>
        <SearchPalette open={open} onOpenChange={setOpen} items={items} />
      </Frame>
    );
  },
};
