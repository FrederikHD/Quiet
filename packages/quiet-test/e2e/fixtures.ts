// A `page` that fails the test on any console error, warning or uncaught exception.
import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ consoleProblems: string[] }>({
  consoleProblems: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text()}`);
      });
      page.on('pageerror', (e) => problems.push(`uncaught: ${e.message}`));
      await use(problems);
      expect(problems, 'console errors and warnings').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
