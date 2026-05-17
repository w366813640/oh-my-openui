import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '../theme/theme';

type ThemeApi = ReturnType<typeof useTheme>;

function Probe({ onReady }: { onReady: (api: ThemeApi) => void }) {
  const t = useTheme();
  onReady(t);
  return <div data-testid="probe">{t.resolved}</div>;
}

describe('ThemeProvider', () => {
  it('applies the chosen mode to document.documentElement', () => {
    let api: ThemeApi | null = null;
    render(
      <ThemeProvider defaultMode="dark">
        <Probe
          onReady={(t) => {
            api = t;
          }}
        />
      </ThemeProvider>,
    );
    expect(api).not.toBeNull();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect((api as ThemeApi | null)?.resolved).toBe('dark');
  });

  it('toggle flips between light and dark', () => {
    let api: ThemeApi | null = null;
    render(
      <ThemeProvider defaultMode="light">
        <Probe
          onReady={(t) => {
            api = t;
          }}
        />
      </ThemeProvider>,
    );
    expect((api as ThemeApi | null)?.resolved).toBe('light');
    act(() => (api as ThemeApi | null)?.toggle());
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('explicit setMode wins over toggle', () => {
    let api: ThemeApi | null = null;
    render(
      <ThemeProvider defaultMode="system">
        <Probe
          onReady={(t) => {
            api = t;
          }}
        />
      </ThemeProvider>,
    );
    act(() => (api as ThemeApi | null)?.setMode('light'));
    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
