import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const pages = [
  'index',
  'signin',
  'signup',
  'dashboard',
  'analytics',
  'asset',
  'origins',
  'dividends',
  'movements',
  'profile',
  'admin',
];

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(import.meta.dirname, `${page}.html`)])
      ),
    },
  },
});
