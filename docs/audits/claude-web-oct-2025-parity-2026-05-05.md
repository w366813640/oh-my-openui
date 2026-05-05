# Claude Web Oct 2025 Parity Audit

Date: 2026-05-05
Reference set: `Reference/Screenshot_Claude web Oct 2025/`
Playground: `http://localhost:5173`

## Scope

This pass focused on visual parity with the Claude web / desktop-like reference
screenshots provided in the repo. The goal was not to copy brand assets, but to
match the calm surface hierarchy, warm palette, composer treatment, message
texture, and split-pane rhythm.

## Reference Samples

High-signal screenshots used during the pass:

| Reference | What it clarified |
| --- | --- |
| `Claude web Oct 2025 12.png` | New-chat canvas, expanded sidebar, composer, quick chips. |
| `Claude web Oct 2025 21.png` | Artifact split view and code tab toolbar. |
| `Claude web Oct 2025 22.png` | Chat + artifact split with user bubble and sticky composer. |
| `Claude web Oct 2025 83.png` | Incognito / dark chrome split view. |
| `Claude web Oct 2025 97.png` | Chats list density and row selection. |
| `Claude web Oct 2025 149.png` | Settings layout and two-pane navigation. |
| `Claude web Oct 2025 157.png` | Dark theme base ramp. |

## Extracted Color Anchors

| Role | Value | Notes |
| --- | --- | --- |
| Main canvas | `#FBF9F5` | Dominant app background in light mode. |
| Expanded sidebar / selected fill | `#F5F4ED` / `#EFEEE6` | Quiet warm neutral, close to the canvas. |
| User bubble | `#EFEEE5` | No visible hard border in the reference. |
| Raised surfaces | `#FFFFFF` | Composer, cards, popovers, settings panels. |
| Brand accent | `#C96442` | Plus button, asterisk, selected rail accents. |
| Send tint | `#E4B0A0` | Softer peach than the brand accent. |
| Dark canvas | `#252623` | Reference-like warm dark neutral. |
| Dark raised surface | `#30302E` | Composer/cards in dark mode. |

## Implemented Changes

- Re-aligned light and dark color tokens in `packages/tokens/src/css/colors.css`.
- Mirrored the palette in `packages/tokens/src/tokens.ts`.
- Added Tailwind theme bindings for `--color-accent-send*`.
- Updated Aurora and Claude-study brand palettes to the same terracotta ramp.
- Changed the collapsed shell rail from 48px to 60px and made it blend with the
  main canvas.
- Tuned the composer to use a white 18px-radius command surface and peach send
  button.
- Removed the visible border from user bubbles and matched the warm grey fill.
- Switched assistant message body rendering to serif copy at 16px / 25px.
- Increased welcome vertical offset and bottom thread padding so the composer
  no longer crowds the content.
- Synchronized BrowserWindow, Win11 titlebar overlay, splash, and pre-React
  document background color so cold start uses the same reference anchors.

## Verification Artifacts

Generated screenshots:

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

Checks run:

```bash
pnpm --filter @oh/ui typecheck
pnpm --filter @oh/playground typecheck
pnpm --filter @oh/desktop typecheck
```

Both completed successfully.

## Remaining Gaps

- The demo still uses Aurora's safe asterisk glyph rather than Claude's exact
  mark. This is intentional for brand/IP hygiene.
- Claude's production copy, billing forms, connector lists, and menus include
  more real data density than the playground fixtures.
- Some modals and list pages still read as scaffold examples rather than a
  fully populated app.
- The artifact preview content is project-specific demo content; only the shell
  and toolbar treatment were targeted for parity.

## Next Polish Options

- Expand fixtures for chats, projects, settings, connector states, billing
  states, and modal variants.
- Add an automated screenshot capture script so `.codex-review/final-*` can be
  regenerated with one command.
- Add a visual QA matrix for 1280px desktop, wide desktop, 390px mobile, light,
  and dark.
