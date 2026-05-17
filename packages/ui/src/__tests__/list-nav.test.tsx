import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useListKeyboardNav } from '../layouts/useListKeyboardNav';

function Harness({
  onActivate,
  onToggleSelect,
}: {
  onActivate?: (id: string) => void;
  onToggleSelect?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useListKeyboardNav({ scopeRef: ref, onActivate, onToggleSelect });
  return (
    <div ref={ref}>
      <input data-testid="search" />
      <button data-list-row data-list-id="a" type="button">
        Row A
      </button>
      <button data-list-row data-list-id="b" type="button">
        Row B
      </button>
      <button data-list-row data-list-id="c" type="button">
        Row C
      </button>
    </div>
  );
}

describe('useListKeyboardNav', () => {
  it('cycles rows with j/k and ArrowDown/ArrowUp', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const rowA = screen.getByText('Row A');
    rowA.focus();
    expect(document.activeElement).toBe(rowA);

    await user.keyboard('j');
    expect(document.activeElement).toBe(screen.getByText('Row B'));

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByText('Row C'));

    await user.keyboard('k');
    expect(document.activeElement).toBe(screen.getByText('Row B'));

    await user.keyboard('{End}');
    expect(document.activeElement).toBe(screen.getByText('Row C'));

    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(rowA);
  });

  it('Enter activates the focused row', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<Harness onActivate={onActivate} />);
    screen.getByText('Row B').focus();
    await user.keyboard('{Enter}');
    expect(onActivate).toHaveBeenCalledWith('b', expect.any(HTMLElement));
  });

  it('x toggles select on the focused row', async () => {
    const user = userEvent.setup();
    const onToggleSelect = vi.fn();
    render(<Harness onToggleSelect={onToggleSelect} />);
    screen.getByText('Row C').focus();
    await user.keyboard('x');
    expect(onToggleSelect).toHaveBeenCalledWith('c', expect.any(HTMLElement));
  });

  it('does not hijack arrows while the search input is focused', async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(<Harness onActivate={onActivate} />);
    const input = screen.getByTestId('search');
    input.focus();
    await user.keyboard('j');
    expect(document.activeElement).toBe(input);
    expect(onActivate).not.toHaveBeenCalled();
  });
});
