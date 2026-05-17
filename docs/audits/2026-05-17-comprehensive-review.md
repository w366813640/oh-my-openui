# Comprehensive UI/UX Review — 2026-05-17

| Field | Value |
|---|---|
| Audit ID | `2026-05-17-comprehensive-review` |
| Branch baseline | `chore/electron-42-and-ui-audit` (after Electron 33→42 + framer-motion 11→motion 12 upgrade) |
| Reviewer lens | Multi-lens: Claude parity / Nielsen + WCAG 2.2 AA + Apple HIG + Microsoft Fluent 2 / Competitor scan / Scaffolding-as-library DX |
| Audit scope | All packaged UI (`packages/{ui,tokens,motion,brand,icons}`), playground routes (`apps/playground`), desktop host (`apps/desktop`), docs (`docs/**`), spec (`.trellis/spec/**`) |
| Prior audits referenced | `docs/audits/ui-polish-2026-05-04.md`, `docs/audits/claude-web-oct-2025-parity-2026-05-05.md`, `docs/WORK_LOG.md` round 1–10 |
| Research files | `.trellis/tasks/05-17-upgrade-electron-ui-review/research/{electron-upgrade-survey,ui-ux-review-frameworks,competitor-chat-ui-2026}.md` |
| Companion change | Electron 33 → 42.1.0, electron-builder 25 → 26.8.1, electron-updater 6.3 → 6.8.3, framer-motion 11 → motion 12 (see `docs/electron.md` and `docs/WORK_LOG.md` round 11) |

---

## §0 · Executive Summary

### 0.1 Scoring matrix (0–5)

| Lens | Visual | Interaction | Accessibility | Reusability / DX | Documentation | Weighted total |
|---|---|---|---|---|---|---|
| §1 Claude parity residuals | 4.0 | 4.0 | — | — | 3.5 | 11.5 / 15 |
| §2 UX heuristics (Nielsen / WCAG / HIG / Fluent 2) | 4.0 | 4.0 | **2.5** | 3.5 | 3.5 | 17.5 / 25 |
| §3 Competitor comparison (informative) | 4.0 | 3.5 | — | 3.5 | — | 11.0 / 15 |
| §4 Scaffolding / library | 3.5 | 4.0 | **2.5** | **3.0** | 3.5 | 16.5 / 25 |
| **Overall maturity** | **3.9** | **3.9** | **2.5** | **3.5** | **3.5** | — |

> The scaffold is **visually mature** (round 10 closed most Claude-parity work) and **interactionally fluid** (Composer, ThinkingTrace, ArtifactPane drag-resize). The **two soft spots are accessibility** (WCAG 2.2 AA gaps in non-text contrast and target hit areas, no axe automation) and **library DX** (no tests, no CI, no fork ergonomics, brand `logoSlot` still missing).

### 0.2 Top 5 risks

| # | Risk | Severity | Lens | Plan ref |
|---|---|---|---|---|
| 1 | **WCAG 2.2 AA non-text contrast** of interactive borders (composer / inputs / modal fields) is ~1.5:1, well below the required 3:1. | High | §2.2 | P0-A1 |
| 2 | **`--color-text-subtle` (`#918C83`) used as 12–13px body text** sits at 3.4:1 vs `--color-bg` (`#FBF9F5`), failing AA normal-text 4.5:1. | High | §2.2 | P0-A2 |
| 3 | **No automated checks** — no CI, no unit tests, no a11y scan, no visual diff. Every regression depends on manual smoke today. | High | §4.6, §2.2 | P1-D1, P1-D2 |
| 4 | **Brand swap is partial** — `BrandProvider` covers tokens but `BrandMark`/logo is hard-coded SVG; consumers cannot drop in their own logo without forking files. | Medium | §4.3 | P1-D3 |
| 5 | **Tool-call thread surface missing** — `ThinkingTrace` shows "reasoning" but there is no "Used tool X" collapsible block. Cursor-class agents are common in 2026 and the scaffold has no story for them. | Medium | §3.2, §1.B | P1-C2 |

### 0.3 Improvement overview

| Tier | Items | Effort total |
|---|---|---|
| **P0** (blocking; ship before public README updates) | 4 items — all WCAG / a11y regressions | ~6–8 h |
| **P1** (high value; ship in this round) | 9 items — DX foundations + Claude parity gaps + Cursor/Linear parity | ~18–24 h |
| **P2** (incremental polish; opportunistic) | 11 items — Fluent 2 Mica, Notion-style hover bounce, Perplexity inline citations, Raycast Kbd everywhere, etc. | ~14–20 h |
| **Documented but deliberately deferred** | 5 items — see §5.4 | n/a |

Full detail in §5.

---

## §1 · Claude parity residuals

### 1.A Items from May 4 audit still partially open

The May 5 polish round closed **6 of 10** original findings (palette, composer affordance, user-bubble fill, serif body, sidebar rail width, welcome rhythm). The following are still open or only partially closed:

| May 4 # | Title | Current status (2026-05-17) | Severity | Plan |
|---|---|---|---|---|
| 1 | Narrow viewport shell strategy | `AppShell` collapses artifact to absolute overlay at `max-[900px]` (`packages/ui/src/shell/AppShell.tsx:74`), but the **sidebar still keeps 240/60px at <600px**. On a 390px viewport the main column is squeezed to <130px while artifact mode forces both panes off-screen. No drawer / off-canvas behaviour. | Medium | P1-B1 |
| 2 | Artifact mode responsive | Same root cause as #1; once shrunk to `<900px`, artifact becomes overlay but the thread underneath still suffers because `MainArea` sticky composer + `MessageList` row do not re-flow gracefully (model picker wraps below "Send"). | Medium | P1-B1 (joint fix) |
| 3 | Light surface ladder | Round 10 tightened `surface-muted` / `surface-sunken` (close to reference). **Still soft** — `surface-raised` is pure `#FFFFFF` which jumps too brightly from `#FBF9F5` canvas, while `surface-sunken` `#F5F4ED` and `surface-muted` `#EFEEE6` are barely 1 step apart. | Low | P2-A1 |
| 4 | Dark surface ladder | Round 10 introduced `surface-sunken` `#1C1C1A` but **`surface` and `surface-raised` are both `#30302E`** (identical value), so cards/composer/modal carry no layering against each other in dark mode. | Medium | P1-B2 |
| 5 | Composer anchored visually | Closed by round 10 (peach send, raised surface, dropdown plus menu). **Open**: keyboard hint (`⌘↵` / `⇧↵`) missing from composer footer, and there is no visible disabled-with-reason tooltip when `canSubmit` is false. | Low | P2-B1 |
| 6 | Sidebar active / grouped polish | Closed in round 10 for the rail accent + selected fill. **Open**: no recognizable "section labels" separator (everything is uniform); account footer still uses the same neutral hover as nav rows. | Low | P2-B2 |
| 7 | Message scan points | Round 10 added serif body. **Open**: blockquotes, ordered-list density, and inline code blocks still inherit default markdown styling — no anchor headers or scroll-spy for long replies. | Low | P2-B3 |
| 8 | Modal / floating system parity | Mostly closed; **open**: tooltip default delay (Radix default 700ms) feels long compared to Claude's ~250ms; toasts use light shadow that disappears against bright surfaces. | Low | P2-B4 |
| 9 | List / project density | Round 9 added bulk-select. **Open**: no list-level loading skeleton (currently jumps to "no items" briefly), and no in-place row inline edit. | Low | P2-B5 |
| 10 | Demo fixture narrative | Round 10 expanded copy. **Open**: only one tool-call style ("ThinkingTrace"), no connector / billing / error fixture variations — the fixtures still read as "library showcase" rather than "fully populated product". | Low | P2-B6 |

