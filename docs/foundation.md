# Foundation — Design tokens

All visual atoms live in `@oh/tokens` as **CSS Variables**. No Tailwind class
hard-codes a hex; everything resolves through `var(--token)` so a brand swap
or theme switch is a single attribute change on `<html>`.

> Tokens are defined in `packages/tokens/src/css/*.css` and re-exported as
> Tailwind utilities through `packages/tokens/src/tailwind.preset.ts`. Consumer
> apps register them with `@theme inline { … }` in `packages/ui/src/styles.css`.

## Color

The palette is **Claude-web-reference aligned, warm, low-saturation, and quiet**.
Light mode is the primary target for parity work. Dark mode keeps the same
terracotta identity but uses a compact neutral ramp so the app feels like a
native dim workspace rather than a blue-black developer theme.

The current reference set is:

```
Reference/Screenshot_Claude web Oct 2025/
```

The dominant light samples are `#FBF9F5` for the canvas, `#F5F4ED` for the
rail/sidebar layer, `#EFEEE5` for the user bubble, `#FFFFFF` for raised
surfaces, `#C96442` for the brand accent, and `#E4B0A0` for the send control.

### Semantic surfaces (light → dark)

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--color-bg` | `#FBF9F5` | `#252623` | Page background and collapsed icon rail. |
| `--color-surface` | `#FFFFFF` | `#30302E` | Cards, modal bodies, artifact toolbar. |
| `--color-surface-muted` | `#EFEEE6` | `#383834` | Selected rows, hover fills, secondary chips. |
| `--color-surface-raised` | `#FFFFFF` | `#30302E` | Composer, popovers, code blocks. |
| `--color-surface-sunken` | `#F5F4ED` | `#1C1C1A` | Expanded sidebar, deep wells. |

### Text

| Token | Light | Dark | Contrast vs `bg` |
| --- | --- | --- | --- |
| `--color-text` | `#262522` | `#F3F0E8` | Primary copy. |
| `--color-text-muted` | `#6F6A62` | `#C5BFB4` | Labels, toolbar text, metadata. |
| `--color-text-subtle` | `#918C83` | `#9A948A` | Section labels, disabled copy, hints. |

### Brand accent and send tint

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `--color-accent` | `#C96442` | `#D97757` | Brand asterisk, primary nav accent, selected artifact icon. |
| `--color-accent-hover` | `#B85A3A` | `#E08A6D` | Hover overlay only. |
| `--color-accent-soft` | `#F3DFD3` | `#46322A` | Research chip active, plan badge, subtle accent fills. |
| `--color-accent-send` | `#E4B0A0` | `#DCA08F` | Composer send button. Kept separate from the brand accent to match Claude's softer peach send affordance. |
| `--color-accent-send-hover` | `#DDA08E` | `#E3AE9E` | Send button hover. |
| `--color-ring` | `rgba(201,100,66,0.42)` | `rgba(217,119,87,0.58)` | Focus halos. |

### Status

`--color-destructive` `#C93F3F / #E16868` · `--color-success` `#2F8A68 / #5BAE85`
`--color-warning` `#B97922 / #D49A45` · `--color-info` `#4C70B7 / #86A2DF`

> When you author a brand replacement, override **only** `--color-accent*` and
> `--color-asterisk` unless you are intentionally replacing the full visual
> language. Keep the surface ramp; that is the Claude-like visual signature.

### User bubble and rail

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--color-user-bg` | `#EFEEE5` | `#30302E` | User message bubble. |
| `--color-user` | `#262522` | `#F3EFE7` | Text inside the user bubble. |
| `--color-asterisk` | `#D97757` | `#D97757` | Brand glyph and streaming cursor accent. |

## Typography

Three font families, all variable, all bundled via Fontsource (no CDN runtime
dependency):

| Token | Stack | Used for |
| --- | --- | --- |
| `--font-serif` | Source Serif 4 → Tiempos → Iowan → Georgia | Greetings, hero titles, page headings. |
| `--font-sans` | Inter → system-ui → Segoe UI → Helvetica | Body, UI, controls. |
| `--font-mono` | JetBrains Mono → Fira → SF Mono | Code blocks, kbd, inline mono. |

