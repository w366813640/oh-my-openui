/**
 * Default UI dictionaries.
 *
 * The keys are the canonical English string (English keys make missing
 * translations gracefully degrade to readable English). Consumers can extend
 * with their own keys; unknown keys fall back to the key itself.
 */

import type { Dictionary, Locale } from './types';

export const enDictionary: Dictionary = {
  // Common verbs / actions
  copy: 'Copy',
  retry: 'Retry',
  send: 'Send',
  cancel: 'Cancel',
  save: 'Save',
  share: 'Share',
  edit: 'Edit',
  delete: 'Delete',
  search: 'Search',
  settings: 'Settings',
  language: 'Language',
  theme: 'Theme',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  signOut: 'Sign out',
  upgrade: 'Upgrade plan',
  newChat: 'New chat',
  starred: 'Starred',
  recents: 'Recents',
  projects: 'Projects',
  artifacts: 'Artifacts',
  chats: 'Chats',
  account: 'Account',
  appearance: 'Appearance',
  privacy: 'Privacy',
  features: 'Features',
  connectors: 'Connectors',
  profile: 'Profile',
  getHelp: 'Get help',

  // Composer
  'composer.placeholder.default': 'How can I help you today?',
  'composer.placeholder.reply': 'Reply to assistant…',
  'composer.placeholder.idea': 'Describe what you want to build',
  'composer.placeholder.research': 'Ask anything — I can use research',
  'composer.send': 'Send',
  'composer.stop': 'Stop',
  'composer.attach': 'Attach',
  'composer.research': 'Research',
  'composer.dropToAttach': 'Drop to attach',
  'composer.modelPicker': 'Model',
  'composer.label': 'Message composer',

  // Search palette
  'search.placeholder': 'Search anything…',
  'search.empty': 'No results',
  'search.recent': 'Recent',
  'search.actions': 'Actions',
  'search.help': 'Move with ↑ ↓, open with ↵',

  // Greeting
  'greeting.morning': 'Good morning, {name}',
  'greeting.afternoon': 'Good afternoon, {name}',
  'greeting.evening': 'Good evening, {name}',
  'greeting.night': 'Working late, {name}?',
  'greeting.returning': '{name} returns!',
  'greeting.welcome': 'Welcome back, {name}',
  'greeting.whatsNew': "What's new, {name}?",

  // Quick actions
  'quick.write': 'Write',
  'quick.learn': 'Learn',
  'quick.code': 'Code',
  'quick.fromDrive': 'From Drive',
  'quick.fromCalendar': 'From Calendar',

  // Settings
  'settings.title': 'Settings',
  'settings.appearance.theme': 'Theme',
  'settings.appearance.brand': 'Brand palette',
  'settings.appearance.motion': 'Motion preferences',
  'settings.appearance.reduceMotion': 'Reduce motion',
  'settings.appearance.animatedIcons': 'Animated icons',
  'settings.account.plan': 'Plan',
  'settings.account.member': 'Member since',
  'settings.privacy.telemetry': 'Send anonymous usage data',

  // Disclaimer
  'thread.disclaimer': 'Responses may contain mistakes. Please double-check important answers.',
};

export const zhDictionary: Dictionary = {
  copy: '复制',
  retry: '重试',
  send: '发送',
  cancel: '取消',
  save: '保存',
  share: '分享',
  edit: '编辑',
  delete: '删除',
  search: '搜索',
  settings: '设置',
  language: '语言',
  theme: '主题',
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
  signOut: '退出登录',
  upgrade: '升级套餐',
  newChat: '新对话',
  starred: '已收藏',
  recents: '最近',
  projects: '项目',
  artifacts: '工件',
  chats: '对话',
  account: '账户',
  appearance: '外观',
  privacy: '隐私',
  features: '功能',
  connectors: '连接器',
  profile: '个人资料',
  getHelp: '获取帮助',

  'composer.placeholder.default': '今天我能帮你做点什么？',
  'composer.placeholder.reply': '回复助手……',
  'composer.placeholder.idea': '描述你想构建的内容',
  'composer.placeholder.research': '随便问 — 可以联网研究',
  'composer.send': '发送',
  'composer.stop': '停止',
  'composer.attach': '附件',
  'composer.research': '研究',
  'composer.dropToAttach': '松手即可附加',
  'composer.modelPicker': '模型',
  'composer.label': '消息编辑器',

  'search.placeholder': '搜索任何内容……',
  'search.empty': '暂无结果',
  'search.recent': '最近',
  'search.actions': '操作',
  'search.help': '↑ ↓ 切换，↵ 打开',

  'greeting.morning': '早上好，{name}',
  'greeting.afternoon': '下午好，{name}',
  'greeting.evening': '晚上好，{name}',
  'greeting.night': '还在工作呀，{name}？',
  'greeting.returning': '{name} 回来啦！',
  'greeting.welcome': '欢迎回来，{name}',
  'greeting.whatsNew': '{name}，最近怎么样？',

  'quick.write': '写作',
  'quick.learn': '学习',
  'quick.code': '编程',
  'quick.fromDrive': '从云盘',
  'quick.fromCalendar': '从日历',

  'settings.title': '设置',
  'settings.appearance.theme': '主题',
  'settings.appearance.brand': '品牌色',
  'settings.appearance.motion': '动效偏好',
  'settings.appearance.reduceMotion': '减少动画',
  'settings.appearance.animatedIcons': '图标动画',
  'settings.account.plan': '套餐',
  'settings.account.member': '加入时间',
  'settings.privacy.telemetry': '发送匿名使用数据',

  'thread.disclaimer': '回答可能存在错误，请对重要内容做二次核对。',
};

export const builtInDictionaries: Record<Locale, Dictionary> = {
  en: enDictionary,
  zh: zhDictionary,
};
