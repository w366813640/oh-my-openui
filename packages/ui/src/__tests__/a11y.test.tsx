import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Composer } from '../composer/Composer';
import { Button } from '../primitives/Button';
import { IconButton } from '../primitives/IconButton';
import { Input } from '../primitives/Input';
import { TooltipProvider } from '../primitives/Tooltip';
import { axe } from './setup';

/**
 * Accessibility smoke — every covered surface should report zero violations
 * from the rules we enable in `setup.ts`. After P0 the baseline is clean;
 * P1+ items will gradually expand the surface area below.
 */

describe('axe smoke — primitives', () => {
  it('Button has no a11y violations', async () => {
    const { container } = render(<Button>Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('IconButton has no a11y violations (label is exposed)', async () => {
    const { container } = render(
      <IconButton label="Settings">
        <span aria-hidden>S</span>
      </IconButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('Input with a label has no a11y violations', async () => {
    const { container } = render(
      <label>
        Name
        <Input placeholder="Type here" />
      </label>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('axe smoke — composer', () => {
  it('Composer (idle, no attachments) has no a11y violations', async () => {
    const { container } = render(
      <TooltipProvider delayDuration={0}>
        <Composer />
      </TooltipProvider>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
