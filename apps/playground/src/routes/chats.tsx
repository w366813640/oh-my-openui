import { Trash2 } from '@oh/icons';
import { Badge, ListPageLayout, ListSkeleton, MainArea } from '@oh/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';
import { mockChatHistory } from '../mocks/data';

export const Route = createFileRoute('/chats')({
  component: ChatsPage,
});

function ChatsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  /* Demo: simulate a 250ms cold load so the ListSkeleton is visible on
   * first paint. Real consumers would gate this on their fetcher's
   * loading state. */
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, []);
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
        {loading ? (
          <div className="mx-auto w-full max-w-[680px] px-6 py-8">
            <div className="mb-4 h-7 w-[40%] rounded-[6px] bg-[var(--color-surface-muted)]" />
            <div className="mb-4 h-10 w-full rounded-[12px] bg-[var(--color-surface-muted)]" />
            <ListSkeleton rows={6} />
          </div>
        ) : (
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
        )}
      </MainArea>
    </AppFrame>
  );
}
