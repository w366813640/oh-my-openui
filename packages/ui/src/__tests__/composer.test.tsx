import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Composer } from '../composer/Composer';
import { TooltipProvider } from '../primitives/Tooltip';

function withTooltip(node: ReactNode) {
  return <TooltipProvider delayDuration={0}>{node}</TooltipProvider>;
}

describe('Composer', () => {
  it('renders Send button accessible by name', () => {
    render(withTooltip(<Composer />));
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('renders the Add menu button', () => {
    render(withTooltip(<Composer />));
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('keeps an accessible placeholder when placeholder rotates (P0-A3)', () => {
    render(
      withTooltip(
        <Composer
          placeholder={['How can I help?', 'Ask anything', 'What now?']}
          placeholderRotateMs={5000}
        />,
      ),
    );
    /* The textarea must expose a non-empty placeholder so screen readers
     * have an accessible name, even though the visible rotating overlay
     * is a separate decorative element. */
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.getAttribute('placeholder')).not.toBe('');
    expect(textarea.getAttribute('placeholder')).toBeTruthy();
  });

  it('calls onSubmit with the typed text on Enter', () => {
    const onSubmit = vi.fn();
    render(withTooltip(<Composer onSubmit={onSubmit} />));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const firstCall = onSubmit.mock.calls[0];
    expect(firstCall?.[0]?.text).toBe('hello world');
  });

  it('does not submit on Shift+Enter (line break)', () => {
    const onSubmit = vi.fn();
    render(withTooltip(<Composer onSubmit={onSubmit} />));
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'one' } });
    fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('outer composer container uses the interactive border token', () => {
    const { container } = render(withTooltip(<Composer />));
    /* The first focusable container with rounded-[18px] is the composer surface. */
    const surface = container.querySelector('[data-focused]');
    expect(surface).not.toBeNull();
    expect(surface?.className).toContain('border-[var(--color-border-interactive)]');
  });
});
