# TODO — DevLab

## 📚 Conteúdo, Cursos e Guias

### Guias e Tecnologias

- [ ] **[TASK-001] Derivação e expansão de guias:**
  - [ ] `[TASK-001.1]` Alternativas ao Express.js no Node.js e em outras linguagens (Flask, Spring Boot, Django, Gin, etc.)
  - [ ] `[TASK-001.2]` Guias de novas linguagens (Java, Go) e infraestrutura (Docker + Docker Compose)
  - [ ] `[TASK-001.3]` Tópicos avançados: Autenticação (JWT, OAuth2, OpenID Connect, 2FA, Passkeys, Refresh Token), GraphQL, WebSockets
  - [ ] `[TASK-001.4]` Segurança Web, OWASP Top 10 e prevenção de vulnerabilidades (CSRF, XSS, SQL Injection, SameSite cookies, CORS, etc.)
  - [ ] `[TASK-001.5]` Opções de deploy (Vercel, Railway, Render, Fly.io, Heroku, AWS, GCP, Azure — Free Tier vs Pago)
  - [x] `[TASK-001.6]` Guia de Uso de IA para desenvolvimento e especificação
- [x] **[TASK-002] Guia de Banco de Dados:** (fechada pela `[TASK-039]`, ver [spec](../specs/executed/spec-010-database-guide-restructure.md))
  - [x] `[TASK-002.1]` Adicionar seção sobre modelagem de dados (normalização, relacionamentos, chaves primárias e estrangeiras, índices) — `modeling/keys-indexes`, com chaves naturais e substitutas, ações referenciais, `UNIQUE` composto, `CHECK` e `EXPLAIN QUERY PLAN`
  - [x] `[TASK-002.2]` Exemplos práticos de modelagem para diferentes tipos de aplicações (e-commerce, redes sociais, sistemas financeiros, etc.) — `modeling/case-studies`, com InvestApp, loja e rede social executados de ponta a ponta
  - [x] `[TASK-002.3]` Comparativo entre paradigmas (relacional, NoSQL, grafos, etc.) — `basics/paradigms`, com os cinco paradigmas, o que cada um abre mão e o CAP como critério
- [ ] **[TASK-003] Guias Práticos / Tópicos de Fundamentos:**
  - [ ] `[TASK-003.1]` Git e GitHub: desenvolvimento com branches, PRs e code review
  - [ ] `[TASK-003.2]` Desenvolvimento orientado a Specs, Planning e Agents (SKILLS, MCP)
  - [ ] `[TASK-003.3]` CI/CD com GitHub Actions
  - [ ] `[TASK-003.4]` Docker e Docker Compose para desenvolvimento local
  - [ ] `[TASK-003.5]` Supabase para banco de dados e autenticação
  - [ ] `[TASK-003.6]` Prisma ORM para modelagem e operações CRUD
  - [ ] `[TASK-003.7]` Jest para testes unitários e de integração
  - [ ] `[TASK-003.8]` React para front-end e Next.js para SSR/SSG
  - [ ] `[TASK-003.9]` TailwindCSS para estilização
  - [ ] `[TASK-003.10]` Diagramas de arquitetura para planejamento de sistemas (microserviços, monolitos, etc.)
  - [ ] `[TASK-003.11]` Text2diagram (Mermaid, PlantUML), Draw.io, etc.
  - [ ] `[TASK-003.12]` Markdown para documentação
  - [ ] `[TASK-003.13]` Propostas de interface: citar Figma, Pencil, Pen
  - [ ] `[TASK-003.14]` Qualidade de código: Code Review, Pair Programming, Mob Programming, TDD, BDD, DDD, Clean Code, Clean Architecture, SOLID, Design Patterns
- [x] **[TASK-004] Melhorias Didáticas nas Seções de Teste:**
  - [x] `[TASK-004.1]` Usar parágrafos `<p>` para comentar e explicar a intenção de cada teste individualmente
  - [x] `[TASK-004.2]` Avaliar a inclusão do recorte da requisição `.http` correspondente em formato recolhível (`<details>` / collapsed) em cada teste
