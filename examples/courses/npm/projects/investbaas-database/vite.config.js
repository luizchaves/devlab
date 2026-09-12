import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Aplicacao multipagina: cada HTML e uma entrada do build.
export default defineConfig({
  build: {
    // O modulo das paginas privadas usa `await` no topo (ES2022).
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        signin: resolve(import.meta.dirname, 'signin.html'),
        signup: resolve(import.meta.dirname, 'signup.html'),
        dashboard: resolve(import.meta.dirname, 'dashboard.html'),
        analytics: resolve(import.meta.dirname, 'analytics.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
        asset: resolve(import.meta.dirname, 'asset.html'),
      },
    },
  },
});
