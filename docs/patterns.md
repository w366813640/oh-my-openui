# Patterns

`@oh/ui` ships nine families of components. The fastest way to see them is
Storybook (`pnpm storybook`); this document is the conceptual map.

## 1. Primitives — `@oh/ui/primitives`

Atoms wrapped over Radix:

| Component | Variants / sizes | Notes |
| --- | --- | --- |
| `Button` | `primary`, `accent`, `ghost`, `outline`, `destructive` × `sm`, `md`, `lg` | Loading state swaps icon for spinning Asterisk. |
| `IconButton` | `sm`, `md`, `lg` × `ghost` (default) / `solid` | Always tooltipped via `<Tooltipped>`. |
| `Input` / `Textarea` | one variant | Bottom-only 1px accent rule on focus. |
| `Tooltip` | top/right/bottom/left | 120ms delay, custom enter/leave keyframes. |
| `DropdownMenu` / `ContextMenu` | check, sub-menu, shortcut hint | Shared `menu-in` / `menu-out` keyframes. |
| `Tabs` | `underline`, `pill` | Pill is used by ArtifactPane preview/code. |
| `Switch` | one variant | Spring on the thumb position. |
| `Avatar` | `xs` … `xl` + status pip | Initials fallback with deterministic hue. |
| `Badge` / `Chip` | `neutral`, `accent-soft`, `info`, `success`, `warning`, `destructive` | |
| `ScrollArea` | one variant | Sets up the three-stage scrollbar. |
| `Toast` | `default`, `success`, `error` | `useToast()` hook. |
| `Kbd` | one variant | Mono caps with raised-key shadow. |
| `BrandMark` | sizes 14/18/24/36 + `motion: 'hover' \| 'thinking' \| 'streaming'` | The asterisk at the heart of every page. |

## 2. Composer — `@oh/ui/composer`

The Composer **is** the product. Single component, many slots:

```
┌────────────────────────────────────────────────────┐
│ ↳  textarea (1–8 rows, paste-image, drag-files)    │
│                                                    │
│ ┌─ left ──────────────┐    ┌─ right ─────────────┐│
│ │ + menu              │    │  Sonnet 4 ▾  ●send  ││
│ │ • parameters        │    │                      ││
│ │ • Research toggle   │    │                      ││
│ │ • project chip      │    │                      ││
│ └─────────────────────┘    └──────────────────────┘│
└────────────────────────────────────────────────────┘
   [ Write ]  [ Learn ]  [ Code ]  [ From Calendar ]
```

States: `idle`, `focused`, `hasContent`, `sending` (asterisk spins),
`disabled`. All driven by `props.status`, no internal state machine.

Quick action chips are a sibling component (`<QuickActionChips />`) so you can
hide them on dense pages.

```tsx
<Composer
  placeholder="Reply to assistant..."
  models={[{ id: 'sonnet-4', label: 'Sonnet 4', description: 'balanced' }]}
  toggles={[{ id: 'research', label: 'Research' }]}
  attachments={[{ id: '1', name: 'design.png', thumbUrl: '/p.png' }]}
  onSubmit={(p) => console.log(p)}
/>
```

## 3. Thread — `@oh/ui/thread`

Container = `<MessageList messages={…}>`. It dispatches each `Message` to:

| Component | Renders |
| --- | --- |
| `<UserMessage>` | Right-side bubble (warm-grey), attachment chips above, initials avatar. |
| `<AssistantMessage>` | No bubble — full bleed text + brand-mark line + reveal-on-hover actions row (Copy / Up / Down / Retry ▾). |
| `<ArtifactCard>` | Inline preview block inside an assistant message; `onOpen` opens the right pane. |
| `<ThinkingTrace>` | Collapsible "Thought for Ns" / pulsing "Thinking…" disclosure rendered above the body. |
| `<MessageActions>` | The reveal-on-hover row (used by AssistantMessage internally). |
| `<ThreadDisclaimer>` | Small grey footer line. |
| `<SelectionToolbar>` | Floating dark capsule that appears when text is selected inside a `scopeRef`. |

### Streaming flow (no LLM required)

