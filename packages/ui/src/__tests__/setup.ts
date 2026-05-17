import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import { afterEach, expect } from 'vitest';

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
