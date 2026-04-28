import { Asterisk, Calendar, CodeIcon, Coffee, GraduationCap, HardDrive, PenLine } from '@oh/icons';
import { Composer } from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Composer> = {
  title: 'Patterns/Composer',
  component: Composer,
};
export default meta;
type Story = StoryObj<typeof Composer>;

const models = [
  { id: 'sonnet', label: 'Sonnet 4', description: 'Smart, efficient model for everyday use' },
  { id: 'opus', label: 'Opus 4.7', description: 'Powerful, large model for complex challenges' },
];

export const Default: Story = {
  render: () => (
    <div className="max-w-[680px] mx-auto">
      <Composer
        models={models}
        toggles={[{ id: 'research', label: 'Research', icon: <Asterisk size={12} /> }]}
        quickActions={[
          { id: 'write', label: 'Write', icon: <PenLine />, tint: 'neutral' },
          { id: 'learn', label: 'Learn', icon: <GraduationCap />, tint: 'amber' },
          { id: 'code', label: 'Code', icon: <CodeIcon />, tint: 'blue' },
          { id: 'life', label: 'Life stuff', icon: <Coffee />, tint: 'green' },
          { id: 'cal', label: 'From Calendar', icon: <Calendar />, tint: 'blue' },
          { id: 'drive', label: 'From Drive', icon: <HardDrive />, tint: 'green' },
        ]}
      />
    </div>
  ),
};

export const Sending: Story = {
  render: () => (
    <div className="max-w-[680px] mx-auto">
      <Composer models={models} status="sending" defaultValue="Generating reply..." />
    </div>
  ),
};
