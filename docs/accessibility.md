# Accessibility

This document captures the project's accessibility posture: the targets we
hold ourselves to, the tokens/components that enforce them, and the
automated checks that prevent regressions. Last revised round 11
(2026-05-17, audit `docs/audits/2026-05-17-comprehensive-review.md`).

## Target conformance

* **WCAG 2.2 AA** for renderer content (`packages/ui`, `apps/playground`).
* **Apple HIG / Microsoft Fluent 2** for platform chrome conventions
  where Electron exposes them (Win11 titlebar overlay, splash, focus
  visibility on touch / pen / keyboard).
* **AAA where cheap** (we go beyond AA on focus visibility because the
  brand accent gives us enough chroma headroom).

We do **not** currently target WCAG 2.2 AAA broadly — most of those
criteria (e.g. context-help on every input, sign-language alternatives)
are out of scope for a UI scaffolding.

## Contrast token strategy

All colors live in `packages/tokens/src/css/colors.css` and its TS
mirror `packages/tokens/src/tokens.ts`. The contrast-critical tokens
are split into three intents:

| Intent                | Token                          | Light contrast vs `--color-bg` | Dark contrast vs `--color-bg` | Rule          |
|-----------------------|--------------------------------|--------------------------------|-------------------------------|---------------|
| Primary body text     | `--color-text`                 | 13.4 : 1                       | 11.8 : 1                      | 1.4.3 (AAA)   |
| Secondary text        | `--color-text-muted`           | 5.6 : 1                        | 7.1 : 1                       | 1.4.3 (AA)    |
| Subtle / caption text | `--color-text-subtle`          | 5.0 : 1                        | 5.8 : 1                       | 1.4.3 (AA)    |
| Decorative separator  | `--color-border`               | 1.13 : 1                       | 1.5 : 1                       | n/a (decorative only) |
| Border on raised card | `--color-border-strong`        | 1.5 : 1                        | 2.3 : 1                       | n/a (decorative)      |
| **Interactive border** | `--color-border-interactive`  | 3.05 : 1                       | 3.15 : 1                      | 1.4.11 (AA)   |
| Focus ring (alpha)    | `--color-ring`                 | 3.2 : 1 composited             | 3.4 : 1 composited            | 1.4.11 + 2.4.7 |

**Rule of thumb for new components**: if it is focusable, accepts user
input, or carries a state change, use `--color-border-interactive`
(introduced round 11). Reserve `--color-border` for pure separators.

## Component-level invariants

* **Focus visibility** — every interactive primitive in `@oh/ui/primitives`
  sets `focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]`
  with `ring-offset-2 ring-offset-[var(--color-bg)]`. The global rule in
  `packages/ui/src/styles.css` also gives every `*:focus-visible` a
  `scroll-margin-bottom` / `scroll-margin-top` so the focused element
  cannot be obscured by the sticky composer or titlebar (2.4.11).
* **Accessible names** — text-only buttons use their text; icon-only
  buttons require `ariaLabel`; the `Composer` textarea exposes its
  current rotating placeholder both visually and via `placeholder` /
  `aria-label`; the hidden file input also has an explicit `aria-label`.
* **Live regions** — `ToastRoot` maps `tone="destructive"` to
  Radix `type="foreground"` (which yields `aria-live="assertive"`) and
  everything else to `type="background"` (`aria-live="polite"`).
* **Keyboard parity** — `ArtifactPane`'s drag handle is a real
  `role="separator"` with `aria-valuemin/max/now` and an `aria-label`
  that mentions arrow-key resizing. Composer accepts `Enter` /
  `Shift+Enter` / `Cmd|Ctrl+Enter`.
* **Reduced motion** — animated components consume
  `useReducedMotion()` from `motion/react`; the splash window also
  honors `@media (prefers-reduced-motion: reduce)`.

## Automated checks (Vitest + jest-axe)

`packages/ui/src/__tests__/a11y.test.tsx` runs `jest-axe` against:

* `<Button>` (default + outline)
* `<IconButton>` (default + outline)
* `<Input>` with a label
* `<Composer>` (full surface with rotating placeholder)

The axe config is in `packages/ui/src/__tests__/setup.ts` — `color-contrast`
is enabled, `region` is disabled (axe expects landmarks on full pages,
not isolated components). Run locally:

```bash
pnpm --filter @oh/ui test
```

Expected: 23 / 23 passing including 4 axe scans with 0 violations.

GitHub Actions runs the same suite on every push and pull request via
`.github/workflows/ci.yml`.

## Keyboard navigation map (renderer)

| Surface           | Key                       | Behavior |
|-------------------|---------------------------|----------|
| Composer textarea | `Enter`                   | Submit (when not composing IME) |
| Composer textarea | `Shift+Enter`             | Newline |
| Composer textarea | `Cmd|Ctrl+Enter`          | Force submit |
| Composer toggles  | `Tab` / `Shift+Tab`       | Focus next/prev toggle |
| Search palette    | `Cmd|Ctrl+K`              | Open |
| Search palette    | `Up` / `Down`             | Cycle results |
| Search palette    | `Enter`                   | Activate result |
| Search palette    | `Esc`                     | Close |
| Artifact pane     | `Arrow Left` / `Right`    | Resize 16px (focus the separator first) |
| Artifact pane     | `Shift + Arrow`           | Resize 64px |
| Artifact pane     | Double-click separator    | Reset to default width |
| Theme toggle      | `Cmd|Ctrl+Shift+L`        | Cycle light → dark → system |

## Manual smoke checklist (per release)

Run the checklist in `docs/testing.md` and also confirm:

1. NVDA (Windows) reads the rotating Composer placeholder on focus.
2. Keyboard-only navigation can reach: sidebar items, composer,
   artifact open/close, search palette, settings modal.
3. `prefers-reduced-motion: reduce` disables: brand mark idle pulse,
   message streaming pulse, splash spinner.
4. Forced colors / high-contrast mode keeps borders visible (native
   form controls keep their default outline; we do not override).
5. Pinch zoom to 200% / browser zoom to 400%: no horizontal scroll,
   composer remains usable.

## Known gaps (tracked in audit)

| ID       | Title                                  | Plan |
|----------|----------------------------------------|------|
| P1-B1    | Narrow viewport (<600px) shell         | useViewport + drawer-mode sidebar |
| P1-C1    | List `j` / `k` keyboard cycling        | useListKeyboardNav hook |
| P2-C3    | Win11 backgroundMaterial (acrylic)     | Feature-flagged, opt-in |
| P2-D7    | Playwright e2e route smoke              | Renderer-only, captures screenshots |

When any of these closes, update the table above and the keyboard map.
