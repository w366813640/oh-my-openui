import { Asterisk, Calendar, CodeIcon, Coffee, GraduationCap, HardDrive, PenLine } from '@oh/icons';
import { Composer, Greeting, MainArea, WelcomeStage } from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { AppFrame } from '../components/AppFrame';
import { mockModelOptions, mockUser } from '../mocks/data';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <AppFrame>
      <MainArea maxWidth={null}>
        <WelcomeStage>
          <Greeting name={mockUser.name} size="xl" recency="returning" />
          <Composer
            placeholder={[
              'Review the artifact pane on mobile',
              'Draft a project handoff checklist',
              'Create empty and error states for a connector',
              'Refactor this composer interaction',
              'Summarize the visual audit into release notes',
            ]}
            models={mockModelOptions}
            toggles={[{ id: 'research', label: 'Research', icon: <Asterisk size={12} /> }]}
            quickActions={[
              { id: 'write', label: 'Write copy', icon: <PenLine />, tint: 'neutral' },
              { id: 'learn', label: 'Explain flow', icon: <GraduationCap />, tint: 'amber' },
              { id: 'code', label: 'Patch UI', icon: <CodeIcon />, tint: 'blue' },
              { id: 'life', label: 'Triage states', icon: <Coffee />, tint: 'green' },
              { id: 'cal', label: 'Plan launch', icon: <Calendar />, tint: 'blue' },
              { id: 'drive', label: 'Use files', icon: <HardDrive />, tint: 'green' },
            ]}
            onSubmit={(p) => console.log('submit', p)}
            onQuickActionClick={(id) => console.log('quick', id)}
          />
        </WelcomeStage>
      </MainArea>
    </AppFrame>
  );
}
