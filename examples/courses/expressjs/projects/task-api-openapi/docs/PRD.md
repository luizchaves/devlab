# Product Requirements Document (PRD) — TaskAPI

Documento completo de especificação de requisitos de produto e engenharia da **TaskAPI**, estruturado em cinco épicos, dezoito features, vinte e duas histórias de usuário, cento e trinta critérios de aceitação e a relação exaustiva de todas as tasks técnicas das doze etapas.

---

## 1. Visão Geral e Objetivos do Produto

A **TaskAPI** é uma API RESTful de referência construída com Node.js e Express. O objetivo do produto é fornecer uma plataforma robusta, segura e de alto desempenho para gerenciamento de tarefas pessoais e colaborativas, sem dependências desnecessárias e com foco em simplicidade arquitetural.

### Público-Alvo e Personas
- **Clientes HTTP**: Aplicações front-end (SPA, mobile), ferramentas de automação e desenvolvedores consumindo a API via clientes HTTP.
- **Engenheiros de Software e Mantenedores**: Pessoas que evoluem e sustentam a base de código, exigindo modularidade, tipagem estrita e separação clara de responsabilidades.
- **Operação e DevOps**: Equipes responsáveis pelo deploy, observabilidade, conformidade de segurança e monitoramento em produção.

---

## 2. Arquitetura e Stack Tecnológica

- **Runtime**: Node.js 22+ (módulos ES nativos `"type": "module"`, execução de TypeScript nativa sem `tsx` e sem passo de build).
- **Framework Web**: Express 5 (com roteamento assíncrono nativo).
- **Linguagem**: JavaScript (etapas 1 a 3) e TypeScript estrito (etapas 4 a 12).
- **Validação de Fronteira**: Zod (`strictObject`, `coerce`, parsing de `body`, `query`, `params`, `headers` e `cookies`).
- **Documentação de Contrato**: OpenAPI 3.0 gerado programaticamente a partir dos schemas Zod (`swagger-ui-express`).
- **Persistência de Dados**:
  - Em memória (etapas 1 a 6).
  - SQLite via driver nativo `node:sqlite` com consultas parametrizadas (etapa 7).
  - Prisma 7 ORM com `@prisma/adapter-better-sqlite3` e migrações versionadas (etapa 8 em diante).
- **Autenticação e Criptografia**: `node:crypto` nativo para hash Argon2id com sal individual e assinatura HS256 de JWT (sem dependências externas como `bcrypt` ou `jsonwebtoken`).
- **Qualidade e Estilo**: Biome (`lint`, `format`, `lint:fix`) e testes automatizados com o test runner nativo `node:test` e `supertest`.
- **Infraestrutura e Empacotamento**: Docker multi-estágio com usuário sem privilégios (`app`), volumes persistentes e `docker compose`.

---

## 3. Catálogo de Requisitos do Sistema

### Requisitos Funcionais (RF)
- **RF01 · Gestão de Tarefas**: CRUD completo de tarefas (`GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`).
- **RF02 · Filtros, Ordenação e Paginação**: Listagem paginada com ordenação dinâmica e filtros combinados (`done`, `priority`, `q`).
- **RF03 · Classificação por Tags**: Relação N-N entre tarefas e tags com carregamento relacional (`include`).
- **RF04 · Cadastro de Usuários**: Registro de novas contas com e-mail único, nome e senha em hash seguro (`POST /auth/signup`).
- **RF05 · Autenticação e Sessão**: Emissão de token JWT para credenciais válidas (`POST /auth/signin`) e consulta de perfil (`GET /auth/me`).
- **RF06 · Isolamento por Dono**: Escopo estrito de tarefas por usuário autenticado (`userId`), garantindo que nenhum usuário acesse ou modifique dados de terceiros.
- **RF07 · Verificação de E-mail**: Disparo assíncrono de mensagem de boas-vindas com token de confirmação de conta (`GET /auth/verify`).
- **RF08 · Avatar do Usuário**: Upload multipart de imagem de perfil (até 2 MB) servida estaticamente via `/uploads/`.
- **RF09 · Eventos em Tempo Real**: Conexão persistente Server-Sent Events (`GET /events`) transmitindo alterações nas tarefas do usuário.
- **RF10 · Diagnóstico de Rede (Ping)**: Execução segura de chamadas de sistema (`execFile`) para medir latência de rede até hosts remotos (`GET /ping`).

