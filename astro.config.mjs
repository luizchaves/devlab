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
    '/courses/cstrc-jp-dw/html': withBase('/courses/html/basics/syntax-structure/'),
    '/courses/cstrc-jp-dw/html/web-importance': withBase('/courses/html/basics/web-importance/'),
    '/courses/cstrc-jp-dw/html/markup-languages': withBase(
      '/courses/html/basics/markup-languages/'
    ),
    '/courses/cstrc-jp-dw/html/forms': withBase('/courses/html/forms/elements-controls/'),
    '/courses/cstrc-jp-dw/css': withBase('/courses/css/basics/syntax-cascade/'),
    '/courses/cstrc-jp-dw/css/box-model': withBase('/courses/css/layout/box-model/'),
    '/courses/cstrc-jp-dw/css/forms': withBase('/courses/css/forms/styling/'),
    '/courses/cstrc-jp-dw/javascript': withBase('/courses/ecmascript/'),
    '/courses/cstrc-jp-dw/javascript/ecmascript': withBase(
      '/courses/ecmascript/basics/introduction/'
    ),
    '/courses/cstrc-jp-dw/javascript/variables': withBase('/courses/ecmascript/basics/variables/'),
    '/courses/cstrc-jp-dw/javascript/expressions-operators': withBase(
      '/courses/ecmascript/basics/operators/'
    ),
    '/courses/cstrc-jp-dw/javascript/control-flow': withBase(
      '/courses/ecmascript/basics/control-flow/'
    ),
    '/courses/cstrc-jp-dw/javascript/functions': withBase(
      '/courses/ecmascript/structure/functions/'
    ),
    '/courses/cstrc-jp-dw/javascript/modules': withBase('/courses/ecmascript/structure/modules/'),
    '/courses/cstrc-jp-dw/javascript/arrays': withBase('/courses/ecmascript/data/arrays/'),
    '/courses/cstrc-jp-dw/javascript/strings': withBase('/courses/ecmascript/data/strings/'),
    '/courses/cstrc-jp-dw/javascript/number-math': withBase('/courses/ecmascript/data/numbers/'),
    '/courses/cstrc-jp-dw/javascript/date': withBase('/courses/ecmascript/stdlib/date/'),
    '/courses/cstrc-jp-dw/javascript/regexp': withBase('/courses/ecmascript/stdlib/regex/'),
    '/courses/cstrc-jp-dw/javascript/map-set': withBase('/courses/ecmascript/data/collections/'),
    '/courses/cstrc-jp-dw/javascript/objects': withBase('/courses/ecmascript/data/objects/'),
    '/courses/cstrc-jp-dw/javascript/promises': withBase('/courses/ecmascript/async/promises/'),
    '/courses/cstrc-jp-dw/javascript/async-await': withBase(
      '/courses/ecmascript/async/async-await/'
    ),
    '/courses/cstrc-jp-dw/javascript/error-handling': withBase(
      '/courses/ecmascript/structure/errors/'
    ),
    '/courses/cstrc-jp-dw/javascript/fetch-api': withBase('/courses/web-api/http/fetch/'),
    '/courses/cstrc-jp-dw/extra/cheat-sheet': withBase(
      '/courses/ecmascript/reference/cheat-sheet/'
    ),
    '/courses/cstrc-jp-dw/extra/ecmascript-versions': withBase(
      '/courses/ecmascript/evolution/tc39/'
    ),
    '/courses/cstrc-jp-dw/browser': withBase('/courses/web-api/'),
    '/courses/cstrc-jp-dw/browser/browser-objects': withBase('/courses/web-api/browser/objects/'),
    '/courses/cstrc-jp-dw/browser/dom-api': withBase('/courses/web-api/dom/manipulation/'),
    '/courses/cstrc-jp-dw/browser/events': withBase('/courses/web-api/dom/events/'),
    '/courses/cstrc-jp-dw/browser/dynamic-elements': withBase(
      '/courses/web-api/dom/dynamic-elements/'
    ),
    '/courses/cstrc-jp-dw/browser/local-storage': withBase(
      '/courses/web-api/storage/local-storage/'
    ),
    '/courses/cstrc-jp-dw/node': withBase('/courses/nodejs/basics/introduction/'),
    '/courses/cstrc-jp-dw/node/modules': withBase('/courses/nodejs/basics/modules/'),
    '/courses/cstrc-jp-dw/node/npm': withBase('/courses/nodejs/tools/npm/'),
    '/courses/cstrc-jp-dw/node/http': withBase('/courses/nodejs/http/server/'),
    '/courses/cstrc-jp-dw/express': withBase('/courses/express/basics/introduction/'),
    '/courses/cstrc-jp-dw/express/routes': withBase('/courses/express/basics/routes/'),
    '/courses/cstrc-jp-dw/express/controllers': withBase('/courses/express/basics/controllers/'),
    '/courses/cstrc-jp-dw/express/middleware': withBase('/courses/express/basics/middleware/'),
    '/courses/cstrc-jp-dw/express/rest-api': withBase('/courses/express/api/rest/'),
    '/courses/cstrc-jp-dw/express/api-construction': withBase('/courses/express/api/construction/'),
    '/courses/cstrc-jp-dw/express/mvc': withBase('/courses/express/architecture/mvc/'),
    '/courses/cstrc-jp-dw/express/system-call': withBase('/courses/express/advanced/system-call/'),
    '/courses/cstrc-jp-dw/express/user-registration': withBase(
      '/courses/express/auth/user-registration/'
    ),
    '/courses/cstrc-jp-dw/express/authentication': withBase(
      '/courses/express/auth/authentication/'
    ),
    '/courses/cstrc-jp-dw/database/dbms': withBase('/courses/database/basics/dbms/'),
    '/courses/cstrc-jp-dw/database/sql': withBase('/courses/database/sql/fundamentals/'),
    '/courses/cstrc-jp-dw/database/sql-node': withBase('/courses/database/sql/node-sqlite/'),
    '/courses/cstrc-jp-dw/database/prisma': withBase('/courses/database/prisma/introduction/'),
    '/courses/cstrc-jp-dw/database/crud': withBase('/courses/database/prisma/crud/'),
    '/courses/cstrc-jp-dw/database/prisma-relations': withBase(
      '/courses/database/prisma/relations/'
    ),
    '/courses/cstrc-jp-dw/packages': withBase('/courses/packages/'),
    '/courses/cstrc-jp-dw/packages/vite': withBase('/courses/packages/build/vite/'),
    '/courses/cstrc-jp-dw/packages/json-server': withBase('/courses/packages/mock/json-server/'),
    '/courses/cstrc-jp-dw/packages/chartjs': withBase('/courses/packages/ui/chartjs/'),
    '/courses/cstrc-jp-dw/packages/axios': withBase('/courses/web-api/http/axios/'),
    '/courses/cstrc-jp-dw/packages/bootstrap': withBase('/courses/css/frameworks/bootstrap/'),
    '/courses/cstrc-jp-dw/packages/tailwind-css': withBase('/courses/css/frameworks/tailwind/'),
    '/courses/cstrc-jp-dw/projects/hello-express': withBase(
      '/courses/express/practice/hello-express/'
    ),
    '/courses/cstrc-jp-dw/projects/express-router': withBase(
      '/courses/express/practice/express-router/'
    ),
    '/courses/cstrc-jp-dw/projects/express-mvc': withBase('/courses/express/practice/express-mvc/'),
    '/courses/cstrc-jp-dw/projects/express-prisma': withBase(
      '/courses/express/practice/express-prisma/'
    ),
    '/courses/csbes-jp-pw2/ecma': withBase('/courses/ecmascript/'),
    '/courses/csbes-jp-pw2/ecma/introduction': withBase('/courses/ecmascript/basics/introduction/'),
    '/courses/csbes-jp-pw2/ecma/variable': withBase('/courses/ecmascript/basics/variables/'),
    '/courses/csbes-jp-pw2/ecma/expression-and-operator': withBase(
      '/courses/ecmascript/basics/operators/'
    ),
    '/courses/csbes-jp-pw2/ecma/statements': withBase('/courses/ecmascript/basics/control-flow/'),
    '/courses/csbes-jp-pw2/ecma/function': withBase('/courses/ecmascript/structure/functions/'),
    '/courses/csbes-jp-pw2/ecma/modules': withBase('/courses/ecmascript/structure/modules/'),
    '/courses/csbes-jp-pw2/ecma/array': withBase('/courses/ecmascript/data/arrays/'),
    '/courses/csbes-jp-pw2/ecma/string': withBase('/courses/ecmascript/data/strings/'),
    '/courses/csbes-jp-pw2/ecma/number-math': withBase('/courses/ecmascript/data/numbers/'),
    '/courses/csbes-jp-pw2/ecma/date': withBase('/courses/ecmascript/stdlib/date/'),
    '/courses/csbes-jp-pw2/ecma/regexp': withBase('/courses/ecmascript/stdlib/regex/'),
    '/courses/csbes-jp-pw2/ecma/map-set': withBase('/courses/ecmascript/data/collections/'),
    '/courses/csbes-jp-pw2/ecma/object': withBase('/courses/ecmascript/data/objects/'),
    '/courses/csbes-jp-pw2/ecma/promise': withBase('/courses/ecmascript/async/promises/'),
    '/courses/csbes-jp-pw2/ecma/error-handling': withBase('/courses/ecmascript/structure/errors/'),
    '/courses/csbes-jp-pw2/extra/cheat-sheet': withBase(
      '/courses/ecmascript/reference/cheat-sheet/'
    ),
    '/courses/csbes-jp-pw2/extra/ecmascript-versions': withBase(
      '/courses/ecmascript/evolution/tc39/'
    ),
    '/courses/csbes-jp-pw2/w3c/browser-objects': withBase('/courses/web-api/browser/objects/'),
    '/courses/csbes-jp-pw2/w3c/dom-api': withBase('/courses/web-api/dom/manipulation/'),
    '/courses/csbes-jp-pw2/w3c/dynamic-elements': withBase(
      '/courses/web-api/dom/dynamic-elements/'
    ),
    '/courses/csbes-jp-pw2/w3c/event-handling': withBase('/courses/web-api/dom/events/'),
    '/courses/csbes-jp-pw2/w3c/local-storage': withBase('/courses/web-api/storage/local-storage/'),
    '/courses/csbes-jp-pw2/w3c/fetch-api': withBase('/courses/web-api/http/fetch/'),
    '/courses/csbes-jp-pw2/api/rest': withBase('/courses/web-api/http/rest/'),
    '/courses/csbes-jp-pw2/api/graphql': withBase('/courses/web-api/http/graphql/'),
    '/courses/csbes-jp-pw2/package/axios': withBase('/courses/web-api/http/axios/'),
    '/courses/csbes-jp-pw2/package/http-client': withBase('/courses/web-api/http/clients/'),
    '/courses/csbes-jp-pw2/package/vite': withBase('/courses/packages/build/vite/'),
    '/courses/csbes-jp-pw2/package/json-server': withBase('/courses/packages/mock/json-server/'),
    '/courses/csbes-jp-pw2/package/supabase-api': withBase('/courses/packages/baas/supabase-api/'),
    '/courses/csbes-jp-pw2/package/supabase-client': withBase(
      '/courses/packages/baas/supabase-client/'
    ),
    '/courses/csbes-jp-pw2/package/supabase-auth': withBase(
      '/courses/packages/baas/supabase-auth/'
    ),
    '/courses/csbes-jp-pw2/package/firebase-firestore': withBase(
      '/courses/packages/baas/firebase-firestore/'
    ),
    '/courses/csbes-jp-pw2/package/firebase-auth': withBase(
      '/courses/packages/baas/firebase-auth/'
    ),
    '/courses/csbes-jp-pw2/react/introduction': withBase('/courses/react/basics/introduction/'),
    '/courses/csbes-jp-pw2/react/style': withBase('/courses/react/basics/style/'),
    '/courses/csbes-jp-pw2/react/hooks': withBase('/courses/react/state/hooks/'),
    '/courses/csbes-jp-pw2/react/supabase-auth': withBase('/courses/react/auth/supabase/'),
    '/courses/csbes-jp-pw2/react/firebase-auth': withBase('/courses/react/auth/firebase/'),
    '/courses/ctii-jp-lp2/javascript/introduction': withBase(
      '/courses/ecmascript/basics/introduction/'
    ),
    '/courses/ctii-jp-lp2/javascript/frontend': withBase('/courses/web-api/dom/dynamic-elements/'),
    '/courses/ctii-jp-lp2/nodejs/http': withBase('/courses/nodejs/http/server/'),
    '/courses/ctii-jp-lp2/expressjs/introduction': withBase(
      '/courses/express/basics/introduction/'
    ),
    '/courses/ctii-jp-lp2/expressjs/api': withBase('/courses/express/api/construction/'),
    '/courses/ctii-jp-lp2/expressjs/mvc': withBase('/courses/express/architecture/mvc/'),
    '/courses/ctii-jp-lp2/expressjs/db-simple': withBase('/courses/database/sql/node-sqlite/'),
    '/courses/ctii-jp-lp2/expressjs/prismajs-simple': withBase(
      '/courses/database/prisma/introduction/'
    ),
    '/courses/ctii-jp-lp2/expressjs/prismajs-relation': withBase(
      '/courses/database/prisma/relations/'
    ),
    '/courses/ctii-jp-lp2/expressjs/prismajs-user': withBase(
      '/courses/express/auth/user-registration/'
    ),
    '/courses/ctii-jp-lp2/expressjs/auth': withBase('/courses/express/auth/authentication/'),
    '/courses/ctii-jp-lp2/expressjs/validation': withBase('/courses/express/advanced/validation/'),
    '/courses/ctii-jp-lp2/expressjs/email': withBase('/courses/express/advanced/email/'),
    '/courses/ctii-jp-lp2/expressjs/upload-file': withBase(
      '/courses/express/advanced/upload-file/'
    ),
    '/courses/ctii-jp-lp2/expressjs/test': withBase('/courses/express/advanced/testing/'),
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
            { label: 'Web e HTML', link: '/courses/cstrc-jp-dw/topics/web-html/' },
            { label: 'CSS', link: '/courses/cstrc-jp-dw/topics/css/' },
            { label: 'JavaScript', link: '/courses/cstrc-jp-dw/topics/javascript/' },
            { label: 'Web APIs e Pacotes', link: '/courses/cstrc-jp-dw/topics/web-apis/' },
            { label: 'Node.js e Express.js', link: '/courses/cstrc-jp-dw/topics/node-express/' },
            { label: 'Banco de Dados', link: '/courses/cstrc-jp-dw/topics/database/' },
            {
              label: 'Projetos',
              collapsed: true,
              items: [
                { label: 'Visão geral', link: '/courses/cstrc-jp-dw/projects/' },
                {
                  label: 'Invest App Bootstrap',
                  link: '/courses/cstrc-jp-dw/projects/invest-app-bootstrap/',
                },
              ],
            },
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
                { label: 'Exercícios', link: '/courses/csbes-jp-pw2/extra/exercises/' },
                { label: 'Quizzes', link: '/courses/csbes-jp-pw2/extra/quizzes/' },
              ],
            },
            { label: 'JavaScript', link: '/courses/csbes-jp-pw2/topics/javascript/' },
            { label: 'Web APIs', link: '/courses/csbes-jp-pw2/topics/web-apis/' },
            { label: 'Pacotes e Serviços', link: '/courses/csbes-jp-pw2/topics/packages/' },
            { label: 'React', link: '/courses/csbes-jp-pw2/topics/react/' },
          ],
        },
        {
          label: 'Linguagem de Programação II',
          items: [
            { label: 'Visão geral', link: '/courses/ctii-jp-lp2/' },
            { label: 'JavaScript e Front-end', link: '/courses/ctii-jp-lp2/topics/javascript/' },
            { label: 'Node.js e Express.js', link: '/courses/ctii-jp-lp2/topics/node-express/' },
            { label: 'Dados e Autenticação', link: '/courses/ctii-jp-lp2/topics/data-auth/' },
            { label: 'Recursos da Aplicação', link: '/courses/ctii-jp-lp2/topics/app-features/' },
          ],
        },
        {
          label: 'Guia de Python',
          items: [
            { label: 'Visão geral', link: '/courses/python/' },
            {
              label: 'Fundamentos',
              collapsed: true,
              items: [
                { label: 'Introdução', link: '/courses/python/basics/introduction/' },
                { label: 'Variáveis e Tipos', link: '/courses/python/basics/variables/' },
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
              collapsed: true,
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
              collapsed: true,
              items: [
                { label: 'Módulos e Pacotes', link: '/courses/python/structure/modules/' },
                { label: 'Classes e Objetos', link: '/courses/python/structure/classes/' },
                { label: 'Erros e Exceções', link: '/courses/python/structure/errors/' },
              ],
            },
            {
              label: 'Biblioteca Padrão',
              collapsed: true,
              items: [
                { label: 'Arquivos, JSON e CSV', link: '/courses/python/stdlib/files/' },
                { label: 'Data e Hora', link: '/courses/python/stdlib/datetime/' },
                { label: 'Expressões Regulares', link: '/courses/python/stdlib/regex/' },
              ],
            },
            {
              label: 'Ambiente e Ferramentas',
              collapsed: true,
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
              collapsed: true,
              items: [
                { label: 'Introdução', link: '/courses/typescript/basics/introduction/' },
                { label: 'Tipos Básicos', link: '/courses/typescript/basics/types/' },
                { label: 'Funções', link: '/courses/typescript/basics/functions/' },
                { label: 'Narrowing', link: '/courses/typescript/basics/narrowing/' },
              ],
            },
            {
              label: 'Sistema de Tipos',
              collapsed: true,
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
              collapsed: true,
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
              collapsed: true,
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
              collapsed: true,
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
              collapsed: true,
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
              collapsed: true,
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
              collapsed: true,
              items: [
                {
                  label: 'Estrutura de Formulários e Controles',
                  link: '/courses/html/forms/elements-controls/',
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
              collapsed: true,
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
              collapsed: true,
              items: [
                {
                  label: 'Modelo de Caixa (Box Model)',
                  link: '/courses/css/layout/box-model/',
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
              collapsed: true,
              items: [
                {
                  label: 'Tipografia, Cores e Variáveis',
                  link: '/courses/css/styling/typography-colors/',
                },
                {
                  label: 'Design Responsivo e Media Queries',
                  link: '/courses/css/styling/responsive-mediaqueries/',
                },
              ],
            },
            {
              label: 'Formulários e Frameworks',
              collapsed: true,
              items: [
                { label: 'Estilizando Formulários', link: '/courses/css/forms/styling/' },
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
              collapsed: true,
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
              label: 'Estruturas de Dados',
              collapsed: true,
              items: [
                { label: 'Strings e Template Literals', link: '/courses/ecmascript/data/strings/' },
                { label: 'Numbers, BigInt e Math', link: '/courses/ecmascript/data/numbers/' },
                { label: 'Date e Manipulação de Datas', link: '/courses/ecmascript/stdlib/date/' },
                {
                  label: 'Expressões Regulares (RegExp)',
                  link: '/courses/ecmascript/stdlib/regex/',
                },
                { label: 'Arrays e Métodos Funcionais', link: '/courses/ecmascript/data/arrays/' },
                { label: 'Objetos e Protótipos', link: '/courses/ecmascript/data/objects/' },
                { label: 'Map, Set e Coleções', link: '/courses/ecmascript/data/collections/' },
              ],
            },
            {
              label: 'Organização de Código',
              collapsed: true,
              items: [
                { label: 'Funções e Closures', link: '/courses/ecmascript/structure/functions/' },
                { label: 'Módulos ES (ESM)', link: '/courses/ecmascript/structure/modules/' },
                { label: 'Tratamento de Erros', link: '/courses/ecmascript/structure/errors/' },
              ],
            },
            {
              label: 'Assincronismo',
              collapsed: true,
              items: [
                { label: 'Promises', link: '/courses/ecmascript/async/promises/' },
                { label: 'Async/Await', link: '/courses/ecmascript/async/async-await/' },
              ],
            },
            {
              label: 'Referência',
              collapsed: true,
              items: [
                {
                  label: 'Evolução e TC39',
                  link: '/courses/ecmascript/evolution/tc39/',
                },
                {
                  label: 'Guia de Referência',
                  link: '/courses/ecmascript/reference/cheat-sheet/',
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
              label: 'Objetos do Navegador',
              collapsed: true,
              items: [{ label: 'Objetos do Navegador', link: '/courses/web-api/browser/objects/' }],
            },
            {
              label: 'DOM',
              collapsed: true,
              items: [
                { label: 'Manipulação do DOM', link: '/courses/web-api/dom/manipulation/' },
                { label: 'Eventos', link: '/courses/web-api/dom/events/' },
                {
                  label: 'Elementos Dinâmicos',
                  link: '/courses/web-api/dom/dynamic-elements/',
                },
              ],
            },
            {
              label: 'Armazenamento',
              collapsed: true,
              items: [{ label: 'Local Storage', link: '/courses/web-api/storage/local-storage/' }],
            },
            {
              label: 'Requisições HTTP',
              collapsed: true,
              items: [
                { label: 'Fetch API', link: '/courses/web-api/http/fetch/' },
                { label: 'Axios', link: '/courses/web-api/http/axios/' },
                { label: 'Clientes HTTP', link: '/courses/web-api/http/clients/' },
                { label: 'REST API', link: '/courses/web-api/http/rest/' },
                { label: 'GraphQL', link: '/courses/web-api/http/graphql/' },
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
              collapsed: true,
              items: [
                { label: 'Introdução ao Node.js', link: '/courses/nodejs/basics/introduction/' },
                { label: 'Módulos no Node.js', link: '/courses/nodejs/basics/modules/' },
              ],
            },
            {
              label: 'Ferramentas',
              collapsed: true,
              items: [{ label: 'npm', link: '/courses/nodejs/tools/npm/' }],
            },
            {
              label: 'HTTP',
              collapsed: true,
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
              collapsed: true,
              items: [
                {
                  label: 'Introdução ao Express.js',
                  link: '/courses/express/basics/introduction/',
                },
                { label: 'Rotas', link: '/courses/express/basics/routes/' },
                { label: 'Controllers', link: '/courses/express/basics/controllers/' },
                { label: 'Middleware', link: '/courses/express/basics/middleware/' },
              ],
            },
            {
              label: 'APIs HTTP',
              collapsed: true,
              items: [
                { label: 'REST API', link: '/courses/express/api/rest/' },
                { label: 'Construção de API', link: '/courses/express/api/construction/' },
              ],
            },
            {
              label: 'Arquitetura e Recursos',
              collapsed: true,
              items: [
                { label: 'MVC', link: '/courses/express/architecture/mvc/' },
                { label: 'Chamada de Sistema', link: '/courses/express/advanced/system-call/' },
                {
                  label: 'Cadastro de Usuário',
                  link: '/courses/express/auth/user-registration/',
                },
                { label: 'Autenticação', link: '/courses/express/auth/authentication/' },
                { label: 'Validação', link: '/courses/express/advanced/validation/' },
                { label: 'Envio de E-mail', link: '/courses/express/advanced/email/' },
                { label: 'Upload de Arquivo', link: '/courses/express/advanced/upload-file/' },
                { label: 'Testes', link: '/courses/express/advanced/testing/' },
              ],
            },
            {
              label: 'Na Prática',
              collapsed: true,
              items: [
                { label: 'Hello Express', link: '/courses/express/practice/hello-express/' },
                { label: 'Express Router', link: '/courses/express/practice/express-router/' },
                { label: 'Express MVC', link: '/courses/express/practice/express-mvc/' },
                { label: 'Express + Prisma', link: '/courses/express/practice/express-prisma/' },
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
              collapsed: true,
              items: [{ label: 'SGBD', link: '/courses/database/basics/dbms/' }],
            },
            {
              label: 'SQL',
              collapsed: true,
              items: [
                { label: 'Fundamentos de SQL', link: '/courses/database/sql/fundamentals/' },
                { label: 'SQL com Node.js', link: '/courses/database/sql/node-sqlite/' },
              ],
            },
            {
              label: 'Prisma ORM',
              collapsed: true,
              items: [
                {
                  label: 'Introdução ao Prisma',
                  link: '/courses/database/prisma/introduction/',
                },
                { label: 'CRUD com Prisma', link: '/courses/database/prisma/crud/' },
                { label: 'Relações com Prisma', link: '/courses/database/prisma/relations/' },
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
              collapsed: true,
              items: [
                { label: 'Introdução', link: '/courses/react/basics/introduction/' },
                { label: 'Estilos', link: '/courses/react/basics/style/' },
              ],
            },
            {
              label: 'Estado e Efeitos',
              collapsed: true,
              items: [{ label: 'Hooks', link: '/courses/react/state/hooks/' }],
            },
            {
              label: 'Autenticação',
              collapsed: true,
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
              collapsed: true,
              items: [{ label: 'Vite', link: '/courses/packages/build/vite/' }],
            },
            {
              label: 'APIs de Prototipagem',
              collapsed: true,
              items: [{ label: 'JSON Server', link: '/courses/packages/mock/json-server/' }],
            },
            {
              label: 'Interface',
              collapsed: true,
              items: [{ label: 'Chart.js', link: '/courses/packages/ui/chartjs/' }],
            },
            {
              label: 'Backend as a Service',
              collapsed: true,
              items: [
                { label: 'Supabase API', link: '/courses/packages/baas/supabase-api/' },
                { label: 'Supabase Client', link: '/courses/packages/baas/supabase-client/' },
                { label: 'Supabase Auth', link: '/courses/packages/baas/supabase-auth/' },
                { label: 'Cloud Firestore', link: '/courses/packages/baas/firebase-firestore/' },
                { label: 'Firebase Auth', link: '/courses/packages/baas/firebase-auth/' },
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
