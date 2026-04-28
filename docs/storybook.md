# Storybook

Storybook **9.1.20** is the live design reference and the place to author /
maintain components in isolation.

```bash
pnpm storybook        # http://localhost:6006
pnpm --filter @oh/stories build   # static export to stories/storybook-static
```

## Layout

```
stories/
├── .storybook/
│   ├── main.ts        framework + addons + Vite Tailwind plugin
│   └── preview.tsx    global decorators (theme + i18n + brand + tooltip + toast + modal stack)
└── src/
    ├── preview.css    Storybook-only Tailwind entry + `@source` directives
    ├── Foundation/    BrandMark / Color / Radius+Shadow / Typography / I18n
    ├── Patterns/      Composer / MessageList / Sidebar / SidebarAccount / SearchPalette / SelectionToolbar / ArtifactPane / Modals / Welcome
    └── Primitives/    Button / Inputs / DropdownMenu
```

## Story conventions

```ts
import type { Meta, StoryObj } from '@storybook/react';
import { Composer } from '@oh/ui';

const meta = {
  title: 'Patterns/Composer',
  component: Composer,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Composer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'How can I help you today?' },
};
```

- Stories live next to the area they document, not next to the component
  source. This avoids polluting `packages/ui/src/`.
- Use `parameters.layout: 'centered'` for primitives, `'fullscreen'` for
  patterns that need full-bleed (Sidebar, Welcome).
- Controls / Actions / Viewport / Backgrounds / Toolbars / Measure / Outline
  are **built into Storybook 9 core** — no need to list them as addons.
- Two opt-in addons remain in `addons:` —
  - `@storybook/addon-docs` for the doc tab and MDX support.
  - `@storybook/addon-themes` for the global theme picker decorator.

## Theme decorator

```tsx
withThemeByDataAttribute({
  themes: { light: 'light', dark: 'dark' },
  defaultTheme: 'light',
  attributeName: 'data-theme',
})
```

Sets `<html data-theme="…">`, which is exactly what the real app does, so
the same CSS variables resolve and the same component variants render.

## Tailwind in Storybook

`stories/.storybook/main.ts` adds the Tailwind v4 Vite plugin inside
`viteFinal()` and `stories/src/preview.css` declares `@source "../../packages/**/*.{ts,tsx}"`
to scan source files in sibling packages. Without this, Tailwind would only
emit utilities that appear in `stories/`, missing those used inside
`@oh/ui`.

## Upgrading

The repo was upgraded from 8.6 → 9.1.20 by:

1. Bumping `storybook`, `@storybook/react`, `@storybook/react-vite`,
   `@storybook/addon-themes` to `^9.1.20`.
2. Removing `@storybook/addon-essentials` (now built into core) and
   `@storybook/blocks` (moved to `storybook/blocks` subpath).
3. Adding `@storybook/addon-docs` for the doc tab.
4. Verifying `pnpm --filter @oh/stories build` still produces a static
   bundle and `dev` boots in < 2s.

If you upgrade further (10.x), follow `npx storybook@latest upgrade`.