### Requisitos Não-Funcionais (RNF)
- **RNF01 · Validação Estrita de Entrada**: Rejeição imediata de payloads inválidos com status 422 e indicação precisa do campo com erro.
- **RNF02 · Segurança Criptográfica**: Senhas armazenadas exclusivamente em hash Argon2id; tokens JWT com assinatura HMAC-SHA256 em tempo constante.
- **RNF03 · Persistência Confiável**: Preservação de integridade relacional, chaves estrangeiras com `CASCADE` e migrações idempotentes.
- **RNF04 · Separação de Camadas (MVC)**: Desacoplamento absoluto entre rotas, controladores, modelos e middlewares.
- **RNF05 · Contrato Autodocumentado**: Sincronização automática entre os schemas de validação e a especificação OpenAPI 3.
- **RNF06 · Observabilidade e Diagnóstico**: Logs estruturados em formato JSON com `requestId` distribuído, sondas `/health` e `/ready`, e métricas para Prometheus (`/metrics`).
- **RNF07 · Proteção de Borda**: Cabeçalhos de segurança (CSP, HSTS, no-sniff, frame-guard), CORS restritivo e rate limiting por IP/rota.
- **RNF08 · Confiabilidade via Testes**: Suíte de testes automatizados unitários e de integração idempotentes executados sem abertura de portas de rede.
- **RNF09 · Portabilidade e Deploy**: Empacotamento em imagem Docker leve, segura e executável via comando único.
- **RNF10 · Execução Nativa de TypeScript**: Tipagem estrita executada diretamente pelo Node.js sem transpilação intermediária.

---

## 4. Matriz de Rastreabilidade do Backlog

| História de Usuário (US) | Critérios de Aceitação (CA) | Tasks de Implementação (TK) | Qtd. CA / TK | Sprint / Responsável |
| ------------------------ | --------------------------- | --------------------------- | ------------ | -------------------- |
| `US01` Criar e consultar tarefas por HTTP | `CA01.1` a `CA01.7` | `TK01.1` a `TK01.4` | 7 CA / 4 TK | Sprint 1 · `luiz.chaves` |
| `US02` Montar o recurso por prefixo | `CA02.1` a `CA02.5` | `TK02.1` a `TK02.3` | 5 CA / 3 TK | Sprint 1 · `luiz.chaves` |
| `US03` Manter as tarefas de ponta a ponta | `CA03.1` a `CA03.5` | `TK03.1`, `TK03.2`, `TK03.5` | 5 CA / 3 TK | Sprint 2 · `luiz.chaves` |
| `US04` Cada responsabilidade no seu lugar | `CA04.1` a `CA04.6` | `TK03.3`, `TK03.4`, `TK03.6` | 6 CA / 3 TK | Sprint 2 · `luiz.chaves` |
| `US05` Deixar o compilador apontar a quebra | `CA05.1` a `CA05.6` | `TK04.1` a `TK04.5` | 6 CA / 5 TK | Sprint 2 · `luiz.chaves` |
| `US06` Saber exatamente o que corrigir | `CA06.1` a `CA06.7` | `TK05.1` a `TK05.3`, `TK05.5`, `TK05.6` | 7 CA / 5 TK | Sprint 3 · `luiz.chaves` |
| `US07` Encontrar tarefas sem baixar tudo | `CA07.1` a `CA07.6` | `TK05.4` | 6 CA / 1 TK | Sprint 3 · `luiz.chaves` |
| `US08` Integrar sem ler o código | `CA08.1` a `CA08.6` | `TK06.1` a `TK06.3` | 6 CA / 3 TK | Sprint 3 · `luiz.chaves` |
| `US09` Não perder tarefas ao reiniciar | `CA09.1` a `CA09.6` | `TK07.1` a `TK07.4` | 6 CA / 4 TK | Sprint 3 · `luiz.chaves` |
| `US10` Classificar tarefas com tags | `CA10.1` a `CA10.7` | `TK08.1` a `TK08.6` | 7 CA / 6 TK | Sprint 4 · `luiz.chaves` |
| `US11` Ter uma conta | `CA11.1` a `CA11.5` | `TK09.1`, `TK09.2`, `TK09.4`, `TK09.5` | 5 CA / 4 TK | Sprint 4 · `luiz.chaves` |
| `US12` Entrar e me identificar | `CA12.1` a `CA12.7` | `TK09.3`, `TK09.6`, `TK09.8` | 7 CA / 3 TK | Sprint 4 · `luiz.chaves` |
| `US13` Ver apenas as minhas tarefas | `CA13.1` a `CA13.6` | `TK09.7` | 6 CA / 1 TK | Sprint 4 · `luiz.chaves` |
| `US14` Saber como o serviço está | `CA14.1` a `CA14.7` | `TK10.1` a `TK10.3`, `TK10.6` | 7 CA / 4 TK | Sprint 5 · `luiz.chaves` |
| `US15` Proteger a borda da API | `CA15.1` a `CA15.6` | `TK10.4`, `TK10.5` | 6 CA / 2 TK | Sprint 5 · `luiz.chaves` |
| `US16` Confirmar que o e-mail é meu | `CA16.1` a `CA16.5` | `TK11.3`, `TK11.4` | 5 CA / 2 TK | Sprint 5 · `luiz.chaves` |
| `US17` Ter uma foto de perfil | `CA17.1` a `CA17.7` | `TK11.1`, `TK11.2` | 7 CA / 2 TK | Sprint 5 · `luiz.chaves` |
| `US18` Ser avisado no instante da mudança | `CA18.1` a `CA18.5` | `TK11.5`, `TK11.6` | 5 CA / 2 TK | Sprint 5 · `luiz.chaves` |
| `US19` Medir a latência até um host | `CA19.1` a `CA19.5` | `TK11.7`, `TK11.8` | 5 CA / 2 TK | Sprint 5 · `luiz.chaves` |
| `US20` Alterar sem quebrar o existente | `CA20.1` a `CA20.7` | `TK12.1` a `TK12.3`, `TK12.7` | 7 CA / 4 TK | Sprint 6 · `luiz.chaves` |
| `US21` Subir a API em qualquer máquina | `CA21.1` a `CA21.7` | `TK12.4` a `TK12.6` | 7 CA / 3 TK | Sprint 6 · `luiz.chaves` |
| `US22` Informar as tags ao criar uma tarefa | `CA22.1` a `CA22.3` | `TK22.1` a `TK22.4` | 3 CA / 4 TK | Sprint 6 · `luiz.chaves` |

