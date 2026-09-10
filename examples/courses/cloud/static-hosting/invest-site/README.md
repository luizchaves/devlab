# InvestSite — publicação estática

Site estático mínimo em Vite usado para comparar a publicação em GitHub Pages,
Netlify, Vercel e Cloudflare Pages.

## Arquivos principais

- `vite.config.js`: define o `base` a partir de `BASE_PATH`, necessário no GitHub Pages.
- `src/main.js`: mostra o `import.meta.env.BASE_URL` resolvido no build.
- `netlify.toml`: build, publicação e regra de reescrita no Netlify.
- `vercel.json`: build, publicação e regra de reescrita na Vercel.
- `public/_redirects` e `public/_headers`: reescrita e cabeçalhos no Cloudflare Pages.
- `.github/workflows/deploy.yml`: build e publicação no GitHub Pages.

## Como executar

```bash
npm install
npm run dev
```

Para conferir o resultado do build com o caminho base do GitHub Pages:

```bash
BASE_PATH=/invest-site/ npm run build && npm run preview
```
