import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html'], ['junit', { outputFile: 'test-results/results.xml' }]] : 'html',
  use: {
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:5174',
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
        command: 'yarn preview --port 4173',
        port: 4173,
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