---

## 5. Decomposição do Backlog por Épicos e Features

### EP01 · Tarefas por HTTP

#### FT01 · Primeiro Servidor (Etapa 1)
- **US01**: *Como cliente HTTP ou pessoa desenvolvedora, quero um servidor estruturado com governança de IA, scripts de qualidade e rotas básicas, para ter o ciclo requisição/resposta completo sobre uma base padronizada e confiável.*
  - **CA01.1**: `GET /health` responde 200 com status "ok" e uptime do processo sem consultar dados.
  - **CA01.2**: `GET /tasks` responde 200 com a lista inicial de tarefas.
  - **CA01.3**: `GET /tasks/1` responde 200 com a tarefa; `GET /tasks/99` responde 404.
  - **CA01.4**: `POST /tasks` com `title` responde 201 com id gerado e `done: false`.
  - **CA01.5**: `POST /tasks` sem `title` responde 400 com indicação do campo faltante.
  - **CA01.6**: API em arquivo único em `src/server.js` com Express como única dependência de produção.
  - **CA01.7**: Raiz contém `docs/PRD.md`, `AGENTS.md`, `README.md`, `biome.json`, subpastas `active/` e `archived/` em `specs/`, skill `.agents/skills/task-spec-generator/` e scripts `dev`, `start`, `lint`, `format` e `lint:fix`.
  - **Tasks**:
    - `TK01.1`: Criar `package.json`, governança (`docs/PRD.md`, `AGENTS.md`, `README.md`), `biome.json`, skill `.agents/skills/` e `specs/`.
    - `TK01.2`: Criar `src/server.js` com `express()`, `express.json()` e rota `GET /health`.
    - `TK01.3`: Declarar array `tasks` e rotas `GET /tasks`, `GET /tasks/:id` e `POST /tasks`.
    - `TK01.4`: Criar `requests.http` com requisições executáveis.

#### FT02 · CRUD Completo em Camadas (Etapa 3)
- **US03**: *Como cliente HTTP, quero atualizar e remover tarefas, para manter a lista inteira pela API sem reiniciar o servidor.*
  - **CA03.1**: `PUT /tasks/{id}` com corpo válido responde 200 com a tarefa atualizada.
  - **CA03.2**: `DELETE /tasks/{id}` responde 204 sem corpo.
  - **CA03.3**: `PUT` ou `DELETE` com id inexistente respondem 404.
  - **CA03.4**: Rota inexistente responde 404 no formato padronizado de erro.
  - **CA03.5**: Respostas de erro utilizam o envelope `{ error: { status, message } }`.
  - **Tasks**:
    - `TK03.1`: Criar `src/models/task-model.js` com funções puras de leitura e escrita.
    - `TK03.2`: Criar `src/controllers/task-controller.js` traduzindo HTTP para o model e lançando `HttpError`.
    - `TK03.5`: Atualizar `src/routes/task-router.js` com `PUT` e `DELETE`.
