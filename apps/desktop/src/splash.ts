import { BrowserWindow, nativeTheme } from 'electron';

/**
 * Lightweight branded splash. Renders an inline HTML data: URL so it can show
 * within ~50ms — no preload bundle required. The asterisk uses brand-tribute
 * colors (warm amber) and a custom CSS keyframe so the user perceives "the
 * app is starting" before the renderer's JS bundle is parsed.
 *
 * The splash window is frameless, transparent, always-on-top during startup,
 * and lifts itself when the main window emits `did-finish-load`.
 */

function inlineSplashHtml(dark: boolean): string {
  const bg = dark ? '#252623' : '#FBF9F5';
  const surface = dark ? '#30302E' : '#FFFFFF';
  const border = dark ? '#42423D' : '#DFDDD6';
  const text = dark ? '#F3F0E8' : '#262522';
  const muted = dark ? '#C5BFB4' : '#6F6A62';
  const accent = dark ? '#D97757' : '#C96442';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Loading…</title>
  <style>
    :root { color-scheme: ${dark ? 'dark' : 'light'}; }
    html, body { margin:0; padding:0; height:100%; width:100%; background:transparent; -webkit-user-select:none; }
    body { display:flex; align-items:center; justify-content:center; font:13px -apple-system, "Segoe UI", system-ui, sans-serif; color:${text}; }
    .panel {
      width: calc(100% - 24px);
      height: calc(100% - 24px);
      border-radius: 18px;
      background: ${surface};
      border: 1px solid ${border};
      box-shadow:
        0 1px 0 rgba(0,0,0,${dark ? '0.35' : '0.04'}),
        0 8px 24px -8px rgba(0,0,0,${dark ? '0.55' : '0.18'}),
        0 24px 48px -16px rgba(0,0,0,${dark ? '0.65' : '0.20'});
      display: grid;
      place-items: center;
      animation: fadeIn 240ms ease-out both;
    }
    .stack { display:flex; flex-direction:column; align-items:center; gap:18px; }
    .mark {
      width: 44px; height: 44px;
      animation: spin 1.6s linear infinite;
      transform-origin: 50% 50%;
      filter: drop-shadow(0 4px 10px rgba(${dark ? '217,119,87' : '201,100,66'}, 0.30));
    }
    .mark path { fill: ${accent}; }
    .label { color: ${muted}; letter-spacing: 0.04em; text-transform: uppercase; font-size: 11px; }
    .name { font-family: "Source Serif 4", "Times New Roman", serif; font-size: 17px; color: ${text}; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    @media (prefers-reduced-motion: reduce) {
      .mark { animation: none; }
      .panel { animation: none; }
    }
  </style>
</head>
<body style="background:${bg};">
  <div class="panel">
    <div class="stack">
      <svg class="mark" viewBox="0 0 24 24" aria-hidden="true">
        <!-- Eight-rayed brand asterisk -->
        ${[0, 45, 90, 135, 180, 225, 270, 315]
          .map(
            (a) =>
              `<path transform="rotate(${a} 12 12)" d="M12 3.2 C 12.6 6.8, 12.6 9.2, 12 12 C 12.6 14.8, 12.6 17.2, 12 20.8 C 11.4 17.2, 11.4 14.8, 12 12 C 11.4 9.2, 11.4 6.8, 12 3.2 Z" />`,
          )
          .join('')}
      </svg>
      <div class="name">oh-my-open-ui</div>
      <div class="label">starting up</div>
    </div>
  </div>
</body>
</html>`;
}

export interface SplashHandle {
  window: BrowserWindow;
  close: () => void;
}

export function showSplash(): SplashHandle {
  const dark = nativeTheme.shouldUseDarkColors;
  const splash = new BrowserWindow({
    width: 360,
    height: 240,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    show: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  const html = inlineSplashHtml(dark);
  splash.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  splash.once('ready-to-show', () => splash.show());

  let closed = false;
  const close = () => {
    if (closed || splash.isDestroyed()) return;
    closed = true;
    // Soft fade-out via a final CSS class swap; even on systems that ignore
    // window opacity transitions this still removes immediately so the user
    // never sees a stale splash next to the real window.
    try {
      splash.webContents
        .executeJavaScript(
          `
          (() => {
            const p = document.querySelector('.panel');
            if (p) { p.style.transition = 'opacity 160ms ease, transform 160ms ease'; p.style.opacity = '0'; p.style.transform = 'scale(0.98)'; }
          })()
        `,
        )
        .catch(() => undefined);
    } catch {
      /* ignore */
    }
    setTimeout(() => {
      if (!splash.isDestroyed()) splash.destroy();
    }, 180);
  };

  return { window: splash, close };
}