1. Mark a message `streaming: true` and (optionally) attach
   `thinking: { active: true, steps: [], defaultOpen: true }`.
2. `<StreamingShimmer />` + spinning brand-mark render until you push tokens
   into `content`.
3. Update `thinking.steps` to make the trace stream alongside.
4. When done, set `streaming: false` and `thinking.active: false` plus a
   `durationMs` so the trace collapses into "Thought for Ns".

The `/chat-demo` route does exactly this with a token replay button.

## 4. Shell — `@oh/ui/shell`

| Component | Job |
| --- | --- |
| `<AppShell>` | CSS Grid `[sidebar] [main] [artifact?]`, hosts the titlebar. |
| `<TitleBarControls>` | Custom Win11 close / max / min, with hover-red close. |
| `<Sidebar>` (+ `SidebarHeader`, `SidebarBody`, `SidebarFooter`, `SidebarBrand`, `SidebarPrimaryAction`, `SidebarNavItem`, `SidebarLinkItem`, `SidebarSectionLabel`) | Two-state (48px ↔ 240px) with Framer Motion `layout`. |
| `<SidebarAccount>` | Bottom-of-sidebar account menu (settings, theme, language, sign out). |
| `<SearchPalette>` | ⌘K command palette, fuzzy search + grouped items. |
| `<ArtifactPane>` | Right-side slide-in pane with drag-resize handle, persistence, preview/code tabs. `useArtifactPane()` is a tiny hook for parents that own its open state. |

## 5. Layouts — `@oh/ui/layouts`

Page templates, **not** wrappers around content. They expose slots; you bring
the children.

| Layout | Slots | Used by |
| --- | --- | --- |
| `<MainArea>` | `topbar`, children | Every chat / project / settings page. |
| `<TwoPaneSettings>` (+ `SettingsRow`) | left nav list, right card body | `/settings`. |
| `<ProjectDetailLayout>` | header, instructions, files, history | `/projects/:id`. |
| `<ListPage>` (+ `ListPageItem`) | search, multi-select bulk-action bar, item list | `/projects`, `/chats`. |

## 6. Modals — `@oh/ui/modals`

Five templates over Radix Dialog. Use the right one for the right shape.

| Template | Width | Pattern |
| --- | --- | --- |
| `<AlertModal>` | sm 400 | Title + 1–2 lines of copy + cancel/destructive buttons. |
| `<FormDialog>` | md 520 | Title + form fields + submit/cancel; `onSubmit(formData)` returns false to keep open. |
| `<InfoDialog>` | md 520 | Title + body + single dismiss action. |
| `<PickerDialog>` | lg 760 | Title + tabs + search + grid; e.g. Connectors picker. |
| `<CelebrationOverlay>` | center | Illustration + headline + CTA; e.g. "Welcome to Pro". |

`<ModalStackProvider>` lets you open one modal on top of another (Welcome
opens Terms over itself). Stack order = mount order.

## 7. Welcome — `@oh/ui/welcome`

| Component | Purpose |
| --- | --- |
| `<WelcomeStage>` | Centers a stack of children (asterisk + greeting + composer + chips). Cross-fades on layout-id changes. |
| `<TimeAwareGreeting>` | Greets the user based on local time, pulled from the active brand's `greetingDictionary`. Supports `recency: 'new' \| 'returning' \| 'longabsent'`. |

## 8. i18n — `@oh/ui/i18n`

`<I18nProvider locale="en">` + `useI18n()` + `useT()`. Built-in dictionaries
(`en`, `zh`) cover Sidebar, Composer, SearchPalette, Greeting, Settings labels.
Pass a `dictionary` prop on the provider to fully override.

```tsx
const { t, locale, setLocale } = useI18n();
t('search') // "Search" / "搜索"
```

## 9. Theme — `@oh/ui/theme`

`<ThemeProvider defaultMode="system">` + `useTheme()`. Persisted under
`localStorage["oh-ui-theme"]`, mirrored to `document.documentElement.dataset.theme`,
syncs to `nativeTheme` over the IPC bridge inside Electron.

```tsx
const { mode, resolved, setMode } = useTheme();
// mode: 'light' | 'dark' | 'system'
// resolved: 'light' | 'dark'
```
