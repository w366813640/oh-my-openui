import path from 'node:path';
import { BrowserWindow, app, ipcMain, nativeTheme, shell } from 'electron';
import { type SplashHandle, showSplash } from './splash';
import { maybeRegisterAutoUpdater } from './updater';

const isDev = !app.isPackaged;
const RENDERER_DEV_URL = process.env.RENDERER_DEV_URL ?? 'http://localhost:5173';

const baseDir = __dirname;

let mainWindow: BrowserWindow | null = null;
let splash: SplashHandle | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 880,
    minHeight: 560,
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#252623' : '#FBF9F5',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: nativeTheme.shouldUseDarkColors ? '#252623' : '#FBF9F5',
      symbolColor: nativeTheme.shouldUseDarkColors ? '#F3F0E8' : '#262522',
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
    const dark = nativeTheme.shouldUseDarkColors;
    mainWindow.setTitleBarOverlay({
      color: dark ? '#252623' : '#FBF9F5',
      symbolColor: dark ? '#F3F0E8' : '#262522',
      height: 36,
    });
    mainWindow.webContents.send('theme:system-changed', dark ? 'dark' : 'light');
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
