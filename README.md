# oh-my-open-ui

A reusable Electron + React UI scaffolding that 1:1 replicates the visual,
interaction, and motion design language of Claude Desktop on Windows — without
any LLM business logic. Drop the components into any app and ship a warm,
restrained, knowledge-tool aesthetic in minutes.

## Documentation

Every concept has its own doc — start with [`docs/README.md`](./docs/README.md).

| | |
| --- | --- |
| [Architecture](./docs/architecture.md) | Monorepo layout, package boundaries, providers, build pipeline. |
| [Foundation](./docs/foundation.md) | Color, typography, radius, shadow, motion tokens. |
| [Patterns](./docs/patterns.md) | Composer, MessageList, ArtifactPane, Sidebar, Modal stack, page templates. |
| [Brand](./docs/brand.md) | Author your own brand; swap accent / fonts / greetings. |
| [Electron](./docs/electron.md) | Win11 titlebar, splash screen, IPC bridge, packaging. |
| [Storybook](./docs/storybook.md) | Storybook 9 conventions, theme decorator, upgrade path. |
| [Testing](./docs/testing.md) | Smoke checklist for every playground route + Electron build. |

## What's inside

```
oh-my-open-ui/
├── apps/
│   ├── desktop/         # Electron 33 main + splash + preload + NSIS packaging
│   └── playground/      # Vite + React 19 renderer with all demo routes
├── packages/
│   ├── ui/              # Component library — primitives, shell, composer, thread, layouts, modals, welcome
│   ├── tokens/          # Design tokens (CSS Vars + TS exports + Tailwind v4 wiring)
│   ├── motion/          # Framer Motion springs, variants, page transitions, streaming shimmer
│   ├── icons/           # Hand-drawn Asterisk + curated Lucide subset
│   └── brand/           # BrandProvider + aurora / claude-tribute / sage / indigo
├── stories/             # Storybook 9 design delivery (Foundation + Patterns + Primitives)
├── docs/                # Architecture / foundation / patterns / brand / electron / storybook / testing
└── pnpm-workspace.yaml
```

## Highlights

- **Win11-native titlebar** — custom drag region + Electron `titleBarOverlay`,
  with hover-red close and grouped taskbar identity.
- **Dual themes** — light & dark shipped, switch with one CSS variable swap.
  No FOUC, system theme aware.
- **Composer-as-the-product** — full multi-state textarea, model picker, plus
  menu, toggle chips, drag-to-attach, paste-image-to-attach, send/stop button,
  quick action chips below.
- **Sidebar with two states** — 48px icon rail ↔ 240px expanded with Recents
  / Starred groups, animated via Framer Motion `layout`.
- **Right Artifact pane** — slides in with a spring, drag-to-resize handle,
  preview/code tabs, publish/copy/refresh/close toolbar.
- **5 modal templates** — Alert, Form, Info, Picker (with tabs + search),
  Celebration overlay, plus a stack manager (`<ModalStackProvider />`).
- **Page templates** — TwoPaneSettings, ProjectDetail (with right rail),
  ListPage (with multi-select + bulk actions).
- **Time-aware greetings** — deterministic per (day, time bucket), supports
  `recency: 'new' | 'returning' | 'longabsent'` overrides.
- **Brand replacement layer** — `<BrandProvider brand={yourBrand} />` instantly
  swaps name, logo, accent, fonts, greetings — UI carries no Claude residue.
- **Streaming-aware messages** — `streaming: true` flips on
  `<StreamingShimmer />` + spinning brand-mark, then a typewriter caret;
  optional `<ThinkingTrace />` mirrors Claude's "Thought for Ns" disclosure.
- **Bundle-conscious build** — Vite splits `framer-motion`, `@radix-ui`,
  `lucide-react`, `@tanstack`, `react-markdown`'s ecosystem and Shiki
  grammars into separate chunks (main bundle 342 KB / 103 KB gzip).
- **Storybook 9.1** — Foundation, Patterns, Primitives chapters with
  per-component controls + theme picker.
- **Win11 splash + NSIS installer** — `pnpm --filter @oh/desktop run package`
  produces `apps/desktop/release/oh-my-open-ui-Setup-*.exe` (~84 MB) plus
  an unpacked binary that boots through a brand-tinted splash window.

## Quick start

```bash
pnpm install

# Renderer-only (browser preview at http://localhost:5173)
pnpm playground

# Full Electron app (renderer + main + Electron window)
pnpm desktop:dev

# Storybook
pnpm storybook

# Package Windows installer (.exe NSIS)
pnpm --filter @oh/desktop run package
```

## Reusing in another project

```ts
// In your app
import { BrandProvider } from '@oh/brand';
import {
  AppShell,
  Composer,
  ThemeProvider,
  ToastProvider,
  TooltipProvider,
  ModalStackProvider,
} from '@oh/ui';
import '@oh/ui/styles.css';

function App() {
  return (
    <ThemeProvider>
      <BrandProvider brand={myBrand /* { name, logo, palette, fonts } */}>
        <TooltipProvider>
          <ToastProvider>
            <ModalStackProvider>
              <AppShell sidebar={<MySidebar />}>{/* main */}</AppShell>
            </ModalStackProvider>
          </ToastProvider>
        </TooltipProvider>
      </BrandProvider>
    </ThemeProvider>
  );
}
```

## Pluggable interfaces (no LLM logic shipped)

The components surface narrow interfaces so you can wire any data source —
or none at all and use them purely for layout:

```ts
interface ComposerHostProps {
  onSubmit?: (payload: ComposerSubmitPayload) => void | Promise<void>;
  status?: 'idle' | 'sending' | 'streaming' | 'disabled';
  // ...attachments, models, toggles, quick actions, all prop-driven
}

interface MessageListProps {
  messages: Message[];
  onCopy?: (id: string) => void;
  onRetry?: (id: string) => void;
  onFeedback?: (id: string, kind: 'up' | 'down') => void;
}
```

There is no built-in API client, no streaming protocol, no chat persistence,
no model adapter. Wire your own — Anthropic, OpenAI, local llama.cpp, or
nothing at all.

## Brand notice

The default `aurora` brand is original; the `claude-tribute` brand is provided
**only** for local visual study against reference screenshots. Do not ship the
`claude-tribute` brand in any public product.
