import { defineConfig } from 'vite';

/**
 * O front do MonitorApp tem build proprio e roda no servidor de
 * desenvolvimento do Vite. Nesta etapa ainda nao existe API para chamar, entao
 * a configuracao so declara as paginas do site estatico.
 */
export default defineConfig({
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
