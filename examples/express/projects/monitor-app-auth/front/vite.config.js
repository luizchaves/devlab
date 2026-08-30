import { defineConfig } from 'vite';

/**
 * O front roda no Vite (5173) e a API no Express (3000): duas origens.
 *
 * O proxy faz o servidor de desenvolvimento repassar tudo que comeca com
 * `/api` para o Express. Para o navegador existe uma origem so, e o CORS nao
 * aparece durante o desenvolvimento — em producao, onde o proxy nao existe, e
 * o middleware `cors` do back que autoriza a chamada.
 */
export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        host: 'host.html',
        signin: 'signin.html',
        signup: 'signup.html',
      },
    },
  },
});
