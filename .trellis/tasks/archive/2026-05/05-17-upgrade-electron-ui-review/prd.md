# Upgrade Electron + Professional UI/UX Review

## Goal

将 `oh-my-open-ui` 升级到最新 Electron（v42 系列），并对当前 UI/UX 进行专业评审，输出可执行的改进计划。

项目定位（README/架构文档）：
> "A reusable Electron + React UI scaffolding that 1:1 replicates the visual,
>  interaction, and motion design language of Claude Desktop on Windows —
>  without any LLM business logic. Drop the components into any app and ship
>  a warm, restrained, knowledge-tool aesthetic in minutes."

因此评审同时承载两类受众：
1. 该模板作为**可复用脚手架**的二次开发者（关心 API 边界、可扩展性、文档）。
2. 该模板最终包装出的**终端用户**（关心可用性、可访问性、性能、视觉精致度）。

## What I already know

### 现状版本
- `electron`: ^33.2.1（apps/desktop）
- `electron-builder`: ^25.1.8
- `electron-updater`: ^6.3.9
- `react` / `react-dom`: ^19.0.0
- `vite`: ^6.0.5（playground、stories）
- `framer-motion`: ^11.15.0（motion、ui）
- `@radix-ui/*`: 1.1.x / 1.2.x / 2.2.x
- `tailwindcss`: ^4.0.0
- `typescript`: 5.6.3
- `turbo`: 2.3.3
- `pnpm`: 9.15.9（packageManager）
- `node`: >=20（engines）
- `storybook`: ^9.1.20
- `lucide-react`: ^0.469.0
- `@biomejs/biome`: 1.9.4

### 最新版本（2026-05-17 调研）
- **Electron**: v42.1.0（2026-05-15 发布）→ 当前落后 9 个大版本
  - 关键破坏性变更里程碑：
    - **38**：macOS 11 不再支持（≥12 Monterey）；`plugin-crashed` 事件移除；Linux Wayland 默认；`webFrame.routingId` 弃用，改 `frameToken`。
    - **39**：`OffscreenSharedTexture` 签名变化；`window.open` 规范修正（始终可调整大小）；Chromium 142 / Node 22.20 / V8 14.2。
- **electron-builder**: v26.9.0（2026-04-14 发布）→ 当前 25.1.8，需跨大版本升级。
- **motion**（原 framer-motion 12 合并产物）: v12.38.0（2026-03 起）。
  - React API 无破坏性变更；包名改为 `motion`，导入路径改为 `motion/react`。
- 其他依赖（Radix UI、TanStack Router、Tailwind v4、Storybook 9）大概率仅 patch/minor。

### 仓库结构（与设计成熟度）
- 完整 monorepo：`apps/{desktop,playground}` + `packages/{ui,tokens,motion,brand,icons}` + `stories/`。
- 桌面端：自绘 Win11 titlebar、splash、IPC bridge、auto-updater（可选）、NSIS 安装包流程已闭环（~84MB installer，4 进程模型）。
- 设计令牌：颜色/字体/圆角/阴影/动效完整成体系；支持 light/dark/system、prefers-reduced-motion；多 brand 切换。
- 已实现 UI：AppShell、Sidebar（双态 60↔240）、Composer、MessageList、ThinkingTrace、ArtifactPane（拖拽 resize + 持久化）、SearchPalette ⌘K、Modal 五形态 + 栈管理、TwoPaneSettings、ProjectDetail、ListPage、I18n（en/zh）、ThemeProvider。
- Playground 路由：`/`（welcome）、`/chat-demo`（含 typewriter 回放 + ThinkingTrace 流式）、`/artifact-demo`、`/chats`、`/projects`、`/projects/:id`、`/settings`、`/modals`、`/tokens`、`/motion`。

