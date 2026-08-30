// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * O E2E do MonitorApp aponta para o Vite (5173), e nao para a API: e o front
 * que o usuario abre, e o proxy do Vite que leva as chamadas ate o Express.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  timeout: 30 * 1000,

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // Descomente para o Playwright subir o front sozinho — a API precisa estar
  // rodando em outro terminal.
  // webServer: {
  //   command: 'npm run dev --prefix front',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
});
