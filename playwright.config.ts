import {defineConfig} from '@playwright/test';

export default defineConfig({
  testDir: './packages/e2e/tests',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'],['html', {open: 'never'}]],
  // NOTE: Web servers are started manually via scripts/run-tests-with-env.sh
  // This allows running e2e tests with dedicated ports while development continues
  // on the default ports (frontend: 3000, backend: 5050)
  use: {
    baseURL: 'http://localhost:3010', // Frontend e2e port (dev uses 3000)
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 393, height: 852 }
  },
});
