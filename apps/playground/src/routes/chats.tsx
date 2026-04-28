import { Trash2 } from '@oh/icons';
import { ListPageLayout, MainArea } from '@oh/ui';
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
          rows={mockChatHistory}
          meta={`${mockChatHistory.length} chats with the assistant`}
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
