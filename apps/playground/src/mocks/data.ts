import type { Message } from '@oh/ui';

export const mockUser = {
  name: 'Sam',
  initials: 'SL',
  email: 'sam@example.com',
  plan: 'Pro plan',
};

export const mockRecents = [
  { id: 'r1', title: 'Productivity tools exploration', when: '12 minutes ago' },
  { id: 'r2', title: 'Remix of Interactive Flashcard L…', when: '32 minutes ago' },
  { id: 'r3', title: 'Exploring productivity tools', when: '1 hour ago' },
  { id: 'r4', title: 'Generate a coding friend', when: '3 hours ago' },
  { id: 'r5', title: 'I want you to design a digital…', when: '5 hours ago' },
  { id: 'r6', title: 'Build a dev companion…', when: 'yesterday' },
];

export const mockStarred = [
  { id: 's1', title: 'Design System Library' },
  { id: 's2', title: 'Build a pet traits based on…' },
];

export const mockProjects = [
  {
    id: 'p1',
    title: 'SLMobbin Digital Pets',
    description:
      'A collection of prompts, designs, and code for digital pets based on coding habits. Organize variants and customizations here to build and extend your pet easily.',
    chatCount: 1,
  },
  {
    id: 'p2',
    title: 'UI Scaffolding Notes',
    description:
      'A scratch space for cataloguing component patterns, design tokens, and motion presets.',
    chatCount: 4,
  },
];

export const mockChatHistory = [
  {
    id: 'c1',
    title: 'Dev a buddy to reflect your coding habits today',
    meta: 'Last message 0 seconds ago',
  },
  { id: 'c2', title: 'Create a coding buddy', meta: 'Last message 2 minutes ago' },
  { id: 'c3', title: 'Build your digital coding pet', meta: 'Last message 2 minutes ago' },
  { id: 'c4', title: 'Coding habits digital pet', meta: 'Last message 2 minutes ago' },
  { id: 'c5', title: 'I want you to design a digital…', meta: 'Last message 3 hours ago' },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    role: 'user',
    initials: 'SL',
    content:
      'I want you to design a digital pet that reflects my coding habits. Generate example code in JavaScript + HTML that allows devs to customize traits via variables.',
  },
  {
    id: 'm2',
    role: 'assistant',
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
- Renders three moods: \`happy\`, \`stressed\`, \`wired\`, with smooth transitions

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
  },
];

export const mockModelOptions = [
  {
    id: 'sonnet',
    label: 'Sonnet 4',
    description: 'Smart, efficient model for everyday use',
    group: 'Recommended',
  },
  {
    id: 'opus',
    label: 'Opus 4.7',
    description: 'Powerful, large model for complex challenges',
    badge: 'New',
    group: 'Recommended',
  },
  {
    id: 'haiku',
    label: 'Haiku 3.5',
    description: 'Fast, lightweight model for quick replies',
    group: 'More models',
  },
];
