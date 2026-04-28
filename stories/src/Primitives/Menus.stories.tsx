import { Settings, Sparkles, Wrench } from '@oh/icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = { title: 'Primitives/DropdownMenu' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings size={12} /> Open menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <Sparkles size={14} className="text-[var(--color-text-muted)]" /> New chat
          <span className="ml-auto text-[10px] text-[var(--color-text-subtle)]">Ctrl+N</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Wrench size={14} className="text-[var(--color-text-muted)]" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
