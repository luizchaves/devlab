import { defineConfig, devices } from '@playwright/test';
import { databaseUrlFor } from './tests/database';

// #region config
/**
 * E2E contra o servidor de desenvolvimento em outra porta, com o schema `e2e`
 * do Postgres: `pnpm test:e2e` não mexe nos dados de desenvolvimento.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  globalSetup: './tests/e2e/global-setup.ts',
  webServer: {
    command: 'pnpm dev --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: databaseUrlFor('e2e'),
      AUTH_SECRET: 'e2e-secret',
      AUTH_URL: 'http://localhost:3100',
    },
  },
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
// #endregion
