# UI/UX Review 框架快查

D3 决策选 E（多镜头综合），评审报告的四章分别对应下列框架。本文档汇总每个镜头的"评审要点 checklist"，供后续评审实际写作时直接 cross-check。

---

## Lens 1 · Claude Parity 残差

### 来源

- 仓库 `Reference/Screenshot_Claude web Oct 2025/` 已下载的参考截图（May 5 audit 引用过 7 张高信号样本：12、21、22、83、97、149、157）。
- May 4 audit (`docs/audits/ui-polish-2026-05-04.md`) 10 条原始发现。
- May 5 audit (`docs/audits/claude-web-oct-2025-parity-2026-05-05.md`) 已实施清单 + 仍开放的 gaps。
- `docs/WORK_LOG.md` polish round 9/10 的"未做项菜单"。

### Checklist（评审需逐项核对）

**已经在 May 4 列出但 May 5 未完全关闭：**
- [ ] 1 窄视口（390px / 768px）：sidebar、artifact、thread 三者竞争空间
- [ ] 2 artifact 模式响应式：thread 列被挤窄时换列策略
- [ ] 3 light 表面层级（bg/sidebar/cards/composer 的明度阶梯过软）
- [ ] 4 dark 表面层级（大色块同值过多，对比偏重）
- [ ] 5 Composer 视觉锚定（控件 affordance vs 视觉噪声平衡）
- [ ] 6 Sidebar 选中/分组态（active rail / hover / section labels / 账户脚一致性）
- [ ] 7 消息内容扫读点（quoted、有序列表、代码块、artifact card 节奏）
- [ ] 8 Modal/popover/tooltip/toast 系统一致性（focus ring、字段、按钮）
- [ ] 9 list/project 页产品密度（搜索栏、批量选择、空态卡片）
- [ ] 10 demo fixtures 产品叙事（更长会话、更多 artifact 形态、连接器/账单状态）

**May 5 audit 显式遗留：**
- [ ] modal/list 产品级数据密度
- [ ] artifact preview 内容多样性
- [ ] 自动截图脚本（取代 `.codex-review/` 临时方式）

**round 9 菜单（潜在 P1/P2 候选）：**
- [ ] CI（GitHub Actions：typecheck + lint + build + storybook build + electron pack）
- [ ] BrandTheme `logoSlot`（pluggable ReactNode/string，避免硬编码 SVG）
- [ ] `pnpm fork-template`（一键复制脚手架并改名）
- [ ] AssistantMessage tool-call UI（"Used 3 tools" 折叠区块）
- [ ] 性能：renderer worker preload、`app.commandLine` 调优
- [ ] a11y 审计

### 验证基线

跑过的 typecheck 命令：
```bash
pnpm --filter @oh/ui typecheck
pnpm --filter @oh/playground typecheck
pnpm --filter @oh/desktop typecheck
```

已捕获截图存放位置（历史，仅参考）：`.codex-review/final-{welcome,chat,artifact,settings}-{light,dark}.png`

---

## Lens 2 · 通用 UX 启发式

### 2.1 Nielsen 10 启发式（每条对照本项目）

| # | 启发式 | 在本项目的具体检查点 |
|---|---|---|
| 1 | System status visibility | StreamingShimmer、ThinkingTrace、Toast、IPC theme 同步、artifact pane open/close 反馈 |
| 2 | Match real world | 时间感知 greeting、reduce-motion 尊重、自然的发送/停止隐喻 |
| 3 | User control & freedom | Composer 撤销、模态 Esc 关闭、artifact pane Esc 关闭、对话取消（onStop） |
| 4 | Consistency & standards | Win11 titlebar 约定、⌘K 命令面板、send/stop 标准图标、settings 二级布局 |
| 5 | Error prevention | 文件上传 `maxAttachments`、destructive 按钮确认（AlertModal）、disabled state |
| 6 | Recognition over recall | SearchPalette 列出 commands、tooltips、Sidebar 双态展开记忆 |
| 7 | Flexibility & efficiency | ⌘K、Kbd 提示、批量选择、quick-action chips、多模型切换 |
| 8 | Aesthetic & minimalist | 已经达到很高水准 — 但需核对是否仍有装饰性元素无功能 |
| 9 | Help users recover from errors | toast error tone、ThreadDisclaimer、Composer disabled hint |
| 10 | Help & documentation | sidebar getHelp、settings 内描述文案、`docs/` 全量 |

### 2.2 WCAG 2.2 AA 关键点

| 准则 | 在本项目的具体检查点 |
|---|---|
| 1.1.1 Non-text content | `aria-hidden` 标签、icon-only button 是否带 `aria-label` |
| 1.4.3 Contrast (Minimum) | `--color-text` vs `--color-bg` ≥4.5:1；`--color-text-muted` ≥4.5:1；`--color-text-subtle` 仅用于 ≥18px |
| 1.4.10 Reflow | 320px 宽度仍可用（May 4 已指出 broken at 390px） |
| 1.4.11 Non-text contrast | focus ring、border 对比度 ≥3:1 |
| 1.4.12 Text spacing | line-height、字间距、段距是否允许用户覆写 |
| 1.4.13 Content on hover/focus | tooltip 可被悬停、可被 dismiss、persist |
| 2.1.1 Keyboard | 全部交互可键盘到达（include drag-resize ArtifactPane handle ↔ ArrowLeft/Right） |
| 2.1.2 No keyboard trap | Modal、ArtifactPane、SearchPalette focus trap 与 Esc 退出 |
| 2.4.3 Focus order | sidebar → main → artifact pane 顺序 |
| 2.4.7 Focus visible | `focus-visible:ring-2 ring-[var(--color-ring)]` 全局规范 |
| 2.4.11 Focus not obscured (Min) | sticky composer 不应遮挡 focused button |
| 2.5.7 Dragging movements | ArtifactPane drag-resize 需有键盘替代（已存在 ArrowLeft/Right） |
| 2.5.8 Target size (Min) | icon button 24x24 是否足够 → 至少 24x24（AA），推荐 44x44（AAA） |
| 3.2.6 Consistent help | sidebar 账户菜单的 getHelp 是否每页可达 |
| 3.3.7 Redundant entry | 表单态不要求重复输入（FormDialog） |
| 4.1.3 Status messages | toast 应该有 `role="status"` 或 `aria-live` |

