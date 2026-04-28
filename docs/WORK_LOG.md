# Work Log

Persistent, append-only progress log for `oh-my-open-ui`. Use this as the
"resume next time" cheat sheet — last entry on top.

---

## Polish round 9 — 2026-04-28 (Tue)

**commit:** `7ce70fb`

### Theme: dark-mode walkthrough + AssistantMessage citations / attachments

#### Critical bugs fixed
1. **Tailwind v4 `dark:` variant was bound to `prefers-color-scheme` only**
   so explicit `data-theme="dark"` never activated `dark:` utility classes.
   Fixed in `packages/ui/src/styles.css` with:
   ```css
   @custom-variant dark {
     &:where([data-theme="dark"] *), &:where([data-theme="dark"]) { @slot; }
     @media (prefers-color-scheme: dark) {
       &:where([data-theme="system"] *), &:where([data-theme="system"]) { @slot; }
     }
   }
   ```
   Without this, primary `Button`, `Tooltip`, `SelectionToolbar`, and
   `Avatar(dark)` all collapsed against the dark page surface in dark mode.

2. **`AppFrame` was passing `defaultMode="light"` to `<ThemeProvider>`**,
   which clobbered the user's persisted choice on every route mount. Removed
   the prop so `ThemeProvider` falls through to `readStoredTheme()` and the
   theme stays sticky across navigation + HMR. See `apps/playground/src/components/AppFrame.tsx`.

#### Visual refinements (dark)
- `Tooltip`, `SelectionToolbar`, `Avatar(dark tone)` now invert in dark mode
  (`#1B1A18` ↔ `#F1ECE2` ink/cream pair) so floating chrome stays legible.
- `Citations` chip number bumped from `bg-accent-soft` to `bg-accent` with
  `text-accent-text` for >4.5:1 contrast in both themes.
- Added `--shadow-xs` dark override (`rgba(0,0,0,0.45)`) so light umber
  shadows don't bleed onto the dark surface.

#### New components
- `packages/ui/src/thread/Citations.tsx` — footnote-style "Sources" strip
  with numbered accent chips and a `Popover` revealing source / title /
  snippet / external link.
- `packages/ui/src/thread/Attachments.tsx` — inline file cards with
  `cards` and `compact` variants. Auto-picks an icon based on `kind` (image
  / text / file) and supports `onOpen`.

#### Type / API extension
- `AssistantMessageData` gained `citations: MessageCitation[]` and
  `attachments: MessageAttachment[]`.
- `AssistantMessage` render order is now: thinking → body → artifact →
  attachments → citations → actions.
- `apps/playground/src/mocks/data.ts` ships 3 sample citations + 2
  attachments on the digital-pet thread for demoing.

#### Verified routes (dark)
welcome / chat-demo / modals / projects / chats / settings / tokens — all
render correctly. Screenshots stored under
`c:\Users\WangTx\AppData\Local\Temp\cursor\screenshots\p9-*.png`.

#### Open follow-up options (next round menu)
- **A. CI** — GitHub Actions: typecheck + lint + build + storybook build + electron pack
- **B. BrandTheme `logoSlot`** — make brand logo pluggable as ReactNode | string, avoid hand-coding SVG in React
- **C. `pnpm fork-template`** — one-shot script that copies the repo into a new directory and rewrites README / `package.json` name / brand
- **D. AssistantMessage tool-call UI** — collapsible "Used 3 tools" inside streaming
- **E. Performance** — renderer worker preload + Electron `app.commandLine` tuning
- **F. Accessibility audit** — focus order, aria-live for streaming, reduced-motion across all routes

---

## Polish round 8 — 2026-04-27

**commit:** `2baecf5`

- Visual layering: scrollbar 3-stage hover, layered focus ring, composer dropshadow palette.
- `ArtifactCard` click → opens right `ArtifactPane` on `/chat-demo`.
- `ThinkingTrace` collapsible "Thought for Ns" with streaming reveal.
- Electron splash screen + main-window deferred show (`ready-to-show` + `did-finish-load`).
- Renderer prefetch script in `index.html` to avoid white-flash boot.
- Documentation: full `docs/` directory (architecture / foundation / patterns / brand / electron / storybook / testing).

---

## Polish round 7 — 2026-04-26

**commit:** `fe8ab0f`

- Vite `manualChunks` splitting framer-motion / radix / lucide / tanstack / react-markdown into vendor chunks (main 857KB → 342KB / gzip 103KB).
- Electron `electron-builder` produced 84MB NSIS installer + `win-unpacked/oh-my-open-ui.exe`, smoke-launched (4-process model, ~90MB RAM).
- Streaming wiring: `StreamingShimmer` skeleton when no token yet; `/chat-demo` Replay button typewriter-replays the last assistant message.
- Storybook 8.6.x → 9.1.20 (removed `addon-essentials` + `@storybook/blocks`, added `@storybook/addon-docs`).

---

## Polish round 6 and earlier

See `git log --oneline` — `c444564 polish-6` → `fe8ab0f polish-7` →
`2baecf5 polish-8` → `7ce70fb polish-9`. The plan file at
`C:/Users/WangTx/.cursor/plans/claude_desktop_ui_scaffolding_2004b5de.plan.md`
documents phases 0–13 of the original implementation.

---

## Quick resume cheatsheet

```bash
# Dev playground (Vite, http://localhost:5173)
pnpm playground

# Full check
pnpm -r typecheck
pnpm biome check .
pnpm -r build

# Electron desktop build (Windows installer + win-unpacked)
pnpm --filter @oh/desktop build
cd apps/desktop && pnpm dlx electron-builder
```

**Known watchouts**
- Each playground route mounts its own `<AppFrame>`, so any provider added
  to `AppFrame` should be safe to remount and read its own persistence.
- Tailwind v4 `dark:` is now wired to `data-theme="dark"` — keep using it.
- `defaultMode` on `<ThemeProvider>` is intentionally absent in
  `AppFrame.tsx`. Don't add it back.
