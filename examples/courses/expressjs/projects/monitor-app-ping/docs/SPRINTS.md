# Planejamento de Sprints — MonitorApp

Planejamento ágil de sprints e alocação de capacidade para as **66 tasks técnicas** do **MonitorApp**, cobrindo as 13 etapas cumulativas e as features de alertas do backlog, com 100% das tarefas atribuídas ao desenvolvedor e mantenedor **luiz.chaves**.

---

## 1. Visão Geral do Modelo de Sprints

O desenvolvimento do MonitorApp é estruturado em **seis sprints quinzenais**, distribuindo as tarefas entre arquitetura de duas origens (SPA com Vite/Tailwind e API Express em TypeScript), medições de rede com ping nativo, Server-Sent Events (SSE) e orquestração Docker Compose.

### Parâmetros da Simulação
- **Ciclo por Sprint**: 2 semanas (10 dias úteis).
- **Responsável Técnico / Assignee**: `luiz.chaves`.
- **Estimativa Total**: 200 Story Points (média de 33 SP por sprint).
- **Critério de Aceite da Sprint**: `pnpm validate` com 0 erros e 100% dos cenários Gherkin validados.

---

## 2. Resumo das Sprints

| Sprint | Meta e Foco da Entrega | Etapas e Features | Tasks Alocadas | Qtd. Tasks | Estimativa | Responsável | Status |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| **Sprint 1** | SPA estática com Vite/Tailwind e API Express em memória | Etapa 1 (`FT01`)<br/>Etapa 2 (`FT02`) | `TK01.1`–`TK01.5`<br/>`TK02.1`–`TK02.6` | 11 tasks | 33 SP | `luiz.chaves` | Concluída |
| **Sprint 2** | TypeScript em camadas e validação de rede com Zod | Etapa 3 (`FT09`)<br/>Etapa 4 (`FT10`) | `TK03.1`–`TK03.7`<br/>`TK04.1`–`TK04.4` | 11 tasks | 33 SP | `luiz.chaves` | Concluída |
| **Sprint 3** | Documentação OpenAPI, SQLite nativo e Prisma ORM | Etapa 5 (`FT11`)<br/>Etapa 6 (`FT12`)<br/>Etapa 7 (`FT03`) | `TK05.1`–`TK05.2`<br/>`TK06.1`–`TK06.3`<br/>`TK07.1`–`TK07.5` | 10 tasks | 30 SP | `luiz.chaves` | Concluída |
| **Sprint 4** | Ping real com `execFile`, cadastro e autenticação JWT | Etapa 8 (`FT04`)<br/>Etapa 9 (`FT07`)<br/>Etapa 10 (`FT08`) | `TK08.1`–`TK08.4`<br/>`TK09.1`–`TK09.4`<br/>`TK10.1`–`TK10.7` | 15 tasks | 45 SP | `luiz.chaves` | Concluída |
| **Sprint 5** | Painel ao vivo com SSE e suíte automatizada de testes | Etapa 11 (`FT05`)<br/>Etapa 12 (`FT13`) | `TK11.1`–`TK11.4`<br/>`TK12.1`–`TK12.6` | 10 tasks | 30 SP | `luiz.chaves` | Concluída |
| **Sprint 6** | Empacotamento Docker e sistema de alertas de queda | Etapa 13 (`FT14`)<br/>Backlog (`FT06`) | `TK13.1`–`TK13.4`<br/>`TK15.1`–`TK15.5` | 9 tasks | 29 SP | `luiz.chaves` | 4 Concl. / 5 Backlog |

---

## 3. Detalhamento das Tasks por Sprint

