# Work Log

Persistent, append-only progress log for `oh-my-open-ui`. Use this as the
"resume next time" cheat sheet — last entry on top.

---

## Round 11 — 2026-05-17 (Sun) — Electron 42 + motion 12 + UI/UX audit

**commit:** pending
**branch:** `chore/electron-42-and-ui-audit`
**baseline tag:** `pre-electron-42-upgrade` (rollback point)
**task dir:** `.trellis/tasks/05-17-upgrade-electron-ui-review/`

### Phase 1 — Runtime upgrade (DONE)

#### Electron 33 → 42 (`apps/desktop`)
- `electron`: `33.2.1` → `42.1.0` (Chromium 136 / Node 22.x)
- `electron-builder`: `25.1.8` → `26.8.1`
- `electron-updater`: `6.3.9` → `6.8.3`
- No code changes required in `main.ts` / `preload.ts` / `splash.ts` / `updater.ts` — all APIs we touch (BrowserWindow + titleBarOverlay, ipcMain, nativeTheme, autoUpdater) are still supported in 42.
- macOS 11 support dropped (now requires 12+). Documented in `docs/electron.md`.

#### framer-motion 11 → motion 12 (renderer)
- `framer-motion@^11.15.0` → `motion@^12.38.0` in `packages/motion`, `packages/ui`, `apps/playground`.
- Migrated every `from 'framer-motion'` import → `from 'motion/react'` across `packages/motion/src/{PageTransition,springs,variants}.tsx`, `packages/ui/src/{composer,modals,primitives,shell,thread,welcome}/**`, `apps/playground/src/routes/motion.tsx`, `stories/src/Patterns/ArtifactPane.stories.tsx`.
- Updated Vite manualChunks: `vendor-motion` now matches `motion` (was `framer-motion`).

#### Verification

| Gate | Result |
|---|---|
| `pnpm -r typecheck` | Pass |
| `pnpm exec biome check .` | 159 pre-existing CRLF errors (zero new from upgrade — Windows `core.autocrlf=true` vs LF index; logged as P2 chore) |
| `pnpm --filter @oh/desktop build` | Pass (main TS + Vite renderer) |
| `pnpm -r build` (packages + stories) | Pass — `vendor-motion-*.js` ≈ 126 kB / 41 kB gzip (chunk works) |
| `pnpm --filter @oh/desktop run package` | `release/win-unpacked/oh-my-open-ui.exe` produced — `VersionInfo.FileVersion = 42.1.0`, 216 MB. NSIS installer (`.Setup.exe`) blocked by winCodeSign symlink permission (pre-existing Windows non-admin limit — see `docs/electron.md`). |
| Smoke launch | `oh-my-open-ui.exe` boots, 100 MB main RSS, 3 child processes (GPU/Renderer/Utility). |

#### Pre-existing follow-ups surfaced

- **P2** — Repo CRLF/LF normalization (`core.autocrlf=true` vs biome `lineEnding: lf`).
- **P3** — Document Developer Mode requirement for NSIS install build (already added to `docs/electron.md`).

### Phase 2 — Comprehensive UI/UX audit (DONE)

See `docs/audits/2026-05-17-comprehensive-review.md` (4 lenses: Claude parity, Nielsen + WCAG 2.2 AA + HIG + Fluent 2, competitor scan, scaffolding/library DX) and `.trellis/tasks/05-17-upgrade-electron-ui-review/research/*`.

### Phase 3 — Targeted fixes (DONE)

#### P0 — Blocking accessibility regressions
- **P0-A1** New `--color-border-interactive` token (light `#A6A399` / dark `#7A7770`, 3:1) applied to `Input`, `IconButton.outline`, `Button.outline`, `Composer` container, `ModelPicker` hover. `--color-border` retained for decorative separators.
- **P0-A2** Light `--color-text-subtle` darkened from `#918C83` (3.4:1) to `#7A7568` (5.0:1) → WCAG 1.4.3 AA.
- **P0-A3** `Composer` textarea exposes the rotating placeholder via both native `placeholder` and `aria-label`, with i18n keys `composer.label` / `composer.attach` (EN + ZH).
- **P0-A4** `--color-ring` alpha 0.42 → 0.85 (light), 0.58 → 0.85 (dark) → focus ring clears 1.4.11 with margin.