- **US04**: *Como pessoa que mantém a API, quero router, controller, model e tratamento de erro em arquivos separados, para trocar o armazenamento na etapa 7 mexendo em um arquivo só.*
  - **CA04.1**: Router apenas mapeia método e caminho para funções do controller.
  - **CA04.2**: Model não manipula objetos HTTP (`req` ou `res`).
  - **CA04.3**: Controller lança `HttpError` em vez de responder diretamente com `res.status`.
  - **CA04.4**: `errorHandler` com 4 parâmetros posicionado ao final da cadeia; `notFound` após rotas.
  - **CA04.5**: Erros 500 respondem mensagem genérica e registram stack trace no log.
  - **CA04.6**: Middleware `logger` imprime método/caminho e delega via `next()`.
  - **Tasks**:
    - `TK03.3`: Criar `src/middlewares/error-handler.js` (`HttpError`, `notFound`, `errorHandler`).
    - `TK03.4`: Criar `src/middlewares/logger.js`.
    - `TK03.6`: Montar cadeia no `src/app.js` (`logger` → `express.json()` → rotas → `notFound` → `errorHandler`).

#### FT03 · Filtros, Ordenação e Paginação (Etapa 5)
- **US07**: *Como cliente HTTP, quero filtrar, ordenar e paginar a listagem, para encontrar tarefas sem receber a coleção inteira.*
  - **CA07.1**: `GET /tasks` padrão responde envelope `{ data, meta }` com página 1, limite 10 e `-createdAt`.
  - **CA07.2**: Filtros `done`, `priority` e `q` combináveis.
  - **CA07.3**: Suporte a ordenação ascendente (`sort=dueDate`) e descendente (`sort=-dueDate`).
  - **CA07.4**: `meta.total` reflete contagem da coleção filtrada; `totalPages` coerente com `perPage`.
  - **CA07.5**: `perPage > 100` responde 422 antes da chamada ao model.
  - **CA07.6**: Modelo expandido com `description`, `priority`, `dueDate` e `createdAt`.
  - **Tasks**:
    - `TK05.4`: Atualizar `src/models/task-model.ts` para aplicar filtros, ordenação e paginação.

#### FT04 · Tags e Schema Declarativo (Etapa 8)
- **US10**: *Como cliente HTTP, quero que cada tarefa venha com as suas tags, para agrupar o que faço por assunto sem uma segunda requisição.*
  - **CA10.1**: Listagem e consulta trazem `tags` (`id`, `name`, `color`) via `include`.
  - **CA10.2**: Relação N-N declarativa no `schema.prisma` com tabela de junção gerenciada.
  - **CA10.3**: `npx prisma migrate deploy` reconstrói o banco a partir das migrações.
  - **CA10.4**: Seed idempotente sem duplicação de dados em execuções sucessivas.
  - **CA10.5**: Erro `P2025` do Prisma capturado e convertido para 404 `HttpError`.
  - **CA10.6**: Conexão configurada em `prisma.config.ts` e `.env` sem dependência de `dotenv`.
  - **CA10.7**: Remoção total de queries SQL manuais do model.
  - **Tasks**:
    - `TK08.1`: Configurar `prisma/schema.prisma` com `Task`, `Tag` e relação implícita.
    - `TK08.2`: Criar `prisma.config.ts` e `.env.example`.
    - `TK08.3`: Criar `src/database/prisma.ts` com singleton do PrismaClient e SQLite adapter.
    - `TK08.4`: Gerar migração inicial e `src/database/seed.ts` idempotente.
    - `TK08.5`: Atualizar `src/models/task-model.ts` com Prisma Client.
    - `TK08.6`: Remover `src/database/database.ts` e `migration.ts`.

