import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      // Só os módulos que rodam fora do navegador. Os arquivos de tela
      // (home.js, profile.js, signin.js, signup.js) manipulam o DOM de uma
      // página real e são cobertos pelo E2E, não por teste de unidade.
      include: ['public/js/lib/**/*.js', 'public/js/services/**/*.js'],
      exclude: ['**/*.test.js'],
      reporter: ['text', 'lcov'],
      thresholds: { lines: 50, functions: 50, branches: 45 },
    },
  },
});