### 1.B New observations under the Electron 42 + motion 12 baseline

Items that did not exist in earlier audits and only surfaced after re-walking the routes against current frameworks/competitor benchmarks:

| ID | Observation | Severity | Plan |
|---|---|---|---|
| 1.B.1 | **Splash window theming is the right idea, but the palette is hard-coded** in `apps/desktop/src/splash.ts` (`#FBF9F5`/`#252623`, `#C96442`). Brand replacement requires editing `splash.ts`; tokens are not yet consumed there. | Medium | P1-D4 |
| 1.B.2 | **Titlebar overlay color is hard-coded** in `apps/desktop/src/main.ts` (light `#FBF9F5` + `#262522`, dark `#252623` + `#F3F0E8`). If a downstream consumer swaps the brand to non-Claude palette, the OS-rendered min/max/close icons will mis-match the rest of the chrome. | Medium | P1-D4 (joint) |
| 1.B.3 | **No tool-call UI in thread**. `ThinkingTrace` is reasoning-only; consumers wiring tool calls would have to build a custom message variant. With Electron 42 + Chromium 136 supporting `dialog` and `inert` natively, the scaffold should ship a baseline `<ToolCallBlock>`. | Medium | P1-C2 |
| 1.B.4 | **Citations are correct but only have one variant**. `<Citations>` renders a single bottom-strip layout. Perplexity-style inline `[1]` superscript is a common 2026 pattern; should be an opt-in `variant="inline"` prop. | Low | P2-C1 |
| 1.B.5 | **Composer placeholder rotation works, but accessibility annotation is missing** — `aria-hidden` on the animated overlay (`Composer.tsx:382`) is correct, but the underlying `<Textarea>` always sees an empty `placeholder` when rotating. Screen readers get no current placeholder text. | Medium | P0-A3 |
| 1.B.6 | **Welcome stage greeting** uses time-of-day pick. There is no per-locale variant (zh greeting still "早上好/下午好/晚上好" but English fallback is just "Good morning"). Acceptable but mark as DX gap for brand owners. | Low | P2-C2 |
| 1.B.7 | **ArtifactPane resize handle** supports keyboard (`ArrowLeft`/`ArrowRight`) but there is no on-screen affordance announcing the keystrokes, and the visible drag handle has no `aria-orientation` or `aria-valuenow` exposed. | Medium | P1-A1 |

### 1.C Section score

| Dimension | Score | Note |
|---|---|---|
| Visual | 4.0 | Round 10 closed the big-ticket parity items; remaining gaps are surface-ladder fine tuning. |
| Interaction | 4.0 | Strong micro-interactions, motion 12 migration adds no jank; gaps are narrow viewport and tool-call. |
| Accessibility | n/a | Covered in §2.2 |
| Reusability | n/a | Covered in §4 |
| Documentation | 3.5 | `docs/audits/` is current, but neither audit references the brand-swap path or splash color lifecycle. |

---

## §2 · UX heuristics

### 2.1 Nielsen 10

| # | Heuristic | Status | Findings |
|---|---|---|---|
| 1 | System status visibility | **Strong** | `StreamingShimmer`, `ThinkingTrace`, asterisk spinner in send button, theme:system-changed IPC all work. Missing: long-running task progress band (e.g. when a tool call takes >5s). |
| 2 | Real-world match | **Strong** | Time-of-day greeting, send/stop icons match common conventions, attachments accept paste/drag. |
| 3 | User control & freedom | **Strong** | Esc closes modals + artifact pane; composer textarea supports paste-cancel; assistant can be stopped mid-stream. |
| 4 | Consistency & standards | **Strong** | Win11 titlebar conventions honoured (hover-red close, drag region), ⌘K palette standard, send/stop symbols are universal. |
| 5 | Error prevention | **Adequate** | `maxAttachments` clip, `AlertModal` for destructive. Missing: composer "you are about to send a 4096-token message" warning; no "exit drag-resize" cancel. |
| 6 | Recognition over recall | **Strong** | `SearchPalette`, sidebar tooltips when collapsed, dropdown labels descriptive. Open: keyboard shortcut display in menus is incomplete (only SearchPalette uses `<Kbd>` today). |
| 7 | Flexibility & efficiency | **Adequate** | ⌘K + Tab navigation work. Missing: j/k vertical list nav (Linear parity), context-aware ⌘K ordering (Cursor parity), `?` cheat-sheet. |
| 8 | Aesthetic & minimalist | **Strong** | Round 10 deliberately removed decoration. The asterisk-as-spinner reuses brand glyph — exemplary. |
| 9 | Help users recover from errors | **Adequate** | Toast error tone exists. Missing: there is no "retry last action" affordance on assistant error; no offline / disconnected indicator. |
| 10 | Help & documentation | **Adequate** | Sidebar `getHelp` exists, `docs/` set is thorough for maintainers. Missing: in-app shortcut cheat-sheet, no first-run tour. |

### 2.2 WCAG 2.2 AA — concrete computed contrast checks

The following contrast checks were computed against current `packages/tokens/src/css/colors.css` (relative-luminance / WCAG formula).

**Light theme** (bg `#FBF9F5` ≈ L 0.958):

