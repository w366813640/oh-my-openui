# Desktop runtime

`apps/desktop` is a small Electron 42 host that loads `apps/playground` as
its renderer. The desktop layer **owns no UI** beyond the Win11 titlebar
overlay and a startup splash; everything visible inside the window is React.

> **Runtime versions** — Electron `42.1.0` (Chromium 136 / Node 22.x),
> `electron-builder@26.8.1`, `electron-updater@6.8.3`. Upgraded from Electron
> 33 on 2026-05-17; see `docs/audits/2026-05-17-comprehensive-review.md` for
> migration notes. macOS 11 is no longer supported (Electron 38+ requirement).

## Process layout

```
┌─────────────────── main process ────────────────────┐
│ apps/desktop/src/main.ts                            │
│ ├── splash window  (apps/desktop/src/splash.ts)     │
│ ├── main window    (BrowserWindow with overlay)     │
│ ├── ipcMain channel: window:* / theme:*             │
│ └── auto-updater hook (apps/desktop/src/updater.ts) │
└─────────────────────────────────────────────────────┘
        │ IPC (contextIsolated, sandbox: true)
┌─────────────────── preload ─────────────────────────┐
│ apps/desktop/src/preload.ts                         │
│ exposes window.bridge.* — see below                 │
└─────────────────────────────────────────────────────┘
        │
┌─────────────────── renderer ────────────────────────┐
│ apps/playground (React 19 + Vite 6)                 │
│ <TitleBarControls /> calls window.bridge.window.*   │
│ <ThemeProvider /> reads native theme on boot        │
└─────────────────────────────────────────────────────┘
```

## Boot sequence

1. `app.whenReady()` fires.
2. `showSplash()` mounts a frameless 360×240 window with an inline data: URL —
   no preload bundle, no module to parse, paints in ~50ms.
3. `createWindow()` creates the main BrowserWindow **hidden**.
4. The main window waits for *both* `ready-to-show` and `did-finish-load`,
   then `.show()`s itself and tells the splash to fade out (160ms).
5. A 5s hard fallback exists so a hanging renderer can never strand the user
   behind a splash.

The splash uses brand tokens (`#FBF9F5` / `#252623`, `#C96442` / `#D97757`)
read directly from `nativeTheme.shouldUseDarkColors`, so dark-mode users see
a dark splash without any flash.

## Custom Win11 titlebar

```ts
new BrowserWindow({
  titleBarStyle: 'hidden',
  titleBarOverlay: {
    color: '#FBF9F5',         // light bg
    symbolColor: '#262522',    // light icons
    height: 36,
  },
  // …
});
```

The renderer mounts `<TitleBarControls />` from `@oh/ui/shell`. It places
custom min / max / close buttons at the right edge with hover-red close,
plus an `app-drag` region above the sidebar so the window stays draggable.
Both regions use `-webkit-app-region: drag` / `no-drag`.

When the system theme flips, the main process re-applies the overlay via
`mainWindow.setTitleBarOverlay({ … })` and pushes `theme:system-changed`
to the renderer over IPC.

## IPC bridge

`preload.ts` exposes a minimal, typed bridge:

```ts
window.bridge = {
  window: {
    minimize(): Promise<void>;
    toggleMaximize(): Promise<void>;
    close(): Promise<void>;
    isMaximized(): Promise<boolean>;
  },
  theme: {
    getSystem(): Promise<'light' | 'dark'>;
    set(mode: 'light' | 'dark' | 'system'): Promise<void>;
    onSystemChanged(cb: (m: 'light' | 'dark') => void): () => void;
  },
};
```

Everything else (auth, network, file system) you add yourself — the scaffold
intentionally ships nothing.

`contextIsolation: true`, `sandbox: true`, `nodeIntegration: false` — no
direct Node access from the renderer, only the bridge.

## Renderer prefetch

`apps/playground/index.html` runs a single `<script>` block in the document
head **before** the React bundle parses:

```html
<script>
  // Read saved theme synchronously so the first paint already has the
  // right surface color. Eliminates the white flash between the splash
  // closing and the React shell mounting.
  var stored = localStorage.getItem('oh-ui-theme');
  …
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.style.background = resolved === 'dark' ? '#252623' : '#FBF9F5';
</script>
```

That single block is the difference between a "professional polish" cold start
and a perceptibly cheap one.

## Auto-updater (optional)

`apps/desktop/src/updater.ts` registers electron-updater **only if** the
build was packaged (`!app.isPackaged === false`) and a `publish` channel is
configured in `electron-builder.yml`. The default repo ships no publish
channel, so this is a no-op. Wire it up by setting `publish:` to your own
GitHub Releases / S3 bucket and shipping signed releases.

## Packaging

```bash
pnpm --filter @oh/desktop run package
```

Runs:

1. `vite build` for `apps/playground` → emitted to `dist/`.
2. `tsc -p tsconfig.main.json` for the main process → `dist/main/{main,preload,splash,updater}.js`.
3. `electron-builder --win nsis` reads `electron-builder.yml`, copies the
   renderer + main bundle into `release/win-unpacked/`, and produces:
   - `release/oh-my-open-ui-Setup-0.1.0-x64.exe` (~84 MB NSIS installer).
   - `release/win-unpacked/oh-my-open-ui.exe` (~216 MB unpacked binary on
     Electron 42, runs without install).

### China-network mirrors

If `github.com` is unreachable, point the binary downloader at an Aliyun
mirror **before** running `package` — both Electron itself and the
`electron-builder` auxiliary binaries (winCodeSign, NSIS) honour env vars:

```powershell
$env:ELECTRON_MIRROR='https://npmmirror.com/mirrors/electron/'
$env:ELECTRON_BUILDER_BINARIES_MIRROR='https://npmmirror.com/mirrors/electron-builder-binaries/'
pnpm --filter @oh/desktop run package
```

### Windows non-admin caveat

`winCodeSign-2.6.0.7z` contains symlinks for the bundled darwin OpenSSL libs.
On Windows without **Developer Mode** (Settings → Privacy → For developers →
Developer Mode) or admin rights, 7-Zip cannot create those symlinks and the
NSIS installer step fails — `release/win-unpacked/oh-my-open-ui.exe` is
still produced and runnable, only the `.Setup.exe` installer is missing.
Enable Developer Mode once per machine to silence this.

`electron-builder.yml` highlights:

```yaml
appId: com.ohmyopenui.desktop
productName: oh-my-open-ui
directories:
  output: release
files:
  - dist/main/**
  - { from: 'dist', to: 'app/renderer' }
win:
  target: [nsis]
  artifactName: ${productName}-Setup-${version}-x64.${ext}
nsis:
  oneClick: false
  perMachine: false
```

## Smoke testing the package

```powershell
# After packaging, launch the unpacked binary directly:
Start-Process apps\desktop\release\win-unpacked\oh-my-open-ui.exe

# Watch the multi-process tree:
Get-Process oh-my-open-ui | Format-Table Id, ProcessName, MainWindowTitle, WS_MB
```

Expected: 4 processes (main + GPU + utility + renderer), main window title
`oh-my-open-ui — playground`, ~90MB main RSS.

Stop with `Stop-Process -Name oh-my-open-ui -Force`.
