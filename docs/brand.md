# Brand authoring

The scaffold's visual signature lives in design tokens; the brand layer is a
**thin overlay** that swaps four CSS variables and (optionally) the logo, the
font stack, and the greeting templates. Everything else cascades.

> This is the file you will spend the most time in when forking the scaffold
> for a new product.

## Built-in brands

| Brand | Palette | Used for |
| --- | --- | --- |
| `auroraBrand` | Claude-aligned terracotta `#C96442` | The default; shipped in playground & Storybook. |
| `claudeTributeBrand` | same terracotta ramp `#C96442` | Local-only study brand to compare against reference screenshots. **Never ship publicly.** |
| `sageBrand` | sage green `#5E8B6A` | Proves the layer works on non-warm palettes. |
| `indigoBrand` | slate indigo `#5A6FC4` | Developer-tool mood. |

Import any of them from `@oh/brand`:

```ts
import {
  auroraBrand,
  sageBrand,
  indigoBrand,
  claudeTributeBrand,
  builtInBrands,
} from '@oh/brand';
```

## Authoring a new brand

```ts
// myBrand.ts
import type { BrandTheme } from '@oh/brand';
import { MyLogo } from './MyLogo';

export const myBrand: BrandTheme = {
  name: 'Atlas',
  logo: <MyLogo size={24} />,
  logoCompact: <MyLogo size={18} />,
  palette: {
    accent: '#3F5E7A',
    accentHover: '#324A60',
    accentSoft: '#DCE5EE',
    asterisk: '#4F6F8B',
  },
  fonts: {
    // Optional — only override what you actually want.
    serif: '"Source Serif 4 Variable", "Iowan Old Style", serif',
  },
  composerPlaceholder: 'What can Atlas explore for you?',
  disclaimer: 'Atlas may misjudge. Verify before publishing.',
  greetings: {
    morning: ['Atlas online, {name}', 'Morning, {name}'],
    evening: ['Evening, {name}', 'Welcome back, {name}'],
    returning: ['{name} returns to base'],
  },
};
```

Wrap your app:

```tsx
import { BrandProvider } from '@oh/brand';

function Root() {
  return (
    <BrandProvider brand={myBrand}>
      <App />
    </BrandProvider>
  );
}
```

That's it. The accent button, asterisk mark, focus ring, selection highlight,
and time-aware greeting will all switch at once.

The composer send button is intentionally not brand-driven by default. It uses
`--color-accent-send` / `--color-accent-send-hover`, a softer peach tint that
matches the Claude reference screenshots. Override those only when a product
brand needs its own send affordance.

### What `BrandProvider` actually does

It writes a small set of CSS variables on a wrapping `<div className="contents">`:

```
--color-accent       (palette.accent)
--color-accent-hover (palette.accentHover)
--color-accent-soft  (palette.accentSoft)
--color-asterisk     (palette.asterisk)
--font-serif         (fonts.serif?)
--font-sans          (fonts.sans?)
--font-mono          (fonts.mono?)
```

Anything not provided falls back to the active **theme** token (`light` or
`dark`), which is why a brand definition can be `{ name, logo }` and still
look complete.

The wrapper also defines a 320ms `background-color` / `color` transition so
runtime brand swaps feel intentional, not abrupt.

It does not currently write `--color-accent-send`; that token belongs to the
theme layer because Claude's send control is visibly softer than the primary
terracotta brand mark.

## Greeting dictionary

`brand.greetings` are time-bucketed templates. Each template can use the
`{name}` placeholder. The `<TimeAwareGreeting>` component picks one of the
following buckets:

| Bucket | Local hour |
| --- | --- |
| `morning` | 04:00 – 11:59 |
| `afternoon` | 12:00 – 17:59 |
| `evening` | 18:00 – 22:59 |
| `night` | 23:00 – 03:59 |
| `returning` | Any bucket if `lastSeen` is more than 24 hours ago. |

If you don't supply `greetings`, the built-in i18n dictionary takes over (still
uses `{name}` interpolation, still localizes by `<I18nProvider>`).

## Demo brand switcher

`<BrandSwitcher>` is shipped purely for the playground and Settings demo. It
uses `<BrandSwitcherProvider>` to maintain `currentBrand` in state and renders
a horizontal pill row that calls `setCurrentBrand(brand)`.

You don't need it in production — just hand a single brand to `BrandProvider`
on app mount.

## Authoring a logo

The default Aurora glyph is an eight-rayed asterisk built procedurally
(`packages/brand/src/AuroraLogo.tsx`). For your own brand you can:

1. Drop in any React component that returns an `<svg>` — the Provider doesn't
   care about its internals.
2. Re-use `<BrandMark size={N} motion={…} />` from `@oh/ui` if you only want
   to recolor the asterisk via `--color-asterisk`.
3. Use a raster image — wrap it in a small React component so size/contrast
   stay under your control.

Provide both `logo` (24px target) and `logoCompact` (18px target). The narrow
icon rail uses the compact one.

### Automatic glyph pickup in `BrandMark`

As of round 11, `<BrandMark>` from `@oh/ui` consumes the active brand glyph
automatically when wrapped in `<BrandProvider>`:

```tsx
<BrandProvider brand={myBrand}>
  <BrandMark size={22} />     // uses myBrand.logo
  <BrandMark size={18} />     // uses myBrand.logoCompact (size ≤ 20)
  <BrandMark size={22} glyph={<CustomMark />} />  // explicit override
</BrandProvider>
```

Behind the scenes `BrandProvider` mirrors `{logo, logoCompact}` onto
`window.__ohBrand`, and `BrandMark` reads it via a tiny `useBrandGlyph`
helper. There is **no import dependency** from `@oh/ui` on `@oh/brand`,
so the component library remains brand-agnostic. Outside a provider (in
Storybook or tests) `BrandMark` falls back to the built-in eight-rayed
asterisk.

## Desktop chrome (splash + Win11 titlebar)

The Electron main process cannot read React contexts, so its brand
palette ships as a small JSON file at `apps/desktop/brand.config.json`:

```json
{
  "splash": {
    "background": "#fbf9f5",
    "foreground": "#252623",
    "accent": "#c96442",
    "backgroundDark": "#252623",
    "foregroundDark": "#f3f0e8",
    "accentDark": "#d97757"
  },
  "titlebar": {
    "lightBg": "#fbf9f5",
    "lightSymbol": "#262522",
    "darkBg": "#252623",
    "darkSymbol": "#f3f0e8"
  }
}
```

Fields are all optional — missing entries inherit the Claude reference
defaults defined in `apps/desktop/src/brand.ts` (`DEFAULT_DESKTOP_BRAND`).
`electron-builder.yml` lists this file under `files:` so it ships inside
the packaged app (`asar`).

Forking checklist (≤ 30 min for a new brand):

1. Define your `BrandTheme` in `packages/brand/src/profiles/<myBrand>.ts`
   with `logo`, `logoCompact`, `palette`, and (optionally) `fonts`,
   `composerPlaceholder`, `disclaimer`, `greetings`.
2. Wrap the renderer entry with `<BrandProvider brand={myBrand}>`. All
   `<BrandMark>` instances pick up the glyph automatically.
3. Copy your brand colors into `apps/desktop/brand.config.json` so the
   splash and Win11 titlebar overlay match.
4. (Optional) Add the new brand to `BrandSwitcher` for the playground
   Settings demo.

## Brand notice

The `claude-tribute` brand exists for **local visual study**, intentionally
side-by-side with reference screenshots. Don't ship it publicly. Authoring
your own brand and shipping under `@oh/ui`'s neutral aesthetic is the
intended path.
