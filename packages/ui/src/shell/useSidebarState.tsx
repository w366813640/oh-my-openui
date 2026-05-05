import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'oh-ui-sidebar-expanded-v2';

interface SidebarStateContextValue {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  toggle: () => void;
}

const Ctx = createContext<SidebarStateContextValue | null>(null);

export function SidebarStateProvider({
  children,
  defaultExpanded = false,
}: {
  children: ReactNode;
  defaultExpanded?: boolean;
}) {
  const [preferredExpanded, setPreferredExpandedState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultExpanded;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === null) return defaultExpanded;
    return saved === 'true';
  });
  const [narrowViewport, setNarrowViewport] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 760px)');
    const sync = () => setNarrowViewport(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const expanded = !narrowViewport && preferredExpanded;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, String(preferredExpanded));
  }, [preferredExpanded]);

  const setExpanded = useCallback((value: boolean) => setPreferredExpandedState(value), []);
  const toggle = useCallback(() => setPreferredExpandedState((prev) => !prev), []);

  const value = useMemo(() => ({ expanded, setExpanded, toggle }), [expanded, setExpanded, toggle]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSidebarState(): SidebarStateContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSidebarState must be used within <SidebarStateProvider>');
  return ctx;
}
