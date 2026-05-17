# Electron 33 → 42 Upgrade Survey

**调研时间**：2026-05-17  
**当前版本**：electron `^33.2.1`（apps/desktop/package.json）  
**目标版本**：electron `v42.1.0`（2026-05-15 发布的最新稳定版）

---

## 1. 版本时间线 & 关键里程碑

| Major | 发布窗口 | 关键变化 |
|---|---|---|
| 33 | 2024-10 ~ 2025-02 | 当前基线 |
| 34 ~ 37 | 2025 中期 | 增量功能、小幅 API 调整（不展开） |
| **38** | 2025-09 ~ 2025-Q4 | **多个破坏点**（见下） |
| **39** | 2025-Q4 ~ 2026-Q1 | API 签名调整、`window.open` 规范修正、Chromium 142 / Node 22.20 |
| 40 ~ 41 | 2026-Q1 ~ 2026-Q2 | 稳定化、性能优化 |
| **42** | 2026-04 ~ 2026-05 | 最新稳定。性能优化、macOS Touch ID 修复、`webRequest` 性能 |

## 2. 破坏性变更 & 本项目暴露面

### Electron 38

| 变更 | 本项目暴露面 | 处理建议 |
|---|---|---|
| **macOS 11 不再支持**（要求 ≥12 Monterey） | 不暴露（仅 Windows 验证） | 文档注明 |
| **`ELECTRON_OZONE_PLATFORM_HINT` 环境变量移除**，`--ozone-platform=auto` 默认；Linux 默认 Wayland | 不暴露（仅 Windows） | 文档注明 |
| **`webContents.plugin-crashed` 事件移除** | 未使用（grep `plugin-crashed` 在 apps/desktop 无命中） | 无 |
| **`webFrame.routingId` 弃用**（改 `webFrame.frameToken`） | preload.ts 未使用 webFrame | 无 |

### Electron 39

| 变更 | 本项目暴露面 | 处理建议 |
|---|---|---|
| `OffscreenSharedTexture` 签名变化 | 未使用 offscreen rendering | 无 |
| `window.open` 规范修正（始终返回可调整大小窗口） | main.ts 用 `setWindowOpenHandler` 截获外链并 `shell.openExternal`，未实际打开新窗口 | 无 |
| Chromium 130 → 142 | renderer 表现（字体、滚动、阴影合成、color-mix）需 smoke | smoke 项 |
| Node 20 → 22.20 | `@types/node ^22.10.2` 已就绪 | typecheck 验证 |
| V8 14.2 | 渲染端 JS API 可能引入新 deprecation warning | smoke 时 DevTools 看 console |

### Electron 40 ~ 42（增量）

- v42.1.0 修复了 macOS Touch ID 与标题栏 crash，新增 `touchID.promptReason` 配置（与本项目无关）。
- 性能改进：`webRequest` header 转换、native event emission、IPC dispatch 更快——属于"得了便宜"。

## 3. 当前主进程 API 表面回看

`apps/desktop/src/main.ts` 实际使用的 Electron API：

| API | Electron 42 状态 | 备注 |
|---|---|---|
| `app` (whenReady, on, isPackaged, setAppUserModelId, setUserTasks, quit) | 全部稳定 | 无变更 |
| `BrowserWindow` constructor + `titleBarStyle:'hidden'` + `titleBarOverlay` + `webPreferences` | 稳定 | `titleBarOverlay` 行为自 v15 起一致 |
| `BrowserWindow.setTitleBarOverlay({color, symbolColor, height})` | 稳定 | 验证仍可在 nativeTheme 更新时动态改写 |
| `BrowserWindow.webContents.setWindowOpenHandler` | 稳定 | 注意 v39 后弹窗规范修正 |
| `ipcMain.handle` / `webContents.send` | 稳定 | 无变更 |
| `nativeTheme.shouldUseDarkColors` / `nativeTheme.themeSource` / `nativeTheme.on('updated')` | 稳定 | 无变更 |
| `shell.openExternal` | 稳定 | 无变更 |

`apps/desktop/src/preload.ts` 使用：
- `contextBridge.exposeInMainWorld` ✅
- `ipcRenderer.invoke` / `ipcRenderer.on` / `ipcRenderer.removeListener` ✅

`apps/desktop/src/splash.ts` 使用 BrowserWindow（frameless / transparent / hasShadow:false）+ `loadURL(data:text/html;...)`。

