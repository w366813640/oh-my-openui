import { BrandSwitcher, useBrand } from '@oh/brand';
import {
  Bell,
  CodeIcon,
  Github,
  HardDrive,
  ImageIcon,
  Languages,
  Layout,
  Lock,
  LogOut,
  Monitor,
  Moon,
  Settings as SettingsIcon,
  Sliders,
  Sparkles,
  Sun,
  User,
} from '@oh/icons';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  DefaultPlanBadge,
  type Locale,
  MainArea,
  SettingsRow,
  SettingsSection,
  SidebarAccount,
  Switch,
  TwoPaneSettingsLayout,
  useI18n,
  useTheme,
} from '@oh/ui';
import { createFileRoute } from '@tanstack/react-router';
import { type ReactNode, useState } from 'react';
import { AppFrame } from '../components/AppFrame';
import { mockUser } from '../mocks/data';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  // All theme / i18n / brand hooks must be inside <AppFrame>'s providers,
  // so we delegate the actual content to a child component.
  return (
    <AppFrame>
      <SettingsContent />
    </AppFrame>
  );
}

function SettingsContent() {
  const [active, setActive] = useState('appearance');
  const { mode, setMode } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const brand = useBrand();
  const items = [
    { id: 'profile', label: t('profile'), icon: <User /> },
    { id: 'account', label: t('account'), icon: <SettingsIcon /> },
    { id: 'appearance', label: t('appearance'), icon: <ImageIcon /> },
    { id: 'privacy', label: t('privacy'), icon: <Lock /> },
    { id: 'features', label: t('features'), icon: <Sliders /> },
    { id: 'connectors', label: t('connectors'), icon: <Layout /> },
  ];
  const [notif, setNotif] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hapticIcons, setHapticIcons] = useState(true);

  const localeOptions: { id: Locale; label: string; native: string }[] = [
    { id: 'en', label: 'English', native: 'EN' },
    { id: 'zh', label: '简体中文', native: '中' },
  ];

  return (
    <MainArea maxWidth={null}>
      <TwoPaneSettingsLayout
        title={t('settings.title')}
        items={items}
        activeId={active}
        onSelect={setActive}
      >
        {active === 'profile' ? <ProfilePanel /> : null}
        {active === 'account' ? <AccountPanel /> : null}
        {active === 'connectors' ? <ConnectorsPanel /> : null}
        {active === 'appearance' ? (
          <div className="flex flex-col gap-6">
            <SettingsSection
              title={t('settings.appearance.brand')}
              description={`Currently active: ${brand.name}. Click a swatch to swap accent colors instantly.`}
            >
              <SettingsRow
                label="Active brand"
                description="The selected brand theme drives accent / asterisk / soft fill colors across the entire app."
                trailing={<BrandSwitcher variant="swatches" />}
              />
              <SettingsRow
                label="Brand picker variant"
                description="Pill version, useful inside narrow settings panels."
                trailing={<BrandSwitcher variant="pills" />}
              />
            </SettingsSection>

            <SettingsSection
              title={`${t('settings.appearance.theme')} & ${t('language')}`}
              description="Choose between light, dark, or follow your operating system. Pick a UI language for the entire app."
            >
              <SettingsRow
                label={t('language')}
                trailing={
                  <div className="inline-flex rounded-[10px] border border-[var(--color-border)] p-0.5 bg-[var(--color-surface)]">
                    {localeOptions.map((opt) => {
                      const active = locale === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setLocale(opt.id)}
                          className={[
                            'inline-flex items-center gap-1.5 h-7 px-3 rounded-[8px]',
                            'text-[12.5px] transition-colors duration-[140ms]',
                            active
                              ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-[var(--shadow-card)]'
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                          ].join(' ')}
                        >
                          <Languages size={13} />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                }
              />
              <SettingsRow
                label="Mode"
                trailing={
                  <div className="inline-flex rounded-[10px] border border-[var(--color-border)] p-0.5 bg-[var(--color-surface)]">
                    {(
                      [
                        { id: 'light', icon: Sun },
                        { id: 'dark', icon: Moon },
                        { id: 'system', icon: Monitor },
                      ] as const
                    ).map(({ id, icon: Icon }) => {
                      const active = mode === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setMode(id)}
                          className={[
                            'inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[8px]',
                            'text-[12.5px] capitalize transition-colors duration-[140ms]',
                            active
                              ? 'bg-[var(--color-surface-raised)] text-[var(--color-text)] shadow-[var(--shadow-card)]'
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
                          ].join(' ')}
                        >
                          <Icon size={13} />
                          {id}
                        </button>
                      );
                    })}
                  </div>
                }
              />
            </SettingsSection>

            <SettingsSection
              title={t('settings.appearance.motion')}
              description="Reduce or accent the interface animation pulse to match your taste."
            >
              <SettingsRow
                label={t('settings.appearance.reduceMotion')}
                description="Minimize transitions and shrink animation distance. Forces compatibility with OS-level reduced motion when enabled."
                trailing={<Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />}
              />
              <SettingsRow
                label={t('settings.appearance.animatedIcons')}
                description="Spin the brand asterisk while the assistant is thinking."
                trailing={<Switch checked={hapticIcons} onCheckedChange={setHapticIcons} />}
              />
            </SettingsSection>

            <SettingsSection title="Notifications & telemetry">
              <SettingsRow
                label="Desktop notifications"
                description="Get a toast pop-up when a long response finishes."
                trailing={<Switch checked={notif} onCheckedChange={setNotif} />}
              />
              <SettingsRow
                label="Anonymous analytics"
                description="Send aggregate, non-identifying usage stats to help improve the scaffolding."
                trailing={<Switch checked={analytics} onCheckedChange={setAnalytics} />}
              />
            </SettingsSection>
          </div>
        ) : null}
        {active === 'privacy' ? (
          <SettingsSection
            title="Privacy"
            description="Plug-in placeholder — wire your own privacy controls into this slot."
          >
            <SettingsRow
              label="Local-only history"
              description="Never sync chat history beyond this device."
              trailing={<Switch />}
            />
            <SettingsRow
              label="Auto-purge after 30 days"
              description="Automatically clear stored conversations after a month."
              trailing={<Switch defaultChecked />}
            />
          </SettingsSection>
        ) : null}
        {active === 'features' ? (
          <SettingsSection
            title="Features"
            description="Beta toggles for experimental UI surfaces."
          >
            <SettingsRow label="Artifact pane v2" trailing={<Switch defaultChecked />} />
            <SettingsRow label="Streaming markdown preview" trailing={<Switch />} />
            <SettingsRow label="Inline code diff renderer" trailing={<Switch />} />
          </SettingsSection>
        ) : null}
      </TwoPaneSettingsLayout>
    </MainArea>
  );
}

