# Architecture

## Monorepo layout

```
oh-my-open-ui/
├── apps/
│   ├── desktop/       Electron 33 main + preload + electron-builder config
│   └── playground/    Vite 6 + React 19 renderer with all demo routes
├── packages/
│   ├── tokens/        Design tokens — CSS Variables + TS exports + Tailwind preset
│   ├── icons/         Hand-drawn brand asterisk + curated Lucide subset
│   ├── motion/        Framer Motion springs, variants, page transitions, shimmer
│   ├── brand/         BrandProvider + aurora / claude-tribute / sage / indigo
│   └── ui/            Component library (primitives, shell, composer, thread, layouts, modals, welcome)
├── stories/           Storybook 9 design delivery (Foundation + Patterns + Primitives)
└── docs/              You are here
```

The dependency graph fans in: every other package may depend on `@oh/tokens` and
`@oh/icons`, only `@oh/ui` depends on `@oh/motion` and `@oh/brand`, only
`apps/playground` and `stories/` depend on `@oh/ui`. `apps/desktop` does not
depend on any UI package — it just hosts the renderer.

## Package boundaries

| Package | Responsibility | Allowed dependencies |
| --- | --- | --- |
| `@oh/tokens` | CSS variables, Tailwind preset, raw color/scale values. **Zero React.** | none |
| `@oh/icons` | Re-exports curated Lucide icons + custom `Asterisk`. | `lucide-react` |
| `@oh/motion` | Spring presets, variants, page transitions, `StreamingShimmer`. | `framer-motion`, `react` |
| `@oh/brand` | `BrandProvider` + built-in brand definitions. **No `@oh/ui` import.** | `@oh/tokens`, `@oh/icons`, `react` |
| `@oh/ui` | Component library — everything visual. | all of the above + `radix-ui`, `react-markdown`, `shiki` |

The strict order keeps `@oh/brand` swappable (you can author a fork that uses
nothing from this repo's `@oh/ui` and still consume tokens) and keeps
`@oh/tokens` cheap to import in any context, including SSR.

## Path aliases

Every `tsconfig.json` extends `tsconfig.base.json` which sets:

```jsonc
"paths": {
  "@oh/tokens": ["packages/tokens/src"],
  "@oh/icons":  ["packages/icons/src"],
  "@oh/motion": ["packages/motion/src"],
  "@oh/brand":  ["packages/brand/src"],
  "@oh/ui":     ["packages/ui/src"]
}
```

Vite mirrors these aliases inside `apps/playground/vite.config.ts` and
`stories/.storybook/main.ts`. Tailwind v4 uses `@source` directives in each
consumer's CSS to pick up utility classes from sibling packages.

## Build pipeline

`turbo.json` defines four pipelines:

| Task | What it does |
| --- | --- |
| `typecheck` | `tsc --noEmit` per package, runs in parallel. |
| `build` | `vite build` for renderer + Storybook; `tsc -p tsconfig.main.json` for desktop main process. |
| `package` (desktop only) | Renderer build + main build + `electron-builder --win nsis`. |
| `dev` | Renderer dev server, Storybook dev, or `concurrently` for desktop. |

Top-level scripts that you'll use day-to-day:

```bash
pnpm install
pnpm playground          # http://localhost:5173 (browser only)
pnpm desktop:dev         # full Electron window with hot reload
pnpm storybook           # http://localhost:6006
pnpm -r typecheck        # all packages
pnpm exec biome check .  # lint
pnpm -r build            # build everything
```

## State management

There is no global state library. Each concern has its own narrow provider:

| Provider | Lives in | Owns |
| --- | --- | --- |
| `<ThemeProvider>` | `@oh/ui` | `light` / `dark` / `system`, syncs `<html data-theme>` and `localStorage["oh-ui-theme"]`. |
| `<I18nProvider>` | `@oh/ui` | `en` / `zh` locale, `localStorage["oh-ui-locale"]`, `<html lang>`. |
| `<BrandProvider>` | `@oh/brand` | Active brand object — name, logo, palette, fonts, greeting dictionary. |
| `<BrandSwitcherProvider>` | `@oh/brand` | Demo-only — adds runtime brand switching with smooth CSS transitions. |
| `<TooltipProvider>` | `@oh/ui` (re-exports Radix) | Global tooltip delay. |
| `<ToastProvider>` | `@oh/ui` | `useToast()` imperative API. |
| `<ModalStackProvider>` | `@oh/ui` | Stack of open modals (so e.g. Welcome + Terms can layer). |
| `<SidebarStateProvider>` | `@oh/ui` | Expanded / collapsed state, persisted. |

`apps/playground/src/components/AppFrame.tsx` shows the canonical nesting
order. **Hooks always need their provider above them in the tree** — the
`/settings` and `/chat-demo` routes both use a small `XContent` inner
component pattern to keep `useTheme()` / `useToast()` inside `<AppFrame>`.

## How requests flow (when you wire one up)

There is no chat client built in. The components surface narrow interfaces so
you can wire any data source — or none at all:

```ts
// You bring this:
const send = async (payload: ComposerSubmitPayload) => {
  const stream = await myLlm.send(payload);
  for await (const tok of stream) {
    appendToMessage(activeId, tok);
  }
};

// You hand it to the Composer:
<Composer onSubmit={send} status={isSending ? 'sending' : 'idle'} />
```

The `streaming: true` flag on an `AssistantMessageData` is what triggers:
- `<StreamingShimmer />` if the body is empty
- An animated caret if it has content
- `<ThinkingTrace>` if `thinking.active === true`
