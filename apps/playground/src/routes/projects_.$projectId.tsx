import { Star } from '@oh/icons';
import {
  Avatar,
  AvatarFallback,
  Badge,
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
import {
  mockChatHistory,
  mockModelOptions,
  mockProjectFiles,
  mockProjectInstructions,
  mockProjectMembers,
  mockProjects,
} from '../mocks/data';

// Trailing-underscore (`projects_`) escapes the `routes/projects.tsx` layout so
// `/projects/:id` mounts standalone instead of being treated as a nested child
// of the projects-list page (which doesn't render an <Outlet />).
export const Route = createFileRoute('/projects_/$projectId')({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/projects_/$projectId' });
  const navigate = useNavigate();
  const project = mockProjects.find((p) => p.id === projectId) ?? mockProjects[0]!;
  const toneForStatus = (status?: string) => {
    if (status === 'Error' || status === 'Blocked') return 'destructive';
    if (status === 'Synced' || status === 'Done' || status === 'Active') return 'success';
    if (status === 'Review') return 'warning';
    if (status === 'Artifact') return 'project';
    return 'neutral';
  };

  return (
    <AppFrame>
      <MainArea maxWidth={null}>
        <ProjectDetailLayout
          backLabel="All projects"
          onBack={() => navigate({ to: '/projects' as never })}
          title={project.title}
          description={`${project.description} ${project.updatedAt}.`}
          actions={
            <>
              <Badge tone={toneForStatus(project.status)}>{project.status}</Badge>
              <IconButton size="md" label="Star">
                <Star />
              </IconButton>
            </>
          }
          composer={
            <Composer
              placeholder="Ask about this project, generate an artifact, or update the handoff checklist..."
              models={mockModelOptions}
              toggles={[
                { id: 'context', label: 'Use project context', defaultPressed: true },
                { id: 'artifact', label: 'Create artifact' },
              ]}
            />
          }
          sideRail={
            <>
              <ProjectRailCard title="Instructions" onAdd={() => console.log('add')}>
                <ul className="space-y-2">
                  {mockProjectInstructions.map((instruction) => (
                    <li
                      key={instruction}
                      className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-[12px] leading-relaxed text-[var(--color-text-muted)]"
                    >
                      {instruction}
                    </li>
                  ))}
                </ul>
              </ProjectRailCard>
              <ProjectRailCard title="Files" onAdd={() => console.log('add')}>
                <ul className="space-y-2">
                  {mockProjectFiles.map((file) => (
                    <li
                      key={file.id}
                      className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[12.5px] font-medium text-[var(--color-text)]">
                          {file.name}
                        </span>
                        <Badge tone={toneForStatus(file.status)} size="sm">
                          {file.status}
                        </Badge>
                      </div>
                      <div className="mt-0.5 truncate text-[11.5px] text-[var(--color-text-muted)]">
                        {file.meta}
                      </div>
                    </li>
                  ))}
                </ul>
              </ProjectRailCard>
              <ProjectRailCard title="Members" onAdd={() => console.log('add')}>
                <ul className="space-y-2">
                  {mockProjectMembers.map((member) => (
                    <li key={member.id} className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12.5px] font-medium text-[var(--color-text)]">
                          {member.name}
                        </div>
                        <div className="truncate text-[11.5px] text-[var(--color-text-muted)]">
                          {member.role}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ProjectRailCard>
              <ProjectRailCard title="Open risks">
                <ProjectRailEmpty>No unresolved visual regressions in this project.</ProjectRailEmpty>
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
              trailing: (
                <Badge tone={toneForStatus(c.status)} size="sm">
                  {c.status}
                </Badge>
              ),
            }))}
            emptyMessage="No project chats match that search."
          />
        </ProjectDetailLayout>
      </MainArea>
    </AppFrame>
  );
}
