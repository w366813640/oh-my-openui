import { ArtifactPane } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof ArtifactPane> = {
  title: 'Patterns/ArtifactPane',
  component: ArtifactPane,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Right-hand split pane that slides in to host previewable assistant artifacts (React components, ' +
          'HTML iframes, markdown documents, etc). Supports drag-to-resize on the left border (with localStorage ' +
          'persistence and keyboard ←/→ nudge), morphing drag affordance, and an animated Preview/Code tab switch.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ArtifactPane>;

const SAMPLE_CODE = `import { motion } from 'motion/react';

export function CodingPet({ mood }: { mood: 'happy' | 'stressed' | 'wired' }) {
  return (
    <motion.div
      animate={{ scale: mood === 'wired' ? 1.05 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-2xl bg-amber-50 p-6 text-center"
    >
      <span className="text-5xl">{mood === 'happy' ? '🐱' : mood === 'stressed' ? '😺' : '⚡️'}</span>
      <p className="mt-2 text-sm font-medium text-amber-900">{mood}</p>
    </motion.div>
  );
}
`;

function PreviewBlock() {
  return (
    <div className="h-full grid place-items-center bg-[var(--color-bg)] p-6">
      <div className="rounded-[18px] bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-[var(--shadow-card)] px-8 py-10 text-center max-w-[320px]">
        <div className="text-[64px] leading-none mb-2">🐱</div>
        <div className="text-[15px] font-semibold text-[var(--color-text)]">happy</div>
        <p className="text-[12.5px] text-[var(--color-text-muted)] mt-1 leading-snug">
          Live preview of the artifact, rendered as a dedicated React node.
        </p>
      </div>
    </div>
  );
}

function CodeBlock() {
  return (
    <pre className="h-full m-0 px-6 py-5 text-[12.5px] leading-[1.65] bg-[var(--color-surface-sunken)] text-[var(--color-text)] font-mono overflow-auto">
      <code>{SAMPLE_CODE}</code>
    </pre>
  );
}

function StoryFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-screen h-[100dvh] min-h-[640px] bg-[var(--color-bg)]">
      <main className="flex-1 px-10 py-12 overflow-auto">
        <h1 className="font-serif text-[32px] leading-tight mb-4 text-[var(--color-text)]">
          Coding Pet — Live demo
        </h1>
        <p className="text-[14.5px] leading-[1.65] text-[var(--color-text-muted)] max-w-[600px]">
          Resize the right pane by dragging its left border, double-click to reset, or focus the
          handle and tap ← / → to nudge by 24px. Width is persisted to{' '}
          <code className="font-mono text-[12.5px]">localStorage</code> under the configured key.
          Switching between Preview and Code crossfades with a directional <em>x</em> slide.
        </p>
      </main>
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <StoryFrame>
        <ArtifactPane
          open={open}
          onOpenChange={setOpen}
          title="Coding Pet · React + TS"
          preview={<PreviewBlock />}
          code={<CodeBlock />}
          onCopy={() => console.log('copy')}
          onRefresh={() => console.log('refresh')}
          onPublish={() => console.log('publish')}
        />
      </StoryFrame>
    );
  },
};

export const StartsOnCode: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <StoryFrame>
        <ArtifactPane
          open={open}
          onOpenChange={setOpen}
          title="Coding Pet · source"
          preview={<PreviewBlock />}
          code={<CodeBlock />}
          defaultTab="code"
          persistKey="oh-storybook-artifact-code-default"
        />
      </StoryFrame>
    );
  },
};

export const NarrowDefaults: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <StoryFrame>
        <ArtifactPane
          open={open}
          onOpenChange={setOpen}
          title="Compact pane"
          preview={<PreviewBlock />}
          code={<CodeBlock />}
          minWidth={360}
          maxWidth={640}
          initialWidth={420}
          persistKey={null}
        />
      </StoryFrame>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom min/max constraints with persistence disabled. Useful as a side-panel inside split layouts where the host owns sizing.',
      },
    },
  },
};

export const Closed: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <StoryFrame>
        <main className="absolute inset-0 grid place-items-center pointer-events-none">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="pointer-events-auto px-3 py-1.5 rounded-[8px] bg-[var(--color-accent)] text-white text-[13px] shadow-[var(--shadow-card)]"
          >
            Open artifact pane
          </button>
        </main>
        <ArtifactPane
          open={open}
          onOpenChange={setOpen}
          title="Coding Pet"
          preview={<PreviewBlock />}
          code={<CodeBlock />}
          persistKey="oh-storybook-artifact-closed"
        />
      </StoryFrame>
    );
  },
};
