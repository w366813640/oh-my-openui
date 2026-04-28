import {
  Asterisk,
  Calendar,
  CodeIcon,
  GraduationCap,
  HardDrive,
  PenLine,
  Sparkles,
} from '@oh/icons';
import {
  AlertDialog,
  Button,
  CelebrationOverlay,
  FormDialog,
  FormField,
  InfoDialog,
  Input,
  MainArea,
  PickerDialog,
  Textarea,
} from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';

export const Route = createFileRoute('/modals')({
  component: ModalsPage,
});

function ModalsPage() {
  const [alert, setAlert] = useState(false);
  const [form, setForm] = useState(false);
  const [info, setInfo] = useState(false);
  const [picker, setPicker] = useState(false);
  const [celeb, setCeleb] = useState(false);

  return (
    <AppFrame>
      <MainArea topbar={<PlaygroundNav />} maxWidth={null}>
        <div className="mx-auto w-full max-w-[680px] py-12">
          <h1 className="text-[26px] font-serif mb-2">Modal templates</h1>
          <p className="text-[13.5px] text-[var(--color-text-muted)] mb-8">
            Five reusable templates: alert, form, info, picker, celebration.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <ModalCard title="Alert dialog (destructive)">
              <Button variant="outline" size="md" onClick={() => setAlert(true)}>
                Open alert
              </Button>
            </ModalCard>
            <ModalCard title="Form dialog">
              <Button variant="outline" size="md" onClick={() => setForm(true)}>
                Open form
              </Button>
            </ModalCard>
            <ModalCard title="Info dialog with content">
              <Button variant="outline" size="md" onClick={() => setInfo(true)}>
                Open info
              </Button>
            </ModalCard>
            <ModalCard title="Picker dialog (tabs)">
              <Button variant="outline" size="md" onClick={() => setPicker(true)}>
                Open picker
              </Button>
            </ModalCard>
            <ModalCard title="Celebration overlay">
              <Button variant="outline" size="md" onClick={() => setCeleb(true)}>
                Open celebration
              </Button>
            </ModalCard>
          </div>
        </div>
      </MainArea>

      <AlertDialog
        open={alert}
        onOpenChange={setAlert}
        title="Disconnect Google Drive?"
        description="You won't be able to continue any previous chats that reference content from Google Docs."
        cancelLabel="Cancel"
        confirmLabel="Disconnect"
        destructive
        onConfirm={() => setAlert(false)}
      />

      <FormDialog
        open={form}
        onOpenChange={setForm}
        title="Edit details"
        submitLabel="Save"
        onSubmit={(fd) => console.log('save', Object.fromEntries(fd))}
      >
        <FormField label="Name" htmlFor="proj-name">
          <Input id="proj-name" name="name" defaultValue="SLMobbin Digital Pets" />
        </FormField>
        <FormField label="Description" htmlFor="proj-desc">
          <Textarea
            id="proj-desc"
            name="description"
            defaultValue="A collection of prompts, designs, and code for digital pets based on coding habits."
            rows={4}
            autoGrow={false}
            className="rounded-[10px] border border-[var(--color-border)] p-3 bg-[var(--color-surface-raised)]"
          />
        </FormField>
      </FormDialog>

      <InfoDialog
        open={info}
        onOpenChange={setInfo}
        title="Send feedback"
        description="Your feedback helps improve the experience."
        primaryLabel="Submit"
        secondaryLabel="Cancel"
        onPrimary={() => console.log('submit feedback')}
      >
        <Textarea
          name="feedback"
          rows={5}
          autoGrow={false}
          className="rounded-[10px] border border-[var(--color-border)] p-3 bg-[var(--color-surface-raised)]"
          placeholder="What worked well? What was confusing?"
        />
      </InfoDialog>

      <PickerDialog
        open={picker}
        onOpenChange={setPicker}
        title="Pick a template"
        description="Pick a starting point for your next artifact."
        tabs={[
          {
            id: 'apps',
            label: 'Apps & sites',
            items: [
              {
                id: 'note',
                title: 'Note-taking app',
                description: 'A focused writing surface with markdown support.',
                icon: <PenLine size={18} className="text-[var(--color-info)]" />,
              },
              {
                id: 'flash',
                title: 'Flashcard learner',
                description: 'Spaced-repetition cards from a topic.',
                icon: <GraduationCap size={18} className="text-[var(--color-warning)]" />,
              },
              {
                id: 'code',
                title: 'Code playground',
                description: 'Editable React/HTML sandbox.',
                icon: <CodeIcon size={18} className="text-[var(--color-info)]" />,
              },
              {
                id: 'gallery',
                title: 'Image gallery',
                description: 'Responsive grid + lightbox.',
                icon: <Sparkles size={18} />,
              },
            ],
          },
          {
            id: 'tools',
            label: 'Productivity tools',
            items: [
              {
                id: 'cal',
                title: 'Calendar widget',
                description: 'Compact week view with event slots.',
                icon: <Calendar size={18} className="text-[var(--color-info)]" />,
              },
              {
                id: 'drive',
                title: 'Drive picker',
                description: 'Browse files from Drive in a panel.',
                icon: <HardDrive size={18} className="text-[var(--color-success)]" />,
              },
            ],
          },
        ]}
        onSelect={(item) => console.log('picked', item.id)}
      />

      <CelebrationOverlay
        open={celeb}
        onOpenChange={setCeleb}
        title="Welcome to Pro"
        description="You've unlocked the full scaffolding feature set — themes, motion, layouts, and brand replacement."
        primaryLabel="Get started"
        secondaryLabel="Maybe later"
        illustration={
          <span className="relative inline-flex items-center justify-center h-24 w-24 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-accent)] shadow-[var(--shadow-card)]">
            <Asterisk size={56} />
          </span>
        }
      />
    </AppFrame>
  );
}

function ModalCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="text-[13px] font-medium text-[var(--color-text)] mb-3">{title}</div>
      {children}
    </div>
  );
}
