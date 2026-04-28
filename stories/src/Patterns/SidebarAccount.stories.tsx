import { HelpCircle, Languages, LogOut, Moon, Settings, Sparkles } from '@oh/icons';
import { DefaultPlanBadge, SidebarAccount, type SidebarAccountAction } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SidebarAccount> = {
  title: 'Patterns/SidebarAccount',
  component: SidebarAccount,
};
export default meta;
type Story = StoryObj<typeof SidebarAccount>;

const actions: SidebarAccountAction[] = [
  { id: 'settings', label: 'Settings', icon: Settings, shortcut: '⌘,' },
  { id: 'theme', label: 'Theme · light', icon: Moon },
  { id: 'language', label: 'Language', icon: Languages },
  { id: 'help', label: 'Get help', icon: HelpCircle },
  { id: 'upgrade', label: 'Upgrade plan', icon: Sparkles },
  { id: 'logout', label: 'Log out', icon: LogOut, tone: 'destructive' },
];

function Wrap({ width, children }: { width: number; children: React.ReactNode }) {
  return (
    <div
      style={{ width }}
      className="border border-[var(--color-border)] rounded-[12px] p-2 bg-[var(--color-bg)]"
    >
      {children}
    </div>
  );
}

export const Expanded: Story = {
  render: () => (
    <Wrap width={240}>
      <SidebarAccount
        expanded
        name="Alex Lee"
        subtitle="Pro plan · alex@example.com"
        planBadge={<DefaultPlanBadge>Pro</DefaultPlanBadge>}
        actions={actions}
      />
    </Wrap>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <Wrap width={48}>
      <SidebarAccount expanded={false} name="Alex Lee" subtitle="Pro plan" actions={actions} />
    </Wrap>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <Wrap width={240}>
      <SidebarAccount
        expanded
        name="Sam Wilson"
        subtitle="Free plan"
        avatarUrl="https://i.pravatar.cc/64?img=12"
        actions={actions}
      />
    </Wrap>
  ),
};

export const FreePlan: Story = {
  render: () => (
    <Wrap width={240}>
      <SidebarAccount
        expanded
        name="Jamie Chen"
        subtitle="Free plan"
        actions={actions.filter((a) => a.id !== 'upgrade').concat([
          { id: 'upgrade', label: 'Upgrade to Pro', icon: Sparkles },
          { id: 'logout', label: 'Log out', icon: LogOut, tone: 'destructive' },
        ])}
      />
    </Wrap>
  ),
};