#### FT05 · Tags pela API (Planejada / Backlog)
- **US22**: *Como cliente HTTP, quero informar tags ao criar ou atualizar tarefas, para classificar atividades dinamicamente.*
  - **CA22.1**: `POST /tasks` aceita lista de nomes de tags, criando automaticamente novas tags inexistentes.
  - **CA22.2**: `PUT /tasks/{id}` com `tags` substitui o conjunto de tags da tarefa.
  - **CA22.3**: Filtro `GET /tasks?tag=nome` retorna apenas tarefas vinculadas à tag informada.
  - **Tasks**:
    - `TK22.1`: Atualizar `src/schemas/task.ts` com `tags` no body e query.
    - `TK22.2`: Atualizar `src/models/task-model.ts` com `connectOrCreate`.
    - `TK22.3`: Atualizar contrato OpenAPI em `src/docs/openapi.ts`.
    - `TK22.4`: Criar testes em `src/routes/task-router.test.ts`.

---

### EP02 · Identidade e Acesso

#### FT06 · Cadastro, Login e Isolamento por Dono (Etapa 9)
- **US11**: *Como cliente HTTP, quero criar uma conta com nome, e-mail e senha, para ter tarefas privadas.*
  - **CA11.1**: `POST /auth/signup` responde 201 com dados públicos do usuário sem retornar a senha.
  - **CA11.2**: Cadastro com e-mail duplicado responde 409 Conflict.
  - **CA11.3**: Senha armazenada em formato PHC `$argon2id$` com sal individual.
  - **CA11.4**: Comparação de hashes em tempo constante (`timingSafeEqual`) via `node:crypto`.
  - **CA11.5**: Papel padrão atribuído é `user`.
  - **Tasks**:
    - `TK09.1`: Atualizar `schema.prisma` com `User`, enum/string `role`, `Task.userId` e `@@unique([userId, title])`.
    - `TK09.2`: Criar `src/utils/password.ts` (hash Argon2id e verificação segura) e testes.
    - `TK09.4`: Criar `src/models/user-model.ts`.
    - `TK09.5`: Criar `src/schemas/auth.ts`, `src/controllers/auth-controller.ts` e `src/routes/auth-router.ts`.
- **US12**: *Como cliente HTTP cadastrado, quero autenticar com e-mail e senha recebendo um token JWT, para me identificar nas requisições.*
  - **CA12.1**: `POST /auth/signin` responde 200 com token JWT assinado e dados do usuário.
  - **CA12.2**: E-mail inexistente e senha incorreta respondem com o mesmo status 401 e mensagem genérica.
  - **CA12.3**: Requisições sem cabeçalho `Authorization` respondem 401.
  - **CA12.4**: Token adulterado ou expirado responde 401.
  - **CA12.5**: `GET /auth/me` com token válido retorna perfil do usuário autenticado.
  - **CA12.6**: Payload do token contém apenas `sub`, `name`, `email` e `role`.
  - **CA12.7**: Cabeçalho malformado responde 401 com mensagem do `bearerSchema`.
  - **Tasks**:
    - `TK09.3`: Criar `src/utils/jwt.ts` (assinatura HS256 com `createHmac`, expiração e verificação) e testes.
    - `TK09.6`: Criar middlewares `src/middlewares/authenticate.ts` e `authorize.ts`.
    - `TK09.8`: Criar `bearerSchema` e `cookieSessionSchema` em `src/schemas/auth.ts`.
- **US13**: *Como cliente HTTP autenticado, quero acessar apenas minhas próprias tarefas, para isolamento seguro de dados.*
  - **CA13.1**: Listagem e consultas retornam exclusivamente tarefas do `userId` autenticado.
  - **CA13.2**: Acesso ou modificação de tarefa de outro dono responde 404 Not Found.
  - **CA13.3**: `userId` fornecido no corpo da requisição é ignorado em favor do token autenticado.
  - **CA13.4**: Restrição de unicidade de título restrita por usuário (`userId + title`).
  - **CA13.5**: Middleware `requireRole` responde 403 Forbidden para permissões insuficientes.
  - **Tasks**:
    - `TK09.7`: Atualizar `src/models/task-model.ts` e `task-controller.ts` para vincular operações ao `userId`.

---

### EP03 · Serviços em Volta da Conta