### 已有 UI/UX 评审历史
位于 `docs/audits/`：
1. **`ui-polish-2026-05-04.md`**（10 条发现）：
   - 1 窄视口缺真正的 shell 策略；2 artifact 模式响应式弱；3 light 表面层级"过软"；4 dark 对比过重；5 Composer 视觉不够锚定；6 sidebar active/grouped 状态扁平；7 消息内容缺扫读点；8 modal/floating 系不齐整；9 list/project 页过稀；10 demo 内容产品叙事弱。
2. **`claude-web-oct-2025-parity-2026-05-05.md`**（实施回合）：
   - 完成色板/Composer/User bubble/serif assistant body/启动期一致色调；
   - 仍开放：响应式分支、demo 数据密度、品牌字形（故意保留）、产品向 modal/list 内容。
3. **`docs/WORK_LOG.md`**（polish round 1~10）：
   - 修复 Tailwind v4 `dark:` 与 `data-theme` 绑定 bug；
   - `AppFrame` 不再传 `defaultMode`（避免覆盖持久化）；
   - polish round 9 列出未做项菜单：CI、BrandTheme logoSlot、`pnpm fork-template`、tool-call UI、性能（renderer worker preload + `app.commandLine`）、可访问性审计。

### 已知约束
- pnpm monorepo + turbo + biome + Tailwind v4。
- Windows 11 为主，macOS/Linux 仅 electron-builder 目标声明，未必充分测试。
- 桌面端纯 host，无业务逻辑；所有 UI 在 `apps/playground`。
- "claude-tribute" 品牌仅作本地视觉对照，不可对外发布。

## Open Questions（待用户回答）

> 一次只问一个，按优先级从高到低，回答后立即更新 PRD。

- ✅ **Q1（结构/优先级）**：**已回答 → A**：顺序执行。先升级 Electron 并验证回归，再基于升级后状态做 UI/UX 评审。
- ✅ **Q2（Electron 升级目标版本与路径）**：**已回答 → A**：一步直升 v42.1.0（最新稳定），electron-builder 同步升 26.x、electron-updater 跟随；依赖 typecheck/build/手动 smoke 拦截回归。
- ✅ **Q3（评审镜头）**：**已回答 → E**：多镜头综合，A+B+C+D 全部并行：Claude parity + Nielsen/HIG/WCAG + 竞品（ChatGPT 5/Cursor/Linear/Raycast/Notion AI/Perplexity）+ 脚手架/库视角。
- ✅ **Q4（评审报告交付形式）**：**已回答 → F**：主报告（多镜头分章节）+ P0/P1/P2 改进计划表（含位置/问题/建议/估时/验收）。不引入截图脚本，不拆 trellis 子任务。
- ✅ **Q5（落地范围）**：**已回答 → D**：本任务全量落地 P0+P1+P2 修复（"一气呵成"：升级 + 评审 + 计划 + 全量修复）。
- ✅ **Q6（跨平台范围）**：**已回答 → A**：仅 Windows 验证（mac/linux electron-builder 配置保留但不验证）。
- ✅ **Q7（Expansion sweep · 邻接关注点）**：**已回答 → B**：仅迁移 framer-motion 11 → motion 12（包名 / import path 变更，React API 无 break）。其他依赖不动。其余可升级机会会在评审 § 5 P1/P2 中列出。

## Decisions（ADR-lite，演进中）

- **D1：执行顺序 = 顺序，先升后评**（Q1 → A）
  - Context：升级会更换 Chromium 渲染引擎，可能影响渲染表现（字体回退、滚动、阴影合成、Wayland 路径等），如果先做评审会导致结论被升级后状态推翻。
  - Decision：顺序执行 = 先 Electron 升级 + 回归 → 再 UI/UX 评审与计划。
  - Consequences：评审结论建立在新版基线上，最有效；但总工期略长，且升级期间评审产物不能并行推进。

