# Changelog

All notable changes to this project are documented here.
Format inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
project follows semantic versioning once it reaches `1.0`.

## [Unreleased]

### Added (Round 11 -- 2026-05-17)

#### Electron + tooling
- Upgraded Electron 33.2.1 -> **42.1.0** (Chromium 136 / Node 22.x) including
  `electron-builder` 25.1.8 -> 26.8.1 and `electron-updater` 6.3.9 -> 6.8.3.
- Migrated `framer-motion` 11.15.0 -> `motion` 12.38.0 across three
  workspaces. All `import { motion } from 'framer-motion'` call sites
  swapped to `import { motion } from 'motion/react'`.
- Documented npmmirror.com Electron + electron-builder-binaries mirror
  in `docs/electron.md` for China-network developer machines.
- Documented the Windows Developer Mode requirement for `winCodeSign`
  symlink extraction during NSIS packaging.

#### Audit + plan
- New `docs/audits/2026-05-17-comprehensive-review.md` -- 4-lens audit
  (Claude parity, Nielsen + WCAG 2.2 AA + HIG + Fluent 2, competitor
  comparison, scaffolding / library DX). Includes scoring matrix, top 5
  risks, and a P0 / P1 / P2 improvement plan with hour estimates and
  acceptance criteria.

#### Accessibility (P0)
- New `--color-border-interactive` design token (light `#A6A399`,
  dark `#7A7770`) reaches WCAG 1.4.11 3:1 on interactive surfaces.
  Applied to `Input`, `IconButton`, `Button` outline variants,
  `ModelPicker` hover, `Composer` container.
- Darkened light `--color-text-subtle` from `#918C83` (3.4:1) to
  `#7A7568` (5.0:1) for WCAG 1.4.3 AA on small text.
- Bumped `--color-ring` alpha 0.42 -> 0.85 (light) and 0.58 -> 0.85
  (dark) so focus rings clear 1.4.11 with margin.
- `Composer` textarea exposes the rotating placeholder via both the
  native `placeholder` attribute and `aria-label` so screen readers
  always hear the current copy. Hidden file input now has an
  `aria-label` too.

#### Accessibility (P1)
- `ArtifactPane` resize separator is a real `role="separator"` with
  `aria-valuemin / max / now` and an `aria-label` mentioning arrow keys.
- Global `*:focus-visible { scroll-margin-bottom: 96px; scroll-margin-top: 64px }`
  for WCAG 2.4.11 (focus not obscured by sticky composer/titlebar).
- `ToastRoot` maps `tone="destructive"` to Radix `type="foreground"`
  (assertive aria-live); others stay polite.
- New `docs/accessibility.md` documenting target conformance, contrast
  token strategy, keyboard navigation map, and known gaps.

#### Brand (P1)
- `<BrandMark>` from `@oh/ui` now auto-consumes the active brand glyph
  when wrapped in `<BrandProvider>` (via a window-bridge to avoid a
  package import cycle).
- New `apps/desktop/brand.config.json` lets desktop forks repaint the
  splash window and Win11 titlebar overlay without touching TypeScript.
  Schema lives in `BrandTheme.desktop` (`@oh/brand`).
- `docs/brand.md` extended with the automatic-glyph behavior and a
  4-step fork checklist for the desktop chrome.

#### Components (P1 + P2)
- New `<ToolCallBlock>` in `@oh/ui/thread`: running / done / error
  states with a collapsible body. Demo: `chat-demo` route + Storybook.
- New `useListKeyboardNav()` hook + Linear-style `j / k / ArrowUp /
  ArrowDown / Home / End / Enter / x` cycling for `<ListPageLayout>`.
- New responsive shell: `useViewport()` (`xs / sm / md`) +
  `AppShell.sidebarMode='auto'`. At xs the sidebar pops out of layout
  and renders as an off-canvas drawer; `<SidebarDrawerTrigger>` exposes
  a hamburger by default at xs only.
- New `<Skeleton>`, `<ListSkeleton>`, `<ComposerSkeleton>`,
  `<ChatSkeleton>` primitives + 4 Storybook stories.
- Composer toolbar shows a muted `⌘↵ Send · ⇧↵ Newline` keyboard hint
  at >=480px (P2-B1).
- Composer quick-action chips are now `role="toolbar"` with
  Arrow-Left / Right cycling between chips, plus a 1px hover lift
  (P2-A2 + P2-D4).
- Tooltipped default `delayDuration` 200 -> 250 ms for a calmer feel
  (P2-B4). Toast shadow popover -> modal so it stays legible on the
  `#FBF9F5` light background.
- `SidebarAccount` shortcuts now render with `<Kbd>` for visual
  consistency (P2-D3).
- Light surface ladder tightened: `surface-sunken` `#F5F4ED` -> `#F2F1E9`,
  `surface-muted` `#EFEEE6` -> `#EAE9E0` (P2-A1) for a clearer two-step
  ladder against `#FBF9F5`.
- Dark `surface-raised` lifted `#30302E` -> `#36352F` for visible
  card / composer lift (P1-B2).
- Win11 `backgroundMaterial: 'acrylic'` (P2-C3) via Electron 42,
  opt-out with `OH_BG_MATERIAL=none`.

#### Tooling
- New Vitest 4 baseline in `@oh/ui` with `happy-dom`,
  `@testing-library/react`, `@testing-library/user-event`, and
  `jest-axe`. 33 cases covering primitives, Composer, ThemeProvider,
  ToolCallBlock, useListKeyboardNav, useViewport, and 4 axe scans.
- New GitHub Actions CI (`.github/workflows/ci.yml`) running
  typecheck, biome check (non-blocking until P2-D8 lands), unit tests,
  and `pnpm -r build`. Electron packaging deliberately excluded.
- `.gitattributes` normalises to `eol=lf` so Windows clones stop
  producing 159 noisy CRLF / LF biome errors (P2-D8).

### Deferred (tracked in audit, not landed in round 11)
- macOS + Linux Electron 42 smoke (D-1) -- repo is Windows-first.
- macOS vibrancy (D-2), `pnpm fork-template` CLI (D-3), voice /
  collaboration features (D-4), Tailwind / Radix replacement (D-5).
- Inline `<sup>` citations variant (P2-C1), greeting per-locale
  (P2-C2), SearchPalette context-aware sort (P2-D2), system accent
  opt-in (P2-D1), long-task `<StatusBand>` (P2-D5), Playwright e2e
  (P2-D7). All scheduled for round 12.

## [0.1.0]

Initial scaffolding rounds 1 through 10. See `docs/WORK_LOG.md` for the
detailed per-round narrative.