- [ ] **[TASK-005]** Aperfeiçoar o conteúdo dos cursos e guias (exemplos práticos, exercícios, quizzes e desafios)
- [x] **[TASK-006]** Padronizar todos os comandos `npm install` com 3 tabs (npm, yarn, pnpm)
- [ ] **[TASK-007]** Gerar slides das páginas de cada curso e guia
- [ ] **[TASK-008]** Gerar `book.pdf` por guia ou curso
- [x] **[TASK-023] TaskAPI — projeto modelo do Guia de Express.js:** (ver [spec](../specs/executed/spec-005-taskapi-model-project.md))
  - [x] `[TASK-023.1]` Auditar a origem do código das páginas de conceito — **172 blocos escritos à mão** com `title="src/…"` contra ~38 `<SourceCode>` reais, e 20 das 33 páginas sem nenhum projeto executável
  - [x] `[TASK-023.2]` Criar a trilha `task-api-*` em doze etapas cumulativas, só API, absorvendo `hello`, `router`, `mvc`, `typescript`, `prisma` e `auth` — **as doze publicadas**, cada uma executada e exercitada por HTTP; a 12 traz 21 testes
  - [x] `[TASK-023.3]` Converter os blocos escritos à mão das páginas de conceito em `<SourceCode>` — de 172 para **6** (todos comparações `del`/`ins`), e de ~38 para **114 recortes reais**; só `api/construction` segue sem projeto, por ser página de projeto de API
  - [x] `[TASK-023.4]` Redirecionar as seis páginas de projeto antigas e remover os quatro diretórios órfãos (`hello-simple`, `hello-lang`, `invest-app-prismajs-simple` e `prisma`)
  - [x] `[TASK-023.5]` Construir e rodar a imagem da etapa 12 — o build revelou **cinco defeitos** que a leitura não pegava (`prisma generate` sem schema, pnpm não pinada, `EACCES` em `uploads/` e no volume, `prisma.config.ts` ausente no runtime, `loadEnvFile` sem `.env`); corrigidos e verificados: `docker compose up` sobe _healthy_, aplica migrations, e os dados sobrevivem ao restart
- [ ] **[TASK-024] Inclusão e Integração de Exercícios e BrainCheck:**
  - [ ] `[TASK-024.1]` Avaliar a inclusão do acervo de exercícios do `ifpb/exercises` no DevLab (migração/incorporação dos problemas práticos ou estruturação via `exercises/*.exercise.md` vinculados às aulas)
  - [ ] `[TASK-024.2]` Avaliar a inclusão/integração do BrainCheck (`brain-check-questions` / quizzes interativos) no DevLab (seção de quizzes embutida ou estruturação via `exercises/*.braincheck.md`)
- [x] **[TASK-025] Padronização de Terminologia (Tópico / Página em vez de Aula):**
  - [x] `[TASK-025.1]` Atualizar convenções de escrita em `AGENTS.md` e nas skills de geração de conteúdo (`.agents/skills/`)
  - [x] `[TASK-025.2]` Substituir cabeçalhos `## Próxima aula` por `## Próximo tópico` e harmonizar linguagem nos arquivos `.mdx` em `src/content/docs/`
- [x] **[TASK-026] Reestruturação do Guia de TypeScript (paridade com o Guia de ECMAScript):** (ver [spec](../specs/executed/spec-006-typescript-guide-restructure.md))
  - [x] `[TASK-026.1]` Criar a trilha `reference/` e mover `basics/typescript-vs-javascript` para ela, com redirect da URL antiga
  - [x] `[TASK-026.2]` Criar `evolution/releases.mdx` com a linha do tempo das versões do TypeScript, espelhando `evolution/tc39.mdx` — as notas oficiais revelaram o **6.0** de transição e o **7.0** nativo em Go, que a linha do tempo escrita de memória não teria
  - [x] `[TASK-026.3]` Criar `reference/cheat-sheet.mdx` e `reference/weird-cases.mdx` — como no ECMAScript, páginas de referência pura levam slides e não mapa mental
  - [x] `[TASK-026.4]` Criar `reference/ai-assisted-development.mdx`
  - [x] `[TASK-026.5]` Criar `practice/react.mdx` (componentes, props, hooks, eventos e contexto tipados) e cruzar os links com o Guia de React
  - [x] `[TASK-026.6]` Acrescentar a seção "na Era da Inteligência Artificial" às páginas existentes do guia e sincronizar os materiais — **10 das 16**, mesmo critério do ECMAScript (10 de 23): as páginas em que se escreve código real
  - [x] `[TASK-026.7]` Alinhar o `index.mdx` ao formato do ECMAScript e criar `index.slide.md` / `index.mindmap.md` do guia
- [ ] **[TASK-027]** Levar o código do Guia de TypeScript para `examples/courses/typescript/` e converter os blocos escritos à mão em `<SourceCode>` — hoje são **0 usos contra 20** no ECMAScript, e nenhum projeto executável (desdobramento previsto nos Non-goals da [spec-006](../specs/executed/spec-006-typescript-guide-restructure.md))
- [x] **[TASK-028]** Ensinar `check-code-blocks.mjs` a validar TypeScript — o analisador passou a ser escolhido pela linguagem do bloco (`node --check` para `js`, parser do TypeScript para `ts`/`tsx`/`jsx`), e blocos de comparação `del`/`ins` são pulados: de **238 erros para 0** em todos os cursos, com 1185 blocos conferidos contra 1134
  - [x] `[TASK-028.1]` Corrigir os cinco defeitos reais que estavam enterrados no ruído: JSX inválido em `react/basics/introduction`, blocos JSX marcados como `js` em `web-api/browser`, sessão `mongosh` e pseudocódigo marcados como `javascript` em `database/basics/dbms`, e bloco só de comentários marcado como `ts` em `typescript/tooling/runtime`
