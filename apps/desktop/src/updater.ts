import { app } from 'electron';

/**
 * Auto-updater integration.
 *
 * Disabled by default — when you're ready to ship, set:
 *   process.env.OH_AUTO_UPDATE = '1'
 * and configure `publish` in electron-builder.yml so update metadata can be
 * generated. The wiring below is intentionally optional so the desktop app
 * runs cleanly without an `electron-updater` install / network call.
 */
export async function maybeRegisterAutoUpdater(): Promise<void> {
  if (!app.isPackaged) return;
  if (process.env.OH_AUTO_UPDATE !== '1') return;

  try {
    const mod = await import('electron-updater');
    const updater = (
      mod as unknown as {
        autoUpdater: { checkForUpdatesAndNotify: () => Promise<unknown>; logger?: unknown };
      }
    ).autoUpdater;
    if (!updater) return;
    void updater.checkForUpdatesAndNotify();
  } catch (err) {
    console.warn('[updater] electron-updater not available:', err);
  }
}
