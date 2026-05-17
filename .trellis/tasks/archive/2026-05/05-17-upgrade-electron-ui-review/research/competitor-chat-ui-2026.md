# 竞品 Chat / Tool UI 对比（2026-05 状态）

D3 决策选 E，本镜头属于"informative，不强求 follow"。目的是把 oh-my-open-ui 与当代 chat/IDE/tool UI 放到同一张坐标系里看，呈现差异化定位与可参考点。

> 注：此处只覆盖**视觉/交互/产品形态**层面，不涉及商业模式或模型能力。

---

## 1. 对标参照集

| 产品 | 类型 | 评审参照重点 |
|---|---|---|
| **Claude Desktop / Web Oct 2025** | 当前 1:1 仿制对象 | 已在 Lens 1 详细对照 |
| **ChatGPT 5 web/desktop** | 通用 chat 入口 | hero 入口、推荐 prompts、模型菜单、artifact-like canvas |
| **Cursor Desktop** | IDE-as-chat | 命令面板、双栏 chat+editor、agent 模式 UI、tool call 折叠 |
| **Linear** | Workspace tool 标杆 | 高密度列表、命令面板、键盘第一交互、loading skeleton |
| **Raycast** | Spotlight-like | 命令面板美学、键位提示、空态、扩展生态 UI |
| **Notion AI** | 写作向 chat | 内嵌在文档的对话气泡、suggestion chip 节奏 |
| **Perplexity** | Search-first chat | 引用 / sources 处理、follow-up suggestions 节奏 |

---

## 2. 关键观察 / 差异点（高信号）

### 2.1 ChatGPT 5（2026-05 当前）

- **Hero 入口已退化为极简**：只有居中 logo + greeting + 输入框，连 quick action chips 都收起。oh-my-open-ui 的 WelcomeStage 仍保留 6 个 quick chips — 这是与 Claude 一致的选择，**不必跟随** ChatGPT 简化趋势。
- **模型菜单变得复杂**（GPT-5 / GPT-5 mini / GPT-5 pro / Sora / DALL·E / o4），用 split-button + 副提示。oh-my-open-ui 仅 2 个 model，足够；但 `ModelPicker` 是否支持>5 个 model 的滚动 + 搜索 — 评审应核对。
- **Canvas（artifact）**已支持多 tab + 多文件，oh-my-open-ui 的 ArtifactPane 仅 2 tab（preview / code），可作 P2 改进项参考。

### 2.2 Cursor Desktop（2026-05）

- **Agent 模式 UI**：左侧 chat、右侧实时编辑器，agent 在中间 thread 里以"Read file X"/"Edit file Y"折叠步骤展示。oh-my-open-ui 的 `ThinkingTrace` 已有类似形态，但**没有 tool-call UI**（round 9 menu 已点出）。
- **命令面板**：⌘K 命中后立即列出最近命令 + 文件 + symbols + agents。oh-my-open-ui 的 `SearchPalette` 仅含 chats/projects/commands — **可参考 Cursor 的"近期 + 上下文感知"排序**。
- **Sticky 通知带**：长任务完成时顶部出现持久带，可点击进入。oh-my-open-ui 仅有 Toast — 可在评审中提"长任务持久带"作为 P2。

### 2.3 Linear（2026-05）

- **列表行密度**：标准行高 32px，多列 metadata；oh-my-open-ui `ListPage` 行高约 56px，更稀疏（符合 Claude 风格）。**保持差异化**。
- **键盘高度可用**：所有列表行支持 j/k 上下、空格选中、x 删除。oh-my-open-ui 的 `ListPage` 有多选 bulk action 但**无 j/k 键位**— 评审应建议加 `useArrowKeyNav` 类 hook 作为 P1。
- **Loading skeleton**：列表载入时显示真实形状的 skeleton（不是 spinner）。oh-my-open-ui 的 `StreamingShimmer` 已有思路但**未覆盖列表载入** — 可作 P2。

### 2.4 Raycast（2026-05）

- **Kbd 提示一等公民**：每个 action 旁都标 `↵` `⌘K` `Esc`。oh-my-open-ui 的 `<Kbd>` 组件已存在但**只在 SearchPalette 用了**— 评审应建议在 sidebar 账户菜单、modal 按钮、toolbar 全面铺开。
- **空态金句**：每个空界面都有一行小俏皮话（"No drafts to show. Yet."）。oh-my-open-ui 的 `ArtifactEmpty` 只有一句"Open an artifact to preview it here."— 可作 P2"空态文案库"项。

### 2.5 Notion AI（2026-05）

- **气泡内联**：AI 回复直接出现在文档段落下方，可直接 Accept / Reject / Improve。oh-my-open-ui 是独立 chat 容器，**不切换形态**。差异化保持。
- **建议 chips 动效**：suggestion chip 出现时左→右 stagger，鼠标移上去微微弹。oh-my-open-ui 的 `quickActions` 已有 stagger，但**hover 微弹缺失** — 可作 P2 polish。

### 2.6 Perplexity（2026-05）

- **Sources 处理**：编号上标 `[1][2]` 直接插入到 markdown 文本里，hover 显示 popover 含 favicon + title + snippet。oh-my-open-ui 的 `<Citations>` 是底部独立 strip — 视觉更安静、Claude-like，**保持差异化**。但**编号上标 inline** 这种形态可在 `<Markdown>` 中作可选 prop 提供，作为 P2"alternative citation style"。
- **Follow-up suggestions**：回答末尾自动 3 条 follow-up chip。oh-my-open-ui 的 `quickActions` 仅在 welcome 出现，**thread 内部无 follow-up suggestion** — 可作 P2 props 扩展。

---

## 3. 总结 · 本项目的差异化定位（评审报告引用）

oh-my-open-ui 不是"集大成的当代 chat UI"，而是**"warm, restrained, knowledge-tool aesthetic"** 的 Claude-flavored 脚手架。评审报告的"competitor 章节"应该：

1. **明确保留**的差异（不必跟随竞品的事项）：
   - Claude 暖色板 / serif assistant body
   - 6 个 quick action chips 的 welcome（不去模仿 ChatGPT 极简）
   - Citations 底部 strip（不去模仿 Perplexity inline 上标）
   - 列表行高（不去模仿 Linear 高密度）
2. **可选借鉴**的（作为可选/可配置 prop 提供，但不替换默认值）：
   - Cursor 的 tool-call 折叠 UI（拓展 ThinkingTrace）
   - Cursor 的 SearchPalette 上下文感知排序
   - Raycast 的 Kbd 全面铺开
   - Notion AI 的 hover 弹弹
   - Perplexity 的 inline 上标作为 `<Citations variant="inline" />` 可选
3. **应当跟随**的（业界共识 / a11y / 可用性必需）：
   - Linear 的 j/k 键盘导航（列表场景）
   - Loading skeleton 覆盖到列表（不只 chat 流式）
   - 长任务持久带（Toast 之外的 progress band）

---

## 4. 引用与日期

- 所有竞品状态描述以 **2026-05** 为基准，参照博客 / changelog / 公开截图 / 评测文章综合形成。
- 评审报告引用本章节时需注明"informative, not normative"。
