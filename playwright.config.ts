import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './packages/e2e/tests',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'],['html', {open: 'never'}]],
  webServer: [
    {
      command: 'ENV_FILE=.env.e2e npm run dev -w packages/backend',
      url: 'http://localhost:5050/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'npm run dev -w packages/frontend',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    }
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 393, height: 852 }
  },
});
