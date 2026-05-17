# Quality Guidelines — `@oh/ui`

> Code quality contracts for the shared component library.
> Last revised round 11 (2026-05-17).

---

## Accessibility contracts (WCAG 2.2 AA, enforced)

### Color tokens — three-tier intent

Pick the right border / text token based on **interaction intent**, not
visual taste. The chosen token directly drives WCAG conformance.

| Intent                  | Token                          | Required ratio |
|-------------------------|--------------------------------|----------------|
| Body text               | `--color-text`                 | ≥ 7 : 1 (AAA target) |
| Secondary text          | `--color-text-muted`           | ≥ 4.5 : 1      |
| Subtle / caption text   | `--color-text-subtle`          | ≥ 4.5 : 1      |
| Decorative separator    | `--color-border`               | n/a (decorative) |
| Card edge (non-focus)   | `--color-border-strong`        | n/a (decorative) |
| **Interactive border**  | `--color-border-interactive`   | **≥ 3 : 1**    |
| Focus ring              | `--color-ring`                 | ≥ 3 : 1 composited |

**Rule:** any focusable element (input, button, dropdown trigger,
composer container, modal field, tab) MUST use
`--color-border-interactive`. Reserve `--color-border` for separators.
Audit P0-A1 surfaced 5 violations of this rule across `Composer`,
`Input`, `IconButton.outline`, `Button.outline`, `ModelPicker`.

### Accessible names

- **Icon-only buttons** require `label` (renders as `aria-label`).
- **Text inputs** must have either a `<label htmlFor>` or `aria-label`.
- **Decorative SVGs** must have `aria-hidden="true"` (not just empty
  `aria-label`).
- **Rotating / animated placeholders** (e.g., `Composer`) MUST keep a
  stable `aria-label` so screen readers always read a meaningful name,
  even when the visible text is empty during a transition. Audit
  P0-A3 surfaced this.

### Focus management

- Every interactive primitive sets
  `focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]` with
  `ring-offset-2 ring-offset-[var(--color-bg)]`.
- The global rule in `packages/ui/src/styles.css` gives every
  `*:focus-visible` a `scroll-margin-bottom: 96px` / `scroll-margin-top: 64px`
  so the focused element cannot be obscured by the sticky composer or
  Win11 titlebar (WCAG 2.4.11).

### Live regions

- `ToastRoot` maps `tone="destructive"` to Radix `type="foreground"`
  (assertive); other tones map to `type="background"` (polite).
- Long-running progress / status surfaces should use
  `aria-live="polite"` so they do not interrupt the user.

### Reduced motion

- Components consuming `motion/react` should call `useReducedMotion()`
  and disable looping animations when it returns `true`.
- CSS keyframes that loop (the splash spinner, the `Skeleton` shimmer)
  ship a `@media (prefers-reduced-motion: reduce)` fallback.

---

## Component patterns (required)

### Brand-aware primitives

`<BrandMark>` reads the active brand glyph from `window.__ohBrand`
(mirrored by `BrandProvider` at mount). Components that draw the brand
logo MUST go through `<BrandMark>` — never re-implement the Asterisk
geometry inline. Adding new brand profiles only requires defining
`logo` / `logoCompact` on the `BrandTheme`.

### Tool calls in threads

LLM tool calls in assistant messages MUST use `<ToolCallBlock>`
(`@oh/ui/thread`). Do not invent ad-hoc surfaces for "the model called
X" — the canonical block carries the running / done / error states,
the disclosure semantics, and the brand-tinted accent ring.

### Keyboard navigation

- Long lists with cardinal flow (chats, projects, search results) MUST
  wire `useListKeyboardNav` so users get `j` / `k` / arrow / `Enter` /
  `x` parity with Linear / Notion. The hook skips `INPUT` / `TEXTAREA`
  / `SELECT` / `contentEditable` targets automatically.
- Quick-action chip groups in the Composer use `role="toolbar"` with
  Arrow-Left / Right cycling between chips (audit P2-A2).

### Responsive shell

- Layout breakpoints come from `useViewport()`. Three tiers:
  `xs (<600) / sm (600-959) / md (≥960)`.
- `AppShell.sidebarMode='auto'` is the default. At `xs` the sidebar
  must pop out of layout as a drawer (controlled via
  `sidebarDrawerOpen` + `onSidebarDrawerChange`). At `sm` it collapses
  to a 60px icon rail. Consumers wire their own hamburger via
  `<SidebarDrawerTrigger>` which only renders at `xs` by default.

---

## Forbidden patterns

- **Bare `<button>` with no accessible name.** Use `<IconButton label="…">`
  or include text inside the button.
- **Hard-coded colors in component CSS.** Always reference a token
  (`var(--color-…)`). Adding raw `#xxxxxx` invalidates the brand swap.
- **`focus-visible:outline-none` without replacement.** If you remove
  the default outline, the global focus ring (or an equivalent
  `box-shadow`) MUST be applied.
- **Importing `@oh/brand` from inside `@oh/ui`.** The dependency runs
  one way only (brand → ui). `@oh/ui` consumes brand data via the
  `window.__ohBrand` bridge instead.
- **Importing `framer-motion`.** The project migrated to `motion` 12 in
  round 11. Always `import { motion } from 'motion/react'`.
- **`Tooltip` outside `TooltipProvider`.** Storybook / tests must wrap
  rendered output in `<TooltipProvider delayDuration={0}>` to avoid
  Radix context errors.

---

## Testing requirements

- Vitest 4 + happy-dom + Testing Library + user-event are the standard
  stack. Test files live next to source as `__tests__/*.test.tsx`.
- Every interactive primitive should have at least one render test and
  one user-interaction test.
- `jest-axe` smoke tests live in `__tests__/a11y.test.tsx`. Adding a
  new public surface (anything exported from `@oh/ui`'s top-level
  `index.ts`) means adding an axe assertion alongside.
- CI gate (`.github/workflows/ci.yml`) runs `pnpm --filter @oh/ui test`
  on every push / PR; a failing axe assertion or test should be fixed
  before merge.

---

## Code review checklist

1. **Tokens** — does the change introduce any raw color? Does an
   interactive surface use `--color-border-interactive`?
2. **a11y** — does every interactive element have an accessible name?
   Is `focus-visible` styled? Are loops `prefers-reduced-motion`-safe?
3. **Keyboard** — can the user reach every action without a mouse?
   For lists, is `useListKeyboardNav` wired?
4. **Responsive** — does the new surface degrade gracefully at xs
   (≤600px)? Did you test the sidebar drawer mode?
5. **Brand** — does the surface read brand-derived values
   (`useBrand()` / `<BrandMark>` / `var(--color-accent)`) instead of
   hard-coding the Aurora palette?
6. **Tests** — render test? interaction test? axe assertion if it's a
   public surface?
7. **Docs** — if the change ships a new public surface, update
   `docs/patterns.md` (or the relevant doc) and the `Storybook` story.

---

## Required reading before authoring new components

- `docs/accessibility.md` — full contrast table and keyboard map.
- `docs/brand.md` — automatic-glyph + desktop chrome wiring.
- `docs/audits/2026-05-17-comprehensive-review.md` — the 2026 audit
  decisions that drove this round of token / API choices.
