import { resolve } from 'node:path';

import { defineConfig } from 'vite';

const raiz = resolve(import.meta.dirname, 'public');

/**
 * Vite entra aqui **so como build**, e nao como servidor de desenvolvimento.
 *
 * O front do InvestApp continua vivendo na mesma origem da API: em
 * desenvolvimento o Express serve `public/` direto do disco, e em producao serve
 * o `dist/` que este build produz — com os modulos empacotados, o CSS
 * minificado e o hash de cache no nome dos arquivos.
 *
 * E a diferenca em relacao ao MonitorApp, que roda o Vite como servidor
 * proprio em outra porta e por isso precisa de proxy e de CORS.
 */
export default defineConfig({
  root: raiz,
  base: './',
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    // Cada pagina e um ponto de entrada: sem isto o build so levaria a primeira.
    rollupOptions: {
      input: {
        home: resolve(raiz, 'home.html'),
        profile: resolve(raiz, 'profile.html'),
        signin: resolve(raiz, 'signin.html'),
        signup: resolve(raiz, 'signup.html'),
      },
    },
  },
});
