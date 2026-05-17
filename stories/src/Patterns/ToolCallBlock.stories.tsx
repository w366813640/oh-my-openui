import { AssistantMessage, type AssistantMessageData, ToolCallBlock } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ToolCallBlock> = {
  title: 'Patterns/ToolCallBlock',
  component: ToolCallBlock,
};
export default meta;
type Story = StoryObj<typeof ToolCallBlock>;

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-4 max-w-[640px]">
      <ToolCallBlock title="bash" kind="shell" subtitle="ls -la /etc" status="running" />
      <ToolCallBlock
        title="web.search"
        kind="web"
        subtitle='"electron 42 release notes"'
        status="done"
        defaultOpen
      >
        {`Electron 42 ships Chromium 136 + Node 22.
Highlights: web app manifest scope changes, Profile API, …`}
      </ToolCallBlock>
      <ToolCallBlock
        title="db.query"
        kind="db"
        subtitle="SELECT * FROM users WHERE …"
        status="error"
        errorLabel="ECONNREFUSED"
        defaultOpen
      >
        {`Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete]
        (node:net:1646:16)`}
      </ToolCallBlock>
      <ToolCallBlock title="code.search" kind="code" subtitle='"useViewport"' status="done" />
    </div>
  ),
};

const messageWithTools: AssistantMessageData = {
  id: 'a-tool',
  role: 'assistant',
  content:
    "I'll find the relevant config and update it for you. Here's what I found and the change I made.",
};

export const InAssistantMessage: Story = {
  render: () => (
    <div className="max-w-[680px] p-6">
      <AssistantMessage message={messageWithTools} hideActions>
        <div className="font-serif text-[16px] leading-[25px]">
          <p>I'll find the relevant config and update it for you.</p>
          <ToolCallBlock
            title="code.search"
            kind="code"
            subtitle='"electronBuilder.config"'
            status="done"
          >
            {`apps/desktop/electron-builder.yml
  3 matches; first at line 1`}
          </ToolCallBlock>
          <ToolCallBlock
            title="apply_patch"
            kind="file"
            subtitle="electron-builder.yml"
            status="done"
          >
            {`@@ -8,6 +8,7 @@ files:
   - dist/main/**/*
   - "package.json"
+  - "brand.config.json"`}
          </ToolCallBlock>
          <p>
            Now `brand.config.json` ships inside the packaged app, so the splash and Win11 titlebar
            overlay paint with your brand at runtime.
          </p>
        </div>
      </AssistantMessage>
    </div>
  ),
};
