import { contextBridge, ipcRenderer } from 'electron';

type ThemeMode = 'light' | 'dark' | 'system';

const bridge = {
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized') as Promise<boolean>,
  },
  theme: {
    getSystem: () => ipcRenderer.invoke('theme:get-system') as Promise<'light' | 'dark'>,
    set: (mode: ThemeMode) => ipcRenderer.invoke('theme:set', mode),
    onSystemChanged: (cb: (mode: 'light' | 'dark') => void) => {
      const handler = (_event: unknown, mode: 'light' | 'dark') => cb(mode);
      ipcRenderer.on('theme:system-changed', handler);
      return () => ipcRenderer.removeListener('theme:system-changed', handler);
    },
  },
  platform: process.platform,
} as const;

contextBridge.exposeInMainWorld('bridge', bridge);

export type Bridge = typeof bridge;
