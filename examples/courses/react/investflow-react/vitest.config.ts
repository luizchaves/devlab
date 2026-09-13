import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { databaseUrlFor, loadEnv } from './tests/database.ts';

// `.env` traz a URL e a service role do Supabase local; o resto vem do próprio config.
loadEnv();

const alias = { '@': fileURLToPath(new URL('./src', import.meta.url)) };

// #region projects
/**
 * Três camadas, três projetos do Vitest:
 * - `unit`: regras puras, hooks e utilitários (`*.test.ts(x)`), em jsdom;
 * - `browser`: primitivas de `components/ui` (`*.browser.test.tsx`) em Chromium real;
 * - `integration`: rotas e serviços (`*.integration.test.ts`) contra o Postgres local, schema `integration`.
 */
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.browser.test.tsx', 'src/**/*.integration.test.ts'],
        },
      },
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.tsx'],
          setupFiles: ['tests/browser-setup.ts'],
          // Um arquivo por vez: diálogos em iframes paralelos disputam o foco e o teste fica instável.
          fileParallelism: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        // Fora do `pnpm test`: `pnpm test:build` roda o `next build` e inspeciona o resultado (RF22).
        resolve: { alias },
        test: {
          name: 'build',
          environment: 'node',
          include: ['tests/deploy/**/*.test.ts'],
          testTimeout: 300_000,
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'integration',
          environment: 'node',
          include: ['tests/integration/**/*.integration.test.ts'],
          globalSetup: ['tests/integration/global-setup.ts'],
          setupFiles: ['tests/integration/setup.ts'],
          env: { DATABASE_URL: databaseUrlFor('integration'), AUTH_SECRET: 'test-secret', QUOTES_PROVIDER: 'fake' },
          fileParallelism: false,
        },
      },
    ],
  },
});
// #endregion