function ProfilePanel() {
  const { t, locale, setLocale } = useI18n();
  return (
    <SettingsSection
      title={t('profile')}
      description="How your account appears to others in shared chats."
    >
      <SettingsRow
        label="Display"
        description="Used as your name in conversation transcripts."
        trailing={
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{mockUser.initials}</AvatarFallback>
            </Avatar>
            <div className="text-[13px]">
              <div className="font-medium text-[var(--color-text)]">{mockUser.name} Lee</div>
              <div className="text-[var(--color-text-muted)]">{mockUser.email}</div>
            </div>
          </div>
        }
      />
      <SettingsRow
        label={t('settings.account.plan')}
        trailing={
          <div className="flex items-center gap-2">
            <Badge tone="accent">{mockUser.plan}</Badge>
            <Button variant="outline" size="sm">
              {t('settings')}
            </Button>
          </div>
        }
      />
      <SettingsRow
        label={t('language')}
        description="Switches the entire UI language. Persisted to local storage."
        trailing={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
          >
            <Languages size={13} /> {locale === 'zh' ? '简体中文' : 'English'}
          </Button>
        }
      />
    </SettingsSection>
  );
}

function AccountPanel() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsSection
        title="Account preview"
        description="The footer block as rendered in the sidebar."
      >
        <div className="flex items-center justify-center py-4">
          <div className="w-[260px] p-2 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)]">
            <SidebarAccount
              expanded
              name={`${mockUser.name} Lee`}
              subtitle={mockUser.plan}
              planBadge={<DefaultPlanBadge>Pro</DefaultPlanBadge>}
            />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Subscription">
        <SettingsRow
          label="Pro membership"
          description="$20/month · billed monthly · renews Jun 4, 2026."
          trailing={
            <Button variant="outline" size="sm">
              Manage billing
            </Button>
          }
        />
        <SettingsRow
          label="Upgrade to Team"
          description="Share projects + workspaces with your colleagues."
          trailing={
            <Button variant="primary" size="sm">
              <Sparkles size={13} /> Upgrade
            </Button>
          }
        />
      </SettingsSection>

      <SettingsSection title="Danger zone">
        <SettingsRow
          label="Sign out"
          description="End the session on this device."
          trailing={
            <Button variant="ghost" size="sm">
              <LogOut size={13} /> Sign out
            </Button>
          }
        />
        <SettingsRow
          label="Delete account"
          description="This is irreversible — all data is purged after 14 days."
          trailing={
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          }
        />
      </SettingsSection>
    </div>
  );
}

function ConnectorsPanel() {
  return (
    <SettingsSection
      title="Connectors"
      description="Allow the assistant to reference other apps and services for more context."
    >
      <ConnectorRow
        name="Google Drive"
        description="Find and analyze files instantly"
        icon={<HardDrive size={18} className="text-[var(--color-success)]" />}
        connected
      />
      <ConnectorRow
        name="GitHub"
        description="Read repositories and PRs from your account"
        icon={<Github size={18} />}
      />
      <ConnectorRow
        name="Slack"
        description="Search channels and threads"
        icon={<CodeIcon size={18} className="text-[var(--color-warning)]" />}
      />
      <ConnectorRow
        name="Notion"
        description="Look up pages and databases"
        icon={<Bell size={18} className="text-[var(--color-info)]" />}
      />
      <div className="pt-4 flex gap-2">
        <Button variant="outline" size="sm">
          Browse connectors
        </Button>
        <Button variant="ghost" size="sm">
          Add custom connector
        </Button>
      </div>
    </SettingsSection>
  );
}

function ConnectorRow({
  name,
  description,
  icon,
  connected,
}: {
  name: string;
  description: string;
  icon: ReactNode;
  connected?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-b-0">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-surface-muted)]">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[var(--color-text)]">{name}</div>
        <div className="text-[12px] text-[var(--color-text-muted)] truncate">{description}</div>
      </div>
      <Button variant={connected ? 'soft' : 'outline'} size="sm">
        {connected ? 'Connected' : 'Connect'}
      </Button>
    </div>
  );
}
