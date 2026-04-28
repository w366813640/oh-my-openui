import { CodeIcon, GraduationCap, PenLine, Sparkles } from '@oh/icons';
import {
  AlertDialog,
  Button,
  CelebrationOverlay,
  FormDialog,
  FormField,
  InfoDialog,
  Input,
  PickerDialog,
  Textarea,
} from '@oh/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = { title: 'Patterns/Modals' };
export default meta;
type Story = StoryObj;

export const All: Story = {
  render: () => {
    const [a, setA] = useState(false);
    const [f, setF] = useState(false);
    const [i, setI] = useState(false);
    const [p, setP] = useState(false);
    const [c, setC] = useState(false);
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setA(true)}>
          Alert
        </Button>
        <Button variant="outline" size="sm" onClick={() => setF(true)}>
          Form
        </Button>
        <Button variant="outline" size="sm" onClick={() => setI(true)}>
          Info
        </Button>
        <Button variant="outline" size="sm" onClick={() => setP(true)}>
          Picker
        </Button>
        <Button variant="outline" size="sm" onClick={() => setC(true)}>
          Celebration
        </Button>

        <AlertDialog
          open={a}
          onOpenChange={setA}
          title="Disconnect Drive?"
          description="Past chats referencing Drive content may stop working."
          destructive
          confirmLabel="Disconnect"
          onConfirm={() => setA(false)}
        />

        <FormDialog
          open={f}
          onOpenChange={setF}
          title="Edit details"
          onSubmit={(fd) => console.log(Object.fromEntries(fd))}
        >
          <FormField label="Name" htmlFor="n">
            <Input id="n" name="name" defaultValue="Project A" />
          </FormField>
          <FormField label="Description" htmlFor="d">
            <Textarea
              id="d"
              name="description"
              rows={3}
              autoGrow={false}
              className="rounded-[10px] border border-[var(--color-border)] p-3 bg-[var(--color-surface-raised)]"
            />
          </FormField>
        </FormDialog>

        <InfoDialog open={i} onOpenChange={setI} title="Send feedback" primaryLabel="Submit">
          <Textarea
            rows={4}
            autoGrow={false}
            className="rounded-[10px] border border-[var(--color-border)] p-3 bg-[var(--color-surface-raised)]"
            placeholder="What worked?"
          />
        </InfoDialog>

        <PickerDialog
          open={p}
          onOpenChange={setP}
          title="Pick a template"
          description="Pick a starting point."
          onSelect={(it) => console.log(it.id)}
          tabs={[
            {
              id: 'apps',
              label: 'Apps',
              items: [
                {
                  id: 'note',
                  title: 'Note app',
                  description: 'Markdown surface',
                  icon: <PenLine size={18} />,
                },
                {
                  id: 'flash',
                  title: 'Flashcards',
                  description: 'Spaced repetition',
                  icon: <GraduationCap size={18} />,
                },
                {
                  id: 'code',
                  title: 'Code playground',
                  description: 'Editable sandbox',
                  icon: <CodeIcon size={18} />,
                },
                {
                  id: 'gal',
                  title: 'Gallery',
                  description: 'Image grid',
                  icon: <Sparkles size={18} />,
                },
              ],
            },
          ]}
        />

        <CelebrationOverlay
          open={c}
          onOpenChange={setC}
          title="Welcome to Pro"
          description="The full scaffolding is unlocked."
        />
      </div>
    );
  },
};
