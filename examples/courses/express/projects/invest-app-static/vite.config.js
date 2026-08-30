import { resolve } from 'node:path';

import { defineConfig } from 'vite';

const raiz = import.meta.dirname;

/**
 * Nesta etapa ainda nao existe servidor: o Vite entra so para dar um `preview`
 * das paginas e para produzir o `dist/` otimizado. A partir da etapa 2, quando
 * o Express aparece, e ele quem serve o front — sempre na mesma origem da API.
 */
export default defineConfig({
  root: raiz,
  base: './',
  // `public/` ja e a convencao do Vite para assets copiados sem processamento.
  publicDir: 'public',
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    // Cada pagina e um ponto de entrada: sem isto o build so levaria a primeira.
    rollupOptions: {
      input: {
        index: resolve(raiz, 'index.html'),
        profile: resolve(raiz, 'profile.html'),
        signin: resolve(raiz, 'signin.html'),
        signup: resolve(raiz, 'signup.html'),
      },
    },
  },
});