#### FT07 · Verificação de E-mail (Etapa 11)
- **US16**: *Como cliente cadastrado, quero receber um e-mail com link de confirmação, para validar meu endereço.*
  - **CA16.1**: Cadastro dispara e-mail de boas-vindas assincronamente sem bloquear o 201.
  - **CA16.2**: Sem servidor SMTP configurado, envio é registrado no log como `mail_sent`.
  - **CA16.3**: `GET /auth/verify?token=...` valida o token e marca `verifiedAt`.
  - **CA16.4**: Token inválido ou expirado responde 400 Bad Request.
  - **CA16.5**: Falha no servidor SMTP não impede o cadastro do usuário.
  - **Tasks**:
    - `TK11.3`: Criar `src/services/mail-service.ts` com Nodemailer.
    - `TK11.4`: Adicionar campos de verificação no schema, `user-model.ts` e rota `GET /auth/verify`.

#### FT08 · Avatar do Usuário (Etapa 11)
- **US17**: *Como cliente autenticado, quero enviar uma foto de perfil, para identificação visual da conta.*
  - **CA17.1**: Upload sem autenticação responde 401.
  - **CA17.2**: Imagens PNG, JPEG e WebP de até 2 MB respondem 201 com path do avatar.
  - **CA17.3**: Tipos não permitidos respondem 415 Unsupported Media Type.
  - **CA17.4**: Arquivos acima de 2 MB são recusados antes da gravação.
  - **CA17.5**: Nome do arquivo gerado como UUID no servidor.
  - **CA17.6**: Novo upload remove o arquivo antigo do mesmo usuário.
  - **CA17.7**: Arquivos servidos estaticamente via `express.static` sob `/uploads/`.
  - **Tasks**:
    - `TK11.1`: Criar `src/config/upload.ts` com Multer, filtros e limites.
    - `TK11.2`: Criar `src/controllers/avatar-controller.ts` e rota `POST /auth/me/avatar`.

#### FT09 · Eventos em Tempo Real (Etapa 11)
- **US18**: *Como cliente autenticado, quero manter conexão SSE para receber notificações de mudanças nas minhas tarefas.*
  - **CA18.1**: `GET /events` responde 200 com `text/event-stream` e mantém conexão aberta.
  - **CA18.2**: Operações de criação e atualização emitem eventos `task.created` e `task.updated`.
  - **CA18.3**: Eventos são entregues exclusivamente para conexões do proprietário da tarefa.
  - **CA18.4**: Fechamento de conexão remove o cliente da memória.
  - **CA18.5**: Rota exige autenticação válida.
  - **Tasks**:
    - `TK11.5`: Criar `src/services/events-service.ts` com pub/sub em memória.
    - `TK11.6`: Criar `src/controllers/events-controller.ts`, rota `GET /events` e disparar `publish` nas mutações.

#### FT10 · Ping sob Demanda (Etapa 11)
- **US19**: *Como cliente autenticado, quero medir a latência até um host remoto através da API.*
  - **CA19.1**: `GET /ping?host=8.8.8.8` responde 200 com latência medida em milissegundos.
  - **CA19.2**: Host contendo caracteres especiais ou tentativas de injeção responde 422.
  - **CA19.3**: Execução de comando via `execFile` sem invocação de shell.
  - **CA19.4**: Rate limiting dedicado e restrito por usuário.
  - **CA19.5**: Parser de latência implementado como função pura.
  - **Tasks**:
    - `TK11.7`: Criar `src/services/ping-service.ts` e `src/schemas/ping.ts`.
    - `TK11.8`: Criar `src/controllers/ping-controller.ts` e rota `GET /ping`.

---

### EP04 · Fundação Técnica

#### FT11 · Rotas em Módulos (Etapa 2)
- **US02**: *Como pessoa que mantém a API, quero rotas modularizadas e separação entre app e server, para testes sem abrir portas.*
  - **CA02.1**: `task-router.js` declara rotas relativas (`/` e `/:id`).
  - **CA02.2**: Prefixo `/tasks` declarado unicamente no `app.use` do `app.js`.
  - **CA02.3**: `app.js` exporta instância Express; `server.js` gerencia `app.listen`.
  - **CA02.4**: Contratos e respostas da etapa 1 preservados.
  - **CA02.5**: Importar `src/app.js` não inicia listener de rede.
  - **Tasks**:
    - `TK02.1`: Criar `src/routes/task-router.js`.
    - `TK02.2`: Criar `src/app.js`.
    - `TK02.3`: Reduzir `src/server.js` ao listener de porta.

