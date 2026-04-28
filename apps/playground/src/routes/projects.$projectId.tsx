import { Star } from '@oh/icons';
import {
  Composer,
  IconButton,
  ListPageLayout,
  MainArea,
  ProjectDetailLayout,
  ProjectRailCard,
  ProjectRailEmpty,
} from '@oh/ui';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { AppFrame } from '../components/AppFrame';
import { mockChatHistory, mockModelOptions, mockProjects } from '../mocks/data';

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const navigate = useNavigate();
  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0]!;

  return (
    <AppFrame>
      <MainArea maxWidth={null}>
        <ProjectDetailLayout
          backLabel="All projects"
          onBack={() => navigate({ to: '/projects' as never })}
          title={project.title}
          description={project.description}
          actions={
            <>
              <IconButton size="md" label="Star">
                <Star />
              </IconButton>
            </>
          }
          composer={<Composer placeholder="How can I help you today?" models={mockModelOptions} />}
          sideRail={
            <>
              <ProjectRailCard title="Instructions" onAdd={() => console.log('add')}>
                <ProjectRailEmpty>
                  Add instructions to tailor the assistant's responses for this project.
                </ProjectRailEmpty>
              </ProjectRailCard>
              <ProjectRailCard title="Files" onAdd={() => console.log('add')}>
                <ProjectRailEmpty>
                  Add PDFs, documents, or other text to reference in this project.
                </ProjectRailEmpty>
              </ProjectRailCard>
            </>
          }
        >
          <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-3">Recent chats</h3>
          <ListPageLayout
            title=""
            className="px-0 py-0 max-w-none"
            searchPlaceholder="Search chats in project..."
            rows={mockChatHistory.slice(0, 4).map((c) => ({
              id: c.id,
              title: c.title,
              meta: c.meta,
            }))}
          />
        </ProjectDetailLayout>
      </MainArea>
    </AppFrame>
  );
}
