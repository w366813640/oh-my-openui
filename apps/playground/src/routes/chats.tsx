import { Trash2 } from '@oh/icons';
import { Badge, ListPageLayout, MainArea } from '@oh/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';
import { mockChatHistory } from '../mocks/data';

export const Route = createFileRoute('/chats')({
  component: ChatsPage,
});

function ChatsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const toneForStatus = (status?: string) => {
    if (status === 'Blocked') return 'destructive';
    if (status === 'Done') return 'success';
    if (status === 'Review') return 'warning';
    if (status === 'Artifact') return 'project';
    return 'neutral';
  };

  return (
    <AppFrame>
      <MainArea topbar={<PlaygroundNav />} maxWidth={null}>
        <ListPageLayout
          title="Your chat history"
          primaryAction={{
            label: 'New chat',
            onClick: () => navigate({ to: '/' as never }),
          }}
          searchPlaceholder="Search your chats..."
          rows={mockChatHistory.map((chat) => ({
            ...chat,
            trailing: (
              <Badge tone={toneForStatus(chat.status)} size="sm">
                {chat.status}
              </Badge>
            ),
          }))}
          meta={`${mockChatHistory.length} chats with the assistant`}
          emptyMessage="No matching conversations. Try a project name, status, or artifact title."
          selectable
          selectedIds={selected}
          onSelectedIdsChange={setSelected}
          bulkActions={[
            {
              label: 'Delete',
              icon: <Trash2 size={14} />,
              onClick: () => setSelected([]),
              destructive: true,
            },
          ]}
        />
      </MainArea>
    </AppFrame>
  );
}