- [x] **[TASK-029] Reestruturação do Guia de Web APIs:** (ver [spec](../specs/executed/spec-007-web-api-guide-restructure.md))
  - [x] `[TASK-029.1]` Aplicar o `## Objetivo` bipartido (Geral + específicos) nas páginas de tópico — de **0 de 30** para **31 de 31**, contando a nova página de WebAssembly
  - [x] `[TASK-029.2]` Acrescentar `## Quando usar, e quando não usar?` às páginas que ensinam uma API concreta — **27 páginas**, cada uma com tabela de decisão nomeando a alternativa perdedora; `ssr` e `objects` ficaram de fora por não ensinarem API escolhível
  - [x] `[TASK-029.3]` Colocar conceito antes do exemplo nas 10 páginas finas de `browser/modern-apis/` e fechá-las com `## Perguntas de revisão` — **11 de 11** agora abrem com modelo mental (diagrama, tabela ou trecho mínimo) antes do arquivo HTML inteiro
  - [x] `[TASK-029.4]` Criar `browser/webassembly.mdx` com projeto executável em `examples/courses/web-api/webassembly/` — módulo de 109 bytes gerado e validado sem compilador instalado; medido no navegador, 200 000 repetições de `fib(30)` levaram 14,0 ms em JS contra 8,8 ms em Wasm
  - [x] `[TASK-029.5]` Escrever `## Web APIs na Era da Inteligência Artificial` no catálogo, apoiada em `examples/courses/web-api/ai-review/` (a mesma suíte `node:test` falha contra a versão gerada e passa contra a corrigida), e um aside `Dica de IA:` em **5 páginas**
  - [x] `[TASK-029.6]` Aplicar a skill `devlab-content-reviewer` ao guia e corrigir os achados: 74 parágrafos de entrada ausentes, 25 blocos sem `title`, 18 títulos numerados, 5 subseções solitárias, 1 travessão e 1 título interrogativo sem `?` — `check-code-blocks` de 25 avisos para 0
- [ ] **[TASK-030] Páginas de projeto do Web APIs no molde do InvestApp do Express:** (spec-008, a escrever)
  - [ ] `[TASK-030.1]` Reescrever `web-api/practice/invest-app.mdx` e `monitor-app.mdx` no formato de `expressjs/practice/investapp/index.mdx` (análise de requisitos, RF/RNF, stack, arquitetura, protótipo visual, modelo de domínio, trilha incremental) — hoje são **91 e 96 linhas** contra **515**
  - [ ] `[TASK-030.2]` Refatorar o front-end da etapa final de cada app (`examples/courses/web-api/fetch-api/invest-app` e `monitor-app`) com Tailwind de verdade, UX/UI revisada e lógica JS reorganizada — hoje o Tailwind está configurado mas o estilo mora em `css/style.css` escrito à mão
- [x] **[TASK-031]** Página de entrada `web-api/common-features.mdx` ligando as funcionalidades recorrentes de uma aplicação vanilla (eventos, carregamento dinâmico, rolagem, validação de formulário, persistência, navegação) à Web API de cada uma — 17 linhas de mapa, e cobre três assuntos que o guia não tinha em lugar nenhum: Constraint Validation com `FormData`, `scrollIntoView`/`scroll-behavior` e o que HTML e CSS já resolvem sem JavaScript (`<details>`, `popover`, `loading="lazy"`, `scroll-snap`)
  - [x] `[TASK-031.1]` Criar `dom/forms.mdx` (Constraint Validation, `FormData`, `validity`, `setCustomValidity`, `:user-invalid`) com exemplo em `examples/courses/web-api/forms/` — o guia não tinha **nenhuma** cobertura de formulários
  - [x] `[TASK-031.2]` Criar `dom/scroll.mdx` (`scrollIntoView`, `scrollY`/`scrollHeight`, `scroll-behavior`, `scroll-margin-top`, `scroll-snap`, `prefers-reduced-motion`) com exemplo em `examples/courses/web-api/scroll/`
  - [x] `[TASK-031.3]` Reescrever o mapa da página de entrada em seis tabelas agrupadas, cobrindo as **33 páginas** do guia, sem nenhuma linha apontando para a própria página
  - [x] `[TASK-031.4]` Desfazer a ambiguidade entre **Web API do navegador** e **API web servida por HTTP**: a trilha "Comunicação de Rede" da sidebar misturava `fetch`/`WebSocket` (interfaces) com REST, GraphQL, CORS e clientes HTTP (convenções, política e ferramentas). Dividida em "Rede: APIs do Navegador" e "Rede: O Que Roda no Servidor", com a seção `## Duas coisas diferentes chamadas de API` na visão geral e um parágrafo de desambiguação na abertura de `rest`, `graphql`, `clients` e `cors`
  - [x] `[TASK-031.5]` Normalizar páginas de Web APIs: mesclar páginas de exemplo redundantes (`fetch.mdx` e `web-storage.mdx`) em suas páginas canônicas (`http/fetch.mdx` e `storage/local-storage.mdx`), criar página de segurança client-side (`security/client-side.mdx` cobrindo OWASP, XSS, CSRF, CSP e sanitização), reestruturar trilha de segurança (CORS e OWASP) e rede (mover SSR para rede, adicionar SSE), e sincronizar sidebar, links e badges do índice
  - [x] `[TASK-031.6]` Reorganizar a seção `browser/modern-apis/` em diretórios temáticos (`ui/`, `media/`, `input/`, `device/` e `browser/catalog.mdx`), criar página de referência exaustiva `reference/other-apis.mdx` (WebGL, WebGPU, IndexedDB, Service Workers, Web Audio, WebRTC, WebAuthn, hardware e sensores), atualizar diagrama SVG interativo e configurar 10 redirecionamentos retrocompatíveis em `astro.config.mjs`
  - [x] `[TASK-031.7]` Expandir a trilha de Desenho e Mídia do Guia de Web APIs com páginas dedicadas, projetos executáveis, slides e mapas mentais para `media/media-devices.mdx` (câmera e áudio), `media/streaming.mdx` (WebRTC e MSE) e `media/webgl-webgpu.mdx` (gráficos 3D e computação); atualizar catálogo, diagrama SVG interativo e páginas de referência (`cheat-sheet.mdx` e `other-apis.mdx`)