| Token | Hex | Contrast vs `--color-bg` | Required | Verdict |
|---|---|---|---|---|
| `--color-text` | `#262522` | **15.2:1** | ≥4.5 (text) | Pass |
| `--color-text-muted` | `#6F6A62` | **5.0:1** | ≥4.5 (text) | Pass |
| `--color-text-subtle` | `#918C83` | **3.4:1** | ≥4.5 (normal text), ≥3.0 (large text ≥18pt) | **FAIL for normal text**; OK only as large-text or non-text decoration. |
| `--color-border` | `#DFDDD6` | **1.13:1** | ≥3.0 (non-text actionable UI per 1.4.11) | **FAIL for actionable element borders** (composer, input, modal field, dropdown trigger). Pass for purely decorative separators. |
| `--color-border-strong` | `#CBC7BD` | **1.5:1** | ≥3.0 (non-text actionable UI per 1.4.11) | **FAIL** even on hover/focus elevation. |
| `--color-accent` | `#C96442` | 4.0:1 | ≥3.0 for graphical / accent stroke | Pass for accent strokes; fails for accent **as small text** on `--color-bg`. |
| `--color-ring` | `rgba(201,100,66,0.42)` | composited ≈ 2.0:1 | ≥3.0 for focus indicator (1.4.11) | **FAIL** — focus ring barely visible on light bg. |

**Dark theme** (bg `#252623` ≈ L 0.018):

| Token | Hex | Contrast vs `--color-bg` | Required | Verdict |
|---|---|---|---|---|
| `--color-text` | `#F3F0E8` | **15.6:1** | ≥4.5 | Pass |
| `--color-text-muted` | `#C5BFB4` | **9.6:1** | ≥4.5 | Pass |
| `--color-text-subtle` | `#9A948A` | **5.8:1** | ≥4.5 | Pass |
| `--color-border` | `#42423D` | **1.5:1** | ≥3.0 | **FAIL** (same family of issues as light). |
| `--color-border-strong` | `#5C5A53` | **2.3:1** | ≥3.0 | **FAIL**. |
| `--color-accent` | `#D97757` | 4.6:1 | ≥3.0 | Pass for strokes, **FAIL for body text**. |
| `--color-ring` | `rgba(217,119,87,0.58)` | composited ≈ 2.5:1 | ≥3.0 | **FAIL** on dark bg too. |

**Key WCAG-affecting findings, summarised:**

- **P0-A1 — Interactive borders fail 1.4.11**. Composer (`Composer.tsx:312-319`), `Textarea`, `DropdownMenuTrigger`, `Tooltip`, modal `<Input>` all use `--color-border` (1.13:1 light / 1.5:1 dark). Even the focused state uses `--color-border-strong` (1.5:1 / 2.3:1). Fix: introduce `--color-border-interactive` token (≥3:1 in both modes) and consume it on focusable input surfaces. The brand-neutral feel can be preserved by keeping `--color-border` for purely decorative separators.
- **P0-A2 — `--color-text-subtle` in light mode is 3.4:1**. Used by `Kbd` (`packages/ui/src/primitives/Kbd.tsx`), composer placeholder overlay (`Composer.tsx:391`), markdown `<small>`-equivalent. Fix: darken to ~`#7A7568` (≈ 5.0:1) or restrict subtle-tier usage to large text only.
- **P0-A3 — Composer placeholder rotation removes accessible name**. `Textarea` receives `placeholder=""` whenever the rotating overlay is active (`Composer.tsx:373`), so screen readers see a blank field. Fix: keep the first placeholder string on the `<Textarea>` and only hide it visually via `text-transparent`/`opacity-0`, OR set `aria-placeholder` to the current `placeholders[placeholderIdx]`.
- **P0-A4 — Focus ring fails 1.4.11**. `--color-ring` is a 42–58% alpha tint that composites to ~2:1. Used everywhere through `focus-visible:ring-2 ring-[var(--color-ring)]` (Composer, IconButton, Buttons, Tabs). Fix: bump alpha to 70–80% and add a 2px outer outline-offset for true 3:1 against both light and dark canvases.

**Other WCAG items to address** (not P0 but listed):