- **D2：Electron 升级 = 一步直升 v42.1.0**（Q2 → A）
  - Context：当前 33.2.1 落后 9 个大版本；用户明确要求"最新"。v42.1.0 已是最新稳定（2026-05-15 发布，仅 2 天）。Electron 主要破坏点集中在 38（macOS 11 退坑、Wayland 默认、plugin-crashed 移除、webFrame.routingId 弃用），而本项目主进程 API 表面很窄（BrowserWindow、ipcMain、nativeTheme、shell、app、setTitleBarOverlay），跨越多版本风险点有限。
  - Decision：一步将 `electron` 升至最新 v42 稳定补丁（执行时再 `npm view electron version` 取真值，避免本文档过期）；同步 `electron-builder` 25→26 最新、`electron-updater` 取兼容最新；保留 `@types/node` 22.x。
  - Consequences：节省迭代成本；风险集中在一次升级里。需配套手段：编译报错驱动定位、main/preload 全文回看、smoke checklist（splash → titlebar → 主窗口 ready-to-show → IPC theme:set / window:* → NSIS package → 启动）覆盖。回滚策略：保留升级前 commit 标签便于 `git revert`。

- **D3：评审镜头 = 多镜头综合（A+B+C+D）**（Q3 → E）
  - Context：用户明确要求"最专业的评审"。单一镜头各有盲区：Claude parity 不评估通用 a11y；启发式忽略竞争品类节奏；竞品对比可能带主观；脚手架视角忽略终端用户。
  - Decision：评审分四章 + 综合结论：
    1. **Claude parity 残差**（基于 May 5 audit 未关闭 + 新表面回看）
    2. **通用 UX 启发式**（Nielsen 10 + WCAG 2.2 AA + Apple HIG Aqua/Liquid Glass 时代 + Microsoft Fluent 2 现代 Windows 规范）
    3. **竞品对比**（ChatGPT 5、Cursor、Linear、Raycast、Notion AI、Perplexity 的 2026 现状，仅作 informative 不强求 follow）
    4. **脚手架/库视角**（API 边界、可复用性、文档完整度、品牌可换装、prop 表面与默认值）
  - Consequences：报告厚重，工作量较大；但全方位、能撑起"最专业"语义；后续可拆 task 落地。

- **D4：评审交付物 = 主报告 + P0/P1/P2 改进计划表**（Q4 → F）
  - Context：现有 audits 都是单 markdown。Option F 在不过度膨胀范围的前提下，给出最关键的两个工件：评审结论 + 可执行改进列表。
  - Decision：交付到 `docs/audits/2026-05-17-comprehensive-review.md`，文档结构：
    - § 0 Executive summary（一页概览：评分矩阵 + Top 5 风险）
    - § 1 Claude parity 残差章节
    - § 2 通用 UX 启发式章节（Nielsen + WCAG + HIG + Fluent 2）
    - § 3 竞品对比章节（informative）
    - § 4 脚手架/库视角章节
    - § 5 综合改进计划表（按 P0/P1/P2 分组，每项含：标题 / 位置（文件:行 或 组件名） / 问题 / 建议 / 估时（h） / 验收标准）
    - § 6 验证方法与基线（怎么再跑一次验证）
  - Consequences：单文件可移植性强、易 review；不生成截图脚本和子任务，留待后续拉取 P0 时再决定是否需要。

- **D6：升级回归 = 仅 Windows**（Q6 → A）
  - Context：当前运行环境为 win32 10.x；docs/WORK_LOG 全部 smoke 来自 Windows；mac/linux builder 配置保留但从未真正出过包。
  - Decision：本任务 smoke 流水线仅在 Windows 上执行（splash → titlebar → main window → IPC → NSIS package → 启动）。`electron-builder.yml` 的 mac/linux 段保留不动，必要时仅做 typecheck 级别覆盖。
  - Consequences：覆盖窄但聚焦；mac/linux 升级风险延后到使用方真正需要时再处理；保留可选 follow-up（"Phase 跨平台 smoke"）作为下任务种子。

