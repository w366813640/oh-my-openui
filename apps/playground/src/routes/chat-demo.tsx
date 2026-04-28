import { Share } from '@oh/icons';
import {
  Button,
  Composer,
  MainArea,
  MessageList,
  SelectionToolbar,
  ThreadDisclaimer,
} from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';
import { AppFrame, PageTopbar } from '../components/AppFrame';
import { mockMessages, mockModelOptions } from '../mocks/data';

export const Route = createFileRoute('/chat-demo')({
  component: ChatDemo,
});

function ChatDemo() {
  const threadRef = useRef<HTMLDivElement>(null);
  return (
    <AppFrame>
      <MainArea
        topbar={
          <PageTopbar
            title="Coding habits digital pet"
            trailing={
              <Button variant="outline" size="sm">
                <Share size={12} /> Share
              </Button>
            }
          />
        }
        maxWidth={null}
      >
        <div ref={threadRef} className="mx-auto w-full max-w-[720px] pb-32">
          <MessageList
            messages={mockMessages}
            onCopy={(id) => console.log('copy', id)}
            onRetry={(id) => console.log('retry', id)}
            onFeedback={(id, k) => console.log('fb', id, k)}
            footer={<ThreadDisclaimer />}
          />
        </div>
        <SelectionToolbar scopeRef={threadRef} />

        <div className="sticky bottom-0 left-0 right-0 mx-auto w-full max-w-[720px] pb-4 pt-2 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/85 to-transparent">
          <Composer
            placeholder="Reply to assistant..."
            models={mockModelOptions}
            toggles={[{ id: 'research', label: 'Research' }]}
          />
        </div>
      </MainArea>
    </AppFrame>
  );
}