- [ ] **[TASK-032] Guia de Express.js — ajustes gerais:**
  - [ ] `[TASK-032.1]` Ajustar as imagens ruins de ver do guia (baixa resolução, contraste ou legibilidade)
  - [ ] `[TASK-032.2]` Incluir, antes de cada `<ApiRequest>`, um `<details>` recolhível com o recorte `.http` correspondente
- [ ] **[TASK-033] TaskAPI — ajustes e páginas pendentes:**
  - [ ] `[TASK-033.1]` Ajustar as imagens ruins de ver na trilha `task-api-*`
  - [ ] `[TASK-033.2]` Incluir, antes de cada `<ApiRequest>`, um `<details>` recolhível com o recorte `.http` correspondente
  - [ ] `[TASK-033.3]` Escrever a página de Especificação da API (contrato OpenAPI consolidado da TaskAPI)
  - [ ] `[TASK-033.4]` Escrever a página de Próximos Passos da TaskAPI (débitos técnicos, features e desafios, no molde da `[TASK-017.1]`)
  - [ ] `[TASK-033.5]` Validar cookies com Zod na etapa de autenticação
- [ ] **[TASK-034] Novas validações de segurança:**
  - [ ] `[TASK-034.1]` Validar o JWT (assinatura, expiração e claims) na etapa de autenticação da TaskAPI
  - [ ] `[TASK-034.2]` Adicionar a validação de dados do front-end como uma etapa própria da trilha do InvestApp
- [ ] **[TASK-035]** Escrever a spec do curso de LP2 para as avaliações 3.x e 4.x
- [ ] **[TASK-036] Guia de Web APIs — melhorias adicionais:**
  - [ ] `[TASK-036.1]` Criar prompt para gerar análise de gargalo, performance e melhorias de um sistema de software, aplicável às avaliações da disciplina e à etapa final das páginas de projeto (ex: InvestApp)
  - [ ] `[TASK-036.2]` Refazer os projetos práticos do guia (ver também `[TASK-030]`)
  - [ ] `[TASK-036.3]` Refazer os slides do guia
- [x] **[TASK-037] Guia de NPM — pacotes adicionais:**
  - [x] `[TASK-037.1]` Mapear e cobrir outros pacotes relevantes do ecossistema npm (`dev-dependencies`, `zod`, `d3`, `echarts`, `leaflet` e `reference/package-map`)
  - [x] `[TASK-037.2]` Revisar e expandir a página de BaaS — absorvida pela `[TASK-038]`: expandir BaaS dentro do guia npm piorava o recorte do guia, então o assunto virou guia próprio