**结论**：主进程暴露面对 38~42 的破坏点**几乎完全免疫**，唯一需要关注的是 Chromium 130→142 跨度可能引入的渲染端细节变化（color-mix、scroll、字体回退）。

## 4. 配套依赖

| 包 | 当前 | 升级到 | 原因 |
|---|---|---|---|
| `electron` | ^33.2.1 | 最新 v42 稳定补丁（执行时 `npm view electron version` 取真值） | 用户要求 |
| `electron-builder` | ^25.1.8 | v26.9.0（2026-04 发布的最新稳定，跨大版本） | 与 Electron 42 兼容 |
| `electron-updater` | ^6.3.9 | 跟随 electron-builder 兼容矩阵（执行时取最新兼容 6.x 或 7.x） | 与 builder 同步 |
| `@types/node` | ^22.10.2 | 保持 22.x（Electron 42 配 Node 22.20） | 无需变 major |

## 5. 升级执行步骤（D2 选定的"一步直升"路径）

```bash
# 1. 创建升级 commit 锚点
git checkout -b chore/electron-42-upgrade
git tag pre-electron-42-upgrade  # 回滚锚点

# 2. 升级
cd apps/desktop
pnpm add electron@latest electron-builder@latest electron-updater@latest

# 3. typecheck（主进程）
pnpm --filter @oh/desktop typecheck

# 4. 重建主进程产物
pnpm --filter @oh/desktop build

# 5. dev 启动 smoke
pnpm desktop:dev
# 检查清单（手工）：
#   - splash 在 ~50ms 内出现
#   - main window 在 splash 消失后 fade-in
#   - titleBarOverlay 颜色与主题一致；切换系统主题颜色随之翻转
#   - 三个 chrome button（min / max / close）功能正常；hover-red close
#   - ⌘K 打开 SearchPalette
#   - / 切换路由（/chat-demo, /artifact-demo, /settings, /modals 等）
#   - 主题切换（light/dark/system）即时生效，无白闪
#   - DevTools console 无新 deprecation warning（Electron 39 增加了部分弃用提示）

# 6. NSIS 打包验证
pnpm --filter @oh/desktop run package
# 检查：release/oh-my-open-ui-Setup-0.1.0-x64.exe 体积、is-runnable

# 7. 启动安装包，跑 smoke
Start-Process apps\desktop\release\win-unpacked\oh-my-open-ui.exe
Get-Process oh-my-open-ui | Format-Table Id, ProcessName, MainWindowTitle, WS_MB
```

## 6. 回滚条件

- typecheck/build 红
- NSIS package 失败
- 任一 smoke 项失败
- DevTools 出现非预期 console error

回滚命令：
```bash
git reset --hard pre-electron-42-upgrade
pnpm install  # 恢复 lockfile
```

## 7. framer-motion → motion 12 迁移（D7）

```bash
# 在 packages/motion + packages/ui + apps/playground 三个工作区分别替换
pnpm --filter @oh/motion remove framer-motion
pnpm --filter @oh/motion add motion
# 同理 ui / playground

# 全局替换 import
# from: from 'framer-motion'
# to:   from 'motion/react'
```

涉及命中文件（grep 预估）：`packages/motion/src/*.tsx`、`packages/ui/src/**/*.tsx`（Sidebar / Composer / ArtifactPane / AssistantMessage / ThinkingTrace / SelectionToolbar / WelcomeStage / SearchPalette / Modal 等都用到 framer-motion）、`apps/playground/src/**/*.tsx`（PageTransition）。

React API 无破坏性变更（按 motion.dev/docs/react-upgrade-guide）：
- `motion.div` / `AnimatePresence` / `useReducedMotion` / `LayoutGroup` / `layout` / `layoutId` 全部不变。
- 只是包名 + import path 改。

## 8. 已知风险与缓解

| 风险 | 缓解 |
|---|---|
| `electron-updater` 与 `electron-builder@26` 兼容矩阵未完全调研 | 升级时跑 `npm info electron-updater peerDependencies`；必要时回退到 6.3.9 |
| Tailwind v4 + Chromium 142 渲染细节差异（color-mix、scrollbar style） | smoke 中显式比对 light/dark 关键路由 |
| Storybook 9.1.20 当前可能依赖旧 Vite 6.x；motion 12 进入后是否触发 storybook 重新构建报错 | 升级后跑 `pnpm storybook` 验证 |
| Win11 `titleBarOverlay` 在 Electron 38+ 是否有行为变化 | 跑 dev 时手动观察 minimize/maximize/close hover-red |
