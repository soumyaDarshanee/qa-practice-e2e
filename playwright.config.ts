import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { STORAGE_STATE } from './src/config/paths';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: isCI,
  // One retry in CI, so a flaky test shows up as "flaky" instead of being hidden.
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [['blob'], ['junit', { outputFile: 'test-results/junit.xml' }], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: env.WEB_URL,
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1. Fail fast when the baseline seed (reference data + test users) is missing.
    {
      name: 'seed',
      testMatch: /setup[\\/]seed\.setup\.ts/,
    },
    // 2. Log in once per role and save the browser session.
    {
      name: 'auth',
      testMatch: /setup[\\/]auth\.setup\.ts/,
      dependencies: ['seed'],
      use: { ...devices['Desktop Chrome'] },
    },
    // 3. The specs. They start logged in as admin unless a spec says otherwise.
    {
      name: 'chromium',
      testMatch: /specs[\\/].*\.spec\.ts/,
      dependencies: ['auth'],
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE.admin },
    },
  ],
});