- [x] **[TASK-038] Extração do BaaS para o Guia de Computação em Nuvem:** (ver [spec](../specs/executed/spec-009-cloud-guide-extraction.md))
  - [x] `[TASK-038.1]` Criar o guia `cloud` (`Guia de Computação em Nuvem`) e mover as **7 páginas** de `npm/baas/` e os **3 projetos** de `examples/courses/npm/baas/`, com **19 redirecionamentos** (7 de `/courses/npm/baas/*`, 7 repontados de `/courses/packages/baas/*` e 5 de `/courses/pw2-csbes-jp/package/*`)
  - [x] `[TASK-038.2]` Fechar o lado do npm: cartão, badges, `description`, diagrama, tabela de decisão e roteiro do `index.mdx`, mais `reference/package-map`, `ui/leaflet` e `pw2-csbes-jp/topics/packages` — **zero** ocorrências de `npm/baas` em `src/`
  - [x] `[TASK-038.3]` Normalizar as 7 páginas migradas: `## Objetivo` bipartido de **0 para 7**, `## Quando usar, e quando não usar?` de **0 para 7**, `## Desafio` de **0 para 7** e um aside `Dica de IA:` nas 5 páginas que escrevem código; `<SourceCode>` de **13 para 20** recortes, com `storage.js` das duas trilhas deixando de ser bloco escrito à mão
  - [x] `[TASK-038.4]` Escrever as **5 páginas novas**: `foundations/cloud-computing`, `foundations/baas`, `hosting/static-hosting` e `hosting/serverless-functions` (com projetos executáveis em `examples/courses/cloud/`) e `reference/platform-map`
  - [x] `[TASK-038.5]` Revisar com a `devlab-content-reviewer`: 4 títulos interrogativos sem `?` reescritos, 11 parágrafos de entrada ausentes, 2 subseções solitárias e 1 anglicismo (`deletar`); `check-code-blocks` com 21 blocos e 0 erro, e `pnpm validate` limpo
  - [x] `[TASK-038.6]` Criar a seção **Recursos** do guia, logo após Fundamentos, com uma página por linha-chave da matriz de comparação: `hosting/` virou `resources/` (2 redirecionamentos) e ganhou **8 páginas novas** (funções de borda, banco relacional, banco de documentos, autenticação, storage, realtime, workers e jobs, containers e PaaS), cada uma cruzando as plataformas e apontando para as páginas específicas; matriz de comparação, mapa de plataformas e índice do guia ligados a elas; 8 diagramas medidos entre 230 e 677 px
- [x] **[TASK-039] Reestruturação do Guia de Banco de Dados:** (ver [spec](../specs/executed/spec-010-database-guide-restructure.md))
  - [x] `[TASK-039.1]` Criar `examples/courses/database/invest-db/` com todo o SQL do guia em arquivos `.sql` executados por `run.mjs` (`node:sqlite`, sem dependências) — blocos escritos à mão com título de arquivo de **20 para 0**, e todo `Output` produzido pelo script
  - [x] `[TASK-039.2]` Normalizar as 6 páginas existentes: `## Objetivo` bipartido, `## Desafio` e `Dica de IA:` de **0 para 6**, `## Quando usar` nas 3 que ensinam técnica escolhível; `basics/dbms` reduzido a motores e escolha
  - [x] `[TASK-039.3]` Criar as seções por motor no molde do guia de nuvem: SQLite, PostgreSQL, MySQL e MongoDB, com visão geral, instalação e cliente, e administração (CRUD e agregação no MongoDB) — **12 páginas**, com sessões de terminal capturadas de contêineres `postgres:16.2`, `mysql:8.3` e `mongo:7.0` e arquivos em `examples/courses/database/servers/`
  - [x] `[TASK-039.4]` Criar as 7 páginas cruzadas: `basics/administration`, `nosql/paradigms`, `modeling/keys-indexes`, `modeling/case-studies`, `sql/transactions`, `sql/performance` e `reference/sql-cheat-sheet`
  - [x] `[TASK-039.5]` Remover a seção "Acesso a dados na aplicação" (duplicava a trilha de persistência do Express), reescrever o índice no formato dos demais guias e cruzar os links com Express e Nuvem — de **6 para 25 páginas**, `pnpm validate` limpo, diagramas medidos entre 256 e 802 px
