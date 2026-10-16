import { defineConfig, devices } from '@playwright/test';

// The browser tests run against a production build of quiet-explorer: every component page, playground and example
// is a test fixture. Set PW_CHROMIUM_PATH to use a Chromium that is already installed (instead of `playwright install`).
const PORT = 4173;
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled' } },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    launchOptions: { executablePath },
  },
  projects: [
    { name: 'e2e', testIgnore: /visual\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    {
      name: 'visual',
      testMatch: /visual\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 },
    },
  ],
  webServer: {
    command: `npm run build -w quiet-explorer && npm run preview -w quiet-explorer -- --port ${PORT} --strictPort`,
    cwd: '../..',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
