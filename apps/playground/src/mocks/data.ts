import type { Message } from '@oh/ui';

export const mockUser = {
  name: 'Sam',
  initials: 'SL',
  email: 'sam@example.com',
  plan: 'Pro plan',
};

export const mockRecents = [
  { id: 'r1', title: 'Artifact pane responsive polish', when: '12 minutes ago' },
  { id: 'r2', title: 'Composer attachments + model picker', when: '32 minutes ago' },
  { id: 'r3', title: 'Settings IA for a design-system app', when: '1 hour ago' },
  { id: 'r4', title: 'Generate a coding habit companion', when: '3 hours ago' },
  { id: 'r5', title: 'Empty and error states audit', when: '5 hours ago' },
  { id: 'r6', title: 'Build a local-first chat scaffold', when: 'yesterday' },
];

export const mockStarred = [
  { id: 's1', title: 'Design System Library' },
  { id: 's2', title: 'Digital pet trait model' },
  { id: 's3', title: 'Desktop shell acceptance checklist' },
];

export const mockProjects = [
  {
    id: 'p1',
    title: 'SLMobbin Digital Pets',
    description:
      'A product prototype for coding-habit pets: mood rules, artifact code, launch copy, and handoff notes.',
    chatCount: 8,
    updatedAt: 'Updated 12 min ago',
    status: 'Active',
  },
  {
    id: 'p2',
    title: 'OpenUI Scaffold QA',
    description:
      'Component coverage notes, visual audit screenshots, accessibility checks, and release blockers.',
    chatCount: 14,
    updatedAt: 'Updated yesterday',
    status: 'Review',
  },
  {
    id: 'p3',
    title: 'Agent Workspace Launch',
    description:
      'Default demo content, onboarding prompts, command palette shortcuts, and connector examples.',
    chatCount: 5,
    updatedAt: 'Updated Apr 30',
    status: 'Draft',
  },
];

