import '@testing-library/jest-dom/vitest';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});

export const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: true },
    region: { enabled: false },
  },
});
