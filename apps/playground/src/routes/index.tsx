import { BrandSwitcher } from '@oh/brand';
import { Asterisk, Calendar, CodeIcon, Coffee, GraduationCap, HardDrive, PenLine } from '@oh/icons';
import { Composer, Greeting, MainArea, WelcomeStage } from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';
import { mockModelOptions, mockUser } from '../mocks/data';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <AppFrame>
      <MainArea topbar={<PlaygroundNav />} maxWidth={null}>
        <WelcomeStage>
          <Greeting name={mockUser.name} size="xl" recency="returning" />
          <Composer
            placeholder={[
              'How can I help you today?',
              'Plan a 3-day Tokyo itinerary',
              'Refactor this React hook for clarity',
              'Summarize this paper in plain English',
              'Draft a polite cancellation email',
            ]}
            models={mockModelOptions}
            toggles={[{ id: 'research', label: 'Research', icon: <Asterisk size={12} /> }]}
            quickActions={[
              { id: 'write', label: 'Write', icon: <PenLine />, tint: 'neutral' },
              { id: 'learn', label: 'Learn', icon: <GraduationCap />, tint: 'amber' },
              { id: 'code', label: 'Code', icon: <CodeIcon />, tint: 'blue' },
              { id: 'life', label: 'Life stuff', icon: <Coffee />, tint: 'green' },
              { id: 'cal', label: 'From Calendar', icon: <Calendar />, tint: 'blue' },
              { id: 'drive', label: 'From Drive', icon: <HardDrive />, tint: 'green' },
            ]}
            onSubmit={(p) => console.log('submit', p)}
            onQuickActionClick={(id) => console.log('quick', id)}
          />
          <div className="flex flex-col items-center gap-2 pt-2">
            <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--color-text-subtle)]">
              Try a brand palette
            </span>
            <BrandSwitcher />
          </div>
        </WelcomeStage>
      </MainArea>
    </AppFrame>
  );
}
