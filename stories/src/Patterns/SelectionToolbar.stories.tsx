import { Copy, MessageSquare, Pin, Sparkles, Wrench } from '@oh/icons';
import { type SelectionAction, SelectionToolbar, useToast } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';

const meta: Meta<typeof SelectionToolbar> = {
  title: 'Patterns/SelectionToolbar',
  component: SelectionToolbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Floating mini-toolbar that appears centered above any text selection inside `scopeRef`. ' +
          'Mirrors Claude Desktop’s assistant-message selection actions — Copy / Explain / Improve / Translate — ' +
          'and stays out of the way otherwise. Pure DOM Selection API + Framer Motion spring entry.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof SelectionToolbar>;

function PlaygroundFrame({
  children,
  hint = 'Highlight any portion of the text to summon the toolbar.',
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="min-h-[640px] w-full bg-[var(--color-bg)] py-12 px-6">
      <div className="mx-auto max-w-[680px] space-y-6">
        <p className="text-[12px] uppercase tracking-[0.08em] text-[var(--color-text-subtle)]">
          {hint}
        </p>
        {children}
      </div>
    </div>
  );
}

const sampleProse =
  "Anthropic's design language leans on warmth instead of clinical neutrality: cream surfaces, sun-baked accents, and a serif headline that reads more like a bound notebook than a SaaS dashboard. Try selecting a phrase, a sentence, or even just a stray word — the toolbar should glide in above the highlight and let you copy, explain, improve, or translate the slice without breaking your reading rhythm.";

export const Default: Story = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    return (
      <PlaygroundFrame>
        <div ref={ref} className="prose-style text-[15px] leading-[1.65] text-[var(--color-text)]">
          <p>{sampleProse}</p>
          <p className="mt-4">
            The whole component runs without any JS framework lock-in. It listens to{' '}
            <code className="font-mono text-[13px]">selectionchange</code> +{' '}
            <code className="font-mono text-[13px]">mouseup</code>, computes the bounding rect of
            the selection, and renders a single absolutely-positioned chip with{' '}
            <code className="font-mono text-[13px]">AnimatePresence</code>.
          </p>
        </div>
        <SelectionToolbar scopeRef={ref} />
      </PlaygroundFrame>
    );
  },
};

export const CustomActions: Story = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    const { show } = useToast();
    const actions: SelectionAction[] = [
      {
        id: 'copy',
        label: 'Copy',
        icon: <Copy size={13} />,
        onSelect: (text) =>
          show({ title: 'Copied to clipboard', description: `${text.slice(0, 60)}…` }),
      },
      {
        id: 'explain',
        label: 'Ask follow-up',
        icon: <MessageSquare size={13} />,
        onSelect: (text) => show({ title: 'Asked follow-up about', description: text }),
      },
      {
        id: 'improve',
        label: 'Rewrite',
        icon: <Sparkles size={13} />,
        onSelect: (text) => show({ title: 'Rewriting…', description: text }),
      },
      {
        id: 'tools',
        label: 'Send to canvas',
        icon: <Wrench size={13} />,
        onSelect: (text) => show({ title: 'Sent to canvas', description: text }),
      },
      {
        id: 'save',
        label: 'Pin snippet',
        icon: <Pin size={13} />,
        onSelect: (text) => show({ title: 'Saved snippet', description: text, tone: 'success' }),
      },
    ];
    return (
      <PlaygroundFrame hint="Five-action variant — wires `onSelect` to a toast for each action.">
        <div ref={ref} className="text-[15px] leading-[1.65] text-[var(--color-text)] space-y-4">
          <p>{sampleProse}</p>
          <p>
            Each action receives the raw selected string. The default <em>copy</em> action
            additionally writes to{' '}
            <code className="font-mono text-[13px]">navigator.clipboard</code> before invoking{' '}
            <code className="font-mono text-[13px]">onSelect</code>.
          </p>
        </div>
        <SelectionToolbar scopeRef={ref} actions={actions} />
      </PlaygroundFrame>
    );
  },
};

export const ScopedToOneBlock: Story = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    return (
      <PlaygroundFrame hint="Toolbar only fires inside the highlighted card. Selecting outside is ignored.">
        <div
          ref={ref}
          className="rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5 text-[14.5px] leading-[1.6] text-[var(--color-text)]"
        >
          <p>
            This card is the only scoped region. Try selecting text here vs. selecting the paragraph
            below — the toolbar should only appear for selections that are descendants of this
            element.
          </p>
        </div>
        <p className="text-[14px] leading-[1.6] text-[var(--color-text-muted)]">
          You can highlight this paragraph all you want — nothing happens, because it lives outside
          the <code className="font-mono text-[12.5px]">scopeRef</code> element above.
        </p>
        <SelectionToolbar scopeRef={ref} />
      </PlaygroundFrame>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const ref = useRef<HTMLDivElement>(null);
    return (
      <PlaygroundFrame hint="`disabled` short-circuits the listeners — useful when a modal or context-menu owns the selection.">
        <div ref={ref} className="text-[15px] leading-[1.65] text-[var(--color-text)]">
          <p>{sampleProse}</p>
        </div>
        <SelectionToolbar scopeRef={ref} disabled />
      </PlaygroundFrame>
    );
  },
};
