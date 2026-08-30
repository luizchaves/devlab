import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      // So os modulos que rodam fora da tela. Os arquivos de pagina
      // (index.js, host.js, signin.js, signup.js) manipulam o DOM de uma
      // pagina real e sao cobertos pelo E2E, nao por teste de unidade.
      include: ['js/lib/**/*.js', 'js/services/**/*.js'],
      exclude: ['**/*.test.js'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 50, functions: 50, branches: 45 },
    },
  },
});
