import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../primitives/Button';
import { IconButton } from '../primitives/IconButton';
import { Input } from '../primitives/Input';
import { Kbd } from '../primitives/Kbd';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('fires onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('blocks click when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button loading>Working</Button>);
    expect(screen.getByRole('button', { name: 'Working' })).toBeDisabled();
  });

  it('uses outline variant border token (interactive contrast)', () => {
    render(<Button variant="outline">Outline</Button>);
    const className = screen.getByRole('button', { name: 'Outline' }).className;
    expect(className).toContain('border-[var(--color-border-interactive)]');
  });
});

describe('IconButton', () => {
  it('exposes the label as accessible name', () => {
    render(
      <IconButton label="Settings">
        <span aria-hidden>S</span>
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  it('outline variant uses the interactive border token', () => {
    render(
      <IconButton label="Edit" variant="outline">
        <span aria-hidden>E</span>
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Edit' }).className).toContain(
      'border-[var(--color-border-interactive)]',
    );
  });
});

describe('Input', () => {
  it('renders the placeholder', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('uses the interactive border token', () => {
    render(<Input data-testid="i" />);
    const input = screen.getByTestId('i') as HTMLInputElement;
    expect(input.className).toContain('border-[var(--color-border-interactive)]');
  });
});

describe('Kbd', () => {
  it('renders content inside a <kbd> element', () => {
    render(<Kbd>⌘K</Kbd>);
    const el = screen.getByText('⌘K');
    expect(el.tagName).toBe('KBD');
  });
});
