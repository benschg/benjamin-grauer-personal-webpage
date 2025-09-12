import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI 
    ? {
        command: 'yarn preview --port 5174',
        port: 5174,
        reuseExistingServer: false,
        timeout: 120 * 1000,
      }
    : {
        command: 'yarn dev',
        url: 'http://localhost:5174',
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});