- **D7：仅迁移 framer-motion → motion 12**（Q7 → B）
  - Context：framer-motion 包已被合并入 `motion`（v12）。React 端 API 无破坏性变更，只需 `pnpm remove framer-motion && pnpm add motion`，并替换 `import { motion, AnimatePresence } from 'framer-motion'` 为 `'motion/react'`。涉及文件：`packages/motion/**`、`packages/ui/**`（多处）、`apps/playground/**`（多处）。
  - Decision：本任务同步完成 framer-motion → motion 12 迁移；其余渲染端依赖（Radix / TanStack / Vite / Storybook / Biome / Tailwind v4 / lucide-react / shiki / react-markdown）一律不动，作为评审 § 5 P1/P2 改进项列出（"已知的升级机会"）以便后续 task pick up。
  - Consequences：保持依赖与 React 19/Vite 6/Electron 42 这代生态贴合；不引入 DevX 新工件（CI/fork-template/screenshot 脚本），评审报告中作为开放选项呈现。

- **D5：本任务全量落地 P0+P1+P2 修复**（Q5 → D）
  - Context：用户希望一气呵成，避免遗留修复战线。本任务最终交付 = 升级后的可运行项目 + 评审报告 + 全部已实施的修复。
  - Decision：流程 = ① Electron 升级 → ② 回归验证 → ③ 4 章评审 → ④ 完成 P0/P1/P2 计划表（同时 commit 报告） → ⑤ 分阶段落地 P0 → P1 → P2，每阶段独立 commit + typecheck/build 闭环 → ⑥ 整体 NSIS package + smoke。
  - Consequences：**本任务体量极大**，预计工时跨度长（粗估：升级 0.5–1 d；评审 1–1.5 d；P0+P1+P2 修复 1.5–3+ d，依发现量上下浮动）。需要：
    - **强制分阶段 commit**（升级 commit / 评审报告 commit / 每个 P 等级独立 commit）以便 review 与回滚。
    - **若 P0 工作量超预算（>1 d）需主动复议**：触发回到 Q5 复议（降级到 B/C），避免单 PR 失控。
    - **优先保护原有 polish round 10 视觉**：所有修复必须保留既有 Claude reference 视觉风格，不破坏现有 brand/tokens/motion 语言。
    - **每章评审后立即生成对应 P 等级表，再开始下一章**，避免评审—修复阶段相互污染。

## Requirements（演进中）

- 升级 `electron` 到 v42 系列最新（待 Q2 确认）。
- 配套升级 `electron-builder`（25→26）、`electron-updater`、`@types/node` 等。
- 对所有 playground 路由 + 桌面包装（splash、titlebar、IPC、updater）做回归。
- 输出一份"专业评审报告"，沿用并扩展 `docs/audits/` 既有格式。
- 评审需主动避免重复 `ui-polish-2026-05-04` 已实施部分，聚焦"自上次以来新增表面" + "未关闭项" + "更高维度"。

## Acceptance Criteria（演进中）

- [x] Electron 升级到目标版本后：`pnpm -r typecheck` ✅、`pnpm -r build` ✅、`pnpm --filter @oh/desktop run package` 部分（win-unpacked exe 生成成功并可启动；NSIS installer 受 winCodeSign 符号链接权限阻塞，已 documented 为 Windows Developer Mode 前置条件）。`pnpm exec biome check .` 为预存在 CRLF/LF 行尾问题（与本次升级无关，列入 P2 修复）。
- [ ] 关键路由（welcome / chat-demo / artifact-demo / chats / projects / settings / modals）在 Electron 新版下视觉一致、交互无回归（Phase 2 评审同步走 smoke）。
- [ ] 评审报告交付到 `docs/audits/{YYYY-MM-DD-name}.md`，结构与既有审计一致。
- [ ] 改进计划：分级（P0 阻塞 / P1 高价值 / P2 增益），每项含位置、问题、建议、估时。

## Definition of Done（团队质量门）

