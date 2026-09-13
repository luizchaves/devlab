import { defineConfig, devices } from '@playwright/test';
import { databaseUrlFor, loadEnv } from './tests/database.ts';

// `.env` traz a URL e a service role do Supabase local; o resto vem do próprio config.
loadEnv();

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
      QUOTES_PROVIDER: 'fake',
    },
  },
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  // `mobile` roda só os specs `*.mobile.spec.ts` em um Pixel 7 (RNF07); `chromium` roda o resto.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /\.mobile\.spec\.ts$/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /\.mobile\.spec\.ts$/ },
  ],
});
// #endregion
