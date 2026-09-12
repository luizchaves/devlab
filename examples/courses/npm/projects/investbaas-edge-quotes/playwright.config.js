import { defineConfig } from '@playwright/test';

// O Vite sobe sozinho; a stack do Supabase precisa estar no ar (pnpm db:start).
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