- Tests / typecheck / lint / build 全绿。
- 桌面端 NSIS 包构建成功并可启动（4 进程、~90MB RAM 基线）。
- 文档（`docs/electron.md`、`docs/architecture.md`、相关 README）同步反映新 Electron 版本。
- WORK_LOG 与新 audit 文件 commit。

## Out of Scope（基于 Q1~Q7 锁定）

明确**不做**：
- LLM 业务逻辑接入（README 已声明 no LLM logic）。
- **macOS / Linux 升级验证**（Q6 → A 仅 Windows；builder 配置保留不动）。
- **framer-motion 之外的渲染端依赖升级**（Q7 → B；Radix/TanStack/Vite/Storybook/Biome/Tailwind/lucide/shiki/react-markdown 一律不动；评审会作为机会列在 P1/P2）。
- 重大架构重构（不替换 Tailwind/Radix/TanStack Router/Vite）。
- 全新功能（语音、画布、collaborative editing 等）。
- 引入 Playwright 截图脚本 / GitHub Actions CI / fork-template 脚本（Q4 → F、Q7 → B 都明确不在本轮，但会以"评审建议"形式列在 § 5）。
- 拆 trellis 子任务（Q4 → F 明确不拆）。
- 评审报告中**不生成新的截图**（沿用 May 5 的截图集；如需新截图作为下任务的 P0 修复依据再做）。

## Research References

- [`research/electron-upgrade-survey.md`](research/electron-upgrade-survey.md) — Electron 33→42 路径、破坏点、主进程暴露面、配套依赖、smoke 步骤、回滚条件、framer-motion → motion 12 迁移
- [`research/ui-ux-review-frameworks.md`](research/ui-ux-review-frameworks.md) — Lens 1~4 的逐项 checklist：Claude parity 残差 / Nielsen 10 / WCAG 2.2 AA / Apple HIG / Microsoft Fluent 2 / 脚手架与库视角
- [`research/competitor-chat-ui-2026.md`](research/competitor-chat-ui-2026.md) — ChatGPT 5 / Cursor / Linear / Raycast / Notion AI / Perplexity 2026 状态 + 本项目差异化定位结论（保留/借鉴/跟随分类）

## Implementation Plan（分阶段、独立 commit）

### Phase 0 · 准备
- `git checkout -b chore/electron-42-and-ui-audit`
- `git tag pre-electron-42-upgrade`（回滚锚点）

### Phase 1 · Electron 升级（D2 + D7）— DONE 2026-05-17
**Commit 1.1 — chore: bump electron 33 → 42 and electron-builder 25 → 26** ✅
- `apps/desktop/package.json`：`electron@^42.1.0` / `electron-builder@^26.8.1` / `electron-updater@^6.8.3`.
- `pnpm install`、`pnpm --filter @oh/desktop typecheck`、`pnpm --filter @oh/desktop build` 全绿。
- 仅升级，未动其他代码。

**Commit 1.2 — chore: migrate framer-motion to motion 12** ✅
- 在 `@oh/motion` / `@oh/ui` / `@oh/playground` 三个工作区移除 `framer-motion`、添加 `motion@^12.38.0`。
- 全局替换 `from 'framer-motion'` → `from 'motion/react'`（共 13 个 src 文件 + 1 个 stories 示例）。
- `pnpm -r typecheck` 全绿；`biome check` 159 个错误**全部**为预存在 CRLF/LF 行尾问题（与升级无关，迁移本身 0 新增违规）。
- `apps/playground/vite.config.ts` `manualChunks` 更新：`vendor-motion` 现在匹配 `motion`。

**Commit 1.3 — chore(desktop): smoke + package after electron 42 upgrade** ✅
- `pnpm -r build`（packages + playground + storybook）全绿，`vendor-motion-*.js` ≈ 126 kB / 41 kB gzip 配额正常。
- `pnpm --filter @oh/desktop run package`：
  - Electron 42 二进制从 npmmirror.com 镜像拉取（github.com 不可达，已记入 `docs/electron.md` "China-network mirrors" 段）。
  - `@electron/rebuild` 对原生依赖重建成功。
  - `release/win-unpacked/oh-my-open-ui.exe` 已生成（**VersionInfo.FileVersion = 42.1.0**，216 MB）。
  - NSIS `.Setup.exe` 步骤因 winCodeSign 符号链接需 Windows Developer Mode 失败（与升级无关；docs 已注明）。
