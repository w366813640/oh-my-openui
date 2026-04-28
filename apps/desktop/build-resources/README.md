# Build Resources

This directory holds installer-side assets that electron-builder picks up automatically.

| File | Purpose |
|---|---|
| `icon.ico` | Windows app icon (256×256 multi-res preferred). Used by NSIS installer & taskbar. |
| `icon.png` | macOS / Linux icon source (≥512×512). |
| `installer.nsh` | Optional NSIS script include for custom installer logic. |
| `installerSidebar.bmp` | (optional) NSIS welcome-page sidebar image, 164×314 BMP. |
| `installerHeader.bmp` | (optional) NSIS header image, 150×57 BMP. |

If you do not supply `icon.ico`, electron-builder will fall back to a generic Electron icon.
For the warm visual identity, ship a 256×256 ICO derived from your brand mark
(see `packages/brand/src/AuroraLogo.tsx` for the SVG source).
