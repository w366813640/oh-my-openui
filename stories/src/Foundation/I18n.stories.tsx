import { Languages } from '@oh/icons';
import {
  Composer,
  Greeting,
  I18nProvider,
  Kbd,
  type Locale,
  SearchPalette,
  type SearchPaletteItem,
  ThreadDisclaimer,
  useI18n,
} from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Foundation/I18n',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Lightweight i18n primitive shipped with `@oh/ui`. `<I18nProvider>` exposes a `locale` + `t()` ' +
          'lookup, a `setLocale()` setter, and ships built-in `en` / `zh` dictionaries. The current locale ' +
          'is persisted to localStorage and mirrored to `<html lang>`. Components like Greeting / Composer ' +
          '/ SearchPalette read the active dictionary automatically.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

function LocalePicker() {
  const { locale, setLocale } = useI18n();
  const options: { id: Locale; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'zh', label: '简体中文' },
  ];
  return (
    <div className="inline-flex rounded-[10px] border border-[var(--color-border)] p-0.5 bg-[var(--color-surface)]">
      {options.map((opt) => {
        const active = locale === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setLocale(opt.id)}
            className={[
              'inline-flex items-center gap-1.5 h-7 px-3 rounded-[8px]',
              'text-[12.5px] transition-colors duration-[140ms]',
              active
                ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-[var(--shadow-card)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
            ].join(' ')}
          >
            <Languages size={13} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StringMatrix() {
  const { t, locale } = useI18n();
  const keys = [
    'newChat',
    'search',
    'chats',
    'projects',
    'artifacts',
    'starred',
    'recents',
    'settings',
    'theme',
    'language',
    'composer.placeholder.default',
    'composer.dropToAttach',
    'search.placeholder',
    'search.help',
    'thread.disclaimer',
    'settings.appearance.brand',
    'settings.appearance.motion',
  ];
  return (
    <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="grid grid-cols-[200px_1fr] text-[12.5px] uppercase tracking-[0.06em] text-[var(--color-text-subtle)] bg-[var(--color-surface-muted)] px-4 py-2.5 border-b border-[var(--color-border)]">
        <div>Key</div>
        <div>{locale === 'zh' ? '当前语言：中文' : 'Current locale: English'}</div>
      </div>
      {keys.map((k) => (
        <div
          key={k}
          className="grid grid-cols-[200px_1fr] items-center text-[13px] px-4 py-2 border-b border-[var(--color-border)] last:border-b-0"
        >
          <code className="font-mono text-[12.5px] text-[var(--color-text-muted)]">{k}</code>
          <div className="text-[var(--color-text)]">{t(k)}</div>
        </div>
      ))}
    </div>
  );
}

function LiveDemo() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const items: SearchPaletteItem[] = [
    { id: '1', label: 'Welcome flow', kind: 'page' },
    { id: '2', label: 'Settings · Appearance', kind: 'page' },
    { id: '3', label: 'New chat', kind: 'command', trailing: <Kbd>⌘N</Kbd> },
  ];
  return (
    <div className="flex flex-col gap-8 max-w-[680px] mx-auto py-12 px-6">
      <header className="flex items-center justify-between">
        <h1 className="font-serif text-[24px] text-[var(--color-text)]">@oh/ui · i18n</h1>
        <LocalePicker />
      </header>

      <section>
        <Greeting name="Sam" size="lg" />
      </section>

      <section className="flex flex-col gap-3">
        <Composer
          quickActions={[
            { id: 'a', label: 'Write' },
            { id: 'b', label: 'Code' },
          ]}
        />
        <ThreadDisclaimer />
      </section>

      <section>
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="px-3 py-1.5 rounded-[8px] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] text-[13px]"
        >
          Open SearchPalette
        </button>
        <SearchPalette open={paletteOpen} onOpenChange={setPaletteOpen} items={items} />
      </section>

      <section>
        <h2 className="text-[14px] font-semibold mb-3 text-[var(--color-text)]">
          Dictionary lookup
        </h2>
        <StringMatrix />
      </section>
    </div>
  );
}

export const LocaleSwitcher: Story = {
  render: () => (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <LiveDemo />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Live demo: switch the locale and watch every string-aware component (Greeting, Composer placeholder, ThreadDisclaimer, SearchPalette) re-render in place.',
      },
    },
  },
};

export const InitialLocaleZh: Story = {
  render: () => (
    <I18nProvider initialLocale="zh" persist={false}>
      <div className="bg-[var(--color-bg)] min-h-screen">
        <LiveDemo />
      </div>
    </I18nProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Override the default `<I18nProvider>` from preview decorators with `initialLocale="zh"` and `persist={false}` to demonstrate boot-time locale selection without polluting localStorage.',
      },
    },
  },
};

export const CustomDictionary: Story = {
  render: () => (
    <I18nProvider
      initialLocale="en"
      persist={false}
      overrides={{
        en: {
          'greeting.afternoon': 'Hey {name} 👋 — back already?',
          'composer.placeholder.default': 'Whisper your idea here…',
          'thread.disclaimer': 'Friendly reminder: re-read anything important.',
        },
      }}
    >
      <div className="bg-[var(--color-bg)] min-h-screen">
        <LiveDemo />
      </div>
    </I18nProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pass an `overrides` map to extend or override the built-in dictionaries — handy for product-specific copy without forking the package.',
      },
    },
  },
};
