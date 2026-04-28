; Custom NSIS includes for the oh-my-open-ui Windows installer.
; This file is referenced by electron-builder's `nsis.include` option in
; electron-builder.yml when uncommented.
;
; Add custom install steps here if needed (e.g., shortcut tweaks, desktop notes).

!macro customInstall
  ; Example: write a small marker so first-run logic knows we just installed.
  WriteRegStr HKCU "Software\\oh-my-open-ui\\install" "JustInstalled" "1"
!macroend

!macro customUninstall
  DeleteRegKey HKCU "Software\\oh-my-open-ui\\install"
!macroend
