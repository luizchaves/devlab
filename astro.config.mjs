// @ts-check
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import materialsDev from './scripts/vite-plugin-materials-dev.mjs';
import { BASE_PATH, REPO_URL, SITE_URL } from './site.config.mjs';

/**
 * Astro nao aplica o `base` no destino de um redirect; este helper faz isso.
 *
 * @param {string} path Caminho interno iniciado por `/`.
 * @returns {string} Caminho ja prefixado com o `base` configurado.
 */
const withBase = (path) => `${BASE_PATH === '/' ? '' : BASE_PATH}${path}`;

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
  /**
   * URLs antigas da disciplina de Desenvolvimento Web.
   *
   * O conteúdo técnico passou a viver nos guias por tecnologia; estes redirecionamentos
   * preservam links de slides, mapas mentais, exercícios e material externo.
   */
  redirects: {
    // O guia de pacotes passou a se chamar "Guia de Pacotes JavaScript" e mudou de rota,
    // para abrir espaco a guias de pacotes de outras linguagens.
    '/courses/packages': withBase('/courses/npm/'),
    '/courses/packages/build/vite': withBase('/courses/npm/build/vite/'),
    '/courses/packages/mock/json-server': withBase('/courses/npm/mock/json-server/'),
    '/courses/packages/http/axios': withBase('/courses/npm/http/axios/'),
    '/courses/packages/ui/chartjs': withBase('/courses/npm/ui/chartjs/'),
    '/courses/packages/baas/supabase': withBase('/courses/cloud/supabase/'),
    '/courses/packages/baas/supabase-api': withBase('/courses/cloud/supabase/api/'),
    '/courses/packages/baas/supabase-client': withBase('/courses/cloud/supabase/client/'),
    '/courses/packages/baas/supabase-auth': withBase('/courses/cloud/supabase/auth/'),
    '/courses/packages/baas/firebase': withBase('/courses/cloud/firebase/'),
    '/courses/packages/baas/firebase-firestore': withBase('/courses/cloud/firebase/firestore/'),
    '/courses/packages/baas/firebase-auth': withBase('/courses/cloud/firebase/auth/'),
    // O BaaS saiu do guia de pacotes e virou o "Guia de Serviços em Nuvem",
    // porque o assunto e a infraestrutura hospedada, nao o registro npm.
    '/courses/npm/baas/supabase': withBase('/courses/cloud/supabase/'),
    '/courses/npm/baas/supabase-api': withBase('/courses/cloud/supabase/api/'),
    '/courses/npm/baas/supabase-client': withBase('/courses/cloud/supabase/client/'),
    '/courses/npm/baas/supabase-auth': withBase('/courses/cloud/supabase/auth/'),
    '/courses/npm/baas/firebase': withBase('/courses/cloud/firebase/'),
    '/courses/npm/baas/firebase-firestore': withBase('/courses/cloud/firebase/firestore/'),
    '/courses/npm/baas/firebase-auth': withBase('/courses/cloud/firebase/auth/'),
    // Redirecionamento da reestruturacao do Guia de Pacotes JavaScript (Fundamentos -> Managers)
    '/courses/npm/basics/introduction': withBase('/courses/npm/managers/npm/'),
    '/courses/npm/basics/dependencies': withBase('/courses/npm/managers/npm/'),
    '/courses/npm/basics/scripts': withBase('/courses/npm/managers/npm/'),
    '/courses/npm/dev/dev-dependencies': withBase('/courses/npm/dev/linters/'),
    // As paginas de hospedagem viraram a secao "Recursos", organizada por recurso de nuvem.
    '/courses/cloud/hosting/static-hosting': withBase('/courses/cloud/resources/static-hosting/'),
    '/courses/cloud/hosting/serverless-functions': withBase(
      '/courses/cloud/resources/serverless-functions/'
    ),
    // Redirecionamento legado do Guia de Express para expressjs.
    '/courses/express': withBase('/courses/expressjs/'),
    // Persistencia migrou do Guia de Banco de Dados para o Guia de Express.js.
    '/courses/database/sql/node-sqlite': withBase('/courses/expressjs/persistence/node-sqlite/'),
    '/courses/database/prisma/introduction': withBase('/courses/expressjs/persistence/prisma/'),
    '/courses/database/prisma/crud': withBase('/courses/expressjs/persistence/crud/'),
    '/courses/database/prisma/relations': withBase('/courses/expressjs/persistence/relations/'),
    // Os projetos soltos do guia viraram as etapas da trilha TaskAPI.
    '/courses/expressjs/practice/hello-express': withBase(
      '/courses/expressjs/practice/taskapi/hello/'
    ),
    '/courses/expressjs/practice/express-router': withBase(
      '/courses/expressjs/practice/taskapi/router/'
    ),
    '/courses/expressjs/practice/express-mvc': withBase('/courses/expressjs/practice/taskapi/mvc/'),
    '/courses/expressjs/practice/express-typescript': withBase(
      '/courses/expressjs/practice/taskapi/typescript/'
    ),
    '/courses/expressjs/practice/express-prisma': withBase(
      '/courses/expressjs/practice/taskapi/prisma/'
    ),
    '/courses/expressjs/practice/express-auth': withBase(
      '/courses/expressjs/practice/taskapi/auth/'
    ),
    // O Monitor API virou o trilho completo do MonitorApp, em treze etapas.
    '/courses/expressjs/practice/monitor-api': withBase('/courses/expressjs/practice/monitorapp/'),
    // Validacao saiu de "Recursos Avancados" para a trilha de APIs HTTP.
    '/courses/expressjs/advanced/validation': withBase('/courses/expressjs/api/validation/'),
    '/courses/dw-cstrc-jp/html': withBase('/courses/html/basics/syntax-structure/'),
    '/courses/dw-cstrc-jp/html/web-importance': withBase('/courses/html/basics/web-importance/'),
    '/courses/dw-cstrc-jp/html/markup-languages': withBase(
      '/courses/html/basics/markup-languages/'
    ),
    '/courses/dw-cstrc-jp/html/forms': withBase('/courses/html/forms/elements-controls/'),
    '/courses/dw-cstrc-jp/css': withBase('/courses/css/basics/syntax-cascade/'),
    '/courses/dw-cstrc-jp/css/box-model': withBase('/courses/css/layout/box-model/'),
    '/courses/dw-cstrc-jp/css/forms': withBase('/courses/css/forms/styling/'),
    '/courses/dw-cstrc-jp/javascript': withBase('/courses/ecmascript/'),
    '/courses/dw-cstrc-jp/javascript/ecmascript': withBase(
      '/courses/ecmascript/basics/introduction/'
    ),
    '/courses/dw-cstrc-jp/javascript/variables': withBase('/courses/ecmascript/basics/variables/'),
    '/courses/dw-cstrc-jp/javascript/expressions-operators': withBase(
      '/courses/ecmascript/basics/operators/'
    ),
    '/courses/dw-cstrc-jp/javascript/control-flow': withBase(
      '/courses/ecmascript/basics/control-flow/'
    ),
    '/courses/dw-cstrc-jp/javascript/functions': withBase(
      '/courses/ecmascript/structure/functions/'
    ),
    '/courses/dw-cstrc-jp/javascript/modules': withBase('/courses/ecmascript/structure/modules/'),
    '/courses/dw-cstrc-jp/javascript/arrays': withBase('/courses/ecmascript/data/arrays/'),
    '/courses/dw-cstrc-jp/javascript/strings': withBase('/courses/ecmascript/data/strings/'),
    '/courses/dw-cstrc-jp/javascript/number-math': withBase('/courses/ecmascript/data/numbers/'),
    '/courses/dw-cstrc-jp/javascript/date': withBase('/courses/ecmascript/stdlib/date/'),
    '/courses/dw-cstrc-jp/javascript/regexp': withBase('/courses/ecmascript/stdlib/regex/'),
    '/courses/dw-cstrc-jp/javascript/map-set': withBase('/courses/ecmascript/data/collections/'),
    '/courses/dw-cstrc-jp/javascript/objects': withBase('/courses/ecmascript/data/objects/'),
    '/courses/dw-cstrc-jp/javascript/promises': withBase('/courses/ecmascript/async/promises/'),
    '/courses/dw-cstrc-jp/javascript/async-await': withBase(
      '/courses/ecmascript/async/async-await/'
    ),
    '/courses/dw-cstrc-jp/javascript/error-handling': withBase(
      '/courses/ecmascript/structure/errors/'
    ),
    '/courses/dw-cstrc-jp/javascript/fetch-api': withBase('/courses/web-api/http/fetch/'),
    '/courses/dw-cstrc-jp/extra/cheat-sheet': withBase(
      '/courses/ecmascript/reference/cheat-sheet/'
    ),
    '/courses/dw-cstrc-jp/extra/ecmascript-versions': withBase(
      '/courses/ecmascript/evolution/tc39/'
    ),
    '/courses/dw-cstrc-jp/browser': withBase('/courses/web-api/'),
    '/courses/dw-cstrc-jp/browser/browser-objects': withBase('/courses/web-api/browser/objects/'),
    '/courses/dw-cstrc-jp/browser/dom-api': withBase('/courses/web-api/dom/manipulation/'),
    '/courses/dw-cstrc-jp/browser/events': withBase('/courses/web-api/dom/events/'),
    '/courses/dw-cstrc-jp/browser/dynamic-elements': withBase(
      '/courses/web-api/dom/dynamic-elements/'
    ),
    '/courses/dw-cstrc-jp/browser/local-storage': withBase(
      '/courses/web-api/storage/local-storage/'
    ),
    '/courses/dw-cstrc-jp/node': withBase('/courses/nodejs/basics/introduction/'),
    '/courses/dw-cstrc-jp/node/modules': withBase('/courses/nodejs/basics/modules/'),
    '/courses/dw-cstrc-jp/node/npm': withBase('/courses/nodejs/tools/npm/'),
    '/courses/dw-cstrc-jp/node/http': withBase('/courses/nodejs/http/server/'),
    '/courses/dw-cstrc-jp/express': withBase('/courses/expressjs/basics/introduction/'),
    '/courses/dw-cstrc-jp/express/routes': withBase('/courses/expressjs/basics/routes/'),
    '/courses/dw-cstrc-jp/express/controllers': withBase('/courses/expressjs/basics/controllers/'),
    '/courses/dw-cstrc-jp/express/middleware': withBase('/courses/expressjs/basics/middleware/'),
    '/courses/dw-cstrc-jp/express/rest-api': withBase('/courses/expressjs/api/rest/'),
    '/courses/dw-cstrc-jp/express/api-construction': withBase(
      '/courses/expressjs/api/construction/'
    ),
    '/courses/dw-cstrc-jp/express/mvc': withBase('/courses/expressjs/architecture/mvc/'),
    '/courses/dw-cstrc-jp/express/system-call': withBase(
      '/courses/expressjs/advanced/system-call/'
    ),
    '/courses/dw-cstrc-jp/express/user-registration': withBase(
      '/courses/expressjs/auth/user-registration/'
    ),
    '/courses/dw-cstrc-jp/express/authentication': withBase(
      '/courses/expressjs/auth/authentication/'
    ),
    '/courses/dw-cstrc-jp/database/dbms': withBase('/courses/database/basics/introduction/'),
    '/courses/database/basics/dbms': withBase('/courses/database/basics/introduction/'),
    '/courses/dw-cstrc-jp/database/sql': withBase('/courses/database/sql/introduction/'),
    '/courses/database/sql/fundamentals': withBase('/courses/database/sql/introduction/'),
    '/courses/database/sql/transactions': withBase('/courses/database/sql/tcl/'),
    '/courses/database/relational-comparison': withBase(
      '/courses/database/sql/engines-comparison/'
    ),
    '/courses/dw-cstrc-jp/database/sql-node': withBase(
      '/courses/expressjs/persistence/node-sqlite/'
    ),
    '/courses/dw-cstrc-jp/database/prisma': withBase('/courses/expressjs/persistence/prisma/'),
    '/courses/dw-cstrc-jp/database/crud': withBase('/courses/expressjs/persistence/crud/'),
    '/courses/dw-cstrc-jp/database/prisma-relations': withBase(
      '/courses/expressjs/persistence/relations/'
    ),
    '/courses/dw-cstrc-jp/packages': withBase('/courses/npm/'),
    '/courses/dw-cstrc-jp/packages/vite': withBase('/courses/npm/build/vite/'),
    '/courses/dw-cstrc-jp/packages/json-server': withBase('/courses/npm/mock/json-server/'),
    '/courses/dw-cstrc-jp/packages/chartjs': withBase('/courses/npm/ui/chartjs/'),
    '/courses/dw-cstrc-jp/packages/axios': withBase('/courses/npm/http/axios/'),
    '/courses/dw-cstrc-jp/packages/bootstrap': withBase('/courses/css/frameworks/bootstrap/'),
    '/courses/dw-cstrc-jp/packages/tailwind-css': withBase('/courses/css/frameworks/tailwind/'),
    '/courses/dw-cstrc-jp/projects/hello-express': withBase(
      '/courses/expressjs/practice/hello-express/'
    ),
    '/courses/dw-cstrc-jp/projects/express-router': withBase(
      '/courses/expressjs/practice/express-router/'
    ),
    '/courses/dw-cstrc-jp/projects/express-mvc': withBase(
      '/courses/expressjs/practice/express-mvc/'
    ),
    '/courses/dw-cstrc-jp/projects/express-prisma': withBase(
      '/courses/expressjs/practice/express-prisma/'
    ),
    '/courses/pw2-csbes-jp/ecma': withBase('/courses/ecmascript/'),
    '/courses/pw2-csbes-jp/ecma/introduction': withBase('/courses/ecmascript/basics/introduction/'),
    '/courses/pw2-csbes-jp/ecma/variable': withBase('/courses/ecmascript/basics/variables/'),
    '/courses/pw2-csbes-jp/ecma/expression-and-operator': withBase(
      '/courses/ecmascript/basics/operators/'
    ),
    '/courses/pw2-csbes-jp/ecma/statements': withBase('/courses/ecmascript/basics/control-flow/'),
    '/courses/pw2-csbes-jp/ecma/function': withBase('/courses/ecmascript/structure/functions/'),
    '/courses/pw2-csbes-jp/ecma/modules': withBase('/courses/ecmascript/structure/modules/'),
    '/courses/pw2-csbes-jp/ecma/array': withBase('/courses/ecmascript/data/arrays/'),
    '/courses/pw2-csbes-jp/ecma/string': withBase('/courses/ecmascript/data/strings/'),
    '/courses/pw2-csbes-jp/ecma/number-math': withBase('/courses/ecmascript/data/numbers/'),
    '/courses/pw2-csbes-jp/ecma/date': withBase('/courses/ecmascript/stdlib/date/'),
    '/courses/pw2-csbes-jp/ecma/regexp': withBase('/courses/ecmascript/stdlib/regex/'),
    '/courses/pw2-csbes-jp/ecma/map-set': withBase('/courses/ecmascript/data/collections/'),
    '/courses/pw2-csbes-jp/ecma/object': withBase('/courses/ecmascript/data/objects/'),
    '/courses/pw2-csbes-jp/ecma/promise': withBase('/courses/ecmascript/async/promises/'),
    '/courses/pw2-csbes-jp/ecma/error-handling': withBase('/courses/ecmascript/structure/errors/'),
    '/courses/pw2-csbes-jp/extra/cheat-sheet': withBase(
      '/courses/ecmascript/reference/cheat-sheet/'
    ),
    '/courses/pw2-csbes-jp/extra/ecmascript-versions': withBase(
      '/courses/ecmascript/evolution/tc39/'
    ),
    '/courses/pw2-csbes-jp/w3c/browser-objects': withBase('/courses/web-api/browser/objects/'),
    '/courses/pw2-csbes-jp/w3c/dom-api': withBase('/courses/web-api/dom/manipulation/'),
    '/courses/pw2-csbes-jp/w3c/dynamic-elements': withBase(
      '/courses/web-api/dom/dynamic-elements/'
    ),
    '/courses/pw2-csbes-jp/w3c/event-handling': withBase('/courses/web-api/dom/events/'),
    '/courses/pw2-csbes-jp/w3c/local-storage': withBase('/courses/web-api/storage/local-storage/'),
    '/courses/pw2-csbes-jp/w3c/fetch-api': withBase('/courses/web-api/http/fetch/'),
    '/courses/pw2-csbes-jp/api/rest': withBase('/courses/web-api/http/rest/'),
    '/courses/pw2-csbes-jp/api/graphql': withBase('/courses/web-api/http/graphql/'),
    '/courses/pw2-csbes-jp/package/axios': withBase('/courses/npm/http/axios/'),
    '/courses/pw2-csbes-jp/package/http-client': withBase('/courses/web-api/http/clients/'),
    '/courses/pw2-csbes-jp/package/vite': withBase('/courses/npm/build/vite/'),
    '/courses/pw2-csbes-jp/package/json-server': withBase('/courses/npm/mock/json-server/'),
    '/courses/pw2-csbes-jp/package/supabase-api': withBase('/courses/cloud/supabase/api/'),
    '/courses/pw2-csbes-jp/package/supabase-client': withBase('/courses/cloud/supabase/client/'),
    '/courses/pw2-csbes-jp/package/supabase-auth': withBase('/courses/cloud/supabase/auth/'),
    '/courses/pw2-csbes-jp/package/firebase-firestore': withBase(
      '/courses/cloud/firebase/firestore/'
    ),
    '/courses/pw2-csbes-jp/package/firebase-auth': withBase('/courses/cloud/firebase/auth/'),
    '/courses/pw2-csbes-jp/react/introduction': withBase('/courses/react/basics/introduction/'),
    '/courses/pw2-csbes-jp/react/style': withBase('/courses/react/basics/style/'),
    '/courses/pw2-csbes-jp/react/hooks': withBase('/courses/react/state/hooks/'),
    '/courses/pw2-csbes-jp/react/supabase-auth': withBase('/courses/react/auth/supabase/'),
    '/courses/pw2-csbes-jp/react/firebase-auth': withBase('/courses/react/auth/firebase/'),
    '/courses/lp2-ctii-jp/javascript/introduction': withBase(
      '/courses/ecmascript/basics/introduction/'
    ),
    '/courses/lp2-ctii-jp/javascript/frontend': withBase('/courses/web-api/dom/dynamic-elements/'),
    '/courses/lp2-ctii-jp/nodejs/http': withBase('/courses/nodejs/http/server/'),
    '/courses/lp2-ctii-jp/expressjs/introduction': withBase(
      '/courses/expressjs/basics/introduction/'
    ),
    '/courses/lp2-ctii-jp/expressjs/api': withBase('/courses/expressjs/api/construction/'),
    '/courses/lp2-ctii-jp/expressjs/mvc': withBase('/courses/expressjs/architecture/mvc/'),
    '/courses/lp2-ctii-jp/expressjs/db-simple': withBase(
      '/courses/expressjs/persistence/node-sqlite/'
    ),
    '/courses/lp2-ctii-jp/expressjs/prismajs-simple': withBase(
      '/courses/expressjs/persistence/prisma/'
    ),
    '/courses/lp2-ctii-jp/expressjs/prismajs-relation': withBase(
      '/courses/expressjs/persistence/relations/'
    ),
    '/courses/lp2-ctii-jp/expressjs/prismajs-user': withBase(
      '/courses/expressjs/auth/user-registration/'
    ),
    '/courses/lp2-ctii-jp/expressjs/auth': withBase('/courses/expressjs/auth/authentication/'),
    '/courses/lp2-ctii-jp/expressjs/validation': withBase('/courses/expressjs/api/validation/'),
    '/courses/lp2-ctii-jp/expressjs/email': withBase('/courses/expressjs/advanced/email/'),
    '/courses/lp2-ctii-jp/expressjs/upload-file': withBase(
      '/courses/expressjs/advanced/upload-file/'
    ),
    '/courses/lp2-ctii-jp/expressjs/test': withBase('/courses/expressjs/advanced/testing/'),
    '/courses/typescript/basics/typescript-vs-javascript': withBase(
      '/courses/typescript/reference/typescript-vs-javascript/'
    ),
    '/courses/web-api/browser/modern-apis': withBase('/courses/web-api/browser/catalog/'),
    '/courses/web-api/browser/modern-apis/dialog': withBase('/courses/web-api/ui/dialog/'),
    '/courses/web-api/browser/modern-apis/fullscreen': withBase('/courses/web-api/ui/fullscreen/'),
    '/courses/web-api/browser/modern-apis/canvas': withBase('/courses/web-api/media/canvas/'),
    '/courses/web-api/browser/modern-apis/web-speech': withBase(
      '/courses/web-api/media/web-speech/'
    ),
    '/courses/web-api/browser/modern-apis/clipboard': withBase('/courses/web-api/input/clipboard/'),
    '/courses/web-api/browser/modern-apis/drag-and-drop': withBase(
      '/courses/web-api/input/drag-and-drop/'
    ),
    '/courses/web-api/browser/modern-apis/geolocation': withBase(
      '/courses/web-api/device/geolocation/'
    ),
    '/courses/web-api/browser/modern-apis/notification': withBase(
      '/courses/web-api/device/notification/'
    ),
    '/courses/web-api/browser/modern-apis/vibration': withBase(
      '/courses/web-api/device/vibration/'
    ),
  },
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
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: `${SITE_URL}${BASE_PATH === '/' ? '' : BASE_PATH}/og-image.png`,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:secure_url',
            content: `${SITE_URL}${BASE_PATH === '/' ? '' : BASE_PATH}/og-image.png`,
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:type',
            content: 'image/png',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: '1200',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: '630',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'DevLab — Portal de disciplinas e guias de programação',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: `${SITE_URL}${BASE_PATH === '/' ? '' : BASE_PATH}/og-image.png`,
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image:alt',
            content: 'DevLab — Portal de disciplinas e guias de programação',
          },
        },
      ],
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
            { label: 'Visão geral', link: '/courses/dw-cstrc-jp/' },
            {
              label: 'Avaliações',
              items: [
                { label: 'Projeto', link: '/courses/dw-cstrc-jp/project/' },
                { label: 'Exercícios', link: '/courses/dw-cstrc-jp/extra/exercises/' },
                { label: 'Quizzes', link: '/courses/dw-cstrc-jp/extra/quizzes/' },
              ],
            },
            { label: 'Web e HTML', link: '/courses/dw-cstrc-jp/topics/web-html/' },
            { label: 'CSS', link: '/courses/dw-cstrc-jp/topics/css/' },
            { label: 'JavaScript', link: '/courses/dw-cstrc-jp/topics/javascript/' },
            { label: 'Web APIs e Pacotes', link: '/courses/dw-cstrc-jp/topics/web-apis/' },
            { label: 'Node.js e Express.js', link: '/courses/dw-cstrc-jp/topics/node-express/' },
            { label: 'Banco de Dados', link: '/courses/dw-cstrc-jp/topics/database/' },
            {
              label: 'Projetos',
              items: [
                { label: 'Visão geral', link: '/courses/dw-cstrc-jp/projects/' },
                {
                  label: 'Invest App Bootstrap',
                  link: '/courses/dw-cstrc-jp/projects/invest-app-bootstrap/',
                },
              ],
            },
          ],
        },
        {
          label: 'Programação para Web 2',
          items: [
            { label: 'Visão geral', link: '/courses/pw2-csbes-jp/' },
            {
              label: 'Avaliações',
              items: [
                { label: 'Projeto', link: '/courses/pw2-csbes-jp/project/' },
                { label: 'Exercícios', link: '/courses/pw2-csbes-jp/extra/exercises/' },
                { label: 'Quizzes', link: '/courses/pw2-csbes-jp/extra/quizzes/' },
              ],
            },
            { label: 'JavaScript', link: '/courses/pw2-csbes-jp/topics/javascript/' },
            { label: 'Web APIs', link: '/courses/pw2-csbes-jp/topics/web-apis/' },
            { label: 'Pacotes e Serviços', link: '/courses/pw2-csbes-jp/topics/packages/' },
            { label: 'React', link: '/courses/pw2-csbes-jp/topics/react/' },
          ],
        },
        {
          label: 'Linguagem de Programação II',
          items: [
            { label: 'Visão geral', link: '/courses/lp2-ctii-jp/' },
            { label: 'JavaScript e Front-end', link: '/courses/lp2-ctii-jp/topics/javascript/' },
            { label: 'Node.js e Express.js', link: '/courses/lp2-ctii-jp/topics/node-express/' },
            { label: 'Dados e Autenticação', link: '/courses/lp2-ctii-jp/topics/data-auth/' },
            { label: 'Recursos da Aplicação', link: '/courses/lp2-ctii-jp/topics/app-features/' },
          ],
        },
        {
          label: 'Guia de Python',
          items: [
            { label: 'Visão geral', link: '/courses/python/' },
            {
              label: 'Fundamentos',
              items: [
                { label: 'Introdução', link: '/courses/python/basics/introduction/' },
                { label: 'Tipos de Dados', link: '/courses/python/basics/types/' },
                { label: 'Variáveis', link: '/courses/python/basics/variables/' },
                {
                  label: 'Expressões e Operadores',
                  link: '/courses/python/basics/operators/',
                },
                {
                  label: 'Decisão e Repetição',
                  link: '/courses/python/basics/statements/',
                },
                { label: 'Funções', link: '/courses/python/basics/functions/' },
              ],
            },
            {
              label: 'Dados e Coleções',
              items: [
                { label: 'Strings', link: '/courses/python/data/strings/' },
                { label: 'Coleções', link: '/courses/python/data/collections/' },
                {
                  label: 'Compreensões e Geradores',
                  link: '/courses/python/data/comprehensions/',
                },
              ],
            },
            {
              label: 'Organização do Código',
              items: [
                { label: 'Módulos e Pacotes', link: '/courses/python/structure/modules/' },
                { label: 'Classes e Objetos', link: '/courses/python/structure/classes/' },
                { label: 'Erros e Exceções', link: '/courses/python/structure/errors/' },
              ],
            },
            {
              label: 'Biblioteca Padrão',
              items: [
                { label: 'Arquivos, JSON e CSV', link: '/courses/python/stdlib/files/' },
                { label: 'Data e Hora', link: '/courses/python/stdlib/datetime/' },
                { label: 'Expressões Regulares', link: '/courses/python/stdlib/regex/' },
              ],
            },
            {
              label: 'Ambiente e Ferramentas',
              items: [
                { label: 'Ambiente e Pacotes com uv', link: '/courses/python/tools/uv/' },
                { label: 'venv e pip', link: '/courses/python/tools/venv/' },
              ],
            },
          ],
        },
        {
          label: 'Guia de TypeScript',
          items: [
            { label: 'Visão geral', link: '/courses/typescript/' },
            {
              label: 'Fundamentos',
              items: [
                { label: 'Introdução', link: '/courses/typescript/basics/introduction/' },
                { label: 'Tipos Básicos', link: '/courses/typescript/basics/types/' },
                { label: 'Funções', link: '/courses/typescript/basics/functions/' },
                { label: 'Narrowing', link: '/courses/typescript/basics/narrowing/' },
              ],
            },
            {
              label: 'Sistema de Tipos',
              items: [
                {
                  label: 'Objetos e Interfaces',
                  link: '/courses/typescript/types/objects/',
                },
                {
                  label: 'Uniões e Interseções',
                  link: '/courses/typescript/types/unions/',
                },
                { label: 'Generics', link: '/courses/typescript/types/generics/' },
              ],
            },
            {
              label: 'Tipos Avançados',
              items: [
                {
                  label: 'Utility Types',
                  link: '/courses/typescript/advanced/utility-types/',
                },
                {
                  label: 'Manipulação de Tipos',
                  link: '/courses/typescript/advanced/type-manipulation/',
                },
                { label: 'Classes', link: '/courses/typescript/advanced/classes/' },
              ],
            },
            {
              label: 'Ferramentas',
              items: [
                { label: 'tsconfig.json', link: '/courses/typescript/tooling/tsconfig/' },
                {
                  label: 'Módulos e Declarações',
                  link: '/courses/typescript/tooling/modules/',
                },
                { label: 'Execução e Build', link: '/courses/typescript/tooling/runtime/' },
              ],
            },
            {
              label: 'Na Prática',
              items: [
                {
                  label: 'Migrando de JavaScript',
                  link: '/courses/typescript/practice/migration/',
                },
                {
                  label: 'TypeScript no Node.js',
                  link: '/courses/typescript/practice/nodejs/',
                },
                {
                  label: 'TypeScript no React',
                  link: '/courses/typescript/practice/react/',
                },
              ],
            },
            {
              label: 'Evolução',
              items: [
                {
                  label: 'Evolução e Versões',
                  link: '/courses/typescript/evolution/releases/',
                },
              ],
            },
            {
              label: 'Referência Rápida',
              items: [
                {
                  label: 'Comparativo com JavaScript',
                  link: '/courses/typescript/reference/typescript-vs-javascript/',
                },
                {
                  label: 'Casos "Bizarros"',
                  link: '/courses/typescript/reference/weird-cases/',
                },
                {
                  label: 'Desenvolvimento com IA',
                  link: '/courses/typescript/reference/ai-assisted-development/',
                },
                {
                  label: 'Guia de Referência',
                  link: '/courses/typescript/reference/cheat-sheet/',
                },
              ],
            },
          ],
        },
        {
          label: 'Guia de HTML',
          items: [
            { label: 'Visão geral', link: '/courses/html/' },
            {
              label: 'Fundamentos e Conceitos',
              items: [
                { label: 'A Importância da Web', link: '/courses/html/basics/web-importance/' },
                { label: 'Linguagens de Marcação', link: '/courses/html/basics/markup-languages/' },
                {
                  label: 'Sintaxe e Estrutura do Documento',
                  link: '/courses/html/basics/syntax-structure/',
                },
              ],
            },
            {
              label: 'Elementos e Semântica',
              items: [
                {
                  label: 'Elementos Semânticos e Acessibilidade',
                  link: '/courses/html/elements/semantic-structure/',
                },
                { label: 'Texto, Listas e Links', link: '/courses/html/elements/text-formatting/' },
                { label: 'Imagens e Tabelas', link: '/courses/html/elements/media-tables/' },
              ],
            },
            {
              label: 'Formulários',
              items: [
                {
                  label: 'Estrutura de Formulários e Controles',
                  link: '/courses/html/forms/elements-controls/',
                },
              ],
            },
            {
              label: 'Ferramentas e Publicação',
              items: [
                {
                  label: 'Publicação e Deploy',
                  link: '/courses/html/tools/deploy/',
                },
              ],
            },
          ],
        },
        {
          label: 'Guia de CSS',
          items: [
            { label: 'Visão geral', link: '/courses/css/' },
            {
              label: 'Fundamentos e Seletores',
              items: [
                {
                  label: 'Sintaxe, Inclusão e Cascata',
                  link: '/courses/css/basics/syntax-cascade/',
                },
                {
                  label: 'Seletores, Pseudo-classes e Pseudo-elementos',
                  link: '/courses/css/basics/selectors/',
                },
                { label: 'At-rules', link: '/courses/css/basics/at-rules/' },
              ],
            },
            {
              label: 'Modelo de Caixa e Layout',
              items: [
                {
                  label: 'Modelo de Caixa (Box Model)',
                  link: '/courses/css/layout/box-model/',
                },
                {
                  label: 'Posicionamento (Positioning)',
                  link: '/courses/css/layout/positioning/',
                },
                {
                  label: 'Layout Flexível (Flexbox)',
                  link: '/courses/css/layout/flexbox/',
                },
                {
                  label: 'Layout Bidimensional (CSS Grid)',
                  link: '/courses/css/layout/grid/',
                },
              ],
            },
            {
              label: 'Estilização e Responsividade',
              items: [
                {
                  label: 'Tipografia, Cores e Variáveis',
                  link: '/courses/css/styling/typography-colors/',
                },
                {
                  label: 'Cores, Fundos e Gradientes',
                  link: '/courses/css/styling/backgrounds-gradients/',
                },
                {
                  label: 'Transições e Animações',
                  link: '/courses/css/styling/animations-transitions/',
                },
                { label: 'Estilizando Formulários', link: '/courses/css/forms/styling/' },
                {
                  label: 'Design Responsivo e Media Queries',
                  link: '/courses/css/styling/responsive-mediaqueries/',
                },
              ],
            },
            {
              label: 'Frameworks',
              items: [
                { label: 'Bootstrap', link: '/courses/css/frameworks/bootstrap/' },
                { label: 'Tailwind CSS', link: '/courses/css/frameworks/tailwind/' },
              ],
            },
          ],
        },
        {
          label: 'Guia de ECMAScript',
          items: [
            { label: 'Visão geral', link: '/courses/ecmascript/' },
            {
              label: 'Fundamentos',
              items: [
                {
                  label: 'Introdução e Ecossistema',
                  link: '/courses/ecmascript/basics/introduction/',
                },
                { label: 'Tipos de Dados e Coerção', link: '/courses/ecmascript/basics/types/' },
                { label: 'Variáveis e Escopo', link: '/courses/ecmascript/basics/variables/' },
                { label: 'Expressões e Operadores', link: '/courses/ecmascript/basics/operators/' },
                {
                  label: 'Estruturas de Controle',
                  link: '/courses/ecmascript/basics/control-flow/',
                },
              ],
            },
            {
              label: 'Organização de Código',
              items: [
                { label: 'Funções e Closures', link: '/courses/ecmascript/structure/functions/' },
                { label: 'Módulos ES (ESM)', link: '/courses/ecmascript/structure/modules/' },
                { label: 'Tratamento de Erros', link: '/courses/ecmascript/structure/errors/' },
              ],
            },
            {
              label: 'Estruturas de Dados',
              items: [
                { label: 'Strings e Template Literals', link: '/courses/ecmascript/data/strings/' },
                { label: 'Numbers, BigInt e Math', link: '/courses/ecmascript/data/numbers/' },
                { label: 'Arrays e Métodos Funcionais', link: '/courses/ecmascript/data/arrays/' },
                {
                  label: 'Objetos, Classes e Protótipos',
                  link: '/courses/ecmascript/data/objects/',
                },
                { label: 'Date e Manipulação de Datas', link: '/courses/ecmascript/stdlib/date/' },
                { label: 'Map, Set e Coleções', link: '/courses/ecmascript/data/collections/' },
                {
                  label: 'Expressões Regulares (RegExp)',
                  link: '/courses/ecmascript/stdlib/regex/',
                },
                {
                  label: 'Objetos Globais e Nativos',
                  link: '/courses/ecmascript/stdlib/built-ins/',
                },
              ],
            },
            {
              label: 'Assincronismo',
              items: [
                { label: 'Promises', link: '/courses/ecmascript/async/promises/' },
                { label: 'Async/Await', link: '/courses/ecmascript/async/async-await/' },
              ],
            },
            {
              label: 'Referência',
              items: [
                {
                  label: 'Evolução e TC39',
                  link: '/courses/ecmascript/evolution/tc39/',
                },
                {
                  label: 'Guia de Referência',
                  link: '/courses/ecmascript/reference/cheat-sheet/',
                },
                {
                  label: 'JavaScript vs Python',
                  link: '/courses/ecmascript/reference/python-vs-javascript/',
                },
                {
                  label: 'Casos "Bizarros"',
                  link: '/courses/ecmascript/reference/weird-cases/',
                },
                {
                  label: 'Desenvolvimento com IA',
                  link: '/courses/ecmascript/reference/ai-assisted-development/',
                },
              ],
            },
          ],
        },
        {
          label: 'Guia de Web APIs',
          items: [
            { label: 'Visão geral', link: '/courses/web-api/' },
            {
              label: 'Ambiente e Navegador',
              items: [
                {
                  label: 'O que o Front-end Faz?',
                  link: '/courses/web-api/common-features/',
                },
                {
                  label: 'Catálogo de APIs do Navegador',
                  link: '/courses/web-api/browser/catalog/',
                },
                { label: 'Ciclo de Vida da Página', link: '/courses/web-api/browser/lifecycle/' },
              ],
            },
            {
              label: 'Interface e Navegação',
              items: [
                { label: 'Objetos do Navegador (BOM)', link: '/courses/web-api/browser/objects/' },
                { label: 'History API (Navegação SPA)', link: '/courses/web-api/browser/history/' },
                {
                  label: 'Dialog API (Modais Nativos)',
                  link: '/courses/web-api/ui/dialog/',
                },
                {
                  label: 'Fullscreen API (Tela Cheia)',
                  link: '/courses/web-api/ui/fullscreen/',
                },
              ],
            },
            {
              label: 'DOM e Estrutura',
              items: [
                { label: 'Manipulação do DOM', link: '/courses/web-api/dom/manipulation/' },
                { label: 'Eventos e Interatividade', link: '/courses/web-api/dom/events/' },
                { label: 'Elementos Dinâmicos', link: '/courses/web-api/dom/dynamic-elements/' },
                { label: 'Formulários e Validação', link: '/courses/web-api/dom/forms/' },
                { label: 'Rolagem e Posicionamento', link: '/courses/web-api/dom/scroll/' },
                { label: 'Observadores (Observers)', link: '/courses/web-api/browser/observers/' },
              ],
            },
            {
              label: 'Desenho e Mídia',
              items: [
                {
                  label: 'Canvas API (Desenho 2D)',
                  link: '/courses/web-api/media/canvas/',
                },
                {
                  label: 'Gráficos 3D (WebGL e WebGPU)',
                  link: '/courses/web-api/media/webgl-webgpu/',
                },
                {
                  label: 'Web Speech API (Voz)',
                  link: '/courses/web-api/media/web-speech/',
                },
                {
                  label: 'MediaDevices API (Câmera e Áudio)',
                  link: '/courses/web-api/media/media-devices/',
                },
                {
                  label: 'Streaming de Vídeo (WebRTC e MSE)',
                  link: '/courses/web-api/media/streaming/',
                },
              ],
            },
            {
              label: 'Entrada e Transferência',
              items: [
                {
                  label: 'Clipboard API (Copiar e Colar)',
                  link: '/courses/web-api/input/clipboard/',
                },
                {
                  label: 'Drag and Drop API (Arrastar)',
                  link: '/courses/web-api/input/drag-and-drop/',
                },
              ],
            },
            {
              label: 'Dispositivo e Sistema',
              items: [
                {
                  label: 'Geolocation API (Localização)',
                  link: '/courses/web-api/device/geolocation/',
                },
                {
                  label: 'Notification API (Notificações)',
                  link: '/courses/web-api/device/notification/',
                },
                {
                  label: 'Vibration API (Feedback Tátil)',
                  link: '/courses/web-api/device/vibration/',
                },
                {
                  label: 'Web Workers API (Multi-threading)',
                  link: '/courses/web-api/browser/workers/',
                },
                {
                  label: 'WebAssembly (Código Compilado)',
                  link: '/courses/web-api/browser/webassembly/',
                },
              ],
            },
            {
              label: 'Armazenamento Client-Side',
              items: [
                {
                  label: 'Local Storage e Web Storage',
                  link: '/courses/web-api/storage/local-storage/',
                },
                { label: 'Cookies e Sessão', link: '/courses/web-api/storage/cookies/' },
              ],
            },
            {
              label: 'Comunicação de Rede',
              items: [
                {
                  label: 'APIs do Navegador',
                  items: [
                    { label: 'Fetch API', link: '/courses/web-api/http/fetch/' },
                    {
                      label: 'WebSockets API (Tempo Real)',
                      link: '/courses/web-api/http/websockets/',
                    },
                    { label: 'Server-Sent Events (SSE)', link: '/courses/web-api/http/sse/' },
                  ],
                },
                {
                  label: 'Fundamentos de Rede',
                  items: [
                    {
                      label: 'Clientes HTTP (Ferramentas)',
                      link: '/courses/web-api/http/clients/',
                    },
                    { label: 'REST API (Arquitetura)', link: '/courses/web-api/http/rest/' },
                    {
                      label: 'GraphQL (Linguagem de Consulta)',
                      link: '/courses/web-api/http/graphql/',
                    },
                    {
                      label: 'Server-Side Rendering (SSR)',
                      link: '/courses/web-api/browser/ssr/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Segurança no Navegador',
              items: [
                { label: 'CORS e Segurança', link: '/courses/web-api/http/cors/' },
                {
                  label: 'OWASP e Segurança no Cliente',
                  link: '/courses/web-api/security/client-side/',
                },
              ],
            },
            {
              label: 'Na Prática',
              items: [
                {
                  label: 'MonitorApp (DOM e Storage)',
                  link: '/courses/web-api/practice/monitor-app/',
                },
                { label: 'InvestApp (Fetch e API)', link: '/courses/web-api/practice/invest-app/' },
              ],
            },
            {
              label: 'Referência',
              items: [
                {
                  label: 'Guia de Referência',
                  link: '/courses/web-api/reference/cheat-sheet/',
                },
                {
                  label: 'Outras Web APIs',
                  link: '/courses/web-api/reference/other-apis/',
                },
              ],
            },
          ],
        },
        {
          label: 'Guia de Node.js',
          items: [
            { label: 'Visão geral', link: '/courses/nodejs/' },
            {
              label: 'Fundamentos',
              items: [
                { label: 'Introdução ao Node.js', link: '/courses/nodejs/basics/introduction/' },
                { label: 'Módulos no Node.js', link: '/courses/nodejs/basics/modules/' },
              ],
            },
            {
              label: 'Ferramentas',
              items: [{ label: 'npm', link: '/courses/nodejs/tools/npm/' }],
            },
            {
              label: 'HTTP',
              items: [{ label: 'Servidor HTTP nativo', link: '/courses/nodejs/http/server/' }],
            },
          ],
        },
        {
          label: 'Guia de Express.js',
          items: [
            { label: 'Visão geral', link: '/courses/expressjs/' },
            {
              label: 'Fundamentos',
              items: [
                {
                  label: 'Introdução ao Express.js',
                  link: '/courses/expressjs/basics/introduction/',
                },
                { label: 'Rotas', link: '/courses/expressjs/basics/routes/' },
                {
                  label: 'Requisição e Resposta',
                  link: '/courses/expressjs/basics/request-response/',
                },
                { label: 'Middleware', link: '/courses/expressjs/basics/middleware/' },
                { label: 'Controllers', link: '/courses/expressjs/basics/controllers/' },
                { label: 'TypeScript', link: '/courses/expressjs/basics/typescript/' },
              ],
            },
            {
              label: 'Arquitetura',
              items: [
                { label: 'MVC', link: '/courses/expressjs/architecture/mvc/' },
                { label: 'Configuração', link: '/courses/expressjs/architecture/config/' },
                { label: 'Log', link: '/courses/expressjs/architecture/logging/' },
                {
                  label: 'Observabilidade',
                  link: '/courses/expressjs/architecture/observability/',
                },
              ],
            },
            {
              label: 'APIs HTTP',
              items: [
                { label: 'Construção de API', link: '/courses/expressjs/api/construction/' },
                { label: 'REST API', link: '/courses/expressjs/api/rest/' },
                {
                  label: 'Tratamento de Erros',
                  link: '/courses/expressjs/api/error-handling/',
                },
                { label: 'Validação', link: '/courses/expressjs/api/validation/' },
                { label: 'Paginação e Filtros', link: '/courses/expressjs/api/pagination/' },
                {
                  label: 'Documentação de API',
                  link: '/courses/expressjs/api/documentation/',
                },
              ],
            },
            {
              label: 'Persistência',
              items: [
                {
                  label: 'SQL com Node.js',
                  link: '/courses/expressjs/persistence/node-sqlite/',
                },
                { label: 'Prisma', link: '/courses/expressjs/persistence/prisma/' },
                { label: 'CRUD com Prisma', link: '/courses/expressjs/persistence/crud/' },
                {
                  label: 'Relações com Prisma',
                  link: '/courses/expressjs/persistence/relations/',
                },
              ],
            },
            {
              label: 'Autenticação',
              items: [
                { label: 'Senhas e Hash', link: '/courses/expressjs/auth/passwords/' },
                {
                  label: 'Cadastro de Usuário',
                  link: '/courses/expressjs/auth/user-registration/',
                },
                { label: 'Autenticação', link: '/courses/expressjs/auth/authentication/' },
                { label: 'Autorização', link: '/courses/expressjs/auth/authorization/' },
              ],
            },
            {
              label: 'Segurança',
              items: [
                { label: 'CORS', link: '/courses/expressjs/security/cors/' },
                { label: 'Endurecimento', link: '/courses/expressjs/security/hardening/' },
              ],
            },
            {
              label: 'Recursos Avançados',
              items: [
                {
                  label: 'Upload de Arquivo',
                  link: '/courses/expressjs/advanced/upload-file/',
                },
                { label: 'Envio de E-mail', link: '/courses/expressjs/advanced/email/' },
                { label: 'Tempo Real', link: '/courses/expressjs/advanced/realtime/' },
                {
                  label: 'Chamada de Sistema',
                  link: '/courses/expressjs/advanced/system-call/',
                },
                { label: 'Testes', link: '/courses/expressjs/advanced/testing/' },
                { label: 'Deploy', link: '/courses/expressjs/advanced/deploy/' },
              ],
            },
            {
              label: 'Na Prática',
              items: [
                { label: 'BMI API', link: '/courses/expressjs/practice/bmi-api/' },
                {
                  label: 'TaskAPI',
                  items: [
                    {
                      label: 'Visão geral',
                      link: '/courses/expressjs/practice/taskapi/',
                    },
                    {
                      label: '1. Primeiro servidor',
                      link: '/courses/expressjs/practice/taskapi/hello/',
                    },
                    {
                      label: '2. Rotas em módulos',
                      link: '/courses/expressjs/practice/taskapi/router/',
                    },
                    {
                      label: '3. Camadas MVC',
                      link: '/courses/expressjs/practice/taskapi/mvc/',
                    },
                    {
                      label: '4. TypeScript',
                      link: '/courses/expressjs/practice/taskapi/typescript/',
                    },
                    {
                      label: '5. Validação',
                      link: '/courses/expressjs/practice/taskapi/validation/',
                    },
                    {
                      label: '6. Documentação',
                      link: '/courses/expressjs/practice/taskapi/openapi/',
                    },
                    {
                      label: '7. SQLite',
                      link: '/courses/expressjs/practice/taskapi/sqlite/',
                    },
                    {
                      label: '8. Prisma',
                      link: '/courses/expressjs/practice/taskapi/prisma/',
                    },
                    {
                      label: '9. Autenticação',
                      link: '/courses/expressjs/practice/taskapi/auth/',
                    },
                    {
                      label: '10. Endurecimento',
                      link: '/courses/expressjs/practice/taskapi/hardening/',
                    },
                    {
                      label: '11. Serviços',
                      link: '/courses/expressjs/practice/taskapi/services/',
                    },
                    {
                      label: '12. Testes e deploy',
                      link: '/courses/expressjs/practice/taskapi/test/',
                    },
                    {
                      label: 'Backlog do produto',
                      link: '/courses/expressjs/practice/taskapi/backlog/',
                    },
                    {
                      label: 'Especificação da API',
                      link: '/courses/expressjs/practice/taskapi/api-spec/',
                    },
                    {
                      label: 'Próximos passos',
                      link: '/courses/expressjs/practice/taskapi/next-steps/',
                    },
                  ],
                },
                {
                  label: 'InvestApp',
                  items: [
                    {
                      label: 'Visão geral',
                      link: '/courses/expressjs/practice/investapp/',
                    },
                    {
                      label: '1. Front estático',
                      link: '/courses/expressjs/practice/investapp/front-static/',
                    },
                    {
                      label: '2. API em memória',
                      link: '/courses/expressjs/practice/investapp/api/',
                    },
                    {
                      label: '3. TypeScript em camadas',
                      link: '/courses/expressjs/practice/investapp/typescript/',
                    },
                    {
                      label: '4. Validação',
                      link: '/courses/expressjs/practice/investapp/validation/',
                    },
                    {
                      label: '5. Documentação da API',
                      link: '/courses/expressjs/practice/investapp/swagger/',
                    },
                    {
                      label: '6. SQLite nativo',
                      link: '/courses/expressjs/practice/investapp/sqlite/',
                    },
                    {
                      label: '7. Prisma ORM',
                      link: '/courses/expressjs/practice/investapp/prisma/',
                    },
                    {
                      label: '8. Cadastro de Usuário',
                      link: '/courses/expressjs/practice/investapp/user/',
                    },
                    {
                      label: '9. Autenticação',
                      link: '/courses/expressjs/practice/investapp/auth/',
                    },
                    {
                      label: '10. E-mail',
                      link: '/courses/expressjs/practice/investapp/email/',
                    },
                    {
                      label: '11. Upload de Avatar',
                      link: '/courses/expressjs/practice/investapp/upload/',
                    },
                    {
                      label: '12. Testes de Software',
                      link: '/courses/expressjs/practice/investapp/testing/',
                    },
                    {
                      label: '13. Docker',
                      link: '/courses/expressjs/practice/investapp/docker/',
                    },
                    {
                      label: 'Backlog do produto',
                      link: '/courses/expressjs/practice/investapp/backlog/',
                    },
                    {
                      label: 'Especificação da API',
                      link: '/courses/expressjs/practice/investapp/api-spec/',
                    },
                    {
                      label: 'Próximos passos',
                      link: '/courses/expressjs/practice/investapp/next-steps/',
                    },
                  ],
                },
                {
                  label: 'MonitorApp',
                  items: [
                    {
                      label: 'Visão geral',
                      link: '/courses/expressjs/practice/monitorapp/',
                    },
                    {
                      label: '1. Front estático',
                      link: '/courses/expressjs/practice/monitorapp/front-static/',
                    },
                    {
                      label: '2. API em memória',
                      link: '/courses/expressjs/practice/monitorapp/api/',
                    },
                    {
                      label: '3. TypeScript em camadas',
                      link: '/courses/expressjs/practice/monitorapp/typescript/',
                    },
                    {
                      label: '4. Validação',
                      link: '/courses/expressjs/practice/monitorapp/validation/',
                    },
                    {
                      label: '5. Documentação da API',
                      link: '/courses/expressjs/practice/monitorapp/swagger/',
                    },
                    {
                      label: '6. SQLite nativo',
                      link: '/courses/expressjs/practice/monitorapp/sqlite/',
                    },
                    {
                      label: '7. Prisma e Relações',
                      link: '/courses/expressjs/practice/monitorapp/prisma/',
                    },
                    {
                      label: '8. Ping Real',
                      link: '/courses/expressjs/practice/monitorapp/ping/',
                    },
                    {
                      label: '9. Cadastro de Usuário',
                      link: '/courses/expressjs/practice/monitorapp/user/',
                    },
                    {
                      label: '10. Autenticação',
                      link: '/courses/expressjs/practice/monitorapp/auth/',
                    },
                    {
                      label: '11. Tempo Real',
                      link: '/courses/expressjs/practice/monitorapp/realtime/',
                    },
                    {
                      label: '12. Testes de Software',
                      link: '/courses/expressjs/practice/monitorapp/testing/',
                    },
                    {
                      label: '13. Docker',
                      link: '/courses/expressjs/practice/monitorapp/docker/',
                    },
                    {
                      label: 'Backlog do produto',
                      link: '/courses/expressjs/practice/monitorapp/backlog/',
                    },
                    {
                      label: 'Especificação da API',
                      link: '/courses/expressjs/practice/monitorapp/api-spec/',
                    },
                    {
                      label: 'Próximos passos',
                      link: '/courses/expressjs/practice/monitorapp/next-steps/',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Guia de Banco de Dados',
          items: [
            { label: 'Visão geral', link: '/courses/database/' },
            {
              label: 'Fundamentos',
              items: [
                { label: 'Conceito e SGBDs', link: '/courses/database/basics/introduction/' },
                { label: 'Paradigmas de Dados', link: '/courses/database/basics/paradigms/' },
                { label: 'SGBDs, Nuvem e Mercado', link: '/courses/database/basics/engines/' },
                { label: 'Estratégias de Escala', link: '/courses/database/basics/scale/' },
                { label: 'Administração', link: '/courses/database/basics/administration/' },
              ],
            },
            {
              label: 'Projeto e Modelagem',
              items: [
                {
                  label: 'Modelo Conceitual e Lógico',
                  link: '/courses/database/modeling/conceptual-logical/',
                },
                {
                  label: 'Normalização de Dados',
                  link: '/courses/database/modeling/normalization/',
                },
                {
                  label: 'Modelagem Não Relacional',
                  link: '/courses/database/modeling/non-relational/',
                },
                {
                  label: 'Padrões e Auditoria',
                  link: '/courses/database/modeling/patterns/',
                },
                { label: 'Chaves e Índices', link: '/courses/database/modeling/keys-indexes/' },
                { label: 'Estudos de Caso', link: '/courses/database/modeling/case-studies/' },
              ],
            },
            {
              label: 'Banco Relacional',
              items: [
                {
                  label: 'Linguagem SQL',
                  items: [
                    { label: 'Introdução ao SQL', link: '/courses/database/sql/introduction/' },
                    { label: 'SQL DDL (Definição)', link: '/courses/database/sql/ddl/' },
                    { label: 'SQL DML (Manipulação)', link: '/courses/database/sql/dml/' },
                    { label: 'SQL DQL (Consulta)', link: '/courses/database/sql/dql/' },
                    {
                      label: 'Junções e Agregações',
                      link: '/courses/database/sql/joins-aggregations/',
                    },
                    { label: 'SQL TCL e Transações', link: '/courses/database/sql/tcl/' },
                    { label: 'SQL DCL e Permissões', link: '/courses/database/sql/dcl/' },
                    {
                      label: 'Procedures, Functions e Triggers',
                      link: '/courses/database/sql/procedures-triggers/',
                    },
                    {
                      label: 'PL/SQL e PL/pgSQL',
                      link: '/courses/database/sql/plsql/',
                    },
                    { label: 'Desempenho', link: '/courses/database/sql/performance/' },
                    {
                      label: 'Comparativo de SGBDs',
                      link: '/courses/database/sql/engines-comparison/',
                    },
                  ],
                },
                {
                  label: 'SQLite',
                  items: [
                    { label: 'Visão geral do SQLite', link: '/courses/database/sqlite/' },
                    { label: 'Instalação e cliente', link: '/courses/database/sqlite/setup/' },
                    {
                      label: 'Dialeto e peculiaridades',
                      link: '/courses/database/sqlite/sql-dialect/',
                    },
                    { label: 'Administração', link: '/courses/database/sqlite/administration/' },
                  ],
                },
                {
                  label: 'PostgreSQL',
                  items: [
                    { label: 'Visão geral do PostgreSQL', link: '/courses/database/postgresql/' },
                    { label: 'Instalação e cliente', link: '/courses/database/postgresql/setup/' },
                    {
                      label: 'Dialeto e recursos avançados',
                      link: '/courses/database/postgresql/sql-dialect/',
                    },
                    {
                      label: 'Administração',
                      link: '/courses/database/postgresql/administration/',
                    },
                    {
                      label: 'Prática de SQL (invest_db)',
                      link: '/courses/database/postgresql/practice/',
                    },
                  ],
                },
                {
                  label: 'MySQL',
                  items: [
                    { label: 'Visão geral do MySQL', link: '/courses/database/mysql/' },
                    { label: 'Instalação e cliente', link: '/courses/database/mysql/setup/' },
                    {
                      label: 'Dialeto e recursos específicos',
                      link: '/courses/database/mysql/sql-dialect/',
                    },
                    { label: 'Administração', link: '/courses/database/mysql/administration/' },
                    {
                      label: 'Prática de SQL (monitor_db)',
                      link: '/courses/database/mysql/practice/',
                    },
                  ],
                },
                {
                  label: 'Amazon RDS e Aurora',
                  items: [
                    {
                      label: 'Visão geral de RDS e Aurora',
                      link: '/courses/database/rds-aurora/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/rds-aurora/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/rds-aurora/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Banco de Documentos',
              items: [
                {
                  label: 'MongoDB',
                  items: [
                    { label: 'Visão geral do MongoDB', link: '/courses/database/mongodb/' },
                    {
                      label: 'Instalação e cliente (mongosh)',
                      link: '/courses/database/mongodb/setup/',
                    },
                    {
                      label: 'Linguagem MQL e Agregação',
                      link: '/courses/database/mongodb/crud/',
                    },
                  ],
                },
                {
                  label: 'MongoDB Atlas e Firestore',
                  items: [
                    {
                      label: 'Visão geral de Atlas e Firestore',
                      link: '/courses/database/atlas-firestore/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/atlas-firestore/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/atlas-firestore/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Banco Chave-Valor',
              items: [
                {
                  label: 'Redis',
                  items: [
                    { label: 'Visão geral do Redis', link: '/courses/database/redis/' },
                    {
                      label: 'Instalação e cliente (redis-cli)',
                      link: '/courses/database/redis/setup/',
                    },
                    {
                      label: 'Comandos e Estruturas',
                      link: '/courses/database/redis/commands/',
                    },
                  ],
                },
                {
                  label: 'DynamoDB e Upstash',
                  items: [
                    {
                      label: 'Visão geral de DynamoDB e Upstash',
                      link: '/courses/database/dynamodb-upstash/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/dynamodb-upstash/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/dynamodb-upstash/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Banco em Grafos',
              items: [
                {
                  label: 'Neo4j',
                  items: [
                    { label: 'Visão geral do Neo4j', link: '/courses/database/neo4j/' },
                    {
                      label: 'Instalação e cliente (cypher-shell)',
                      link: '/courses/database/neo4j/setup/',
                    },
                    { label: 'Linguagem Cypher', link: '/courses/database/neo4j/cypher/' },
                  ],
                },
                {
                  label: 'Neo4j AuraDB e Neptune',
                  items: [
                    {
                      label: 'Visão geral de AuraDB e Neptune',
                      link: '/courses/database/auradb-neptune/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/auradb-neptune/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/auradb-neptune/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Banco de Séries Temporais',
              items: [
                {
                  label: 'InfluxDB',
                  items: [
                    { label: 'Visão geral do InfluxDB', link: '/courses/database/influxdb/' },
                    {
                      label: 'Instalação e cliente (CLI e Web)',
                      link: '/courses/database/influxdb/setup/',
                    },
                    {
                      label: 'Linguagem Flux e Line Protocol',
                      link: '/courses/database/influxdb/time-series/',
                    },
                  ],
                },
                {
                  label: 'InfluxDB Cloud e Timestream',
                  items: [
                    {
                      label: 'Visão geral de InfluxDB Cloud e Timestream',
                      link: '/courses/database/time-series-cloud/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/time-series-cloud/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/time-series-cloud/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Motor de Busca',
              items: [
                {
                  label: 'Elasticsearch',
                  items: [
                    {
                      label: 'Visão geral do Elasticsearch',
                      link: '/courses/database/elasticsearch/',
                    },
                    {
                      label: 'Instalação e cliente (Dev Tools)',
                      link: '/courses/database/elasticsearch/setup/',
                    },
                    {
                      label: 'Linguagem Query DSL e Busca',
                      link: '/courses/database/elasticsearch/search/',
                    },
                  ],
                },
                {
                  label: 'Elastic Cloud e OpenSearch',
                  items: [
                    {
                      label: 'Visão geral de Elastic Cloud e OpenSearch',
                      link: '/courses/database/elastic-cloud-opensearch/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/elastic-cloud-opensearch/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/elastic-cloud-opensearch/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Banco Colunar Amplo',
              items: [
                {
                  label: 'Cassandra',
                  items: [
                    { label: 'Visão geral do Cassandra', link: '/courses/database/cassandra/' },
                    {
                      label: 'Instalação e cliente (cqlsh)',
                      link: '/courses/database/cassandra/setup/',
                    },
                    {
                      label: 'Linguagem CQL e Particionamento',
                      link: '/courses/database/cassandra/cql/',
                    },
                  ],
                },
                {
                  label: 'DataStax Astra DB e Keyspaces',
                  items: [
                    {
                      label: 'Visão geral de Astra DB e Keyspaces',
                      link: '/courses/database/astradb-keyspaces/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/astradb-keyspaces/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/astradb-keyspaces/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Banco Analítico (OLAP)',
              items: [
                {
                  label: 'ClickHouse',
                  items: [
                    {
                      label: 'Visão geral do ClickHouse',
                      link: '/courses/database/clickhouse/',
                    },
                    {
                      label: 'Instalação e cliente',
                      link: '/courses/database/clickhouse/setup/',
                    },
                    {
                      label: 'Família MergeTree e SQL Analítico',
                      link: '/courses/database/clickhouse/queries/',
                    },
                  ],
                },
                {
                  label: 'ClickHouse Cloud e BigQuery',
                  items: [
                    {
                      label: 'Visão geral de ClickHouse Cloud e BigQuery',
                      link: '/courses/database/clickhouse-cloud-bigquery/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/clickhouse-cloud-bigquery/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/clickhouse-cloud-bigquery/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Data Lakehouse',
              items: [
                {
                  label: 'DuckDB e Apache Iceberg',
                  items: [
                    {
                      label: 'Visão geral do Lakehouse',
                      link: '/courses/database/duckdb-iceberg/',
                    },
                    {
                      label: 'Instalação e cliente',
                      link: '/courses/database/duckdb-iceberg/setup/',
                    },
                    {
                      label: 'Consultas e Operações em Lakehouse',
                      link: '/courses/database/duckdb-iceberg/queries/',
                    },
                  ],
                },
                {
                  label: 'Databricks e Athena',
                  items: [
                    {
                      label: 'Visão geral de Databricks e Athena',
                      link: '/courses/database/lakehouse-cloud/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/lakehouse-cloud/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/lakehouse-cloud/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Big Data',
              items: [
                {
                  label: 'Apache Spark e Trino',
                  items: [
                    {
                      label: 'Visão geral de Spark e Trino',
                      link: '/courses/database/spark-trino/',
                    },
                    {
                      label: 'Instalação e cliente',
                      link: '/courses/database/spark-trino/setup/',
                    },
                    {
                      label: 'Processamento Distribuído e Federação SQL',
                      link: '/courses/database/spark-trino/processing/',
                    },
                  ],
                },
                {
                  label: 'AWS EMR e Google Dataproc',
                  items: [
                    {
                      label: 'Visão geral de EMR e Dataproc',
                      link: '/courses/database/bigdata-cloud/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/bigdata-cloud/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/bigdata-cloud/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Banco Imutável (Ledger)',
              items: [
                {
                  label: 'immudb',
                  items: [
                    {
                      label: 'Visão geral do immudb',
                      link: '/courses/database/immudb/',
                    },
                    {
                      label: 'Instalação e cliente',
                      link: '/courses/database/immudb/setup/',
                    },
                    {
                      label: 'Operações e Provas Criptográficas',
                      link: '/courses/database/immudb/ledger/',
                    },
                  ],
                },
                {
                  label: 'Ledger na Nuvem',
                  items: [
                    {
                      label: 'Visão geral de Ledger na Nuvem',
                      link: '/courses/database/ledger-cloud/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/ledger-cloud/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Auditoria Criptográfica',
                      link: '/courses/database/ledger-cloud/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Armazenamento de Objetos',
              items: [
                {
                  label: 'MinIO',
                  items: [
                    { label: 'Visão geral do MinIO', link: '/courses/database/minio/' },
                    {
                      label: 'Instalação e cliente (mc)',
                      link: '/courses/database/minio/setup/',
                    },
                    {
                      label: 'Operações e API S3',
                      link: '/courses/database/minio/s3-api/',
                    },
                  ],
                },
                {
                  label: 'Amazon S3 e Cloud Storage',
                  items: [
                    {
                      label: 'Visão geral de S3 e Blob Storage',
                      link: '/courses/database/s3-blob-storage/',
                    },
                    {
                      label: 'Provisionamento e Clientes',
                      link: '/courses/database/s3-blob-storage/setup/',
                    },
                    {
                      label: 'Recursos de Nuvem e Operações',
                      link: '/courses/database/s3-blob-storage/operations/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Referência',
              items: [
                {
                  label: 'Guia de Referência',
                  link: '/courses/database/reference/sql-cheat-sheet/',
                },
              ],
            },
          ],
        },
        {
          label: 'Guia de React',
          items: [
            { label: 'Visão geral', link: '/courses/react/' },
            {
              label: 'Fundamentos',
              items: [
                { label: 'Introdução', link: '/courses/react/basics/introduction/' },
                { label: 'Estilos', link: '/courses/react/basics/style/' },
              ],
            },
            {
              label: 'Estado e Efeitos',
              items: [{ label: 'Hooks', link: '/courses/react/state/hooks/' }],
            },
            {
              label: 'Autenticação',
              items: [
                { label: 'Autenticação com Supabase', link: '/courses/react/auth/supabase/' },
                { label: 'Autenticação com Firebase', link: '/courses/react/auth/firebase/' },
              ],
            },
          ],
        },
        {
          label: 'Guia de Pacotes JavaScript',
          items: [
            { label: 'Visão geral', link: '/courses/npm/' },
            {
              label: 'Gerenciadores de Pacotes',
              items: [
                { label: 'package.json', link: '/courses/npm/managers/package-json/' },
                { label: 'npm', link: '/courses/npm/managers/npm/' },
                { label: 'pnpm', link: '/courses/npm/managers/pnpm/' },
                { label: 'Yarn', link: '/courses/npm/managers/yarn/' },
                { label: 'Bun', link: '/courses/npm/managers/bun/' },
                { label: 'JSR', link: '/courses/npm/managers/jsr/' },
                { label: 'Comparativo de Comandos', link: '/courses/npm/managers/commands/' },
              ],
            },
            {
              label: 'Ferramentas e Qualidade',
              items: [
                { label: 'Linters e Formatadores', link: '/courses/npm/dev/linters/' },
                { label: 'Testes com Vitest', link: '/courses/npm/dev/testing/' },
                { label: 'Playwright', link: '/courses/npm/dev/playwright/' },
                { label: 'Husky e Pre-commit', link: '/courses/npm/dev/git-hooks/' },
                { label: 'Vite', link: '/courses/npm/build/vite/' },
              ],
            },
            {
              label: 'APIs, Dados e Validação',
              items: [
                { label: 'JSON Server', link: '/courses/npm/mock/json-server/' },
                { label: 'Faker.js', link: '/courses/npm/mock/faker/' },
                { label: 'Axios', link: '/courses/npm/http/axios/' },
                { label: 'Apollo Client', link: '/courses/npm/http/apollo/' },
                { label: 'Zod', link: '/courses/npm/validation/zod/' },
                { label: 'Valibot', link: '/courses/npm/validation/valibot/' },
                { label: 'Day.js', link: '/courses/npm/datetime/dayjs/' },
              ],
            },
            {
              label: 'Interface e Feedback',
              items: [
                { label: 'Tailwind CSS', link: '/courses/npm/ui/tailwind/' },
                { label: 'Primitivas de UI', link: '/courses/npm/ui/modern-ui-primitives/' },
                { label: 'Suíte TanStack', link: '/courses/npm/ui/tanstack/' },
                { label: 'Lucide Icons', link: '/courses/npm/ui/lucide/' },
                { label: 'SweetAlert2', link: '/courses/npm/ui/sweetalert2/' },
              ],
            },
            {
              label: 'Gráficos e Visualização',
              items: [
                { label: 'Chart.js', link: '/courses/npm/ui/chartjs/' },
                { label: 'D3.js', link: '/courses/npm/ui/d3/' },
                { label: 'Leaflet', link: '/courses/npm/ui/leaflet/' },
              ],
            },
            {
              label: 'Frameworks e Renderização',
              items: [
                { label: 'Frameworks de UI', link: '/courses/npm/frameworks/ui-frameworks/' },
                {
                  label: 'SSR, SSG e Meta-frameworks',
                  link: '/courses/npm/frameworks/ssr-ssg/',
                },
              ],
            },
            {
              label: 'Aplicações Multiplataforma',
              items: [
                {
                  label: 'React Native e Expo',
                  link: '/courses/npm/platforms/react-native/',
                },
                {
                  label: 'Aplicações Desktop',
                  link: '/courses/npm/platforms/desktop-apps/',
                },
              ],
            },
            {
              label: 'Banco de Dados e BaaS',
              items: [
                {
                  label: 'Prisma',
                  link: '/courses/npm/database/prisma/',
                },
                {
                  label: 'Drizzle ORM',
                  link: '/courses/npm/database/drizzle/',
                },
                {
                  label: 'Supabase Client',
                  link: '/courses/npm/cloud/supabase/',
                },
              ],
            },
            {
              label: 'Servidores, Segurança e IA',
              items: [
                {
                  label: 'Frameworks de Servidor',
                  link: '/courses/npm/backend/web-frameworks/',
                },
                {
                  label: 'Autenticação e Identidade',
                  link: '/courses/npm/auth/auth-providers/',
                },
                {
                  label: 'IA e SDKs de LLM',
                  link: '/courses/npm/ai/llm-sdks/',
                },
              ],
            },
            {
              label: 'Na Prática',
              items: [
                {
                  label: 'InvestBaaS',
                  items: [
                    {
                      label: 'Visão geral',
                      link: '/courses/npm/practice/investbaas/',
                    },
                    {
                      label: 'Backlog do projeto',
                      link: '/courses/npm/practice/investbaas/backlog/',
                    },
                    {
                      label: '1. Frontend estático',
                      link: '/courses/npm/practice/investbaas/front-static/',
                    },
                    {
                      label: '2. Autenticação BaaS',
                      link: '/courses/npm/practice/investbaas/auth/',
                    },
                    {
                      label: '3. Banco de Dados e RLS',
                      link: '/courses/npm/practice/investbaas/database/',
                    },
                    {
                      label: '4. Cotações com Edge Functions',
                      link: '/courses/npm/practice/investbaas/edge-quotes/',
                    },
                    {
                      label: '5. Armazenamento de Comprovantes',
                      link: '/courses/npm/practice/investbaas/storage/',
                    },
                    {
                      label: '6. Analytics e Painel Admin',
                      link: '/courses/npm/practice/investbaas/analytics/',
                    },
                    {
                      label: '7. Origem e Evolução',
                      link: '/courses/npm/practice/investbaas/origins/',
                    },
                    {
                      label: 'Próximos passos',
                      link: '/courses/npm/practice/investbaas/next-steps/',
                    },
                  ],
                },
              ],
            },
            { label: 'Mapa de Pacotes', link: '/courses/npm/reference/package-map/' },
          ],
        },
        {
          label: 'Guia de Serviços em Nuvem',
          items: [
            { label: 'Visão geral', link: '/courses/cloud/' },
            {
              label: 'Fundamentos',
              items: [
                {
                  label: 'Computação em Nuvem',
                  link: '/courses/cloud/foundations/cloud-computing/',
                },
                {
                  label: 'Regiões, Zonas e Borda',
                  link: '/courses/cloud/foundations/regions-zones-edge/',
                },
                {
                  label: 'Custos de Nuvem e FinOps',
                  link: '/courses/cloud/foundations/cloud-costs-finops/',
                },
                {
                  label: 'Segurança, VPC e IAM',
                  link: '/courses/cloud/foundations/cloud-security-iam/',
                },
                {
                  label: 'Infraestrutura como Código',
                  link: '/courses/cloud/foundations/infrastructure-as-code/',
                },
                {
                  label: 'Arquitetura Serverless',
                  link: '/courses/cloud/foundations/serverless-architecture/',
                },
                { label: 'Backend as a Service', link: '/courses/cloud/foundations/baas/' },
                {
                  label: 'CI/CD e Automação',
                  link: '/courses/cloud/foundations/ci-cd/',
                },
                {
                  label: 'Comparação de Serviços',
                  link: '/courses/cloud/foundations/service-comparison/',
                },
              ],
            },
            {
              label: 'Recursos',
              items: [
                { label: 'Hospedagem Estática', link: '/courses/cloud/resources/static-hosting/' },
                {
                  label: 'Domínios e DNS',
                  link: '/courses/cloud/resources/custom-domains-dns/',
                },
                {
                  label: 'HTTPS e Certificados',
                  link: '/courses/cloud/resources/https-certificates/',
                },
                {
                  label: 'CDN e Cache de Borda',
                  link: '/courses/cloud/resources/cdn-caching/',
                },
                {
                  label: 'Funções Serverless',
                  link: '/courses/cloud/resources/serverless-functions/',
                },
                { label: 'Funções de Borda', link: '/courses/cloud/resources/edge-functions/' },
                {
                  label: 'Banco Relacional Gerenciado',
                  link: '/courses/cloud/resources/relational-database/',
                },
                {
                  label: 'Banco de Documentos',
                  link: '/courses/cloud/resources/document-database/',
                },
                {
                  label: 'Autenticação Gerenciada',
                  link: '/courses/cloud/resources/managed-auth/',
                },
                {
                  label: 'E-mails Transacionais',
                  link: '/courses/cloud/resources/transactional-email/',
                },
                {
                  label: 'Meios de Pagamento',
                  link: '/courses/cloud/resources/payment-gateways/',
                },
                { label: 'Storage de Arquivos', link: '/courses/cloud/resources/file-storage/' },
                { label: 'Realtime', link: '/courses/cloud/resources/realtime/' },
                {
                  label: 'Workers e Jobs Agendados',
                  link: '/courses/cloud/resources/workers-jobs/',
                },
                {
                  label: 'Filas e Mensageria',
                  link: '/courses/cloud/resources/message-queues/',
                },
                {
                  label: 'Cache em Memória e Rate Limiting',
                  link: '/courses/cloud/resources/in-memory-cache/',
                },
                { label: 'Containers e PaaS', link: '/courses/cloud/resources/containers-paas/' },
                {
                  label: 'Observabilidade e Monitoramento',
                  link: '/courses/cloud/resources/observability-monitoring/',
                },
                {
                  label: 'Ambientes Efêmeros e Feature Flags',
                  link: '/courses/cloud/resources/preview-environments-flags/',
                },
                {
                  label: 'Gestão de Segredos',
                  link: '/courses/cloud/resources/secrets-management/',
                },
                {
                  label: 'WAF e Segurança de Borda',
                  link: '/courses/cloud/resources/waf-edge-security/',
                },
                {
                  label: 'Notificações Push e SMS',
                  link: '/courses/cloud/resources/push-notifications-sms/',
                },
                {
                  label: 'Busca e Banco Vetorial',
                  link: '/courses/cloud/resources/search-vector/',
                },
              ],
            },
            {
              label: 'Supabase',
              items: [
                { label: 'Visão geral do Supabase', link: '/courses/cloud/supabase/' },
                { label: 'Database API', link: '/courses/cloud/supabase/api/' },
                { label: 'Supabase Auth', link: '/courses/cloud/supabase/auth/' },
                { label: 'Supabase Storage', link: '/courses/cloud/supabase/storage/' },
                { label: 'Supabase Realtime', link: '/courses/cloud/supabase/realtime/' },
                { label: 'Edge Functions', link: '/courses/cloud/supabase/edge-functions/' },
              ],
            },
            {
              label: 'Firebase',
              items: [
                { label: 'Visão geral do Firebase', link: '/courses/cloud/firebase/' },
                { label: 'Cloud Firestore', link: '/courses/cloud/firebase/firestore/' },
                { label: 'Firebase Auth', link: '/courses/cloud/firebase/auth/' },
                { label: 'Cloud Storage', link: '/courses/cloud/firebase/storage/' },
                { label: 'Cloud Functions', link: '/courses/cloud/firebase/functions/' },
                { label: 'Firebase Hosting', link: '/courses/cloud/firebase/hosting/' },
              ],
            },
            {
              label: 'Vercel',
              items: [
                { label: 'Visão geral da Vercel', link: '/courses/cloud/vercel/' },
                { label: 'Deployments', link: '/courses/cloud/vercel/deployments/' },
                { label: 'Vercel Functions', link: '/courses/cloud/vercel/functions/' },
                { label: 'CDN e Edge Network', link: '/courses/cloud/vercel/cdn/' },
                { label: 'Storage e Marketplace', link: '/courses/cloud/vercel/storage/' },
                { label: 'Ambientes e variáveis', link: '/courses/cloud/vercel/environments/' },
              ],
            },
            {
              label: 'Netlify',
              items: [
                { label: 'Visão geral do Netlify', link: '/courses/cloud/netlify/' },
                { label: 'Deployments', link: '/courses/cloud/netlify/deployments/' },
                { label: 'Netlify Functions', link: '/courses/cloud/netlify/functions/' },
                { label: 'Edge Functions', link: '/courses/cloud/netlify/edge-functions/' },
                { label: 'Forms', link: '/courses/cloud/netlify/forms/' },
                { label: 'Redirects e headers', link: '/courses/cloud/netlify/routing/' },
                { label: 'Data e Storage', link: '/courses/cloud/netlify/data-storage/' },
              ],
            },
            {
              label: 'Cloudflare',
              items: [
                { label: 'Visão geral da Cloudflare', link: '/courses/cloud/cloudflare/' },
                { label: 'Pages', link: '/courses/cloud/cloudflare/pages/' },
                { label: 'Workers', link: '/courses/cloud/cloudflare/workers/' },
                { label: 'Dados e Storage', link: '/courses/cloud/cloudflare/data-storage/' },
                {
                  label: 'Workflows e Queues',
                  link: '/courses/cloud/cloudflare/workflows-queues/',
                },
                { label: 'Workers AI', link: '/courses/cloud/cloudflare/workers-ai/' },
              ],
            },
            {
              label: 'AWS Amplify',
              items: [
                { label: 'Visão geral do Amplify', link: '/courses/cloud/amplify/' },
                { label: 'Hosting', link: '/courses/cloud/amplify/hosting/' },
                { label: 'Auth', link: '/courses/cloud/amplify/auth/' },
                { label: 'Data', link: '/courses/cloud/amplify/data/' },
                { label: 'Storage', link: '/courses/cloud/amplify/storage/' },
                { label: 'Functions', link: '/courses/cloud/amplify/functions/' },
              ],
            },
            {
              label: 'PaaS e Containers',
              items: [
                { label: 'Render', link: '/courses/cloud/render/' },
                { label: 'Railway', link: '/courses/cloud/railway/' },
              ],
            },
            {
              label: 'Na Prática',
              items: [
                {
                  label: 'InvestApp Cloud',
                  items: [
                    {
                      label: 'Visão geral',
                      link: '/courses/cloud/practice/investapp/',
                    },
                    {
                      label: '1. Supabase API',
                      link: '/courses/cloud/practice/investapp/supabase-api/',
                    },
                    {
                      label: '2. Supabase Client',
                      link: '/courses/cloud/practice/investapp/supabase-client/',
                    },
                    {
                      label: '3. Firebase Firestore',
                      link: '/courses/cloud/practice/investapp/firebase-firestore/',
                    },
                    {
                      label: '4. Publicação e funções',
                      link: '/courses/cloud/practice/investapp/deploy-functions/',
                    },
                  ],
                },
              ],
            },
            {
              label: 'Referência',
              items: [
                { label: 'Mapa de Plataformas', link: '/courses/cloud/reference/platform-map/' },
                { label: 'Outras Plataformas', link: '/courses/cloud/reference/other-platforms/' },
              ],
            },
          ],
        },
      ],
    }),
  ],
  vite: {
    // `materialsDev` so atua em `astro dev`: resolve `index.html` de slides e mapas
    // mentais e regenera o material quando o arquivo de `materials/` e salvo.
    plugins: [tailwindcss(), materialsDev()],
    server: {
      watch: {
        // Os projetos de `examples/` sao instalados de forma independente.
        ignored: ['**/examples/**/node_modules/**', '**/examples/**/dist/**'],
      },
    },
  },
});
