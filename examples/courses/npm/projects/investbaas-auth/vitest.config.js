import { defineConfig } from 'vitest/config';

// Dois projetos no mesmo runner: unidade roda em jsdom com o SDK mockado;
// integracao roda em node contra a stack local (supabase start).
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.js'],
          env: {
            VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
            VITE_SUPABASE_ANON_KEY: 'anon-key-de-teste',
          },
        },
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          include: ['tests/integration/**/*.test.js'],
          testTimeout: 15_000,
        },
      },
    ],
  },
});
