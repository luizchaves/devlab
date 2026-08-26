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
              label: 'Avaliações',
              collapsed: true,
              items: [
                { label: 'Projeto', link: '/courses/cstrc-jp-dw/project/' },
                { label: 'Exercícios', link: '/courses/cstrc-jp-dw/extra/exercises/' },
                { label: 'Quizzes', link: '/courses/cstrc-jp-dw/extra/quizzes/' },
              ],
            },
            {
              label: 'HTML',
              collapsed: true,
              items: [
                {
                  label: 'Importância da Web',
                  link: '/courses/cstrc-jp-dw/html/web-importance/',
                },
                {
                  label: 'Linguagens de Marcação',
                  link: '/courses/cstrc-jp-dw/html/markup-languages/',
                },
                { label: 'Fundamentos de HTML', link: '/courses/cstrc-jp-dw/html/' },
                { label: 'Formulários HTML', link: '/courses/cstrc-jp-dw/html/forms/' },
              ],
            },
            {
              label: 'CSS',
              collapsed: true,
              items: [
                { label: 'Fundamentos de CSS', link: '/courses/cstrc-jp-dw/css/' },
                {
                  label: 'Pacotes',
                  collapsed: true,
                  items: [
                    {
                      label: 'Bootstrap',
                      link: '/courses/cstrc-jp-dw/packages/bootstrap/',
                    },
                    {
                      label: 'Tailwind CSS',
                      link: '/courses/cstrc-jp-dw/packages/tailwind-css/',
                    },
                  ],
                },
                { label: 'Formulários com CSS', link: '/courses/cstrc-jp-dw/css/forms/' },

              ],
            },
            {
              label: 'JavaScript',
              collapsed: true,
              items: [
                { label: 'ECMAScript', link: '/courses/cstrc-jp-dw/javascript/ecmascript/' },
                {
                  label: 'Sintaxe',
                  collapsed: true,
                  items: [
                    { label: 'Variáveis', link: '/courses/cstrc-jp-dw/javascript/variables/' },
                    {
                      label: 'Expressões e Operadores',
                      link: '/courses/cstrc-jp-dw/javascript/expressions-operators/',
                    },
                    {
                      label: 'Decisão e Repetição',
                      link: '/courses/cstrc-jp-dw/javascript/control-flow/',
                    },
                    { label: 'Funções', link: '/courses/cstrc-jp-dw/javascript/functions/' },
                    { label: 'Módulos', link: '/courses/cstrc-jp-dw/javascript/modules/' },
                    { label: 'Arrays', link: '/courses/cstrc-jp-dw/javascript/arrays/' },
                    { label: 'Strings', link: '/courses/cstrc-jp-dw/javascript/strings/' },
                    { label: 'Objetos', link: '/courses/cstrc-jp-dw/javascript/objects/' },
                    { label: 'Date', link: '/courses/cstrc-jp-dw/javascript/date/' },
                    { label: 'RegExp', link: '/courses/cstrc-jp-dw/javascript/regexp/' },
                    { label: 'Promises', link: '/courses/cstrc-jp-dw/javascript/promises/' },
                    { label: 'Async/Await', link: '/courses/cstrc-jp-dw/javascript/async-await/' },
                  ],
                },
                {
                  label: 'Web APIs',
                  collapsed: true,
                  items: [
                    {
                      label: 'Objetos do Navegador',
                      link: '/courses/cstrc-jp-dw/browser/browser-objects/',
                    },
                    {
                      label: 'Elementos Dinâmicos',
                      link: '/courses/cstrc-jp-dw/browser/dynamic-elements/',
                    },
                    { label: 'Eventos', link: '/courses/cstrc-jp-dw/browser/events/' },
                    { label: 'DOM API', link: '/courses/cstrc-jp-dw/browser/dom-api/' },
                    { label: 'Local Storage', link: '/courses/cstrc-jp-dw/browser/local-storage/' },
                    { label: 'Fetch API', link: '/courses/cstrc-jp-dw/javascript/fetch-api/' },
                  ],
                },
                {
                  label: 'Packages',
                  collapsed: true,
                  items: [
                    { label: 'Vite', link: '/courses/cstrc-jp-dw/packages/vite/' },
                    { label: 'JSON Server', link: '/courses/cstrc-jp-dw/packages/json-server/' },
                    { label: 'Chart.js', link: '/courses/cstrc-jp-dw/packages/chartjs/' },
                  ],
                },
              ],
            },
            {
              label: 'Node.js e Express.js',
              collapsed: true,
              items: [
                { label: 'Node.js HTTP', link: '/courses/cstrc-jp-dw/node/http/' },
                { label: 'Express.js', link: '/courses/cstrc-jp-dw/express/' },
                {
                  label: 'Chamada de Sistema',
                  link: '/courses/cstrc-jp-dw/express/system-call/',
                },
                {
                  label: 'Construção de API',
                  link: '/courses/cstrc-jp-dw/express/api-construction/',
                },
                { label: 'MVC', link: '/courses/cstrc-jp-dw/express/mvc/' },
                { label: 'SQL com Node.js', link: '/courses/cstrc-jp-dw/database/sql-node/' },
                { label: 'Prisma', link: '/courses/cstrc-jp-dw/database/prisma/' },
                {
                  label: 'Relações com Prisma',
                  link: '/courses/cstrc-jp-dw/database/prisma-relations/',
                },
                {
                  label: 'Cadastro de Usuário',
                  link: '/courses/cstrc-jp-dw/express/user-registration/',
                },
                { label: 'Autenticação', link: '/courses/cstrc-jp-dw/express/authentication/' },
              ],
            },
            {
              label: 'Banco de Dados',
              collapsed: true,
              items: [
                { label: 'SGBD', link: '/courses/cstrc-jp-dw/database/dbms/' },
                { label: 'SQL', link: '/courses/cstrc-jp-dw/database/sql/' },
              ],
            },
            // {
            //   label: 'Complementares',
            //   collapsed: true,
            //   items: [
            //     { label: 'CSS Box Model', link: '/courses/cstrc-jp-dw/css/box-model/' },
            //     { label: 'JavaScript: Fundamentos', link: '/courses/cstrc-jp-dw/javascript/' },

            //     { label: 'Browser APIs', link: '/courses/cstrc-jp-dw/browser/' },

            //     { label: 'Pacotes', link: '/courses/cstrc-jp-dw/packages/' },

            //     { label: 'Node.js', link: '/courses/cstrc-jp-dw/node/' },
            //     { label: 'npm', link: '/courses/cstrc-jp-dw/node/npm/' },
            //     { label: 'Node.js Modules', link: '/courses/cstrc-jp-dw/node/modules/' },

            //     { label: 'Express Routes', link: '/courses/cstrc-jp-dw/express/routes/' },
            //     { label: 'Controllers', link: '/courses/cstrc-jp-dw/express/controllers/' },
            //     { label: 'Middleware', link: '/courses/cstrc-jp-dw/express/middleware/' },
            //     { label: 'Express REST API', link: '/courses/cstrc-jp-dw/express/rest-api/' },

            //     { label: 'CRUD', link: '/courses/cstrc-jp-dw/database/crud/' },

            //     { label: 'Projetos', link: '/courses/cstrc-jp-dw/projects/' },
            //     { label: 'Hello Express', link: '/courses/cstrc-jp-dw/projects/hello-express/' },
            //     { label: 'Express Router', link: '/courses/cstrc-jp-dw/projects/express-router/' },
            //     { label: 'Express MVC', link: '/courses/cstrc-jp-dw/projects/express-mvc/' },
            //     {
            //       label: 'Express + Prisma',
            //       link: '/courses/cstrc-jp-dw/projects/express-prisma/',
            //     },
            //     {
            //       label: 'Invest App Bootstrap',
            //       link: '/courses/cstrc-jp-dw/projects/invest-app-bootstrap/',
            //     },
            //     { label: 'Extra', link: '/courses/cstrc-jp-dw/extra/' },
            //     { label: 'Exercícios', link: '/courses/cstrc-jp-dw/extra/exercises/' },
            //     { label: 'Próximos Passos', link: '/courses/cstrc-jp-dw/extra/next-steps/' },
            //   ],
            // },
          ],
        },
        {
          label: 'Programação para Web 2',
          items: [
            { label: 'Visão geral', link: '/courses/csbes-jp-pw2/' },
            {
              label: 'Avaliações',
              collapsed: true,
              items: [
                { label: 'Projeto', link: '/courses/csbes-jp-pw2/project/' },
                {
                  label: 'Exercícios',
                  link: '/courses/csbes-jp-pw2/extra/exercises/',
                },
                { label: 'Quizzes', link: '/courses/csbes-jp-pw2/extra/quizzes/' },
              ],
            },
            {
              label: 'JavaScript',
              collapsed: false,
              items: [
                { label: 'ECMAScript', link: '/courses/csbes-jp-pw2/ecma/introduction/' },
                { label: 'Variáveis', link: '/courses/csbes-jp-pw2/ecma/variable/' },
                {
                  label: 'Expressões e Operadores',
                  link: '/courses/csbes-jp-pw2/ecma/expression-and-operator/',
                },
                {
                  label: 'Decisão e Repetição',
                  link: '/courses/csbes-jp-pw2/ecma/statements/',
                },
                { label: 'Funções', link: '/courses/csbes-jp-pw2/ecma/function/' },
                { label: 'Módulos', link: '/courses/csbes-jp-pw2/ecma/modules/' },
                { label: 'Arrays', link: '/courses/csbes-jp-pw2/ecma/array/' },
                { label: 'Strings', link: '/courses/csbes-jp-pw2/ecma/string/' },
                { label: 'Objetos', link: '/courses/csbes-jp-pw2/ecma/object/' },
                { label: 'Promises', link: '/courses/csbes-jp-pw2/ecma/promise/' },
                { label: 'RegExp', link: '/courses/csbes-jp-pw2/ecma/regexp/' },
                { label: 'Date', link: '/courses/csbes-jp-pw2/ecma/date/' },
              ],
            },
            {
              label: 'Browser, APIs e Pacotes',
              collapsed: false,
              items: [
                {
                  label: 'Objetos do Navegador',
                  link: '/courses/csbes-jp-pw2/w3c/browser-objects/',
                },
                {
                  label: 'Elementos Dinâmicos',
                  link: '/courses/csbes-jp-pw2/w3c/dynamic-elements/',
                },
                { label: 'Vite', link: '/courses/csbes-jp-pw2/package/vite/' },
                { label: 'Eventos', link: '/courses/csbes-jp-pw2/w3c/event-handling/' },
                { label: 'DOM API', link: '/courses/csbes-jp-pw2/w3c/dom-api/' },
                { label: 'Local Storage', link: '/courses/csbes-jp-pw2/w3c/local-storage/' },
                { label: 'REST API', link: '/courses/csbes-jp-pw2/api/rest/' },
                { label: 'GraphQL', link: '/courses/csbes-jp-pw2/api/graphql/' },
                { label: 'Supabase API', link: '/courses/csbes-jp-pw2/package/supabase-api/' },
                { label: 'Consumo do Supabase', link: '/courses/csbes-jp-pw2/package/http-client/' },
                { label: 'Fetch API', link: '/courses/csbes-jp-pw2/w3c/fetch-api/' },
                { label: 'Axios', link: '/courses/csbes-jp-pw2/package/axios/' },
                { label: 'JSON Server', link: '/courses/csbes-jp-pw2/package/json-server/' },
                {
                  label: 'Supabase Client',
                  link: '/courses/csbes-jp-pw2/package/supabase-client/',
                },
                {
                  label: 'Supabase Auth',
                  link: '/courses/csbes-jp-pw2/package/supabase-auth/',
                },
                {
                  label: 'Firebase Firestore',
                  link: '/courses/csbes-jp-pw2/package/firebase-firestore/',
                },
                {
                  label: 'Firebase Auth',
                  link: '/courses/csbes-jp-pw2/package/firebase-auth/',
                },
              ],
            },
            {
              label: 'React',
              collapsed: false,
              items: [
                { label: 'ReactJS', link: '/courses/csbes-jp-pw2/react/introduction/' },
                { label: 'React Hooks', link: '/courses/csbes-jp-pw2/react/hooks/' },
                {
                  label: 'Supabase Auth',
                  link: '/courses/csbes-jp-pw2/react/supabase-auth/',
                },
                {
                  label: 'Firebase Auth',
                  link: '/courses/csbes-jp-pw2/react/firebase-auth/',
                },
                { label: 'React Style', link: '/courses/csbes-jp-pw2/react/style/' },
              ],
            },
            {
              label: 'Guias e Referências',
              collapsed: true,
              items: [
                { label: 'ECMAScript', link: '/courses/csbes-jp-pw2/extra/cheat-sheet/' },
              ],
            },
            {
              label: 'Extras',
              collapsed: false,
              items: [
                { label: 'Próximos Passos', link: '/courses/csbes-jp-pw2/extra/next-steps/' },
              ],
            },
          ],
        },
        {
          label: 'Linguagem de Programação II',
          items: [
            { label: 'Visão geral', link: '/courses/ctii-jp-lp2/' },
            {
              label: 'JavaScript e Node.js',
              collapsed: false,
              items: [
                { label: 'JavaScript', link: '/courses/ctii-jp-lp2/javascript/introduction/' },
                {
                  label: 'JavaScript no Front-end',
                  link: '/courses/ctii-jp-lp2/javascript/frontend/',
                },
                { label: 'Node.js HTTP', link: '/courses/ctii-jp-lp2/nodejs/http/' },
              ],
            },
            {
              label: 'Express.js',
              collapsed: false,
              items: [
                { label: 'Express.js', link: '/courses/ctii-jp-lp2/expressjs/introduction/' },
                {
                  label: 'Construção de API',
                  link: '/courses/ctii-jp-lp2/expressjs/api/',
                },
                { label: 'MVC', link: '/courses/ctii-jp-lp2/expressjs/mvc/' },
              ],
            },
            {
              label: 'Dados e Autenticação',
              collapsed: false,
              items: [
                { label: 'SQL com Node.js', link: '/courses/ctii-jp-lp2/expressjs/db-simple/' },
                { label: 'Prisma', link: '/courses/ctii-jp-lp2/expressjs/prismajs-simple/' },
                {
                  label: 'Relações com Prisma',
                  link: '/courses/ctii-jp-lp2/expressjs/prismajs-relation/',
                },
                {
                  label: 'Cadastro de Usuário',
                  link: '/courses/ctii-jp-lp2/expressjs/prismajs-user/',
                },
                { label: 'Autenticação', link: '/courses/ctii-jp-lp2/expressjs/auth/' },
              ],
            },
            {
              label: 'Recursos da Aplicação',
              collapsed: false,
              items: [
                { label: 'Validação', link: '/courses/ctii-jp-lp2/expressjs/validation/' },
                { label: 'E-mail', link: '/courses/ctii-jp-lp2/expressjs/email/' },
                { label: 'Upload de Arquivo', link: '/courses/ctii-jp-lp2/expressjs/upload-file/' },
                { label: 'Testes', link: '/courses/ctii-jp-lp2/expressjs/test/' },
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