### Sprint 1 · SPA com Vite, Layout Tailwind e API Express em Memória
- `[x]` `TK01.1`: Criar `index.html`, métricas, `docs/PRD.md`, `AGENTS.md`, `README.md`, `biome.json` e `specs/`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.2`: Criar `front/css/components.css` com tokens de cores e componentes visuais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.3`: Criar tela de detalhes e histórico de host `front/host.html`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.4`: Criar telas de autenticação `front/signin.html` e `front/signup.html`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.5`: Configurar entradas multi-página em `front/vite.config.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.1`: Criar entrypoint Express `back/src/index.js` com Morgan e CORS. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.2`: Criar repositório de hosts em memória `back/src/data/hosts.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.3`: Criar rotas CRUD RESTful com classe de erro `HttpError`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.4`: Configurar proxy `/api` em `front/vite.config.js` eliminando preflight de CORS. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.5`: Criar camada de serviços front `front/js/services/api.js` e renderização de cartões em `index.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.6`: Criar catálogo de requisições HTTP `back/requests.http`. *(Assignee: `luiz.chaves`)*

### Sprint 2 · TypeScript em Camadas e Validação de Rede com Zod
- `[x]` `TK03.1`: Configurar `tsconfig.json` com `strict` e alias `@/*`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.2`: Migrar entrypoint para `back/src/index.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.3`: Declarar interfaces `Host` e `HostInput` em `types/`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.4`: Criar model assíncrono `models/Host.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.5`: Criar controller HTTP `controllers/hosts.controller.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.6`: Criar classe tipada de erro `errors/HttpError.ts` e manipuladores centrais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.7`: Criar roteador modular `routes/hosts.routes.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.1`: Criar middleware genérico `middlewares/validate.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.2`: Criar schemas de validação de rede em `schemas/host.schema.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.3`: Tratar issues Zod no `HttpError` respondendo 400 estruturado. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.4`: Criar utilitário `utils/cookies.ts` para validação de cookies e headers. *(Assignee: `luiz.chaves`)*

### Sprint 3 · Documentação OpenAPI, SQLite Nativo e Relações Prisma
- `[x]` `TK05.1`: Criar gerador OpenAPI `docs/openapi.ts` acoplado aos schemas Zod. *(Assignee: `luiz.chaves`)*
- `[x]` `TK05.2`: Criar rotas `/api/docs` e `/api/openapi.json`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.1`: Criar conexão singleton `database/database.ts` sobre `node:sqlite`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.2`: Criar scripts de migração e sementes relacionais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.3`: Reescrever model com consultas SQL parametrizadas. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.1`: Modelar schema Prisma com `Host`, `Ping` e `Tag` em relação N-N. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.2`: Criar client singleton Prisma e script de seed com dados iniciais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.3`: Reescrever models com Prisma Client e exclusão em cascata. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.4`: Criar rotas de consulta de histórico de medições `GET /api/hosts/:id/pings`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.5`: Exibir tags dinâmicas nos cartões e renderizar histórico em `host.html`. *(Assignee: `luiz.chaves`)*

### Sprint 4 · Coleta de Latência com Ping Nativo, Contas e Autenticação JWT
- `[x]` `TK08.1`: Criar utilitário `lib/ping.ts` com `execFile` e parser de latência em milissegundos. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.2`: Implementar medição manual `Ping.check` persistindo resultado no banco. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.3`: Criar agendador periódico `services/monitor.ts` com `Promise.allSettled`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.4`: Adicionar botão de ação "Medir agora" na página `host.html`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.1`: Adicionar model `User` no schema Prisma e gerar migração. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.2`: Criar utilitário `utils/password.ts` com hash Argon2id via `node:crypto`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.3`: Criar rota `POST /api/users` com validação de dados cadastrais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.4`: Conectar formulário `front/js/signup.js` à criação de conta. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.1`: Criar utilitário `utils/jwt.ts` (`signJwt`, `verifyJwt`). *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.2`: Criar middleware de autenticação `middlewares/isAuthenticated.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.3`: Criar rota `POST /api/signin` emitindo token JWT assinado. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.4`: Escopar queries e histórico de pings pelo `userId` do token. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.5`: Criar `front/js/lib/auth.js` e injetar token nas requisições da SPA. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.6`: Proteger rotas privadas e associar dados de seed ao usuário proprietário. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.7`: Declarar `bearerSchema` e `cookieSessionSchema` em `schemas/auth.schema.ts`. *(Assignee: `luiz.chaves`)*

### Sprint 5 · Painel ao Vivo com SSE e Suíte Completa de Testes
- `[x]` `TK11.1`: Criar barramento de eventos pub/sub em memória `services/events.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.2`: Criar rota SSE `GET /api/events` com heartbeat e encerramento seguro. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.3`: Emitir evento instantâneo após gravação de medição em `Ping.check`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.4`: Criar módulo front `front/js/lib/events.js` atualizando cores e métricas sem recarregar tela. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.1`: Criar testes unitários para `lib/ping.ts` e schemas de validação. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.2`: Criar testes de integração de rotas com Supertest em `src/routes.test.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.3`: Criar testes de front-end com Vitest e JSDOM (`format.js`, `api.js`). *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.4`: Criar suíte de testes E2E com Playwright em `tests/monitor-app.spec.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.5`: Configurar `vitest.config.js`, `playwright.config.js` e scripts de teste. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.6`: Criar testes de cookies e cabeçalhos malformados. *(Assignee: `luiz.chaves`)*

### Sprint 6 · Empacotamento Docker Multi-Serviço e Alertas de Indisponibilidade
- `[x]` `TK13.1`: Criar `Dockerfile` multi-estágio da API incluindo binário nativo `ping`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK13.2`: Criar `Dockerfile` e `nginx.conf` para servir o front estático com proxy reverso. *(Assignee: `luiz.chaves`)*
- `[x]` `TK13.3`: Configurar arquivos `.dockerignore` para API e front-end. *(Assignee: `luiz.chaves`)*
- `[x]` `TK13.4`: Criar `compose.yaml` com serviços, volumes nomeados e rede isolada. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.1`: Modelar entidade relacional `Alert` no schema Prisma. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.2`: Implementar detector de transição de estado de falhas consecutivas no serviço de monitoramento. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.3`: Criar serviço de despacho de notificações de alerta e recuperação. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.4`: Criar tela de preferências e limites de alerta por host. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.5`: Escrever testes unitários para a máquina de estados de alerta. *(Assignee: `luiz.chaves`)*
