# Testing

The scaffold ships **no automated test runner** — it's a UI surface, and
testing it well requires a human eye on layout, rhythm, and motion. The
repo instead leans on three things:

1. **TypeScript** strict mode in every package — catches API drift at edit
   time.
2. **Biome** lint — enforces formatting + a small set of correctness rules
   (no array index keys, no useless fragments, etc.).
3. **Manual smoke routes** in `apps/playground` that exercise every
   pattern.

```bash
pnpm -r typecheck            # 8 workspaces, ~30s
pnpm exec biome check .      # lint, ~1s
pnpm -r build                # full repo build, ~90s
```

## Smoke routes

`apps/playground/src/routes/` contains every demo route. Walk these in
order whenever you finish a substantive change:

| Route | What it exercises |
| --- | --- |
| `/` | Welcome stage, time-aware greeting, quick action chips, asterisk hover. |
| `/chat-demo` | MessageList, AssistantMessage actions, streaming replay, ThinkingTrace, SelectionToolbar, ArtifactCard → ArtifactPane wiring. |
| `/artifact-demo` | ArtifactPane drag-resize, preview/code tabs, persistence. |
| `/chats` | ListPage with multi-select bulk actions. |
| `/projects` | ListPage variant + filter + new-item primary action. |
| `/projects/:id` | ProjectDetail layout with right-rail Files/Instructions. |
| `/settings` | TwoPaneSettings, BrandSwitcher, theme & i18n controls. |
| `/modals` | Five modal templates + stacked welcome example. |
| `/tokens` | Live design-token tour (color, radius, shadow, motion). |
| `/motion` | Live preview of every motion variant + spring preset. |

## Per-route checklist

For each route:

- [ ] No console errors / warnings.
- [ ] Theme switch (sidebar account → "Theme · X") flips without flash.
- [ ] Locale switch (sidebar account → "Language · …") updates labels in
      Composer / Greeting / Search / ThreadDisclaimer.
- [ ] Brand switch (Settings → BrandSwitcher pills) flips accent + asterisk
      live.
- [ ] Sidebar collapse / expand animates without overlapping content.
- [ ] Cmd/Ctrl+K opens SearchPalette; arrows + Enter selects an item.
- [ ] Composer hover lifts shadow; focus draws accent halo + bottom rule.
- [ ] Modals open with spring + backdrop blur; Escape closes; stacked
      modals layer correctly.

## Streaming smoke

On `/chat-demo`, click **Replay streaming**:

- [ ] Pre-tokens: ThinkingTrace appears with pulsing brand dot, steps stream
      in one at a time, "Thinking…" label.
- [ ] After ~720ms thinking pause: trace collapses to "Thought for Ns" pill,
      typewriter begins.
- [ ] Caret blinks at the end of revealed content.
- [ ] After completion: trace remains collapsible (toggle disclosure to
      re-show steps).
- [ ] SelectionToolbar: select any text inside the thread → dark capsule
      pops up; Copy / Ask follow-up / Rewrite / Send to canvas all fire
      a toast.

## Electron smoke

```powershell
pnpm --filter @oh/desktop run package
Start-Process apps\desktop\release\win-unpacked\oh-my-open-ui.exe
```

- [ ] Splash window appears within ~50ms.
- [ ] Main window title `oh-my-open-ui — playground` paints, splash fades.
- [ ] Custom Win11 close / max / min react correctly; close button hovers red.
- [ ] System theme change (Settings → Personalization) updates the
      titlebar overlay color and the window background instantly.

## When to add a real test runner

If you start consuming this scaffold inside a product, add Vitest +
@testing-library/react in your **product repo**, not here. The scaffold
itself doesn't ship business logic worth unit-testing; what matters is that
the visual contract (props → DOM + data attributes) is stable, which TS
already enforces.