### Scale

| Token | Size | Line height |
| --- | --- | --- |
| `text-2xs` | 11 | 14 |
| `text-xs` | 12 | 16 |
| `text-sm` | 13 | 18 |
| `text-base` | 14 | 21 |
| `text-md` | 15 | 23 |
| `text-lg` | 17 | 26 |
| `text-xl` | 20 | 28 |
| `text-2xl` | 24 | 32 |
| `text-3xl` | 30 | 38 |
| `text-4xl` | 38 | 46 |

Assistant messages intentionally use the serif family at 16px / 25px to match
the reference reading texture. UI controls, user bubbles, navigation, and
settings remain sans. Headings escalate one step at a time; do not use display
scale inside compact panels.

## Radius

```
--radius-xs   6px   chips, tags
--radius-sm   8px   buttons, inputs
--radius-md  10px   icon buttons, segmented controls
--radius-lg  14px   cards
--radius-xl  18px   composer, hero panels
--radius-2xl 24px   modals, sheets
--radius-full 9999  pills, switch thumbs, asterisk
```

Pick by **mass**, not by hierarchy. A 36px button takes `sm`, a 56px composer
takes `xl`, a 76px modal corner takes `2xl`.

## Shadow

Shadows are **layered into three tiers** per surface:

1. *Hairline* — 1px contact line that grounds the shape.
2. *Mid-air* — 8–12px ambient glow, –8/–12 spread.
3. *Far-throw* — 24–36px tail, –12/–16 spread.

The composer adds a fourth `accent halo` ring on focus.

```css
--shadow-card:           hairline + mid-air
--shadow-popover:        hairline + mid-air + far-throw
--shadow-composer:       hairline + mid-air + far-throw  (warm umber)
--shadow-composer-focus: ring + halo + composer stack    (brand accent)
--shadow-modal:          hairline + far-throw + extra-far
```

In dark mode every layer's alpha is doubled because the surfaces underneath
are darker — without that bump the lift reads as flat.

## Motion

```
duration-instant  60ms    micro-affordance (ripple, kbd press)
duration-fast    120ms    color/opacity transitions
duration-base    180ms    button hover, tooltip
duration-medium  240ms    modal, popover, sidebar collapse
duration-slow    320ms    pane slide-in, overlay backdrop
duration-slower  480ms    welcome stage cross-fade
```

Easings (Bezier):

| Token | Curve | Use |
| --- | --- | --- |
| `ease-standard` | (0.2, 0, 0, 1) | Most enter/leave. |
| `ease-emphasized` | (0.3, 0, 0, 1) | Larger surfaces (modals, panes). |
| `ease-decelerate` | (0, 0, 0.2, 1) | Accelerating in (rare; mostly for entrances after a delay). |
| `ease-accelerate` | (0.4, 0, 1, 1) | Exits when something is leaving the screen entirely. |
| `ease-spring` | (0.34, 1.56, 0.64, 1) | Subtle overshoot — used by `pop-in`, `menu-in`, `tooltip-in`. |

Spring presets in `@oh/motion`:

```ts
springs.gentle  = { stiffness: 220, damping: 28, mass: 0.9 }
springs.snappy  = { stiffness: 320, damping: 26, mass: 0.6 }
springs.bouncy  = { stiffness: 400, damping: 22, mass: 0.6 }
```

`prefers-reduced-motion` zeroes all durations at the CSS-variable level, so
**every** animated transition that consumes `var(--duration-*)` becomes
instant without per-component branches.

## Tokens in TypeScript

`@oh/tokens` also exports a `tokens` object so build-time logic can read the
same source of truth without re-parsing CSS.

```ts
import { tokens } from '@oh/tokens';

tokens.colors.light.accent // "#C96442"
tokens.colors.light.bg     // "#FBF9F5"
tokens.radius.xl           // "18px"
```
