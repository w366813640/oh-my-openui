import path from 'node:path';
import { BrowserWindow, app, ipcMain, nativeTheme, shell } from 'electron';
import { type DesktopBrand, loadDesktopBrand } from './brand';
import { type SplashHandle, showSplash } from './splash';
import { maybeRegisterAutoUpdater } from './updater';

const isDev = !app.isPackaged;
const RENDERER_DEV_URL = process.env.RENDERER_DEV_URL ?? 'http://localhost:5173';

const baseDir = __dirname;

let mainWindow: BrowserWindow | null = null;
let splash: SplashHandle | null = null;
let desktopBrand: DesktopBrand | null = null;

function getBrand(): DesktopBrand {
  if (!desktopBrand) desktopBrand = loadDesktopBrand();
  return desktopBrand;
}

function createWindow() {
  const brand = getBrand();
  const dark = nativeTheme.shouldUseDarkColors;

  /* P2-C3 -- Win11 acrylic backgroundMaterial.
   *
   * Electron 42's BrowserWindow accepts a `backgroundMaterial` option on
   * Win11; on Win10 or any other platform the option is ignored
   * silently. We default to 'acrylic' for a soft frosted titlebar feel
   * that matches Fluent 2. Users can opt out by setting
   * OH_BG_MATERIAL=none in their env (useful for older GPUs or remote
   * desktop scenarios where compositing is expensive).
   *
   * Note: When acrylic is active, `backgroundColor` should be a
   * transparent ARGB hex (#00rrggbb) so the system blur shows through;
   * however electron-builder's NSIS install needs an opaque fallback
   * during the first paint, so we keep the brand color as the fallback
   * and accept a brief solid-color frame before the desktop composites.
   */
  const bgMaterial = process.env.OH_BG_MATERIAL ?? 'acrylic';
  const useAcrylic = process.platform === 'win32' && bgMaterial !== 'none' && bgMaterial !== '';

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 880,
    minHeight: 560,
    show: false,
    backgroundColor: dark ? brand.titlebar.darkBg : brand.titlebar.lightBg,
    ...(useAcrylic
      ? { backgroundMaterial: bgMaterial as 'auto' | 'none' | 'mica' | 'acrylic' | 'tabbed' }
      : {}),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: dark ? brand.titlebar.darkBg : brand.titlebar.lightBg,
      symbolColor: dark ? brand.titlebar.darkSymbol : brand.titlebar.lightSymbol,
      height: 36,
    },
    webPreferences: {
      preload: path.join(baseDir, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  // Defer showing the main window until BOTH ready-to-show AND
  // did-finish-load fire. ready-to-show only guarantees the first paint;
  // waiting for did-finish-load avoids the brief blank-window flash that
  // otherwise appears before the React shell mounts.
  let readyToShow = false;
  let finishedLoading = false;
  const tryShow = () => {
    if (!readyToShow || !finishedLoading || !mainWindow) return;
    mainWindow.show();
    if (splash) splash.close();
  };
  mainWindow.once('ready-to-show', () => {
    readyToShow = true;
    tryShow();
  });
  mainWindow.webContents.once('did-finish-load', () => {
    finishedLoading = true;
    tryShow();
  });
  // Hard fallback so we never strand the user behind a splash if the
  // renderer takes >5s (network blip, AV scan, cold disk).
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) mainWindow.show();
    if (splash) splash.close();
  }, 5000);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL(RENDERER_DEV_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    const rendererIndex = path.join(process.resourcesPath, 'app/renderer/index.html');
    mainWindow.loadFile(rendererIndex);
  }

  nativeTheme.on('updated', () => {
    if (!mainWindow) return;
    const brand = getBrand();
    const isDark = nativeTheme.shouldUseDarkColors;
    mainWindow.setTitleBarOverlay({
      color: isDark ? brand.titlebar.darkBg : brand.titlebar.lightBg,
      symbolColor: isDark ? brand.titlebar.darkSymbol : brand.titlebar.lightSymbol,
      height: 36,
    });
    mainWindow.webContents.send('theme:system-changed', isDark ? 'dark' : 'light');
  });
}

function registerIpc() {
  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:toggleMaximize', () => {
    if (!mainWindow) return;
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });
  ipcMain.handle('window:close', () => mainWindow?.close());
  ipcMain.handle('window:isMaximized', () => mainWindow?.isMaximized() ?? false);

  ipcMain.handle('theme:get-system', () => (nativeTheme.shouldUseDarkColors ? 'dark' : 'light'));
  ipcMain.handle('theme:set', (_event, mode: 'light' | 'dark' | 'system') => {
    nativeTheme.themeSource = mode;
  });
}

// Set the AppUserModelID before any window is created so the Windows taskbar
// groups the app correctly under its own product identity (instead of
// "electron.exe").
if (process.platform === 'win32') {
  app.setAppUserModelId('com.ohmyopenui.desktop');
}

app.whenReady().then(() => {
  registerIpc();
  // Show the splash first so the user gets immediate visual feedback while
  // the renderer's bundle parses. createWindow() then opens the main window
  // hidden and brings it forward once it's painted.
  splash = showSplash();
  createWindow();
  void maybeRegisterAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Optional Windows jumplist scaffolding (placeholders — wire to your own actions).
  if (process.platform === 'win32') {
    try {
      app.setUserTasks([
        {
          program: process.execPath,
          arguments: '',
          iconPath: process.execPath,
          iconIndex: 0,
          title: 'New Chat',
          description: 'Open a new chat window',
        },
      ]);
    } catch {
      // best-effort
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
