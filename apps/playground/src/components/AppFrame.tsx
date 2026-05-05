import { BrandSwitcherProvider, useBrand } from '@oh/brand';
import {
  FolderOpen,
  HelpCircle,
  Languages,
  Layout,
  LogOut,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
} from '@oh/icons';
import {
  AppShell,
  BrandMark,
  DefaultPlanBadge,
  I18nProvider,
  Kbd,
  type Locale,
  ModalStackProvider,
  SearchPalette,
  type SearchPaletteItem,
  Sidebar,
  SidebarAccount,
  SidebarBody,
  SidebarBrand,
  SidebarFooter,
  SidebarHeader,
  SidebarLinkItem,
  SidebarNavItem,
  SidebarPrimaryAction,
  SidebarSectionLabel,
  SidebarStateProvider,
  ThemeProvider,
  TitleBarControls,
  ToastProvider,
  TooltipProvider,
  useCommandKToggle,
  useI18n,
  useSidebarState,
  useTheme,
} from '@oh/ui';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { type ReactNode, useMemo, useState } from 'react';
import { mockRecents, mockStarred, mockUser } from '../mocks/data';

export function AppFrame({
  children,
  artifact,
}: {
  children: ReactNode;
  artifact?: ReactNode;
}) {
  // Note: do NOT pass `defaultMode` to <ThemeProvider> here. Each route
  // mounts its own <AppFrame>, so a hard-coded default would clobber the
  // user's persisted theme on every client-side navigation. Letting
  // ThemeProvider fall through to readStoredTheme() (localStorage) keeps
  // the choice sticky across routes and HMR reloads.
  return (
    <ThemeProvider>
      <I18nProvider initialLocale="en">
        <BrandSwitcherProvider initialBrandName="Aurora">
          <TooltipProvider delayDuration={150}>
            <ToastProvider>
              <ModalStackProvider>
                <SidebarStateProvider defaultExpanded={false}>
                  <FrameShell artifact={artifact}>{children}</FrameShell>
                </SidebarStateProvider>
              </ModalStackProvider>
            </ToastProvider>
          </TooltipProvider>
        </BrandSwitcherProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

function FrameShell({ children, artifact }: { children: ReactNode; artifact?: ReactNode }) {
  const { expanded } = useSidebarState();
  const { open: searchOpen, setOpen: setSearchOpen } = useCommandKToggle();
  const navigate = useNavigate();

  const searchItems = useMemo<SearchPaletteItem[]>(
    () => [
      ...mockStarred.map((s) => ({
        id: `star-${s.id}`,
        label: s.title,
        kind: 'chat' as const,
        group: 'Starred',
        description: 'Starred chat',
      })),
      ...mockRecents.map((r) => ({
        id: `recent-${r.id}`,
        label: r.title,
        kind: 'chat' as const,
        group: 'Recents',
        description: 'Recent conversation',
      })),
      {
        id: 'cmd-new',
        label: 'New chat',
        kind: 'command',
        group: 'Commands',
        trailing: <Kbd>⌘N</Kbd>,
        searchKey: 'new chat compose',
      },
      {
        id: 'cmd-projects',
        label: 'Browse projects',
        kind: 'command',
        group: 'Commands',
        searchKey: 'projects browse',
      },
      {
        id: 'cmd-settings',
        label: 'Open settings',
        kind: 'command',
        group: 'Commands',
        trailing: <Kbd>⌘,</Kbd>,
        searchKey: 'settings preferences',
      },
    ],
    [],
  );

  const handleSelect = (item: SearchPaletteItem) => {
    if (item.id === 'cmd-new') navigate({ to: '/' as never });
    else if (item.id === 'cmd-projects') navigate({ to: '/projects' as never });
    else if (item.id === 'cmd-settings') navigate({ to: '/settings' as never });
    else navigate({ to: '/chat-demo' as never });
  };

  return (
    <>
      <TitleBarControls />
      <AppShell
        sidebar={<AppSidebar onOpenSearch={() => setSearchOpen(true)} />}
        sidebarExpanded={expanded}
        artifact={artifact}
      >
        {children}
      </AppShell>
      <SearchPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={searchItems}
        onSelect={handleSelect}
      />
    </>
  );
}

function AppSidebar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { expanded, toggle } = useSidebarState();
  const { mode, setMode, resolved } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const brand = useBrand();
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <Sidebar expanded={expanded}>
      <SidebarHeader>
        <div className={expanded ? 'flex items-center justify-between' : 'flex h-8 items-center justify-center'}>
          {expanded ? <SidebarBrand expanded={expanded} logo={brand.logo} name={brand.name} /> : null}
          <button
            type="button"
            onClick={toggle}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)]"
          >
            <Layout size={14} />
          </button>
        </div>

        <SidebarPrimaryAction expanded={expanded} onClick={() => navigate({ to: '/' as never })} />

        <SidebarNavItem
          icon={Search}
          label={t('search')}
          expanded={expanded}
          onClick={onOpenSearch}
          trailing={expanded ? <Kbd>⌘K</Kbd> : null}
        />
      </SidebarHeader>

      <SidebarBody>
        <SidebarNavItem
          icon={MessageSquare}
          label={t('chats')}
          expanded={expanded}
          active={currentPath === '/chats'}
          onClick={() => navigate({ to: '/chats' as never })}
        />
        <SidebarNavItem
          icon={FolderOpen}
          label={t('projects')}
          expanded={expanded}
          active={currentPath.startsWith('/projects')}
          onClick={() => navigate({ to: '/projects' as never })}
        />
        <SidebarNavItem
          icon={Sparkles}
          label={t('artifacts')}
          expanded={expanded}
          active={currentPath === '/artifact-demo'}
          onClick={() => navigate({ to: '/artifact-demo' as never })}
        />

        {expanded ? (
          <>
            <SidebarSectionLabel expanded={expanded}>{t('starred')}</SidebarSectionLabel>
            <ul>
              {mockStarred.map((s) => (
                <li key={s.id}>
                  <SidebarLinkItem label={s.title} />
                </li>
              ))}
            </ul>

            <SidebarSectionLabel expanded={expanded}>{t('recents')}</SidebarSectionLabel>
            <ul>
              {mockRecents.map((r) => (
                <li key={r.id}>
                  <SidebarLinkItem label={r.title} />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </SidebarBody>

      <SidebarFooter>
        <SidebarAccount
          expanded={expanded}
          name={`${mockUser.name} Lee`}
          subtitle={mockUser.plan}
          planBadge={expanded ? <DefaultPlanBadge>Pro</DefaultPlanBadge> : null}
          actions={[
            {
              id: 'settings',
              label: t('settings'),
              icon: Settings,
              shortcut: '⌘,',
              onSelect: () => navigate({ to: '/settings' as never }),
            },
            {
              id: 'theme',
              label: `${t('theme')} · ${mode}`,
              icon: resolved === 'dark' ? Sun : Moon,
              onSelect: () => setMode(resolved === 'dark' ? 'light' : 'dark'),
            },
            {
              id: 'language',
              label: `${t('language')} · ${locale === 'zh' ? '中文' : 'English'}`,
              icon: Languages,
              onSelect: () => setLocale((locale === 'zh' ? 'en' : 'zh') as Locale),
            },
            { id: 'help', label: t('getHelp'), icon: HelpCircle },
            { id: 'upgrade', label: t('upgrade'), icon: Sparkles },
            { id: 'logout', label: t('signOut'), icon: LogOut, tone: 'destructive' },
          ]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

/** Top breadcrumb / share button bar for inside main pages. */
export function PageTopbar({
  title,
  trailing,
}: {
  title?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-[13px] text-[var(--color-text-muted)] truncate">{title}</div>
      <div className="flex items-center gap-1">{trailing}</div>
    </div>
  );
}

/** Tiny helper for nav links in route components. */
export function PlaygroundNav() {
  const links = [
    ['/', 'Welcome'],
    ['/chat-demo', 'Chat'],
    ['/artifact-demo', 'Artifact'],
    ['/chats', 'Chats list'],
    ['/projects', 'Projects'],
    ['/projects/p1', 'Project detail'],
    ['/settings', 'Settings'],
    ['/modals', 'Modals'],
    ['/tokens', 'Tokens'],
    ['/motion', 'Motion'],
  ] as const;
  const router = useRouterState();
  const navigate = useNavigate();
  const current = router.location.pathname;
  return (
    <nav className="flex flex-wrap gap-1 px-3 py-2 text-[12px]">
      {links.map(([href, label]) => (
        <button
          key={href}
          type="button"
          onClick={() => navigate({ to: href as never })}
          className={`px-2 py-1 rounded-[6px] hover:bg-[var(--color-surface-muted)] ${
            current === href
              ? 'bg-[var(--color-surface-muted)] text-[var(--color-text)]'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

/** Convenience: brand asterisk used in welcome. */
export function BrandAsterisk({ size = 26 }: { size?: number }) {
  const _brand = useBrand();
  return <BrandMark size={size} motion="hover" />;
}

/** No-op state to keep React-router happy in some routes. */
export function _useNoop() {
  return useState(0);
}
