import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToolCallBlock } from '../thread/ToolCallBlock';

describe('ToolCallBlock', () => {
  it('renders title + status badge per state', () => {
    const { rerender } = render(<ToolCallBlock title="bash" status="running" />);
    expect(screen.getByText('bash')).toBeInTheDocument();
    expect(screen.getByLabelText('Running')).toBeInTheDocument();

    rerender(<ToolCallBlock title="bash" status="done" />);
    expect(screen.getByLabelText('Completed')).toBeInTheDocument();

    rerender(<ToolCallBlock title="bash" status="error" errorLabel="EPIPE" />);
    expect(screen.getByLabelText('Errored')).toBeInTheDocument();
    expect(screen.getByText('EPIPE')).toBeInTheDocument();
  });

  it('toggle button is disabled when no body provided', () => {
    render(<ToolCallBlock title="ping" status="done" />);
    const btn = screen.getByRole('button', { name: 'ping' });
    expect(btn).toBeDisabled();
  });

  it('expands / collapses when children are present', async () => {
    const user = userEvent.setup();
    render(
      <ToolCallBlock title="grep" status="done">
        match: README.md:1
      </ToolCallBlock>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/README\.md:1/)).toBeInTheDocument();
  });

  it('error status opens body by default so the user sees the failure', () => {
    render(
      <ToolCallBlock title="db.query" status="error" errorLabel="ECONNREFUSED">
        connect ECONNREFUSED 127.0.0.1:5432
      </ToolCallBlock>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/ECONNREFUSED 127\.0\.0\.1/)).toBeInTheDocument();
  });
});