#### FT12 · TypeScript Nativo (Etapa 4)
- **US05**: *Como pessoa que mantém a API, quero TypeScript estrito executado diretamente no Node.js sem transpilação.*
  - **CA05.1**: `npm run typecheck` finaliza sem erros de tipos.
  - **CA05.2**: Execução direta de arquivos `.ts` pelo Node.js sem `tsx` nem bundlers.
  - **CA05.3**: Subpath imports (`#models/*`, `#controllers/*`) configurados no `package.json`.
  - **CA05.4**: `GET /tasks/abc` responde 400 com erro de validação de ID inteiro.
  - **CA05.5**: `POST /tasks` sem cabeçalho `Content-Type: application/json` responde 415.
  - **CA05.6**: Tipos `Task` e `TaskInput` declarados em `types/task.ts`.
  - **Tasks**:
    - `TK04.1`: Configurar `tsconfig.json`, scripts e subpath imports no `package.json`.
    - `TK04.2`: Criar `src/types/task.ts`.
    - `TK04.3`: Criar `src/errors/HttpError.ts`.
    - `TK04.4`: Migrar codebase para TypeScript.
    - `TK04.5`: Criar middleware `src/middlewares/require-json.ts`.

#### FT13 · Validação Estrita (Etapa 5)
- **US06**: *Como cliente HTTP, quero respostas com detalhamento exato dos erros de validação.*
  - **CA06.1**: Múltiplos erros no corpo retornam lista consolidada de issues com status 422.
  - **CA06.2**: Cada issue aponta a origem (`body`, `params`, `query`, `headers`, `cookies`).
  - **CA06.3**: Campos não declarados são rejeitados por `strictObject`.
  - **CA06.4**: Coerção automática de tipos numéricos e booleanos via schemas Zod.
  - **CA06.5**: Controladores recebem dados tipados e saneados via `req.valid`.
  - **CA06.6**: Título duplicado responde 409 Conflict.
  - **CA06.7**: Suporte a validação de headers e cookies (via `parseCookies` nativo).
  - **Tasks**:
    - `TK05.1`: Criar `src/schemas/task.ts` com Zod.
    - `TK05.2`: Criar `src/middlewares/validate.ts` e tipagem global `src/types/express.d.ts`.
    - `TK05.3`: Suportar `issues` em `HttpError` e `error-handler.ts`.
    - `TK05.5`: Integrar validação em `task-router.ts` e `task-controller.ts`.
    - `TK05.6`: Criar `src/utils/cookies.ts` e estender `validate.ts` para 5 fontes.

#### FT14 · Documentação OpenAPI (Etapa 6)
- **US08**: *Como desenvolvedor consumidor da API, quero documentação interativa OpenAPI/Swagger sincronizada com o código.*
  - **CA08.1**: `GET /docs` renderiza interface interativa Swagger UI.
  - **CA08.2**: `GET /openapi.json` expõe especificação OpenAPI 3.0 completa em JSON.
  - **CA08.3**: Regras de validação (tamanhos, enums, obrigatórios) espelhadas dos schemas Zod.
  - **CA08.4**: Alterações em schemas Zod propagam automaticamente para a documentação.
  - **CA08.5**: Rota de documentação montada antes do handler de 404.
  - **CA08.6**: Zero alterações nos contratos das rotas existentes de `/tasks`.
  - **Tasks**:
    - `TK06.1`: Criar gerador OpenAPI `src/docs/openapi.ts` via `swagger-ui-express`.
    - `TK06.2`: Criar router `src/routes/docs-router.ts`.
    - `TK06.3`: Integrar documentação no `src/app.ts`.

#### FT15 · Persistência em SQLite (Etapa 7)
- **US09**: *Como cliente HTTP, quero que as tarefas persistam após o reinício do servidor.*
  - **CA09.1**: Scripts `db:migrate`, `db:seed` e `db:reset` funcionais.
  - **CA09.2**: Dados persistem em arquivo SQLite local (`dev.db`).
  - **CA09.3**: Todas as consultas executadas com parâmetros posicionais (`?`).
  - **CA09.4**: Ordenação dinâmica restrita a colunas de lista segura.
  - **CA09.5**: Unicidade de título garantida por índice único no banco relacional.
  - **CA09.6**: Contratos e formatos de resposta da API preservados.
  - **Tasks**:
    - `TK07.1`: Criar `src/database/database.ts` encapsulando `node:sqlite`.
    - `TK07.2`: Criar `src/database/migration.ts` e `src/database/seed.ts`.
    - `TK07.3`: Atualizar `src/models/task-model.ts` para executar queries SQL.
    - `TK07.4`: Adequar `src/controllers/task-controller.ts` para chamadas assíncronas.

---

### EP05 · Qualidade e Operação

