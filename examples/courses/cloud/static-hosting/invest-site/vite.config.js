import { defineConfig } from 'vite';

// O caminho base muda conforme o destino da publicação:
// - Netlify, Vercel e Cloudflare Pages servem o site na raiz do domínio ('/');
// - GitHub Pages de projeto serve em '/<repositorio>/'.
// A variável BASE_PATH é definida pelo workflow do GitHub Pages.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