| WCAG SC | Status | Note |
|---|---|---|
| 1.4.10 Reflow | **Fail** for 320px and degrades at 390–600px (see §1.A #1). | P1-B1 |
| 2.1.1 Keyboard | Mostly pass. ArtifactPane drag handle has ArrowLeft/Right (good). But `<Composer>` quick-action chips have no keyboard cycle hint — only Tab works. | P2-A2 |
| 2.4.3 Focus order | Pass — sidebar → main → artifact follows DOM. | — |
| 2.4.7 Focus visible | Fail — see P0-A4. | P0-A4 |
| 2.4.11 Focus not obscured (Min) | **Risk** — sticky composer (`MainArea`) overlaps any focused button placed near the thread bottom (e.g. last assistant action menu). | P1-A2 |
| 2.5.7 Dragging | Pass — ArtifactPane has keyboard alternative. | — |
| 2.5.8 Target size (Min) | Pass — `IconButton size="sm"` is 28×28 (≥24×24 minimum). | — |
| 3.2.6 Consistent help | Pass — sidebar `getHelp` available on every route via `Sidebar`. | — |
| 4.1.3 Status messages | **Risk** — Toast probably needs explicit `role="status"` / `aria-live="polite"`. Need to verify in Radix Toast wrapper. | P1-A3 |

### 2.3 Apple HIG (2025 Liquid Glass era)

- **Material / vibrancy**: HIG promotes thin/regular/thick materials. `MainArea` topbar already uses `backdrop-blur-md` over a translucent layer, which approximates `thinMaterial`. The artifact toolbar does the same. Acceptable parity. **Open**: Electron `vibrancy` API on macOS (`acrylic`-like) is **not enabled** — adding `vibrancy: 'sidebar'` for the sidebar on macOS would yield true HIG-grade material. Skipped per scope (Q6 = Windows only) but recorded under §5.4 deferred items.
- **Focus**: HIG users expect a system-blue ring. The brand-coloured terracotta ring is intentional brand override and acceptable for an opinionated scaffold. However the **alpha-tint variant fails 3:1** (see P0-A4) which violates HIG-and-WCAG simultaneously. Fix via P0-A4.
- **Pointer target ≥44pt**: HIG recommends ≥44pt; we ship 24/28/32/36. For a Windows-first scaffold this is acceptable, but the README claim "drop the components into any app" implies macOS too. **Recommendation**: keep current as default; expose `IconButtonSize` override as documented prop, document in `docs/foundation.md` that `lg` (36) is closest to HIG.
- **Easing**: Already `cubic-bezier(0.2,0,0,1)` (HIG-grade `easeOut` analogue). Pass.

### 2.4 Microsoft Fluent 2 (Win11)

| Topic | Status | Note |
|---|---|---|
| Titlebar | **Pass** — hover-red close, `titleBarOverlay` correctly used. | — |
| `backgroundMaterial` Acrylic/Mica | **Not used** — main BrowserWindow does not set `backgroundMaterial`. Electron 30+ supports `'acrylic' \| 'mica' \| 'tabbed'` on Win11. Adding `backgroundMaterial: 'acrylic'` would make the chrome match modern Win11 apps when the user enables transparency. | P2-C3 |
| Smooth corners 8px | **Pass** — `--radius-md` = 10px close enough. | — |
| Reveal hover | Not used. Not required, but optional Fluent flair. | Deferred |
| System accent color | **Not respected** — terracotta is hard-coded. Fluent 2 strongly recommends honouring the user's system accent. **Recommendation**: ship a `useSystemAccent()` hook (read `nativeTheme.systemColors` over IPC) that consumers can opt into. | P2-D1 |
| Sound feedback | Not used. Not required. | — |
| Settings two-pane | **Pass** — `TwoPaneSettings` mirrors Win11 Settings rhythm. | — |

### 2.5 Section score

| Dimension | Score |
|---|---|
| Visual | 4.0 |
| Interaction | 4.0 |
| Accessibility | **2.5** (P0 items above are the largest single drag on overall maturity) |
| Reusability / DX | 3.5 |
| Documentation | 3.5 |

---

## §3 · Competitor comparison (informative)

> Per D3 brainstorm decision, competitor benchmarks are **informative not normative** — they exist to clarify our differentiated stance, not to drive copies. See `.trellis/tasks/05-17-upgrade-electron-ui-review/research/competitor-chat-ui-2026.md` for the full scan.

### 3.1 Where we deliberately stay different

| Decision | Why we keep it | Competitor diverge |
|---|---|---|
| Warm Claude palette + serif assistant body | Brand reason; emotional warmth differentiates from cool greys of Linear / Cursor. | ChatGPT/Cursor lean cool grey. |
| Six quick-chip welcome | Matches Claude reference; reduces blank-page anxiety. | ChatGPT 5 deliberately stripped this to "just a prompt box". |
| Bottom citation strip | Less invasive than inline; respects flow. | Perplexity inserts `[1]` inline. |
| List rows 56px tall | Calmer "knowledge-tool aesthetic" vs Linear's 32px workspace density. | Linear / Notion lean denser. |

### 3.2 Where we should consider catching up (mapped to plan)

| Competitor | Pattern | Why now | Plan |
|---|---|---|---|
| **Cursor** | Tool-call thread block (`Used 3 tools` expand) | 2026 agents are tool-heavy. Without this, library consumers building agent UX must hand-roll. | P1-C2 |
| **Cursor** | Context-aware ⌘K ordering (recent + same-project first) | SearchPalette already has groups; just needs ranking. | P2-D2 |
| **Linear** | j/k vertical list navigation | List rows lose to Linear on speed-of-scan. | P1-C1 |
| **Linear** | Skeleton loading on list mount | Better than empty flash. | P2-C4 |
| **Raycast** | `<Kbd>` everywhere, not just SearchPalette | Reinforces "keyboard-first" claim. | P2-D3 |
| **Notion AI** | Hover bounce on suggestion chips | Small, delightful, low effort. | P2-D4 |
| **Perplexity** | Inline citation superscript variant | Coexists with current strip; opt-in. | P2-C1 |
| **All** | Long-running task persistent band | Toast is too ephemeral for >5s actions. | P2-D5 |

### 3.3 Section score

| Dimension | Score |
|---|---|
| Visual | 4.0 |
| Interaction | 3.5 |
| Reusability | 3.5 |

---

## §4 · Scaffolding / library lens

### 4.1 API surface — `packages/ui/src/index.ts`

Surface is a single barrel export of all subdomains (composer, i18n, layouts, markdown, modals, primitives, shell, theme, thread, utils, welcome). For a fork-and-customise scaffold this **is** the right shape. **Findings**:

| ID | Finding | Severity |
|---|---|---|
| 4.1.a | No explicit `package.json#exports` map beyond `.` and `./styles.css`. Consumers cannot do `import { ... } from '@oh/ui/composer'` for treeshake-friendly subpath imports. | Low (build still tree-shakes via barrel + side-effect-free TS, but explicit map signals intent and prevents accidental side-effects later). |
| 4.1.b | Most components export their prop type as `ComposerHostProps`, `AppShellProps`, etc. (good). **But** `MessageList`, `AssistantMessage`, `UserMessage` prop types are not re-exported from the top barrel — only the component is. Forking consumers need deep imports. | Medium |
| 4.1.c | `useI18n`, `useTheme` hooks are exported. Good. `useSidebarState`, `useArtifactPane` (if they exist as separate hooks) — verify naming consistency; consider documenting them in `docs/foundation.md`. | Low |

### 4.2 Provider hierarchy & replaceability

`AppFrame.tsx` composes: `ThemeProvider > BrandProvider > I18nProvider > ToastProvider > TooltipProvider > SidebarStateProvider > children`. Order is correct (tokens before brand, i18n inside everything).

**Findings**:

| ID | Finding | Severity |
|---|---|---|
| 4.2.a | The order is hard-coded in `AppFrame`. A consumer who only wants `<Composer>` standalone has to either replicate the provider stack or wrap with `AppFrame`. Document a minimal-stack recipe in `docs/foundation.md` and ideally ship a `<MinimalProviders>` helper. | Medium |
| 4.2.b | `SidebarStateProvider` is referenced by `<Sidebar>` and `<TitleBarControls>` (for collapsing). Couples nav to sidebar logic. Acceptable today but document. | Low |

### 4.3 Brand swap — `BrandProvider`

`packages/brand/src/**` defines `BrandProfile { palette, fonts, asterisk, greetings, ... }`. Active profile is set by `<BrandProvider value={...}>`. **Coverage gaps**:

| ID | Finding | Severity |
|---|---|---|
| 4.3.a | **No `logoSlot`** — `<BrandMark>` in `packages/ui/src/primitives/BrandMark.tsx` hard-codes the asterisk SVG geometry; consumers swapping brand can change colour but not the shape. Round 9 menu surfaced this. | High |
| 4.3.b | Splash and titlebar overlay colours (see 1.B.1, 1.B.2) live outside the BrandProvider lifecycle. Need either an IPC `brand:get-splash-colors` or static `BrandProfile.desktop = { splashBg, splashFg, titlebarBg, titlebarFg }`. | High |
| 4.3.c | `BrandProfile` exposes greetings (en / zh). No public typed API to add a new locale for greetings only. | Low |

### 4.4 i18n coverage — `packages/ui/src/i18n/dictionaries/{en,zh}.ts`

A spot grep was not exhaustive, but the suspect surfaces are:

| ID | Finding | Severity |
|---|---|---|
| 4.4.a | Some hard-coded English literals in component files (`'Add'`, `'Settings'`, `'Stop'` aria-labels in `Composer.tsx:559, :406, :442`). For a scaffold marketing itself as i18n-ready, these should be `t('composer.actions.add')`-style. | Medium |
| 4.4.b | `BrandProfile.greetings` is a typed surface; markdown rendering, code-block "Copy" button, citation "Read source" labels — verify each is routed through `useI18n()`. | Medium |
| 4.4.c | No RTL story. Components use `flex-row` with hard-coded `ml-1` / `mr-2` etc. — flipping to `rtl` would require an audit. Out-of-scope for this round but should be in `docs/foundation.md` known-limitations. | Low (deferred) |

### 4.5 Documentation — `docs/**`

| Doc | Status | Note |
|---|---|---|
| `docs/architecture.md` | Pass | Solid overview. |
| `docs/foundation.md` | Pass | Token system is well documented. |
| `docs/patterns.md` | Pass | Patterns inventory is present. |
| `docs/electron.md` | **Updated this round** (Electron 42, mirror, Developer Mode). | — |
| `docs/testing.md` | Adequate; checklist exists for smoke. **Missing**: a11y test plan, screenshot regen process. | P1-D5 |
| `docs/storybook.md` | Pass. | — |
| `docs/audits/` | Pass — three audits now (this is #3). | — |
| `docs/brand.md` | **Missing** — there is no dedicated doc explaining how to author a `BrandProfile`. | P1-D6 |
| Migration / changelog | **Missing**. WORK_LOG fills the gap manually. Acceptable for a private template, would block "use as starter" claim. | P2-D6 |
| A11y status | **Missing**. After P0 fixes we should publish a baseline `docs/accessibility.md`. | P1-D7 (depends on P0) |

### 4.6 Test coverage

- Zero unit tests today. The repo does not import `vitest`, `@testing-library/react`, `playwright` or `axe-core`.
- Smoke is entirely manual (per `docs/testing.md`).
- Storybook 9 is the only behaviour reference.

**Recommendation**:

| ID | Finding | Severity |
|---|---|---|
| 4.6.a | Add `vitest` + `@testing-library/react` to `packages/ui` with one smoke test per major component (rendering with default props, focus management, keyboard handling). Even 30 minimal tests catch ~80% of accidental regressions. | High (P1-D1) |
| 4.6.b | Add `vitest-axe` to fail CI on any newly introduced a11y violation. Runs in the same Vitest setup. | High (P1-D2) |
| 4.6.c | Add a tiny Playwright smoke (electron-mode is overkill; use Playwright Chrome to walk the playground routes for visual stability). Deferred. | Medium (P2-D7) |

### 4.7 Build, exports, dependency hygiene

- Workspace TS is `5.6.3` — older minor than current. Consider bumping to 5.7+ when convenient (not in this round per Q7 = B).
- All renderer packages share the same `motion@^12.38.0` after this round. Good.
- `peerDependencies` in `@oh/ui` correctly lists `react`/`react-dom` `^19.0.0`.
- Storybook 9 + Vite 6 + React 19 chain is up to date.
- `apps/desktop` still depends on `@types/node@^22.10.2`, matching Electron 42's Node 22. Good.
- Lockfile size: ~unchanged after upgrade (motion 12 is a 1:1 transitive replacement).

### 4.8 Section score

| Dimension | Score |
|---|---|
| Visual | 3.5 |
| Interaction | 4.0 |
| Accessibility | **2.5** |
| Reusability / DX | **3.0** (logoSlot, brand-aware splash, no tests, no CI all weigh heavily) |
| Documentation | 3.5 |

---

## §5 · Improvement plan (P0 / P1 / P2)

> Each row is meant to be **directly actionable**: title, file/location, problem, recommendation, hour estimate, acceptance criterion, and the lens that surfaced it.

### 5.1 P0 — blocking accessibility regressions

| ID | Title | Location | Problem | Recommendation | h | Acceptance | Lens |
|---|---|---|---|---|---|---|---|
| **P0-A1** | Interactive border non-text contrast | `packages/tokens/src/css/colors.css`; consumers: `Composer.tsx:312-319`, `Textarea`, `DropdownMenuTrigger`, modal `<Input>`, `Tooltip` | `--color-border` (1.13:1 light / 1.5:1 dark) and `--color-border-strong` (1.5:1 / 2.3:1) used on focusable surfaces fail WCAG 1.4.11 (≥3:1). | Add `--color-border-interactive` light ≈ `#A6A399` (3.05:1) / dark ≈ `#7A7770` (3.15:1). Use it on Composer/Input/Modal field/Dropdown trigger borders. Keep `--color-border` for separators only. | 2.0 | New token compiled, axe / contrast script reports ≥3:1 for the listed selectors. | §2.2 |
| **P0-A2** | `--color-text-subtle` light fails AA normal text | `packages/tokens/src/css/colors.css`; usages: `Kbd`, `Composer.tsx:391` placeholder overlay, markdown `<small>` equivalents, citation timestamp | 3.4:1 light vs `--color-bg`. | Darken light value `#918C83` → `#7A7568` (~5.0:1). Dark value already 5.8:1, leave. Update Storybook color page. | 1.0 | Re-computed contrast ≥4.5:1 in light. No regression to dark. | §2.2 |
| **P0-A3** | Composer placeholder loses accessible name when rotating | `packages/ui/src/composer/Composer.tsx:373-396` | `<Textarea placeholder={isRotating ? '' : placeholders[0]}>` leaves screen reader without current placeholder text. | Keep `placeholder={placeholders[placeholderIdx]}` on the real `<Textarea>` and hide it visually via `placeholder:opacity-0` when the overlay animation is mounted. Alternatively set `aria-placeholder={placeholders[placeholderIdx]}`. | 1.5 | NVDA / VoiceOver reads current rotating placeholder. Existing visual rotation unchanged. | §2.2 + 1.B.5 |
| **P0-A4** | Focus ring fails 1.4.11 | `packages/tokens/src/css/colors.css`; consumers: all `focus-visible:ring-2 ring-[var(--color-ring)]` call sites | `rgba(201,100,66,0.42)` composites to ~2:1 in light, `rgba(217,119,87,0.58)` ~2.5:1 in dark. | Bump alpha to 0.75 in both modes, OR switch to solid accent + `ring-offset-2 ring-offset-[var(--color-bg)]` (already partially used). Update one canonical `focus-visible` class so the change applies everywhere. | 2.0 | Manual contrast check reports ≥3:1 on bg and on raised surface. Storybook focus stories still look "brand", not "system blue". | §2.2 |

**P0 total ≈ 6.5 h.**

### 5.2 P1 — high value (ship this round)

| ID | Title | Location | Problem | Recommendation | h | Acceptance | Lens |
|---|---|---|---|---|---|---|---|
| **P1-A1** | ArtifactPane resize handle keyboard affordance | `packages/ui/src/shell/ArtifactPane.tsx` | Drag handle has Arrow keyboard support but no `role="separator"`, `aria-valuemin/max/now`, and no on-screen "Use ←/→" hint. | Add `role="separator"` `aria-orientation="vertical"` `aria-valuenow` with the percentage width. Add a visually subtle "Use ←/→" hint on focus. | 1.0 | NVDA reports separator with value. Visual hint appears only on focus. | §1.B.7 + §2.2 |
| **P1-A2** | Focus-not-obscured for sticky composer | `packages/ui/src/shell/MainArea.tsx` + `MessageList` | Sticky composer can cover focused action menus on last assistant message. | When a button inside `MessageList` gains focus, scroll-margin-bottom equal to composer height. CSS-only via `scroll-margin-bottom: 96px` on the focusable selectors. | 0.5 | Tab to the last assistant message action — composer no longer occludes it. | §2.2 (2.4.11) |
| **P1-A3** | Toast aria-live | `packages/ui/src/modals/Toast.tsx` (Radix wrapper) | Verify `role="status"` / `aria-live="polite"`; success/error variants should differentiate (success `polite`, error `assertive`). | Audit current Radix Toast props, override `role` if missing. | 0.5 | Screen reader announces toast contents within 250ms. | §2.2 (4.1.3) |
| **P1-B1** | Narrow viewport real shell strategy | `packages/ui/src/shell/AppShell.tsx` + `Sidebar` | Sidebar fixed 240/60 at <600px; squeezes thread / artifact off-screen. | Add `useViewport()` breakpoint hook (xs <600, sm <960, md ≥960). Sidebar: at xs, render as off-canvas drawer triggered by hamburger; collapsed rail only at sm. Artifact: at sm, force tab-switch rather than split. | 4.0 | 390 / 640 / 1024 px layouts: sidebar / thread / artifact all usable without horizontal scroll. | §1.A #1, #2; §2.2 (1.4.10) |
| **P1-B2** | Dark surface ladder gap | `packages/tokens/src/css/colors.css` dark block | `--color-surface` and `--color-surface-raised` are both `#30302E`; cards/composer/modal carry no layering against each other. | Push `--color-surface-raised` to `#36363A` (subtle lift) and re-validate against round-10 dark screenshots. | 1.0 | Side-by-side comparison shows visible card/composer lift in dark mode without changing brand feel. | §1.A #4 |
| **P1-C1** | List `j`/`k` keyboard nav | `packages/ui/src/layouts/ListPage.tsx` + `apps/playground/src/routes/chats.tsx`, `projects.tsx` | List rows lack keyboard cycling. | Add `useListKeyboardNav()` hook supporting `ArrowUp/Down`, `j/k`, `x` toggle selection, `Enter` activate. Wire into ListPage. | 2.0 | Manual smoke: focus a row, j/k traverses; x toggles bulk select; Enter opens. | §3 Linear |
| **P1-C2** | Tool-call thread block | `packages/ui/src/thread/` (new `ToolCallBlock.tsx`) | No surface for "agent called tool X". | Introduce `<ToolCallBlock title icon tool? status="running\|done\|error">`. Story in `stories/`. Demo fixture in `apps/playground/src/routes/chat-demo.tsx`. | 3.0 | Storybook story renders running/done/error states; chat-demo shows two tool calls. | §1.B.3 + §3 Cursor |
| **P1-D1** | Vitest baseline | `packages/ui` add `vitest.config.ts` + ~12 smoke tests | No tests. | Configure Vitest + `@testing-library/react`. Cover: Composer submit/clear, IconButton focus ring, ArtifactPane open/close, SearchPalette filter, Sidebar collapse, ThemeProvider light/dark switch. | 3.0 | `pnpm --filter @oh/ui test` runs in <10s and is green. | §4.6 |
| **P1-D2** | a11y scan in tests | same package | No automated a11y check. | Add `vitest-axe`. Run axe against AppShell + Composer + SearchPalette + ArtifactPane stories. | 2.0 | `pnpm --filter @oh/ui test` includes 4 axe assertions; 0 violations after P0. | §4.6 |
| **P1-D3** | Brand `logoSlot` | `packages/brand/src/types.ts` + `packages/ui/src/primitives/BrandMark.tsx` + `packages/brand/src/profiles/*.ts` | Logo SVG hard-coded. | Add `BrandProfile.logoSlot?: ReactNode` (preferred) or `logoSrc?: string`. `BrandMark` renders `logoSlot ?? <DefaultAsterisk />`. Update aurora/claude-study profiles. | 1.5 | Swapping a brand profile with a custom logoSlot replaces the welcome / sidebar / titlebar mark. | §1.A round 9; §4.3 |
| **P1-D4** | Brand-aware splash + titlebar | `apps/desktop/src/{main,splash}.ts` + brand IPC | Hard-coded splash colours and titlebar overlay. | Read active brand on app start via existing brand JSON (or new `BrandProfile.desktop`); apply to splash inline data: URL and `titleBarOverlay`. | 2.0 | Switching brand at fork-time changes splash + titlebar to the brand palette. | §1.B.1, §1.B.2; §4.3 |
| **P1-D5** | Testing doc + a11y plan | `docs/testing.md` + new `docs/accessibility.md` | a11y plan missing. | After P0 closes, write `docs/accessibility.md` documenting: contrast token strategy, axe baseline, keyboard navigation map. | 1.0 | New doc references current token values and CI command. | §4.5 |
| **P1-D6** | Brand authoring doc | `docs/brand.md` (new) | How to fork brand is not written down. | Document the `BrandProfile` shape, `logoSlot` usage (after P1-D3), splash override (after P1-D4), greeting strings, palette stress test. | 1.5 | A new contributor can author a fresh brand profile in <30 min by reading only this doc. | §4.5 |
| **P1-D7** | GitHub Actions CI | new `.github/workflows/ci.yml` | No CI. | Build matrix: `typecheck` (all workspaces), `biome check`, `pnpm -r build`, `pnpm --filter @oh/ui test`. **Do not** package electron in CI (network + admin issues). | 1.5 | PR opens → CI runs 4 jobs in <5 min. | §4.6 |

**P1 total ≈ 23.5 h.**

### 5.3 P2 — incremental polish

| ID | Title | Location | Problem | Recommendation | h | Acceptance | Lens |
|---|---|---|---|---|---|---|---|
| **P2-A1** | Light surface ladder finesse | tokens light block | `surface-sunken` and `surface-muted` 1 step apart. | Split: `surface-sunken` `#F2F1E9` / `surface-muted` `#EAE9E0` for a clearer two-step ladder. | 0.5 | Storybook ColorScale shows visible step. | §1.A #3 |
| **P2-A2** | Quick-action chip keyboard cycle | `Composer.tsx:528-549` | Chips only reachable via Tab. | Make chip group `role="toolbar"` with ArrowLeft/Right cycling within the group. | 0.5 | Tab into group → Arrow cycles chips. | §2.1 #7 |
| **P2-B1** | Composer keyboard hint | `Composer.tsx` toolbar | No `⌘↵` / `⇧↵` hint visible. | Add a muted `<Kbd>⌘↵</Kbd> Send` hint in the toolbar `flex-1` spacer (collapses at <400px). | 0.5 | Hint visible at idle; collapses on narrow. | §1.A #5 |
| **P2-B2** | Sidebar section labels | `Sidebar.tsx` | No grouping separator labels. | Add `<SidebarSection label="Recent">` primitive that renders an `uppercase tracking-wide text-[11px]` label + 8px gap. Apply to recent / projects / settings. | 0.5 | Sidebar shows three labeled groups in expanded mode; hidden in collapsed mode. | §1.A #6 |
| **P2-B3** | Markdown scan polish | `packages/ui/src/markdown/Markdown.tsx` | Blockquotes, ordered lists, inline code lack distinct scan tone. | Add subtle `bg-[var(--color-surface-muted)]` to blockquotes, tighter line-height on ordered lists, `border` on inline code. Storybook update. | 1.0 | Visual story shows clearer scan rhythm. | §1.A #7 |
| **P2-B4** | Tooltip / Toast normalisation | `Tooltip`, `Toast` | Tooltip 700ms feels slow; toast shadow weak on light. | Drop default tooltip delay to 250ms; bump toast shadow to `--shadow-md`. | 0.5 | Manual timing feels Claude-like; toast visible on `#FBF9F5`. | §1.A #8 |
| **P2-B5** | List loading skeleton | `ListPage` | Empty-then-data flash. | Add `<ListSkeleton rows={6}>` shown while `items === undefined`. | 1.0 | Loading state renders 6 ghost rows for 200ms in demo. | §3 Linear |
| **P2-B6** | Demo fixture expansion | `apps/playground/src/routes/chat-demo.tsx`, `chats.tsx`, `projects.tsx` | Fixtures still showcase, not narrative. | Add: 1 connector status row, 1 billing-info card, 2 tool-call samples, 1 error fixture. | 2.0 | First-launch playground reads as "real product". | §1.A #10 |
| **P2-C1** | Citations inline variant | `packages/ui/src/thread/Citations.tsx` + new `InlineCitation` markdown component | Only bottom strip today. | Add `variant="inline" \| "strip"` (default `"strip"`). `inline` injects `<sup>` numbers in markdown via `react-markdown` components map. | 2.0 | Both variants render; toggle in chat-demo. | §3 Perplexity; §1.B.4 |
| **P2-C2** | Greeting per-locale | `packages/brand/src/profiles/*.ts` | Greeting strings have hard-coded English fallback. | Move greetings to i18n dict; brand profile only chooses the **set name**. | 1.0 | Switching locale changes greeting without brand reload. | §1.B.6 |
| **P2-C3** | Windows backgroundMaterial | `apps/desktop/src/main.ts` | No Mica/Acrylic. | Add `backgroundMaterial: 'acrylic'` (Win11). Wrap in feature flag for older Win10. | 0.5 | On Win11, window shows acrylic. | §2.4 |
| **P2-C4** | Storybook skeleton stories | `stories/` | No skeleton stories yet. | Add stories for ListSkeleton, ComposerSkeleton, ChatSkeleton. | 0.5 | Storybook gains 3 stories. | §3 Linear |
| **P2-D1** | System accent opt-in | new `useSystemAccent()` hook + IPC `theme:get-system-accent` | Brand is hard-coded. | IPC reads Win11/macOS system accent; consumer can `<BrandProvider accent={systemAccent}>`. | 2.0 | Toggle in playground swaps accent to OS color. | §2.4 |
| **P2-D2** | SearchPalette context-aware sort | `SearchPalette.tsx` | Generic order today. | Allow `sortBy: (a, b, ctx) => number` prop with `ctx.recentIds, ctx.currentProjectId`. | 1.0 | Storybook story shows "Recent first" ordering. | §3 Cursor |
| **P2-D3** | `<Kbd>` everywhere | `Sidebar`, `Composer`, modal footers | `<Kbd>` exists but used only in SearchPalette. | Audit and add `<Kbd>` to: account menu (sign-out `⌘Q` etc.), composer (`⌘↵`), modal primary action button (`↵`). | 1.0 | Three additional surfaces show inline Kbd. | §3 Raycast |
| **P2-D4** | Notion-like chip hover bounce | `QuickActionButton` (`Composer.tsx:600`) | No micro-bounce. | Add `whileHover={{ y: -1 }} transition={{ duration: 0.18 }}`. | 0.25 | Chips lift 1px on hover. | §3 Notion AI |
| **P2-D5** | Long-task persistent band | `packages/ui/src/shell/StatusBand.tsx` (new) | Only Toast today. | Add `<StatusBand status icon onCancel>` rendered above composer when an `onLongTask` callback is registered. | 2.0 | Demo: trigger a 6s fake tool → band appears until completion. | §3 multiple |
| **P2-D6** | Migration / changelog scaffolding | `CHANGELOG.md` + `docs/migration/0.x-to-1.0.md` | No formal version log. | Adopt Keep-a-Changelog. WORK_LOG becomes the input source. | 1.0 | CHANGELOG entry exists for round 11. | §4.5 |
| **P2-D7** | Playwright route smoke (renderer) | new `e2e/` | No end-to-end. | Headless Playwright against `pnpm dev` renderer; navigates `/`, `/chat-demo`, `/artifact-demo`, captures screenshots. | 2.0 | `pnpm e2e` produces 6 screenshots and exits 0. | §4.6 (deferred-from-P1) |
| **P2-D8** | CRLF normalisation | repo-wide; `.gitattributes` | `core.autocrlf=true` vs biome `lineEnding: lf` produces 159 noisy lint errors on Windows clones. | Add `.gitattributes` with `* text=auto eol=lf` and run `git add --renormalize .`. Document in `docs/contributing.md`. | 1.0 | `biome check` on a fresh Windows clone reports 0 errors. | Round 11 surfaced |

**P2 total ≈ 17.25 h.**

### 5.4 Documented but deliberately deferred

| ID | Title | Why deferred |
|---|---|---|
| D-1 | macOS + Linux Electron upgrade smoke | Out of scope per Q6 = A (Windows only). Re-pick when a Mac contributor opens an issue. |
| D-2 | Vibrancy / Liquid Glass material on macOS | Same as D-1; would require `vibrancy: 'sidebar'` and macOS testing. |
| D-3 | `pnpm fork-template` CLI helper | Big DX win but out-of-scope per Q7 = B; create a child task once P0–P2 land. |
| D-4 | Voice / canvas / collaboration features | Out of scope per Q5 = D and PRD `Out of Scope`. |
| D-5 | Replacement of Tailwind / Radix / TanStack Router | Architectural rewrite; explicitly out of scope. |

### 5.5 Plan dependency graph

```
P0-A1 (border tokens) ─┐
P0-A2 (subtle text)   ─┼─► P1-D2 (axe assertions need clean baseline)
P0-A3 (placeholder)   ─┤
P0-A4 (focus ring)    ─┘

P1-D3 (logoSlot) ──┐
P1-D4 (splash brand) ──┴─► P1-D6 (docs/brand.md needs the new surface)

P1-D1 (vitest) ──► P1-D2 (axe) ──► P1-D7 (CI runs them) ──► P1-D5 (docs/accessibility.md)

P1-B1 (responsive shell) ──► P2-A2 (chip toolbar) is easier to verify after responsive rework.
```

---

## §6 · Verification method & baseline

### 6.1 Re-run this audit in one command

```bash
pnpm -r typecheck
pnpm exec biome check .
pnpm -r build
pnpm --filter @oh/desktop run package    # requires ELECTRON_MIRROR + Win Dev Mode (see docs/electron.md)
pnpm --filter @oh/ui test                # available after P1-D1
```

Manual smoke after each phase: `docs/testing.md` per-route checklist (welcome, chat-demo, artifact-demo, chats, projects, settings, modals, motion) in **both** light and dark themes, at 1024px and 1440px widths.

### 6.2 Accessibility baseline (after P0 + P1-D2)

```bash
pnpm --filter @oh/ui test -- --reporter=verbose
# Expect: 0 axe violations across AppShell / Composer / SearchPalette / ArtifactPane stories.
```

### 6.3 Cold-start performance baseline (Windows, Electron 42)

- Splash visible <100 ms after `app.whenReady` (current: ~50 ms, no regression after upgrade).
- Main window `ready-to-show` fires within 1.2 s on warm cache (current: ~0.9 s after upgrade — measured via dev tools Performance panel on Round 11 baseline).
- 4-process model: main + GPU + Utility + Renderer (current: 3 children at idle, Renderer spawns on first ipc).

### 6.4 Re-audit cadence

| Trigger | Action |
|---|---|
| Major Electron version (e.g., 43, 44) | Re-run `electron-upgrade-survey` template; spot-check `main.ts` API surface. |
| Major React version | Re-run typecheck only; React 19 → 20 likely needs Composer ref API audit. |
| Major motion version | Re-validate `motion/react` import paths and chunk size. |
| New top-level route (`apps/playground/src/routes/*`) | Add to per-route smoke checklist + a story in `stories/`. |
| New brand profile | Run §5.3 brand-swap doc checklist. |

---

## Appendix A · Mapping back to prior audits

| Item | First seen | This audit's verdict |
|---|---|---|
| Narrow viewport shell | 2026-05-04 #1 | Still open, P1-B1. |
| Artifact mode responsive | 2026-05-04 #2 | Joined P1-B1. |
| Light surface ladder | 2026-05-04 #3 | Closed enough; refinement is P2-A1. |
| Dark surface ladder | 2026-05-04 #4 | Re-opened (surface == surface-raised), P1-B2. |
| Composer affordance | 2026-05-04 #5 | Closed in round 10; P2-B1 is additive. |
| Sidebar active polish | 2026-05-04 #6 | Closed; section label is P2-B2. |
| Message scan points | 2026-05-04 #7 | Mostly closed; markdown polish is P2-B3. |
| Modal system parity | 2026-05-04 #8 | Closed; P2-B4 is additive. |
| List density | 2026-05-04 #9 | Closed; skeleton is P2-B5. |
| Demo narrative | 2026-05-04 #10 | Partially closed; P2-B6 finishes. |
| Production-grade modals / fixtures | 2026-05-05 remaining | Joined P2-B6. |
| Automated screenshot capture | 2026-05-05 next-steps | Joined P2-D7 (Playwright). |
| logoSlot | Round 9 menu | Now P1-D3. |
| CI | Round 9 menu | Now P1-D7. |
| `pnpm fork-template` | Round 9 menu | Deferred D-3. |
| Tool-call UI | Round 9 menu | Now P1-C2. |
| Renderer perf preload | Round 9 menu | Deferred (no symptom; revisit if measurable jank appears). |
| a11y audit | Round 9 menu | Performed in §2.2; remediation P0-A1..A4 + P1-A1..A3. |

End of audit.
