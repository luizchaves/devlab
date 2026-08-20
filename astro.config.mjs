// @ts-check
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { BASE_PATH, REPO_URL, SITE_URL } from './site.config.mjs';

/**
 * Publicacao no GitHub Pages.
 *
 * Os valores de `site`, `base` e do repositorio ficam em `site.config.mjs`, que
 * tambem e lido pelos componentes. Veja o README para publicar em outro
 * usuario/repositorio.
 */
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  // Deixa as URLs previsiveis atras do `base` do GitHub Pages.
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'DevLab',
      tagline: 'Material das disciplinas de programação',
      description:
        'Portal de disciplinas de programação: JavaScript, Node.js, Express.js, banco de dados e projetos práticos.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
      },
      social: [{ icon: 'github', label: 'GitHub', href: REPO_URL }],
      editLink: {
        baseUrl: `${REPO_URL}/edit/main/`,
      },
      // `true` exige que o build rode dentro de um repositorio git com historico.
      lastUpdated: false,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      customCss: ['./src/styles/global.css'],
      components: {
        Header: './src/components/Header.astro',
        Pagination: './src/components/Pagination.astro',
        Sidebar: './src/components/Sidebar.astro',
        SiteTitle: './src/components/SiteTitle.astro',
      },
      // As opcoes do Expressive Code ficam em `ec.config.mjs` (veja o arquivo).
      sidebar: [
        {
          label: 'Desenvolvimento Web',
          items: [
            { label: 'Visão geral', link: '/courses/cstrc-jp-dw/' },
            {
              label: 'HTML',
              collapsed: false,
              items: [{ label: 'Fundamentos', link: '/courses/cstrc-jp-dw/html/' }],
            },
            {
              label: 'CSS',
              collapsed: false,
              items: [{ label: 'Fundamentos', link: '/courses/cstrc-jp-dw/css/' }],
            },
            {
              label: 'JavaScript',
              collapsed: false,
              items: [
                { label: 'Fundamentos', link: '/courses/cstrc-jp-dw/javascript/' },
                { label: 'Modules', link: '/courses/cstrc-jp-dw/javascript/modules/' },
                { label: 'Async/Await', link: '/courses/cstrc-jp-dw/javascript/async-await/' },
                { label: 'Fetch API', link: '/courses/cstrc-jp-dw/javascript/fetch-api/' },
              ],
            },
            {
              label: 'Node.js',
              collapsed: false,
              items: [
                { label: 'Fundamentos', link: '/courses/cstrc-jp-dw/node/' },
                { label: 'npm', link: '/courses/cstrc-jp-dw/node/npm/' },
                { label: 'Modules', link: '/courses/cstrc-jp-dw/node/modules/' },
              ],
            },
            {
              label: 'Express.js',
              collapsed: false,
              items: [
                { label: 'Fundamentos', link: '/courses/cstrc-jp-dw/express/' },
                { label: 'Routes', link: '/courses/cstrc-jp-dw/express/routes/' },
                { label: 'Controllers', link: '/courses/cstrc-jp-dw/express/controllers/' },
                { label: 'Middleware', link: '/courses/cstrc-jp-dw/express/middleware/' },
                { label: 'MVC', link: '/courses/cstrc-jp-dw/express/mvc/' },
                { label: 'REST API', link: '/courses/cstrc-jp-dw/express/rest-api/' },
              ],
            },
            {
              label: 'Banco de Dados',
              collapsed: false,
              items: [
                { label: 'SQL', link: '/courses/cstrc-jp-dw/database/sql/' },
                { label: 'Prisma', link: '/courses/cstrc-jp-dw/database/prisma/' },
                { label: 'CRUD', link: '/courses/cstrc-jp-dw/database/crud/' },
              ],
            },
            {
              label: 'Projetos',
              collapsed: false,
              items: [
                { label: 'Visão geral', link: '/courses/cstrc-jp-dw/projects/' },
                { label: 'Hello Express', link: '/courses/cstrc-jp-dw/projects/hello-express/' },
                { label: 'Express Router', link: '/courses/cstrc-jp-dw/projects/express-router/' },
                { label: 'Express MVC', link: '/courses/cstrc-jp-dw/projects/express-mvc/' },
                {
                  label: 'Express + Prisma',
                  link: '/courses/cstrc-jp-dw/projects/express-prisma/',
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        // Os projetos de `examples/` sao instalados de forma independente.
        ignored: ['**/examples/**/node_modules/**', '**/examples/**/dist/**'],
      },
    },
  },
});
