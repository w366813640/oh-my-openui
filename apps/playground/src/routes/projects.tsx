import { Plus } from '@oh/icons';
import { Badge, ListPageLayout, MainArea } from '@oh/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';
import { mockProjects } from '../mocks/data';

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const toneForStatus = (status?: string) => {
    if (status === 'Active') return 'success';
    if (status === 'Review') return 'warning';
    return 'neutral';
  };

  return (
    <AppFrame>
      <MainArea topbar={<PlaygroundNav />} maxWidth={null}>
        <ListPageLayout
          title="Projects"
          primaryAction={{
            label: 'New project',
            icon: <Plus size={14} />,
            onClick: () => console.log('new project'),
          }}
          searchPlaceholder="Search projects..."
          rows={mockProjects.map((p) => ({
            id: p.id,
            title: p.title,
            meta: `${p.chatCount} chats - ${p.updatedAt} - ${p.description}`,
            trailing: (
              <Badge tone={toneForStatus(p.status)} size="sm">
                {p.status}
              </Badge>
            ),
            onClick: () => navigate({ to: `/projects/${p.id}` as never }),
          }))}
          meta={`${mockProjects.length} projects across prototype, QA, and launch work`}
          emptyMessage="No projects match that search. Create one from the current conversation."
        />
      </MainArea>
    </AppFrame>
  );
}