- [x] **[TASK-040] Expansão de Motores Especializados no Guia de Banco de Dados:** (ver [spec](../specs/executed/spec-011-specialized-databases-expansion.md))
  - [x] `[TASK-040.1]` Criar os 5 ambientes e scripts de servidor em `examples/courses/database/servers/` (`redis-server`, `neo4j-server`, `influxdb-server`, `elasticsearch-server`, `cassandra-server`)
  - [x] `[TASK-040.2]` Escrever a seção do **Redis** (Chave-Valor): `index.mdx`, `setup.mdx`, `commands.mdx`
  - [x] `[TASK-040.3]` Escrever a seção do **Neo4j** (Grafos): `index.mdx`, `setup.mdx`, `cypher.mdx`
  - [x] `[TASK-040.4]` Escrever a seção do **InfluxDB** (Séries Temporais): `index.mdx`, `setup.mdx`, `time-series.mdx`
  - [x] `[TASK-040.5]` Escrever a seção do **Elasticsearch** (Busca Textual): `index.mdx`, `setup.mdx`, `search.mdx`
  - [x] `[TASK-040.6]` Escrever a seção do **Apache Cassandra** (Wide-Column): `index.mdx`, `setup.mdx`, `cql.mdx`
  - [x] `[TASK-040.7]` Atualizar sidebar em `astro.config.mjs`, índice em `src/content/docs/courses/database/index.mdx` e matriz em `basics/paradigms.mdx`
  - [x] `[TASK-040.8]` Validar com `pnpm validate`, mover a spec para `specs/executed/` e realizar commit e push
  - [x] `[TASK-040.9]` Reorganizar a sidebar do Guia de Banco de Dados por paradigmas (`Banco Relacional`, `Banco de Documentos`, `Banco Chave-Valor`, etc.), aninhar as Linguagens de Consulta específicas de cada paradigma e criar tópicos de dialetos/peculiaridades SQL para SQLite, PostgreSQL e MySQL
  - [x] `[TASK-040.10]` Expandir a seção 'Projeto e Modelagem' com modelagem não relacional (documentos, chave-valor, grafos, séries temporais e colunar) e padrões de modelagem/auditoria (soft delete com índice parcial, createdAt/updatedAt, colunas computadas/geradas, concorrência otimista e identificadores UUIDv7)
  - [x] `[TASK-040.11]` Criar páginas de visão geral de bancos gerenciados em nuvem (DBaaS) para todos os 7 paradigmas (`Amazon RDS e Aurora`, `MongoDB Atlas e Firestore`, `DynamoDB e Upstash`, `Neo4j AuraDB e Neptune`, `InfluxDB Cloud e Timestream`, `Elastic Cloud e OpenSearch`, `DataStax Astra DB e Keyspaces`), registrando-as na sidebar e no índice do curso
  - [x] `[TASK-040.12]` Criar a seção de **Armazenamento de Objetos (Storage)** no Guia de Banco de Dados, com ambiente local Docker e utilitário `mc` para **MinIO** (`minio/`, `minio/setup`, `minio/s3-api`) e visão geral de **Amazon S3 e Cloud Storage** (`s3-blob-storage/`), registrando-os na sidebar, catálogo e matriz de decisão
  - [x] `[TASK-040.13]` Expandir as 8 seções de bancos em nuvem e storage (RDS/Aurora, Atlas/Firestore, DynamoDB/Upstash, AuraDB/Neptune, InfluxDB Cloud/Timestream, Elastic Cloud/OpenSearch, Astra DB/Keyspaces, S3/Blob Storage) com 3 páginas cada (Visão Geral, Provisionamento e Clientes, Recursos de Nuvem e Operações), registrando todos os 24 tópicos na sidebar

### Concluídos (Conteúdo)

- [x] **[TASK-009]** O path dos cursos em `/courses/` agora usam o prefixo da sigla primeiro (`dw-cstrc-jp`, `pw2-csbes-jp`, `lp2-ctii-jp`)
- [x] **[TASK-010]** TS e JS centralizados
- [x] **[TASK-011]** Comparativo entre TypeScript e JavaScript
- [x] **[TASK-012]** Comparativo entre Python e JavaScript
- [x] **[TASK-013]** Casos bizarros de JS (`NaN !== NaN`, `typeof null === 'object'`, `0.1 + 0.2 !== 0.3`, etc.)
- [x] **[TASK-014]** Revisar os cursos e guias para incluir Mermaid caso necessário (ex: objeto de JS)

---

## 🚀 Projetos Práticos (InvestApp, MonitorApp, etc.)

- [ ] **[TASK-015] Análise de Cobertura e Passo a Passo:**
  - [x] `[TASK-015.1]` Analisar etapa a etapa para ver se é possível criar o projeto final seguindo apenas o que está disponível no passo a passo, sem precisar de conhecimento prévio — **não é**: viável até a etapa 6, seis bloqueadores da etapa 7 em diante (ver [spec](../specs/executed/spec-002-investapp-monitorapp-coverage.md))
  - [x] `[TASK-015.2]` Percorrer todas as linhas de código para analisar se as tarefas atuais cobrem todas as linhas ou se precisam ser atualizadas — **não cobriam**: das linhas alteradas em cada etapa, o InvestApp exibia 62% e o MonitorApp 82%; depois das correções, 88% e 91%, sem nenhuma mudança de código sem explicação (ver [spec](../specs/executed/spec-002-investapp-monitorapp-coverage.md))
  - [ ] `[TASK-015.3]` Avaliar o conteúdo dos projetos e o acesso/execução dos códigos (avaliar se trechos são suficientes; identificar pontos de melhoria didática e de codificação; existem boas práticas que ficaram de fora; existem trechos que podem ser simplificados; existem trechos que podem ser melhor explicados; existem trechos que podem ser melhor documentados; existem trechos que podem ser melhor testados; existem trechos que podem ser melhor estruturados (Por exemplo, no teste tem vários requests sem explicação))
  - [x] `[TASK-015.4]` Fechar o restante da cobertura planejado na [spec](../specs/executed/spec-002-investapp-monitorapp-coverage.md): migrations, `requests.http`, `package.json` e `.env` nas duas trilhas, e as etapas 8 a 11 do MonitorApp