#### FT16 · Endurecimento (Etapa 10)
- **US14**: *Como operador de sistema, quero inicialização segura, logs JSON legíveis por máquina e sondas de integridade.*
  - **CA14.1**: Processo recusa inicialização se variáveis obrigatórias estiverem ausentes.
  - **CA14.2**: Logs em formato JSON contendo `requestId`, `method`, `path`, `status` e `durationMs`.
  - **CA14.3**: Rastreamento com `X-Request-Id` respeitando identificador recebido do proxy.
  - **CA14.4**: Sonda `/health` (liveness) e `/ready` (readiness conectada ao banco).
  - **CA14.5**: Métrica `/metrics` expondo latência e contadores no padrão Prometheus.
  - **CA14.6**: Graceful shutdown ao receber sinal `SIGTERM`/`SIGINT`.
  - **CA14.7**: Dados confidenciais (senhas, tokens, cookies) mascarados nos logs.
  - **Tasks**:
    - `TK10.1`: Criar validação de ambiente `src/config.ts` com Zod.
    - `TK10.2`: Criar `src/middlewares/request-id.ts` e atualizar `logger.ts`.
    - `TK10.3`: Criar `src/routes/health-router.ts` e coletor `src/telemetry.ts`.
    - `TK10.6`: Configurar encerramento gracioso e `trust proxy` no `server.ts` e `app.ts`.
- **US15**: *Como operador de sistema, quero controle de CORS, headers de segurança e rate limiting.*
  - **CA15.1**: CORS restrito a origens explicitamente autorizadas com suporte a preflight 204.
  - **CA15.2**: Cabeçalhos de segurança padronizados (`nosniff`, `DENY`, CSP, HSTS).
  - **CA15.3**: Limite de requisições por IP com resposta 429 Too Many Requests e `Retry-After`.
  - **CA15.4**: Rate limiting estrito para rota de login (`POST /auth/signin`).
  - **CA15.5**: Endpoint `/health` isento de contagem de limite.
  - **Tasks**:
    - `TK10.4`: Criar `src/middlewares/cors.ts` e `src/middlewares/security-headers.ts`.
    - `TK10.5`: Criar `src/middlewares/rate-limit.ts`.

#### FT17 · Suíte de Testes Automatizados (Etapa 12)
- **US20**: *Como pessoa que mantém a API, quero suíte de testes rápida e determinística para prevenção de regressões.*
  - **CA20.1**: `pnpm test` executa suíte completa sem abertura de sockets de rede.
  - **CA20.2**: Testes de rota importam `app` e exercitam endpoints via Supertest.
  - **CA20.3**: Cenários de teste comprovam isolamento de dados entre usuários (404).
  - **CA20.4**: Testes verificam integridade de autenticação, omissão de senhas e 401 unificado.
  - **CA20.5**: Testes realizam limpeza em `before`/`after`, garantindo idempotência.
  - **CA20.6**: Execução baseada no runner nativo `node:test`.
  - **CA20.7**: Testes dedicados para validação de cabeçalhos, cookies e utilitários.
  - **Tasks**:
    - `TK12.1`: Criar `src/routes/auth-router.test.ts`.
    - `TK12.2`: Criar `src/routes/task-router.test.ts`.
    - `TK12.3`: Criar `src/services/ping-service.test.ts`.
    - `TK12.7`: Criar `src/utils/cookies.test.ts` e testes de borda.

#### FT18 · Empacotamento e Deploy (Etapa 12)
- **US21**: *Como engenheiro de deploy, quero contêiner Docker reproduzível com execução via Docker Compose.*
  - **CA21.1**: `docker compose up --build` disponibiliza a API funcional na porta configurada.
  - **CA21.2**: Migrações do banco executadas automaticamente na inicialização do contêiner.
  - **CA21.3**: Aplicação executada sob usuário de baixa permissão (`app`).
  - **CA21.4**: Imagem gerada sem arquivos confidenciais, temporários ou dependências de build.
  - **CA21.5**: Volumes nomeados garantem persistência de dados do SQLite e uploads de avatares.
  - **CA21.6**: Compose valida presença obrigatória de `JWT_SECRET`.
  - **CA21.7**: Instrução `HEALTHCHECK` configurada consultando `/health`.
  - **Tasks**:
    - `TK12.4`: Criar `Dockerfile` multi-estágio otimizado.
    - `TK12.5`: Criar `.dockerignore`.
    - `TK12.6`: Criar `compose.yaml` com volumes, variáveis e healthcheck.
