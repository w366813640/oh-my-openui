# Brand authoring

The scaffold's visual signature lives in design tokens; the brand layer is a
**thin overlay** that swaps four CSS variables and (optionally) the logo, the
font stack, and the greeting templates. Everything else cascades.

> This is the file you will spend the most time in when forking the scaffold
> for a new product.

## Built-in brands

| Brand | Palette | Used for |
| --- | --- | --- |
| `auroraBrand` | warm terracotta `#C96F4A` | The default; shipped in playground & Storybook. |
| `claudeTributeBrand` | warm rust `#CC785C` | Local-only study brand to compare against reference screenshots. **Never ship publicly.** |
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

That's it. The accent button, asterisk mark, send button glow, focus ring,
selection highlight, and time-aware greeting will all switch at once.

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

## Brand notice

The `claude-tribute` brand exists for **local visual study**, intentionally
side-by-side with reference screenshots. Don't ship it publicly. Authoring
your own brand and shipping under `@oh/ui`'s neutral aesthetic is the
intended path.
