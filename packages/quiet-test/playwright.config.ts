import { defineConfig, devices } from '@playwright/test';

// The browser tests run against a production build of quiet-explorer: every component page, playground and example
// is a test fixture. The e2e suite runs in Chromium (e2e), Firefox (e2e-firefox) and WebKit, Safari's engine
// (e2e-webkit); screenshots only in Chromium. Set PW_CHROMIUM_PATH to use a Chromium that is already installed.
const PORT = 4173;
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  // Rendering is pinned (the Playwright image), so no pixel may change; a per-pixel colour threshold of 0.02 still
  // absorbs off-by-one anti-aliasing, while any real recolouring (an icon from ink to brand) fails.
  expect: { toHaveScreenshot: { maxDiffPixels: 0, threshold: 0.02, animations: 'disabled' } },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'e2e',
      testIgnore: /visual\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], launchOptions: { executablePath } },
    },
    { name: 'e2e-firefox', testIgnore: /visual\.spec\.ts/, use: { ...devices['Desktop Firefox'] } },
    { name: 'e2e-webkit', testIgnore: /visual\.spec\.ts/, use: { ...devices['Desktop Safari'] } },
    {
      name: 'visual',
      testMatch: /visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath },
        viewport: { width: 1280, height: 900 },
        deviceScaleFactor: 1,
      },
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
