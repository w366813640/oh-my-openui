# Foundation — Design tokens

All visual atoms live in `@oh/tokens` as **CSS Variables**. No Tailwind class
hard-codes a hex; everything resolves through `var(--token)` so a brand swap
or theme switch is a single attribute change on `<html>`.

> Tokens are defined in `packages/tokens/src/css/*.css` and re-exported as
> Tailwind utilities through `packages/tokens/src/tailwind.preset.ts`. Consumer
> apps register them with `@theme inline { … }` in `packages/ui/src/styles.css`.

## Color

The palette is **warm, knowledge-tool, low-saturation**. Light is the default;
dark steps up about one hue tick warmer at every surface depth so it never
goes muddy.

### Semantic surfaces (light → dark)

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--color-bg` | `#F7F3EA` | `#1D1B17` | Page background. |
| `--color-surface` | `#FFFAF2` | `#25231F` | Cards, sidebar body. |
| `--color-surface-muted` | `#EFE8DC` | `#2E2B25` | Hover states, secondary chips. |
| `--color-surface-raised` | `#FFFFFF` | `#36332C` | Composer, modal, popovers. |
| `--color-surface-sunken` | `#EBE3D5` | `#161412` | Code wells, sidebar bottom. |

### Text

| Token | Light | Dark | Contrast vs `bg` |
| --- | --- | --- | --- |
| `--color-text` | `#2B2926` | `#F1ECE2` | 13.7:1 / 14.2:1 |
| `--color-text-muted` | `#7B746B` | `#B8AF9F` | 5.0:1 / 6.7:1 |
| `--color-text-subtle` | `#A8A096` | `#877E70` | 3.4:1 / 4.3:1 |

### Brand accent (warm terracotta)

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `--color-accent` | `#C96F4A` | `#DB8460` | Send button, active rail, brand asterisk. |
| `--color-accent-hover` | `#B85F3D` | `#E9946F` | Hover overlay only. |
| `--color-accent-soft` | `#F7E7D9` | `#3F2C22` | Tinted surfaces (Research chip on, selection). |
| `--color-ring` | `rgba(201,111,74,0.45)` | `rgba(219,132,96,0.55)` | Focus halos. |

### Status

`--color-destructive` `#D14343 / #E16868` · `--color-success` `#3F9871 / #5BAE85`
`--color-warning` `#C8862A / #D49A45` · `--color-info` `#5577B8 / #7C9AD9`

> When you author a brand replacement, override **only** `--color-accent*` and
> `--color-asterisk`. Keep the surface ramp; that's the visual signature.

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

Body copy is `text-md` on assistant messages, `text-base` everywhere else.
Headings escalate one step at a time — never skip.

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

`@oh/tokens` also exports a `tokens` object so build-time logic (e.g. canvas
thumbnails, syntax-highlighter color resolution) can read the same source of
truth without re-parsing CSS.

```ts
import { tokens } from '@oh/tokens';

tokens.color.accent.light // "#c96f4a"
tokens.radius.xl          // 18
```