export const mockChatHistory = [
  {
    id: 'c1',
    title: 'Artifact pane responsive polish',
    meta: 'OpenUI Scaffold QA - Last message 0 seconds ago',
    status: 'Active',
  },
  {
    id: 'c2',
    title: 'Composer attachments and quick action chips',
    meta: 'OpenUI Scaffold QA - Last message 2 minutes ago',
    status: 'Review',
  },
  {
    id: 'c3',
    title: 'Build the digital coding pet prototype',
    meta: 'SLMobbin Digital Pets - Last message 18 minutes ago',
    status: 'Artifact',
  },
  {
    id: 'c4',
    title: 'Settings page information architecture',
    meta: 'Agent Workspace Launch - Last message 46 minutes ago',
    status: 'Spec',
  },
  {
    id: 'c5',
    title: 'Empty states and connector error copy',
    meta: 'OpenUI Scaffold QA - Last message 3 hours ago',
    status: 'Blocked',
  },
  {
    id: 'c6',
    title: 'Token palette dark-mode contrast pass',
    meta: 'Design System Library - Yesterday',
    status: 'Done',
  },
  {
    id: 'c7',
    title: 'Local-first workspace install checklist',
    meta: 'Agent Workspace Launch - Apr 30',
    status: 'Pinned',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    role: 'user',
    initials: 'SL',
    attachments: [{ id: 'u-att-1', name: 'habit-inputs.csv' }],
    content:
      'I want you to design a digital pet that reflects my coding habits. Use the attached habit inputs, then generate example code that lets devs customize traits through variables.',
  },
  {
    id: 'm2',
    role: 'assistant',
    thinking: {
      active: false,
      durationMs: 4200,
      steps: [
        'Mapped the input columns to three visible traits: focus, debug load, and recovery.',
        'Kept the first artifact small enough to scan inside the side pane.',
        'Reserved the richer error and empty states for a follow-up pass.',
      ],
    },
    content: `I'll create a **digital pet that reflects your coding habits**! To make this as useful as possible for you:

1. What type of coding behavior patterns would you like the pet to track and respond to? (e.g. commit frequency, code-quality metrics, debugging sessions, time spent coding)
2. Should the pet's appearance / mood change based on positive habits (like a reward system) or reflect current coding state (like showing stress during debugging)?
3. Do you want the pet to have specific interactions or just be a visual indicator? (e.g. feeding mechanisms, mini-games, notifications)

Once you clarify these, I'll create a comprehensive **TypeScript + React** implementation with customizable variables for different developer preferences!

> Tip: you can also bind the pet to an editor extension event stream — see the snippet below.

\`\`\`ts
import { onEvent } from '@editor/events';

onEvent('focus.tick', ({ minutes }) => {
  pet.update({ focus: minutes });
});
\`\`\``,
  },
  {
    id: 'm3',
    role: 'user',
    initials: 'SL',
    content:
      'Make it personal — track focus duration, debugging time, and coffee breaks. Mood shifts based on positive habits.',
  },
  {
    id: 'm4',
    role: 'assistant',
    content: `Great direction! I'll build a small, themable digital pet whose visuals adapt to your day. The component below:

- Ships with sliders for **sensitivity tuning** of focus / debug / coffee inputs
- Emits state events you can wire to your editor or terminal
- Renders four moods: \`happy\`, \`stressed\`, \`wired\`, and \`resting\`, with smooth transitions

| Input | Maps to | Range |
| --- | --- | --- |
| \`focus\` | uninterrupted coding minutes | 0–240 |
| \`debug\` | active debugging time | 0–90 |
| \`coffee\` | cups today | 0–4 |

Open the artifact on the right to inspect the full source.`,
    artifact: {
      title: 'Digital Coding Pet',
      subtitle: 'Interactive artifact · React + TS',
    },
    attachments: [
      {
        id: 'att-1',
        name: 'CodingPet.tsx',
        kind: 'TypeScript · 96 lines',
        size: '3.4 KB',
      },
      {
        id: 'att-2',
        name: 'pet-states.png',
        kind: 'image/png',
        size: '184 KB',
      },
    ],
    citations: [
      {
        id: '1',
        title: 'Self-Determination Theory and Daily Habits',
        source: 'Deci & Ryan · 2000',
        snippet:
          'Intrinsic motivation persists when feedback loops are tightly coupled to autonomous behaviors — a useful frame for habit-tracking UIs.',
        url: 'https://example.com/sdt',
      },
      {
        id: '2',
        title: 'Tamagotchi UX retrospective',
        source: 'designdiary.io',
        snippet:
          'Pet-state animations need to read in under 200ms or the user perceives the response as broken — keep transition windows tight.',
        url: 'https://example.com/tamagotchi',
      },
      {
        id: '3',
        title: 'Internal · Mood-as-pure-function notes',
        source: 'team wiki',
        snippet:
          'Validated that "stressed" must take precedence over "wired" — caffeinated stress reads as worse than caffeinated focus.',
      },
    ],
  },
  {
    id: 'm5',
    role: 'user',
    initials: 'SL',
    content:
      'Nice. Now make the scaffold feel demo-ready: include an empty state, a connector error state, and a compact handoff checklist in the artifact.',
  },
  {
    id: 'm6',
    role: 'assistant',
    thinking: {
      active: false,
      durationMs: 6100,
      steps: [
        'Separated persistent project data from transient connector status.',
        'Used a calm warning state so errors are noticeable without dominating the chat.',
        'Added short checklist copy that works in the artifact pane and project rail.',
      ],
    },
    content: `I added a small **handoff layer** so the prototype reads like a complete product surface:

- Empty state: shown when the pet has no activity data for the current day.
- Error state: shown when a connector sync fails, with retry and fallback copy.
- Handoff checklist: short enough for the artifact pane, but specific enough for engineers.

\`\`\`ts
const petStates = {
  empty: 'No activity yet - start a focus session to wake the pet.',
  error: 'GitHub sync paused. Using local editor events for now.',
  ready: 'Mood model calibrated from focus, debug, and recovery signals.',
};
\`\`\`

This gives the chat, the artifact, and the project detail page enough narrative density to feel like a real app instead of a loose component gallery.`,
    attachments: [
      {
        id: 'att-3',
        name: 'handoff-checklist.md',
        kind: 'Markdown - 12 lines',
        size: '1.1 KB',
      },
      {
        id: 'att-4',
        name: 'connector-error-state.tsx',
        kind: 'TypeScript - 48 lines',
        size: '2.0 KB',
      },
    ],
    citations: [
      {
        id: '4',
        title: 'Internal scaffold acceptance notes',
        source: 'OpenUI QA',
        snippet:
          'Every demo route should reveal at least one realistic success, empty, or recoverable error state.',
      },
    ],
  },
];

export const mockModelOptions = [
  {
    id: 'sonnet',
    label: 'Sonnet 4',
    description: 'Balanced model for product chat and everyday implementation',
    group: 'Recommended',
  },
  {
    id: 'opus',
    label: 'Opus 4.7',
    description: 'Deep reasoning for architecture, audits, and long artifacts',
    badge: 'New',
    group: 'Recommended',
  },
  {
    id: 'haiku',
    label: 'Haiku 3.5',
    description: 'Fast drafts, labels, summaries, and lightweight UI copy',
    group: 'More models',
  },
];

export const mockProjectInstructions = [
  'Prefer concise, implementation-ready answers with visible assumptions.',
  'Use artifact previews for code, states, and design handoff snippets.',
  'Keep examples local-first and avoid depending on paid services in demos.',
];

export const mockProjectFiles = [
  {
    id: 'f1',
    name: 'pet-mood-rules.md',
    meta: 'Markdown - source of truth',
    status: 'Synced',
  },
  {
    id: 'f2',
    name: 'habit-inputs.csv',
    meta: 'CSV - 7 day sample',
    status: 'Synced',
  },
  {
    id: 'f3',
    name: 'github-connector.json',
    meta: 'Connector paused - retry needed',
    status: 'Error',
  },
];

export const mockProjectMembers = [
  { id: 'u1', name: 'Sam Lee', role: 'Owner', initials: 'SL' },
  { id: 'u2', name: 'Mira Chen', role: 'Design review', initials: 'MC' },
  { id: 'u3', name: 'Dev Bot', role: 'Automation', initials: 'DB' },
];
