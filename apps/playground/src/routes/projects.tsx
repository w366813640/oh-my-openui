import { Plus } from '@oh/icons';
import { ListPageLayout, MainArea } from '@oh/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AppFrame, PlaygroundNav } from '../components/AppFrame';
import { mockProjects } from '../mocks/data';

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
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
            meta: p.description,
            onClick: () => navigate({ to: `/projects/${p.id}` as never }),
          }))}
        />
      </MainArea>
    </AppFrame>
  );
}
