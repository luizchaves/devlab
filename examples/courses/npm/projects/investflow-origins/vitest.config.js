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
          include: ['src/**/*.test.js', 'supabase/functions/**/*.test.js'],
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
          fileParallelism: false,
        },
      },
      {
        // O build de producao e o vercel.json: roda em node, sem stack, e leva
        // alguns segundos por causa do vite build.
        test: {
          name: 'build',
          environment: 'node',
          include: ['tests/build/**/*.test.js'],
        },
      },
    ],
  },
});