#### P1 — High value
- **P1-A1** `ArtifactPane` resize handle: `role="separator"`, `aria-orientation="vertical"`, `aria-valuemin/max/now`, `aria-label` mentions arrow keys.
- **P1-A2** Global `*:focus-visible { scroll-margin-bottom: 96px; scroll-margin-top: 64px }` for 2.4.11 (focus not obscured).
- **P1-A3** `ToastRoot` maps `tone="destructive"` → Radix `type="foreground"` (assertive aria-live); others stay polite.
- **P1-B1** Responsive shell: new `useViewport()` (xs <600 / sm 600-959 / md ≥960) + `AppShell.sidebarMode='auto'`. At xs the sidebar pops out of layout as an animated drawer; `<SidebarDrawerTrigger>` renders only at xs by default.
- **P1-B2** Dark `--color-surface-raised` lifted `#30302E` → `#36352F` for visible card / composer lift.
- **P1-C1** New `useListKeyboardNav()` hook + Linear-style `j / k / ArrowUp / ArrowDown / Home / End / Enter / x` cycling. Wired into `ListPageLayout` with an inline `<Kbd>` hint.
- **P1-C2** New `<ToolCallBlock>` thread primitive (running / done / error states, collapsible body). Storybook + chat-demo route render the new component.
- **P1-D1** Vitest 4 baseline in `@oh/ui` (happy-dom + Testing Library + user-event). 33 cases across 7 files.
- **P1-D2** `jest-axe` smoke tests with 0 violations after P0 — confirms a11y baseline is preserved as code evolves.
- **P1-D3** `<BrandMark>` from `@oh/ui` consumes the active brand glyph automatically (via `window.__ohBrand` mirror set by `BrandProvider`); no import cycle between `@oh/ui` and `@oh/brand`.
- **P1-D4** `apps/desktop/brand.config.json` repaints the Electron splash window and Win11 titlebar overlay from a JSON file at app start; schema lives in `BrandTheme.desktop` (`@oh/brand`).
- **P1-D5** New `docs/accessibility.md` (token strategy, axe baseline, keyboard map, manual smoke checklist).
- **P1-D6** `docs/brand.md` extended with automatic-glyph + desktop chrome sections + 4-step fork checklist.
- **P1-D7** GitHub Actions CI (`.github/workflows/ci.yml`): typecheck + biome check + vitest + `pnpm -r build` on push/PR; Electron packaging deliberately excluded.

#### P2 — Polish
- **P2-A1** Light surface ladder tightened: `surface-sunken` `#F5F4ED` → `#F2F1E9`, `surface-muted` `#EFEEE6` → `#EAE9E0`.
- **P2-A2** Composer quick-action chips: `role="toolbar"` with Arrow-Left / Right cycling.
- **P2-B1** Composer toolbar shows muted `⌘↵ Send · ⇧↵ Newline` keyboard hint at ≥480px.
- **P2-B4** Tooltipped default `delayDuration` 200 → 250 ms (Claude-feel). Toast shadow `popover` → `modal` for visible lift on light bg.
- **P2-B5** New `<Skeleton>`, `<ListSkeleton>`, `<ComposerSkeleton>`, `<ChatSkeleton>` primitives. `chats` route shows ListSkeleton for 280ms on cold load.
- **P2-C3** Win11 `backgroundMaterial: 'acrylic'` on Electron 42, opt-out via `OH_BG_MATERIAL=none`.
- **P2-C4** 4 Storybook stories under `Patterns/Skeleton`.
- **P2-D3** `SidebarAccount` shortcuts render as `<Kbd>` for consistency.
- **P2-D4** Quick-action chip 1px hover lift (`whileHover={y: -1}`).
- **P2-D6** New `CHANGELOG.md` (Keep-a-Changelog format) — round 11 entry mirrors this section.
- **P2-D8** `.gitattributes` normalises to `eol=lf`; `git rm --cached -r .` + `reset --hard` re-extracted the tree with LF; `biome check --write` cleaned 12 long-standing format / import-organize issues; CI biome step flipped from `|| true` to fail-fast.

#### Deferred to round 12 (tracked in audit §5.4)
P2-C1 inline citations · P2-C2 greeting per-locale · P2-D1 system accent opt-in · P2-D2 SearchPalette context-aware sort · P2-D5 `<StatusBand>` · P2-D7 Playwright e2e.

### Phase 4 — Final regression (DONE)

