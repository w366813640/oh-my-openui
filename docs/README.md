# Documentation

This is the design + engineering handbook for **oh-my-open-ui**. Read these in
order to onboard a new contributor or to author a fork that targets a different
brand:

| Doc | Purpose |
| --- | --- |
| [`architecture.md`](./architecture.md) | Monorepo layout, package boundaries, how `@oh/*` workspaces compose. |
| [`foundation.md`](./foundation.md) | Design tokens — color, typography, radius, shadow, motion. |
| [`patterns.md`](./patterns.md) | High-level UI patterns — Composer, MessageList, ArtifactPane, Sidebar, Modal stack, page templates. |
| [`brand.md`](./brand.md) | How to author a new `Brand`, swap the accent palette, and override the greeting dictionary. |
| [`electron.md`](./electron.md) | Desktop runtime — main / preload split, custom Win11 titlebar, splash screen, IPC bridge, packaging. |
| [`storybook.md`](./storybook.md) | Storybook 9 conventions, story locations, viewing, building. |
| [`testing.md`](./testing.md) | Manual test plan and the playground smoke routes. |

If you only want to ship — read [`architecture.md`](./architecture.md) and
[`brand.md`](./brand.md), then jump into Storybook for live component reference.
