// @ts-check
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
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
    // Persistencia migrou do Guia de Banco de Dados para o Guia de Express.js.
    '/courses/database/sql/node-sqlite': withBase('/courses/express/persistence/node-sqlite/'),
    '/courses/database/prisma/introduction': withBase('/courses/express/persistence/prisma/'),
    '/courses/database/prisma/crud': withBase('/courses/express/persistence/crud/'),
    '/courses/database/prisma/relations': withBase('/courses/express/persistence/relations/'),
    // O Monitor API virou o trilho completo do MonitorApp, em treze etapas.
    '/courses/express/practice/monitor-api': withBase('/courses/express/practice/monitorapp/'),
    // Validacao saiu de "Recursos Avancados" para a trilha de APIs HTTP.
    '/courses/express/advanced/validation': withBase('/courses/express/api/validation/'),
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
    '/courses/dw-cstrc-jp/express': withBase('/courses/express/basics/introduction/'),
    '/courses/dw-cstrc-jp/express/routes': withBase('/courses/express/basics/routes/'),
    '/courses/dw-cstrc-jp/express/controllers': withBase('/courses/express/basics/controllers/'),
    '/courses/dw-cstrc-jp/express/middleware': withBase('/courses/express/basics/middleware/'),
    '/courses/dw-cstrc-jp/express/rest-api': withBase('/courses/express/api/rest/'),
    '/courses/dw-cstrc-jp/express/api-construction': withBase('/courses/express/api/construction/'),
    '/courses/dw-cstrc-jp/express/mvc': withBase('/courses/express/architecture/mvc/'),
    '/courses/dw-cstrc-jp/express/system-call': withBase('/courses/express/advanced/system-call/'),
    '/courses/dw-cstrc-jp/express/user-registration': withBase(
      '/courses/express/auth/user-registration/'
    ),
    '/courses/dw-cstrc-jp/express/authentication': withBase(
      '/courses/express/auth/authentication/'
    ),
    '/courses/dw-cstrc-jp/database/dbms': withBase('/courses/database/basics/dbms/'),
    '/courses/dw-cstrc-jp/database/sql': withBase('/courses/database/sql/fundamentals/'),
    '/courses/dw-cstrc-jp/database/sql-node': withBase('/courses/express/persistence/node-sqlite/'),
    '/courses/dw-cstrc-jp/database/prisma': withBase('/courses/express/persistence/prisma/'),
    '/courses/dw-cstrc-jp/database/crud': withBase('/courses/express/persistence/crud/'),
    '/courses/dw-cstrc-jp/database/prisma-relations': withBase(
      '/courses/express/persistence/relations/'
    ),
    '/courses/dw-cstrc-jp/packages': withBase('/courses/packages/'),
    '/courses/dw-cstrc-jp/packages/vite': withBase('/courses/packages/build/vite/'),
    '/courses/dw-cstrc-jp/packages/json-server': withBase('/courses/packages/mock/json-server/'),
    '/courses/dw-cstrc-jp/packages/chartjs': withBase('/courses/packages/ui/chartjs/'),
    '/courses/dw-cstrc-jp/packages/axios': withBase('/courses/packages/http/axios/'),
    '/courses/dw-cstrc-jp/packages/bootstrap': withBase('/courses/css/frameworks/bootstrap/'),
    '/courses/dw-cstrc-jp/packages/tailwind-css': withBase('/courses/css/frameworks/tailwind/'),
    '/courses/dw-cstrc-jp/projects/hello-express': withBase(
      '/courses/express/practice/hello-express/'
    ),
    '/courses/dw-cstrc-jp/projects/express-router': withBase(
      '/courses/express/practice/express-router/'
    ),
    '/courses/dw-cstrc-jp/projects/express-mvc': withBase('/courses/express/practice/express-mvc/'),
    '/courses/dw-cstrc-jp/projects/express-prisma': withBase(
      '/courses/express/practice/express-prisma/'
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
    '/courses/pw2-csbes-jp/package/axios': withBase('/courses/packages/http/axios/'),
    '/courses/pw2-csbes-jp/package/http-client': withBase('/courses/web-api/http/clients/'),
    '/courses/pw2-csbes-jp/package/vite': withBase('/courses/packages/build/vite/'),
    '/courses/pw2-csbes-jp/package/json-server': withBase('/courses/packages/mock/json-server/'),
    '/courses/pw2-csbes-jp/package/supabase-api': withBase('/courses/packages/baas/supabase-api/'),
    '/courses/pw2-csbes-jp/package/supabase-client': withBase(
      '/courses/packages/baas/supabase-client/'
    ),
    '/courses/pw2-csbes-jp/package/supabase-auth': withBase(
      '/courses/packages/baas/supabase-auth/'
    ),
    '/courses/pw2-csbes-jp/package/firebase-firestore': withBase(
      '/courses/packages/baas/firebase-firestore/'
    ),
    '/courses/pw2-csbes-jp/package/firebase-auth': withBase(
      '/courses/packages/baas/firebase-auth/'
    ),
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
      '/courses/express/basics/introduction/'
    ),
    '/courses/lp2-ctii-jp/expressjs/api': withBase('/courses/express/api/construction/'),
    '/courses/lp2-ctii-jp/expressjs/mvc': withBase('/courses/express/architecture/mvc/'),
    '/courses/lp2-ctii-jp/expressjs/db-simple': withBase(
      '/courses/express/persistence/node-sqlite/'
    ),
    '/courses/lp2-ctii-jp/expressjs/prismajs-simple': withBase(
      '/courses/express/persistence/prisma/'
    ),
    '/courses/lp2-ctii-jp/expressjs/prismajs-relation': withBase(
      '/courses/express/persistence/relations/'
    ),
    '/courses/lp2-ctii-jp/expressjs/prismajs-user': withBase(
      '/courses/express/auth/user-registration/'
    ),
    '/courses/lp2-ctii-jp/expressjs/auth': withBase('/courses/express/auth/authentication/'),
    '/courses/lp2-ctii-jp/expressjs/validation': withBase('/courses/express/api/validation/'),
    '/courses/lp2-ctii-jp/expressjs/email': withBase('/courses/express/advanced/email/'),
    '/courses/lp2-ctii-jp/expressjs/upload-file': withBase(
      '/courses/express/advanced/upload-file/'
    ),
    '/courses/lp2-ctii-jp/expressjs/test': withBase('/courses/express/advanced/testing/'),
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
                {
                  label: 'Comparativo com JavaScript',
                  link: '/courses/typescript/basics/typescript-vs-javascript/',
                },
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
                { label: 'Variáveis e Escopo', link: '/courses/ecmascript/basics/variables/' },
                { label: 'Tipos de Dados e Coerção', link: '/courses/ecmascript/basics/types/' },
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
                { label: 'Date e Manipulação de Datas', link: '/courses/ecmascript/stdlib/date/' },
                {
                  label: 'Expressões Regulares (RegExp)',
                  link: '/courses/ecmascript/stdlib/regex/',
                },
                { label: 'Arrays e Métodos Funcionais', link: '/courses/ecmascript/data/arrays/' },
                {
                  label: 'Objetos, Classes e Protótipos',
                  link: '/courses/ecmascript/data/objects/',
                },
                { label: 'Map, Set e Coleções', link: '/courses/ecmascript/data/collections/' },
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
                  label: 'APIs Modernas do Navegador',
                  link: '/courses/web-api/browser/modern-apis/',
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
                  link: '/courses/web-api/browser/modern-apis/dialog/',
                },
                {
                  label: 'Fullscreen API (Tela Cheia)',
                  link: '/courses/web-api/browser/modern-apis/fullscreen/',
                },
              ],
            },
            {
              label: 'DOM e Estrutura',
              items: [
                { label: 'Manipulação do DOM', link: '/courses/web-api/dom/manipulation/' },
                { label: 'Eventos e Interatividade', link: '/courses/web-api/dom/events/' },
                { label: 'Elementos Dinâmicos', link: '/courses/web-api/dom/dynamic-elements/' },
                { label: 'Observadores (Observers)', link: '/courses/web-api/browser/observers/' },
              ],
            },
            {
              label: 'Desenho e Mídia',
              items: [
                {
                  label: 'Canvas API (Desenho 2D)',
                  link: '/courses/web-api/browser/modern-apis/canvas/',
                },
                {
                  label: 'Web Speech API (Voz)',
                  link: '/courses/web-api/browser/modern-apis/web-speech/',
                },
              ],
            },
            {
              label: 'Entrada e Transferência',
              items: [
                {
                  label: 'Clipboard API (Copiar e Colar)',
                  link: '/courses/web-api/browser/modern-apis/clipboard/',
                },
                {
                  label: 'Drag and Drop API (Arrastar)',
                  link: '/courses/web-api/browser/modern-apis/drag-and-drop/',
                },
              ],
            },
            {
              label: 'Dispositivo e Sistema',
              items: [
                {
                  label: 'Geolocation API (Localização)',
                  link: '/courses/web-api/browser/modern-apis/geolocation/',
                },
                {
                  label: 'Notification API (Notificações)',
                  link: '/courses/web-api/browser/modern-apis/notification/',
                },
                {
                  label: 'Vibration API (Feedback Tátil)',
                  link: '/courses/web-api/browser/modern-apis/vibration/',
                },
                {
                  label: 'Web Workers API (Multi-threading)',
                  link: '/courses/web-api/browser/workers/',
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
                {
                  label: 'Web Storage API (Exemplo)',
                  link: '/courses/web-api/browser/modern-apis/web-storage/',
                },
                { label: 'Cookies e Sessão', link: '/courses/web-api/storage/cookies/' },
              ],
            },
            {
              label: 'Comunicação de Rede',
              items: [
                { label: 'Server-Side Rendering (SSR)', link: '/courses/web-api/browser/ssr/' },
                { label: 'WebSockets API (Tempo Real)', link: '/courses/web-api/http/websockets/' },
                { label: 'Fetch API', link: '/courses/web-api/http/fetch/' },
                {
                  label: 'Fetch API (Exemplo)',
                  link: '/courses/web-api/browser/modern-apis/fetch/',
                },
                { label: 'CORS e Segurança', link: '/courses/web-api/http/cors/' },
                { label: 'Clientes HTTP', link: '/courses/web-api/http/clients/' },
                { label: 'REST API', link: '/courses/web-api/http/rest/' },
                { label: 'GraphQL', link: '/courses/web-api/http/graphql/' },
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
            { label: 'Visão geral', link: '/courses/express/' },
            {
              label: 'Fundamentos',
              items: [
                {
                  label: 'Introdução ao Express.js',
                  link: '/courses/express/basics/introduction/',
                },
                { label: 'Rotas', link: '/courses/express/basics/routes/' },
                {
                  label: 'Requisição e Resposta',
                  link: '/courses/express/basics/request-response/',
                },
                { label: 'Middleware', link: '/courses/express/basics/middleware/' },
                { label: 'Controllers', link: '/courses/express/basics/controllers/' },
                { label: 'TypeScript', link: '/courses/express/basics/typescript/' },
              ],
            },
            {
              label: 'Arquitetura',
              items: [
                { label: 'MVC', link: '/courses/express/architecture/mvc/' },
                { label: 'Configuração', link: '/courses/express/architecture/config/' },
                { label: 'Log', link: '/courses/express/architecture/logging/' },
                {
                  label: 'Observabilidade',
                  link: '/courses/express/architecture/observability/',
                },
              ],
            },
            {
              label: 'APIs HTTP',
              items: [
                { label: 'Construção de API', link: '/courses/express/api/construction/' },
                { label: 'REST API', link: '/courses/express/api/rest/' },
                {
                  label: 'Tratamento de Erros',
                  link: '/courses/express/api/error-handling/',
                },
                { label: 'Validação', link: '/courses/express/api/validation/' },
                { label: 'Paginação e Filtros', link: '/courses/express/api/pagination/' },
                {
                  label: 'Documentação de API',
                  link: '/courses/express/api/documentation/',
                },
              ],
            },
            {
              label: 'Persistência',
              items: [
                {
                  label: 'SQL com Node.js',
                  link: '/courses/express/persistence/node-sqlite/',
                },
                { label: 'Prisma', link: '/courses/express/persistence/prisma/' },
                { label: 'CRUD com Prisma', link: '/courses/express/persistence/crud/' },
                {
                  label: 'Relações com Prisma',
                  link: '/courses/express/persistence/relations/',
                },
              ],
            },
            {
              label: 'Autenticação',
              items: [
                { label: 'Senhas e Hash', link: '/courses/express/auth/passwords/' },
                {
                  label: 'Cadastro de Usuário',
                  link: '/courses/express/auth/user-registration/',
                },
                { label: 'Autenticação', link: '/courses/express/auth/authentication/' },
                { label: 'Autorização', link: '/courses/express/auth/authorization/' },
              ],
            },
            {
              label: 'Segurança',
              items: [
                { label: 'CORS', link: '/courses/express/security/cors/' },
                { label: 'Endurecimento', link: '/courses/express/security/hardening/' },
              ],
            },
            {
              label: 'Recursos Avançados',
              items: [
                {
                  label: 'Upload de Arquivo',
                  link: '/courses/express/advanced/upload-file/',
                },
                { label: 'Envio de E-mail', link: '/courses/express/advanced/email/' },
                { label: 'Tempo Real', link: '/courses/express/advanced/realtime/' },
                {
                  label: 'Chamada de Sistema',
                  link: '/courses/express/advanced/system-call/',
                },
                { label: 'Testes', link: '/courses/express/advanced/testing/' },
                { label: 'Deploy', link: '/courses/express/advanced/deploy/' },
              ],
            },
            {
              label: 'Na Prática',
              items: [
                { label: 'Hello Express', link: '/courses/express/practice/hello-express/' },
                { label: 'BMI API', link: '/courses/express/practice/bmi-api/' },
                { label: 'Express Router', link: '/courses/express/practice/express-router/' },
                { label: 'Express MVC', link: '/courses/express/practice/express-mvc/' },
                {
                  label: 'Express TypeScript',
                  link: '/courses/express/practice/express-typescript/',
                },
                { label: 'Express + Prisma', link: '/courses/express/practice/express-prisma/' },
                { label: 'Express Auth', link: '/courses/express/practice/express-auth/' },
                {
                  label: 'InvestApp',
                  items: [
                    {
                      label: 'Visão geral',
                      link: '/courses/express/practice/investapp/',
                    },
                    {
                      label: '1. Front estático',
                      link: '/courses/express/practice/investapp/front-static/',
                    },
                    {
                      label: '2. API em memória',
                      link: '/courses/express/practice/investapp/api/',
                    },
                    {
                      label: '3. TypeScript em camadas',
                      link: '/courses/express/practice/investapp/typescript/',
                    },
                    {
                      label: '4. Validação',
                      link: '/courses/express/practice/investapp/validation/',
                    },
                    {
                      label: '5. Documentação da API',
                      link: '/courses/express/practice/investapp/swagger/',
                    },
                    {
                      label: '6. SQLite nativo',
                      link: '/courses/express/practice/investapp/sqlite/',
                    },
                    {
                      label: '7. Prisma ORM',
                      link: '/courses/express/practice/investapp/prisma/',
                    },
                    {
                      label: '8. Cadastro de Usuário',
                      link: '/courses/express/practice/investapp/user/',
                    },
                    {
                      label: '9. Autenticação',
                      link: '/courses/express/practice/investapp/auth/',
                    },
                    {
                      label: '10. E-mail',
                      link: '/courses/express/practice/investapp/email/',
                    },
                    {
                      label: '11. Upload de Avatar',
                      link: '/courses/express/practice/investapp/upload/',
                    },
                    {
                      label: '12. Testes de Software',
                      link: '/courses/express/practice/investapp/testing/',
                    },
                    {
                      label: '13. Docker',
                      link: '/courses/express/practice/investapp/docker/',
                    },
                    {
                      label: 'Backlog do produto',
                      link: '/courses/express/practice/investapp/backlog/',
                    },
                    {
                      label: 'Especificação da API',
                      link: '/courses/express/practice/investapp/api-spec/',
                    },
                    {
                      label: 'Próximos passos',
                      link: '/courses/express/practice/investapp/next-steps/',
                    },
                  ],
                },
                {
                  label: 'MonitorApp',
                  items: [
                    {
                      label: 'Visão geral',
                      link: '/courses/express/practice/monitorapp/',
                    },
                    {
                      label: '1. Front estático',
                      link: '/courses/express/practice/monitorapp/front-static/',
                    },
                    {
                      label: '2. API em memória',
                      link: '/courses/express/practice/monitorapp/api/',
                    },
                    {
                      label: '3. TypeScript em camadas',
                      link: '/courses/express/practice/monitorapp/typescript/',
                    },
                    {
                      label: '4. Validação',
                      link: '/courses/express/practice/monitorapp/validation/',
                    },
                    {
                      label: '5. Documentação da API',
                      link: '/courses/express/practice/monitorapp/swagger/',
                    },
                    {
                      label: '6. SQLite nativo',
                      link: '/courses/express/practice/monitorapp/sqlite/',
                    },
                    {
                      label: '7. Prisma e Relações',
                      link: '/courses/express/practice/monitorapp/prisma/',
                    },
                    {
                      label: '8. Ping Real',
                      link: '/courses/express/practice/monitorapp/ping/',
                    },
                    {
                      label: '9. Cadastro de Usuário',
                      link: '/courses/express/practice/monitorapp/user/',
                    },
                    {
                      label: '10. Autenticação',
                      link: '/courses/express/practice/monitorapp/auth/',
                    },
                    {
                      label: '11. Tempo Real',
                      link: '/courses/express/practice/monitorapp/realtime/',
                    },
                    {
                      label: '12. Testes de Software',
                      link: '/courses/express/practice/monitorapp/testing/',
                    },
                    {
                      label: '13. Docker',
                      link: '/courses/express/practice/monitorapp/docker/',
                    },
                    {
                      label: 'Backlog do produto',
                      link: '/courses/express/practice/monitorapp/backlog/',
                    },
                    {
                      label: 'Especificação da API',
                      link: '/courses/express/practice/monitorapp/api-spec/',
                    },
                    {
                      label: 'Próximos passos',
                      link: '/courses/express/practice/monitorapp/next-steps/',
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
                {
                  label: 'Conceito e Arquitetura',
                  link: '/courses/database/basics/introduction/',
                },
                {
                  label: 'SGBDs e Administração',
                  link: '/courses/database/basics/dbms/',
                },
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
              ],
            },
            {
              label: 'SQL',
              items: [
                {
                  label: 'SQL DDL e DML',
                  link: '/courses/database/sql/fundamentals/',
                },
                {
                  label: 'Junções e Agregações',
                  link: '/courses/database/sql/joins-aggregations/',
                },
              ],
            },
            {
              label: 'Acesso a dados na aplicação',
              items: [
                {
                  label: 'SQL com Node.js',
                  link: '/courses/express/persistence/node-sqlite/',
                },
                { label: 'Prisma', link: '/courses/express/persistence/prisma/' },
                { label: 'CRUD com Prisma', link: '/courses/express/persistence/crud/' },
                {
                  label: 'Relações com Prisma',
                  link: '/courses/express/persistence/relations/',
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
          label: 'Guia de Pacotes',
          items: [
            { label: 'Visão geral', link: '/courses/packages/' },
            {
              label: 'Build e Desenvolvimento',
              items: [{ label: 'Vite', link: '/courses/packages/build/vite/' }],
            },
            {
              label: 'APIs de Prototipagem',
              items: [{ label: 'JSON Server', link: '/courses/packages/mock/json-server/' }],
            },
            {
              label: 'HTTP e Clientes',
              items: [{ label: 'Axios', link: '/courses/packages/http/axios/' }],
            },
            {
              label: 'Interface',
              items: [{ label: 'Chart.js', link: '/courses/packages/ui/chartjs/' }],
            },
            {
              label: 'Backend as a Service (BaaS)',
              items: [
                {
                  label: 'Firebase',
                  items: [
                    { label: 'Visão geral do Firebase', link: '/courses/packages/baas/firebase/' },
                    {
                      label: 'Cloud Firestore',
                      link: '/courses/packages/baas/firebase-firestore/',
                    },
                    { label: 'Firebase Auth', link: '/courses/packages/baas/firebase-auth/' },
                  ],
                },
                {
                  label: 'Supabase',
                  items: [
                    { label: 'Visão geral do Supabase', link: '/courses/packages/baas/supabase/' },
                    { label: 'Supabase API', link: '/courses/packages/baas/supabase-api/' },
                    { label: 'Supabase Client', link: '/courses/packages/baas/supabase-client/' },
                    { label: 'Supabase Auth', link: '/courses/packages/baas/supabase-auth/' },
                  ],
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