### 2.3 Apple HIG 现代要点（2025 Liquid Glass / 2026 适配）

- **半透/磨砂**：`backdrop-blur-md` 在 MainArea topbar 已使用，需核对是否在 dark 模式下仍可读；artifact toolbar 也用了 `backdrop-blur-md`。
- **Vibrancy / Material**：HIG 2025 起强调 system materials（thinMaterial/regularMaterial）。Electron 中 `vibrancy` API（macOS）若启用需配合。
- **Pointer target size**：HIG 推荐 ≥44pt（Mac）/ ≥44dp（iOS）。`IconButton size="sm"` 是否在 28/32px → 评审时核对。
- **Easing**：HIG 推荐 system easings；已用 `cubic-bezier(0.2,0,0,1)` 类工业标准。
- **Focus**：Mac 用户期望 Tab focus 不绕，且应有蓝色聚焦环；当前用品牌 `--color-ring`（terracotta）— 评审时讨论是否提供 Mac 模式 override。

### 2.4 Microsoft Fluent 2（Win11 适配）

- **Titlebar**：自绘已对齐 Win11（hover-red close、`titleBarOverlay`）— 但 **Fluent 2 强调 segmented Mica 背景**，本项目用 solid bg（可作改进项）。
- **Acrylic / Mica**：BrowserWindow `backgroundMaterial: 'acrylic' | 'mica' | 'tabbed'`（Electron 30+ 支持）— 本项目未使用。可在 P2 中提议。
- **Smooth corners**：Win11 默认 8px；项目 `--radius-md = 10px` 等接近。
- **Pointer feedback**：Fluent 2 强调 reveal effect（鼠标位置高亮 border）— 不必硬上，但可评审。
- **Sound feedback**：本项目无（不强求）。
- **System accent color**：用户在 Win11 设置中设的 accent 色 — Fluent 2 强烈建议尊重。本项目硬编码 terracotta，可作 P2 改进项（系统色覆盖品牌色的开关）。

---

## Lens 3 · 竞品对比

详见 `competitor-chat-ui-2026.md`。本镜头是 informative，不强求 follow，但要在报告中体现"我们的差异化定位"。

---

## Lens 4 · 脚手架 / 库视角

### 评审维度

| 维度 | 检查点 |
|---|---|
| **API 边界清晰度** | 每个组件 prop 是否最小、必要、有合理默认；是否暴露过多内部 hooks |
| **Provider 嵌套清晰度** | `AppFrame.tsx` 的嵌套深度合理性；providers 间依赖关系是否文档化 |
| **可替换性** | 单独使用 `<Composer>` 不带 `<AppFrame>` 是否能 work；`<Sidebar>` 是否需要 `SidebarStateProvider` |
| **品牌可换装** | `<BrandProvider>` 能否真正 100% 覆盖品牌相关元素（asterisk、palette、greetings、fonts、logo）— round 9 menu 已点出 `logoSlot` 缺口 |
| **令牌完整度** | tokens/css/*.css 是否覆盖所有 UI 用到的颜色/字体；是否还有 hard-code 的 hex |
| **i18n 完整度** | en/zh 字典是否覆盖所有 UI 字符串；是否存在 hard-code 的英文（grep 检查） |
| **类型导出完整度** | `@oh/ui` 是否导出所有公共 props 类型（用户 wrap 时需要） |
| **文档完整度** | `docs/{architecture,foundation,patterns,brand,electron,storybook,testing}.md` 各章节是否覆盖到位；是否缺 migration / changelog / a11y / performance 章节 |
| **示例完整度** | playground 路由是否覆盖每个组件的关键 state（empty/loading/error/dense） |
| **构建产物** | `@oh/ui` 是否以 ESM-only 发布；`exports` 字段是否完整；treeshaking 友好性 |
| **依赖卫生** | 是否有 peerDependencies 漏报；版本范围是否过窄 |
| **测试覆盖** | 当前几乎无 unit test；评审是否建议加 RTL/vitest 最小覆盖 |

### 与 README 宣言对照

README 自我宣言：
- "Drop the components into any app and ship a warm, restrained, knowledge-tool aesthetic in minutes." → 评审需验证"in minutes"是否真能做到（fork → rename → first render 时长估算）
- "no LLM business logic" → 评审需确认 onSubmit 等接口足够 generic、不暗藏 Anthropic 假设
- "1:1 visual/UX/motion replica" → 评审需评估 motion 与 visual 真实 parity 程度

---

## 评分维度（每章末尾给出）

为支持 § 0 Executive summary 的"评分矩阵"，每章末尾用以下五维 0–5 分：

- Visual quality（视觉成熟度）
- Interaction quality（交互流畅度）
- Accessibility（可访问性）
- Reusability（可复用性 / DX）
- Documentation（文档完整度）

总分用于横向比较"哪一章最值得本轮投入"。