- Smoke launch：unpacked exe 启动正常，100 MB 主进程 RSS，3 个子进程（GPU/Renderer/Utility）。
- `docs/electron.md` 已更新为 Electron 42；`docs/WORK_LOG.md` round 11 起头条目已追加。

### Phase 2 · 评审（D3 + D4）— DONE 2026-05-17
**Commit 2.1 — docs(audit): comprehensive UI/UX review 2026-05-17** ✅

落到 `docs/audits/2026-05-17-comprehensive-review.md`，章节固定（已落，共 ~440 行）：

| 节 | 内容 | 主要 checklist 来源 |
|---|---|---|
| § 0 | Executive summary（一页：维度评分矩阵 + Top 5 风险 + 改进总览） | 综合 |
| § 1 | Claude parity 残差 | `research/ui-ux-review-frameworks.md` Lens 1 |
| § 2 | UX 启发式（Nielsen + WCAG 2.2 AA + Apple HIG + Microsoft Fluent 2） | Lens 2 |
| § 3 | 竞品对比（informative） | `research/competitor-chat-ui-2026.md` |
| § 4 | 脚手架/库视角（DX、API、文档、品牌可换装、测试覆盖） | Lens 4 |
| § 5 | 综合改进计划表（P0/P1/P2，每项含：标题 / 位置 / 问题 / 建议 / 估时 / 验收） | 综合 |
| § 6 | 验证方法与基线 | `docs/testing.md` 风格 |

### Phase 3 · 全量落地修复（D5）— P0 → P1 → P2
每个等级独立 commit + typecheck/lint 闭环；**若 P0 累积工时超 1 d 触发复议**（回到 Q5）。

**Commit 3.x.1 — fix(p0): \<topic\>**（每个 P0 一个或合并几个相关项）
**Commit 3.y.1 — feat(p1): \<topic\>**
**Commit 3.z.1 — chore(p2): \<topic\>**

每个 commit 都需：
- 改动文件作用域聚焦，commit message 引用 `docs/audits/2026-05-17-comprehensive-review.md` § 5 中的条目编号。
- 跑 `pnpm -r typecheck` + `pnpm exec biome check .` 全绿。
- 关键改动后回跑 `docs/testing.md` 相关 smoke 项。

### Phase 4 · 收尾
- 最终回归：`pnpm -r typecheck && pnpm exec biome check . && pnpm -r build && pnpm --filter @oh/desktop run package`，全绿。
- `docs/WORK_LOG.md` 补 "Polish round 11 — 2026-05-17" 条目。
- 触发 trellis Phase 3.3（spec update）：把评审中发现的"应固化为约定"的内容写回 `.trellis/spec/`。
- 通知用户准备 commit / PR。

## Technical Notes

- 当前 `docs/audits/` 已有两份审计，新审计应避免重复结论 — 已经在 Lens 1 checklist 中显式标注"May 4 未关闭项"。
- WORK_LOG round 9 的 "未做项菜单"（CI / fork-template / tool-call / 性能 / a11y）已作为评审 § 4（脚手架）和 § 5 P1/P2 的候选输入。
- `apps/desktop/src/main.ts` 主进程使用的 Electron API 经过逐项 verify（见 `research/electron-upgrade-survey.md` § 3），对 38~42 破坏点免疫。
- 渲染端通过 `window.bridge`（preload contextBridge）通信，sandbox / contextIsolation / no nodeIntegration 三连已开。
- 关键 spec 入口（desktop/ui/motion/tokens/brand frontend index.md）目前为 "To fill" 模板，落地修复时可一并补充实际约定（Phase 3.3）。