- [ ] **[TASK-016] Estruturação e Documentação dos Projetos:**
  - [ ] `[TASK-016.1]` Criar `PRD.md` com as features e o `README`
  - [ ] `[TASK-016.2]` Definir Requisitos Não Funcionais (RNF), garantindo um bom design responsivo (Mobile-First / layout adaptável)
  - [ ] `[TASK-016.3]` Verificar e Auditar a segurança dos projetos contra vulnerabilidades comuns (ex: CSRF, XSS, CORS mal configurado, SQL Injection)
  - [ ] `[TASK-016.4]` Definir spec gradual e plan por etapa
  - [ ] `[TASK-016.5]` Incluir .agents/, SKILLs, `AGENT.md`…
  - [ ] `[TASK-016.6]` Ajustar projetos com boas práticas
- [ ] **[TASK-017] Página Final do Projeto (Desafios & Evolução):**
  - [x] `[TASK-017.1]` Adicionar página na etapa final de InvestApp e MonitorApp apontando novas features, débitos técnicos, melhorias e desafios para o projeto (estímulo ao aprendizado contínuo)
  - [ ] `[TASK-017.2]` Exemplos de melhorias: migração do front vanilla para React/Vue/Svelte, implementação de GraphQL, testes automatizados, integração com serviços externos, performance e escalabilidade, linter e formatter, CI/CD, monitoramento e logging, segurança, autenticação/autorização, otimização de queries e caching
- [x] **[TASK-018] Divulgação & Apoio Visual:**
  - [x] `[TASK-018.1]` Fazer o OpenGraph para o projeto final (título, descrição, imagem e URL)
  - [x] `[TASK-018.2]` Criar mindmap para as tarefas e etapas do projeto final do projeto (InvestApp e MonitorApp) e adicionar o link na página de backlog do projeto

---

## 🛠️ Tooling, DX, Linters e Automações com IA

- [ ] **[TASK-019]** Adicionar formatter, linter, Husky e GitHub Action CI no repositório TypeScript
- [ ] **[TASK-020]** Sugerir prompts de IA para cada etapa (ex: skill para criar branch de uma task e abrir PR com template)
- [ ] **[TASK-021]** Prompt/skill para montar um PR a partir de uma task, com template de PR, checklist de revisão, etc.
- [x] **[TASK-022]** Skill: usar mais `<p>` para deixar o texto mais didático

---

## 📄 Especificação: Pull Request Skill

````markdown
# Prompt — Create a Pull Request Skill

Create a reusable skill named `pull-request` for generating high-quality GitHub Pull Request titles and descriptions from the current repository state.

The skill must optimize for **reviewability, signal-to-noise ratio, traceability, and factual accuracy**.

## Goal

Generate a Pull Request description that allows a reviewer to quickly understand:

1. **What changed?**
2. **Why was it changed?**
3. **How was it implemented at a meaningful architectural/domain level?**
4. **How was it validated?**
5. **Are there risks, breaking changes, migrations, dependencies, or follow-up work?**
6. **What deserves special attention during review?**

The PR description must summarize the change, not reproduce the diff, commit history, or implementation file-by-file.

---

## Repository Analysis

Before writing the PR, inspect the repository and determine the effective change between the current branch and its target/base branch.

When available, inspect:

- git diff against the base branch;
- changed files;
- commit history;
- existing PR template;
- repository contribution guidelines;
- `AGENTS.md`, `CLAUDE.md`, or equivalent repository instructions;
- package/build/test configuration;
- issue/ticket references;
- documentation affected by the change.

Prefer the **actual diff and resulting repository state** over commit messages when determining what changed.

Commit messages are supporting evidence, not the primary source of truth.

Never claim that something was implemented, fixed, tested, or validated unless repository evidence or executed commands support the claim.

---

## Summarization Strategy

Do not summarize the PR file-by-file or commit-by-commit.

Instead, identify the smallest set of **logical change groups** that explain the PR.

Examples:

- Authentication
- API contract
- Data model
- Error handling
- Internationalization
- UI/UX
- Testing
- Developer tooling
- CI/CD
- Documentation

Usually prefer **2–5 meaningful groups**.

Combine related changes into one statement.

### Bad

- Changed `user.ts`
- Changed `api-user-service.ts`
- Changed `endpoints.ts`
- Changed `user-card.tsx`

### Good

- Aligned user management with the backend API contract, including UUID-based identifiers, updated endpoints, and create/update operations.

Describe **behavior and intent**, not merely touched files.

---

## Information Priority

Apply progressive disclosure.

### Level 1 — Reviewer must know

Always prioritize:

- purpose of the PR;
- main behavioral or architectural changes;
- important implementation decisions;
- validation performed;
- breaking changes or migration requirements.

### Level 2 — Reviewer may need

Include when relevant:

- compatibility considerations;
- backend or external-service dependencies;
- important refactors;
- security implications;
- performance implications;
- deployment/configuration changes;
- known limitations;
- follow-up work.

### Level 3 — Usually omit

Avoid unless specifically useful:

- exhaustive file lists;
- exhaustive commit lists;
- trivial renames;
- formatting-only changes;
- obvious implementation details visible directly in the diff;
- generic statements such as "code was improved";
- duplicated information.

---

## PR Title

