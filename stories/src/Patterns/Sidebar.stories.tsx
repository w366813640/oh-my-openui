import { FolderOpen, Layout, MessageSquare, Search, Sparkles } from '@oh/icons';
import {
  Sidebar,
  SidebarBody,
  SidebarBrand,
  SidebarFooter,
  SidebarHeader,
  SidebarLinkItem,
  SidebarNavItem,
  SidebarPrimaryAction,
  SidebarSectionLabel,
} from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = { title: 'Patterns/Sidebar' };
export default meta;
type Story = StoryObj;

function Demo({ initiallyExpanded = true }: { initiallyExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  return (
    <div className="flex h-[600px] border border-[var(--color-border)] rounded-[12px] overflow-hidden">
      <div
        style={{
          width: expanded ? 240 : 48,
          transition: 'width 240ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
        className="border-r border-[var(--color-border)] bg-[var(--color-bg)] flex-shrink-0"
      >
        <Sidebar expanded={expanded}>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <SidebarBrand expanded={expanded} name="Aurora" />
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
              >
                <Layout size={14} />
              </button>
            </div>
            <SidebarPrimaryAction expanded={expanded} />
            <SidebarNavItem icon={Search} label="Search" expanded={expanded} />
          </SidebarHeader>
          <SidebarBody>
            <SidebarNavItem icon={MessageSquare} label="Chats" expanded={expanded} active />
            <SidebarNavItem icon={FolderOpen} label="Projects" expanded={expanded} />
            <SidebarNavItem icon={Sparkles} label="Artifacts" expanded={expanded} />
            {expanded ? (
              <>
                <SidebarSectionLabel expanded={expanded}>Recents</SidebarSectionLabel>
                <SidebarLinkItem label="Productivity tools exploration" />
                <SidebarLinkItem label="Generate a coding friend" />
                <SidebarLinkItem label="Build a dev companion" />
              </>
            ) : null}
          </SidebarBody>
          <SidebarFooter>
            <div className="text-[12px] text-[var(--color-text-muted)] px-1">SL · Pro</div>
          </SidebarFooter>
        </Sidebar>
      </div>
      <div className="flex-1 grid place-items-center text-[var(--color-text-muted)]">main</div>
    </div>
  );
}

export const Expanded: Story = { render: () => <Demo /> };
export const Collapsed: Story = { render: () => <Demo initiallyExpanded={false} /> };