| Gate                              | Result |
|---|---|
| `pnpm -r typecheck`               | Pass |
| `pnpm exec biome check .`         | **0 errors** (was 159 at the start of the round) |
| `pnpm --filter @oh/ui test`       | **33/33 pass**, 7 test files, 4 axe scans, 0 violations |
| `pnpm -r build`                   | Pass — `vendor-motion-*.js` 126 kB / 41 kB gzip; renderer + main + Storybook all green |
| Smoke (Electron 42 packaged)      | `oh-my-open-ui.exe` boots ✓, splash paints from `brand.config.json` ✓, Win11 titlebar overlay matches brand ✓, acrylic backdrop active ✓ |
| `pnpm --filter @oh/desktop run package` | Re-validated against `ELECTRON_MIRROR=npmmirror.com` (China network); winCodeSign NSIS step still requires Windows Developer Mode (pre-existing, documented) |

### Commits on `chore/electron-42-and-ui-audit`

1. Phase 1 Electron upgrade + motion migration (3 commits as per user request)
2. `feat(audit): docs/audits/2026-05-17-comprehensive-review.md` (P2 in plan)
3. `a11y(p0): WCAG 1.4.11 / 2.4.7 token bumps + composer placeholder accessible name`
4. `a11y+visual(p1): ArtifactPane separator values, focus-not-obscured, toast aria-live, dark surface lift`
5. `chore(tests+ci): vitest baseline, jest-axe smoke, github actions CI (P1-D1/D2/D7)`
6. `feat(brand): brand-aware BrandMark + desktop brand.config.json (P1-D3/D4)`
7. `feat(p1): tool-call block, list j/k nav, responsive shell, docs (P1-C1/C2/B1/D5/D6)`
8. `feat(p2): polish wave -- skeletons, composer hints, acrylic, kbd, ladders`
9. `chore(ci): biome auto-fixes after gitattributes renormalize + flip CI fail-fast (P2-D8)`

---

## Polish round 10 — 2026-05-05 (Tue)

**commit:** pending

### Theme: Claude Web Oct 2025 color parity pass

Reference screenshots live in:

```
Reference/Screenshot_Claude web Oct 2025/
```

#### Visual changes
- Re-aligned light tokens to the reference palette:
  `#FBF9F5` canvas, `#F5F4ED` sidebar layer, `#EFEEE6` muted fill,
  `#EFEEE5` user bubble, `#C96442` terracotta accent, and `#E4B0A0`
  peach send control.
- Re-aligned dark tokens to the warm neutral reference ramp:
  `#252623` canvas and `#30302E` raised surfaces.
- Added `--color-accent-send`, `--color-accent-send-hover`, and
  `--color-accent-send-text` so the composer send affordance can stay softer
  than the primary brand accent.
- Updated `auroraBrand` and `claudeTributeBrand` to the same terracotta ramp.
- Changed collapsed shell rail width from 48px to 60px and made the collapsed
  rail share the main canvas color.
- Tuned Composer: white raised surface, 18px radius, taller text area, peach
  send button, quieter toolbar divider.
- Tuned Thread: no-border warm user bubble, black initials avatar, serif
  assistant body copy.
- Tuned WelcomeStage vertical offset so the empty state sits closer to the
  Claude reference rhythm.
- Increased chat/artifact bottom padding to keep the sticky composer from
  covering code blocks and long assistant content.
- Synchronized Electron startup chrome: BrowserWindow background, Win11
  titlebar overlay, splash panel, and pre-React document paint now use the same
  `#FBF9F5` / `#252623` Claude reference anchors.

#### Documentation
- Updated `docs/foundation.md`, `docs/brand.md`, `docs/patterns.md`, and
  `docs/testing.md` to match the current implementation.
- Added `docs/audits/claude-web-oct-2025-parity-2026-05-05.md` with extracted
  color anchors, verification artifacts, and remaining gaps.

#### Verification
```bash
pnpm --filter @oh/ui typecheck
pnpm --filter @oh/playground typecheck
pnpm --filter @oh/desktop typecheck
```

Final visual review screenshots:

```
.codex-review/final-welcome-light.png
.codex-review/final-chat-light.png
.codex-review/final-artifact-light.png
.codex-review/final-settings-light.png
.codex-review/final-welcome-dark.png
.codex-review/final-chat-dark.png
.codex-review/final-artifact-dark.png
.codex-review/final-settings-dark.png
```

#### Open follow-up options
- Add a first-class screenshot capture script instead of ad hoc Edge/CDP
  snippets.
- Expand demo fixtures so chats, projects, billing, connectors, and modal
  states carry the same density as the reference app.
- Run a mobile/narrow responsive pass after the desktop parity pass.

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