Generate a concise title describing the primary outcome of the change.

Prefer Conventional Commit semantics when compatible with the repository:

`<type>(<optional-scope>): <description>`

Common types:

- `feat`
- `fix`
- `refactor`
- `docs`
- `test`
- `perf`
- `build`
- `ci`
- `chore`

Use `!` or explicitly document a breaking change when appropriate.

Do not infer a `feat` merely because many files changed. Determine the type from the primary intent.

Examples:

`feat(auth): add OAuth login flow`

`fix(events): preserve UUIDs when loading event routes`

`refactor(api): align frontend services with backend contract`

---

## PR Description

Use this structure, omitting sections that genuinely do not apply:

# Summary

Write 1–3 sentences explaining the purpose and outcome of the PR.

Focus on the reviewer-facing mental model.

Do not begin with implementation trivia.

## Changes

Describe the main logical changes using concise bullets.

Prefer approximately 3–7 bullets total.

Each bullet should describe a meaningful behavior, architectural decision, or cohesive change.

Use nested bullets only when they materially improve comprehension.

## Why

Explain the problem, requirement, ticket, or technical motivation.

Include issue/ticket references when available.

Do not merely repeat the Summary.

## Testing

Report what was actually validated.

Use exact commands when useful:

- `npm test`
- `npm run lint`
- `npm run typecheck`
- integration tests
- E2E tests
- manual validation

Clearly distinguish:

- passed;
- failed;
- partially passing;
- not executed.

Never mark a test as passing based solely on documentation or a checklist.

If tests were not run, explicitly say so.

## Review Notes

Include only when useful.

Call attention to areas where reviewer attention is especially valuable, such as:

- API contract changes;
- authentication/authorization;
- database migrations;
- concurrency;
- security-sensitive code;
- architectural changes;
- complex compatibility behavior.

## Breaking Changes

Include only when applicable.

Explain:

- what breaks;
- who is affected;
- required migration or configuration changes.

## Dependencies

Include only when the PR depends on:

- another repository;
- another PR or branch;
- infrastructure;
- environment variables;
- migrations;
- external services.

## Screenshots

Include for meaningful visual changes.

If there is no visual impact, either omit the section or state:

`No visual changes.`

---

## Accuracy Rules

The skill must distinguish between:

**Observed**
Information directly supported by the diff or repository.

**Validated**
Information confirmed by commands or tests executed during the analysis.

**Inferred**
A conclusion derived from repository evidence but not directly verified.

Avoid presenting inferred information as validated fact.

Never invent:

- ticket IDs;
- test results;
- performance improvements;
- bug fixes;
- motivations;
- breaking changes;
- deployment requirements.

When evidence is insufficient, omit the claim or explicitly qualify it.

---

## Handling Large PRs

For large PRs, summarize hierarchically.

First determine the overall purpose.

Then cluster changes by responsibility or domain.

Do not increase description length proportionally to the number of changed files.

A PR touching 200 files may still need only five meaningful change bullets.

Highlight cross-cutting changes such as:

- mass renaming;
- formatting;
- generated files;
- dependency lockfile updates;

but compress them into a single bullet unless they have independent review significance.

---

## Testing Integrity

Do not trust a PR checklist blindly.

If the repository says:

`[x] Tests pass`

but executed tests fail, report the actual result.

If a test suite is partially passing, report the numbers when available.

Example:

`Playwright: 9/19 tests passing; 10 currently failing.`

Never describe a partially failing suite as successfully validated.

---

## Existing PR Templates

If `.github/PULL_REQUEST_TEMPLATE.md` exists, preserve its required structure unless doing so would violate repository instructions.

Fill the template using summarized information.

Do not duplicate information simply because similar sections exist.

---

## Writing Style

Write for a developer reviewing the PR.

Use:

- concise technical language;
- active voice;
- specific nouns and verbs;
- short paragraphs;
- meaningful bullets;
- Markdown.

Avoid:

- marketing language;
- unnecessary adjectives;
- chronological narration;
- "This PR makes several improvements...";
- commit-by-commit narration;
- file-by-file narration;
- obvious statements;
- excessive emojis.

Prefer:

> Aligns frontend identifiers and API routes with the backend contract.

Instead of:

> Updated multiple files throughout the application to make several improvements related to how the frontend communicates with the backend.

---

## Final Quality Check

Before returning the PR, verify:

- Can the purpose be understood in under 30 seconds?
- Does the Summary explain the outcome rather than list files?
- Are related changes grouped?
- Is implementation detail included only when relevant to review?
- Are test claims supported by actual evidence?
- Are failures or limitations visible?
- Are breaking changes explicit?
- Are dependencies explicit?
- Is any information unnecessarily duplicated?
- Could any bullet be removed without losing reviewer-relevant information?

If so, remove it.

---

## Output

Return:

### Title

`<recommended PR title>`

### Description

```markdown
<complete PR description>
```
````

Do not include additional analysis unless explicitly requested.

```

```
