# Round 12 — Deferred P2 items from the 2026-05-17 audit

## Goal

Close the 6 P2 items deferred at the end of round 11 so the
`2026-05-17-comprehensive-review.md` audit reaches 100% landed
coverage. Each item is scoped, has acceptance criteria already
written, and was deferred only because its value/risk ratio fit
better in a separate round.

## What I already know

* Round 11 commits live on `main` from `6374773` through `09343c9` (12 commits).
* Audit file: `docs/audits/2026-05-17-comprehensive-review.md`.
* Round 11 work log: `docs/WORK_LOG.md` "Round 11" section.
* Vitest baseline (33 cases / 7 files / 0 axe violations) is live.
* CI runs typecheck + biome (fail-fast) + vitest + `pnpm -r build` on every push.
* `useViewport()`, `useListKeyboardNav()`, `<ToolCallBlock>`,
  `<Skeleton>` family, brand JSON pipeline, `<BrandMark>` auto-glyph
  are all available as foundations.

## Scope (the 6 deferred items)

### P2-C1 — Inline citation variant

* **Location:** `packages/ui/src/thread/Citations.tsx` + new `InlineCitation`.
* **What:** Add `variant="inline" | "strip"` (default `"strip"`).
  Inline mode injects `<sup>1</sup>` markers in the markdown via the
  `react-markdown` components map; clicking a marker scrolls to the
  citation chip in the strip (when both are rendered) or opens the
  source URL.
* **Acceptance:** Both variants render; toggle in `chat-demo` route.

### P2-C2 — Greeting per-locale

* **Location:** `packages/brand/src/profiles/*.ts` + `packages/ui/src/i18n/dictionaries.ts`.
* **What:** Move greeting strings out of brand profiles (where they
  default to English) into the i18n dictionary; brand profile only
  declares a *set name* (e.g. `greetings: 'aurora'`), and the dict
  carries `aurora.morning`, `aurora.evening`, etc. for each locale.
* **Acceptance:** Switching `I18nProvider` locale changes greeting
  without remounting `BrandProvider`.

### P2-D1 — System accent opt-in

* **Location:** new `useSystemAccent()` hook in `@oh/ui` + new
  IPC `theme:get-system-accent` in `apps/desktop`.
* **What:** Renderer hook reads the OS accent via IPC (Win11 DWM /
  macOS `NSColor.controlAccentColor`). Returns `{accent, supported}`.
  Consumer can pass `<BrandProvider accent={systemAccent}>`.
* **Acceptance:** Playground Settings toggle "Use system accent"
  swaps the accent to the OS color and back without reload.

### P2-D2 — SearchPalette context-aware sort

* **Location:** `packages/ui/src/modals/SearchPalette.tsx`.
* **What:** Add `sortBy?: (a, b, ctx) => number` prop with
  `ctx.recentIds: string[]` and `ctx.currentProjectId?: string`.
  Default behavior preserves alphabetical; consumers wire their own
  rank function. Linear-style "recent first" can be expressed in 6
  lines.
* **Acceptance:** Storybook story "Recent first" demonstrates the
  new ordering with a fixture.

### P2-D5 — Long-task persistent status band

* **Location:** new `packages/ui/src/shell/StatusBand.tsx` +
  hook into `MainArea` slot.
* **What:** `<StatusBand status icon onCancel>` rendered above the
  composer when an `onLongTask` callback is registered. Persists
  until the task completes or the user cancels (unlike Toast which
  auto-dismisses).
* **Acceptance:** Demo route triggers a 6s fake tool; band appears
  with progress text and a Cancel button; auto-removes on completion.

### P2-D7 — Playwright e2e route smoke

* **Location:** new `e2e/` workspace using `@playwright/test`.
* **What:** Headless Playwright against the playground renderer
  (`pnpm dev` or built `apps/playground/dist` via `vite preview`).
  Navigates `/`, `/chat-demo`, `/artifact-demo`, `/chats`,
  `/projects`, `/settings`; captures one screenshot per route into
  `e2e/screenshots/`. Compares against committed baselines (allow
  small diff threshold).
* **Acceptance:** `pnpm e2e` produces 6 screenshots and exits 0.
  CI runs the suite on every push (headless Linux runner is fine
  since renderer has no Electron dependency at this layer).

## Out of scope

* Anything in audit §5.4 "Documented but deliberately deferred"
  (macOS / Linux smoke, vibrancy, fork CLI, voice / canvas /
  collaboration, Tailwind / Radix replacement).
* Round 13+ items that emerge during this round (capture in a new
  task instead).

## Decision (ADR-lite)

**Context:** 6 P2 items survived round 11 because their value/risk
ratio better fit a dedicated PR per item rather than another batch.
**Decision:** Treat round 12 as 6 small PRs, one per item, all
landing onto `main`. Order: D8 has already shipped, so start with
P2-D7 (playwright e2e) since it provides regression coverage for
every following item.
**Consequences:** Round 12 is a more conservative round with
visible incremental wins; CI catches any visual or interaction
regression from D7 onward.

## Acceptance Criteria (round-level)

* [ ] All 6 P2 items above land on `main` with passing CI.
* [ ] `docs/audits/2026-05-17-comprehensive-review.md` §5.3 P2
      table updated to mark each as "LANDED ROUND 12".
* [ ] New CHANGELOG.md "Unreleased" → "Round 12" entry mirrors the
      6 items.
* [ ] `pnpm -r typecheck`, `pnpm exec biome check .`,
      `pnpm --filter @oh/ui test`, and `pnpm e2e` all green.

## Definition of Done

* Tests: each item has at least one Vitest unit test + axe assertion
  for any new public surface; e2e smoke covers happy path.
* Lint / typecheck / CI: green on the round 12 branch before merge.
* Docs: WORK_LOG round 12 section + brand / accessibility doc
  updates for any new public APIs.
* Rollback: each item is its own commit so individual revert is
  trivial.

## Implementation plan (one PR per item)

1. **PR 1 (P2-D7)** — Playwright workspace + 6 route screenshots
   committed. CI job added.
2. **PR 2 (P2-C2)** — Greeting per-locale (smallest API change).
3. **PR 3 (P2-D2)** — SearchPalette `sortBy` prop.
4. **PR 4 (P2-C1)** — Inline citation variant.
5. **PR 5 (P2-D5)** — `<StatusBand>` + MainArea integration.
6. **PR 6 (P2-D1)** — System accent opt-in (requires IPC).

## Technical notes

* Each item references its row in
  `docs/audits/2026-05-17-comprehensive-review.md` §5.3 — no need
  to re-derive the design; just implement and verify the audit's
  acceptance line.
* Reuse `@oh/ui` testing setup (`vitest`, `happy-dom`, `jest-axe`,
  `user-event`) for unit coverage of every new public surface.
* Reuse `apps/playground` routes for demo fixtures (chat-demo,
  chats, settings).
