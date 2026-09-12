# Planejamento de Sprints — TaskAPI

Planejamento ágil de sprints e alocação de capacidade para as **70 tasks técnicas** da **TaskAPI**, cobrindo as 12 etapas cumulativas e as features de extensão de backlog, com 100% das tarefas atribuídas ao desenvolvedor e mantenedor **luiz.chaves**.

---

## 1. Visão Geral do Modelo de Sprints

O desenvolvimento da TaskAPI é estruturado em **seis sprints quinzenais**, distribuindo as tarefas entre entregas de valor para clientes HTTP e fundações arquiteturais de backend.

### Parâmetros da Simulação
- **Ciclo por Sprint**: 2 semanas (10 dias úteis).
- **Responsável Técnico / Assignee**: `luiz.chaves`.
- **Estimativa Total**: 210 Story Points (média de 35 SP por sprint).
- **Critério de Aceite da Sprint**: `pnpm validate` com 0 erros e 100% dos cenários Gherkin validados.

---

## 2. Resumo das Sprints

| Sprint | Meta e Foco da Entrega | Etapas e Features | Tasks Alocadas | Qtd. Tasks | Estimativa | Responsável | Status |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| **Sprint 1** | Setup inicial, primeiro servidor HTTP e rotas modulares | Etapa 1 (`FT01`)<br/>Etapa 2 (`FT11`) | `TK01.1`–`TK01.4`<br/>`TK02.1`–`TK02.3` | 7 tasks | 21 SP | `luiz.chaves` | Concluída |
| **Sprint 2** | Camadas MVC, tratamento central de erros e TypeScript nativo | Etapa 3 (`FT02`)<br/>Etapa 4 (`FT12`) | `TK03.1`–`TK03.6`<br/>`TK04.1`–`TK04.5` | 11 tasks | 33 SP | `luiz.chaves` | Concluída |
| **Sprint 3** | Validação Zod, paginação, documentação OpenAPI e banco SQLite | Etapa 5 (`FT03`, `FT13`)<br/>Etapa 6 (`FT14`)<br/>Etapa 7 (`FT15`) | `TK05.1`–`TK05.6`<br/>`TK06.1`–`TK06.3`<br/>`TK07.1`–`TK07.4` | 13 tasks | 39 SP | `luiz.chaves` | Concluída |
| **Sprint 4** | Prisma ORM, hash Argon2id e autenticação JWT por dono | Etapa 8 (`FT04`)<br/>Etapa 9 (`FT06`) | `TK08.1`–`TK08.6`<br/>`TK09.1`–`TK09.8` | 14 tasks | 42 SP | `luiz.chaves` | Concluída |
| **Sprint 5** | Observabilidade, segurança de borda, e-mail, avatar, SSE e ping | Etapa 10 (`FT16`)<br/>Etapa 11 (`FT07`–`FT10`) | `TK10.1`–`TK10.6`<br/>`TK11.1`–`TK11.8` | 14 tasks | 42 SP | `luiz.chaves` | Concluída |
| **Sprint 6** | Suíte de testes, Docker Compose e criação de tags na API | Etapa 12 (`FT17`, `FT18`)<br/>Backlog (`FT05`) | `TK12.1`–`TK12.7`<br/>`TK22.1`–`TK22.4` | 11 tasks | 33 SP | `luiz.chaves` | 7 Concl. / 4 Backlog |

---

## 3. Detalhamento das Tasks por Sprint

### Sprint 1 · Setup Inicial, Primeiro Servidor HTTP e Rotas Modulares
- `[x]` `TK01.1`: Criar `package.json`, governança (`docs/PRD.md`, `AGENTS.md`, `README.md`), `biome.json` e `specs/`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.2`: Criar `src/server.js` com Express 5 e rota de verificação de saúde `GET /health`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.3`: Declarar array em memória e rotas RESTful `GET /tasks`, `GET /tasks/:id`, `POST /tasks`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.4`: Criar catálogo de requisições HTTP executáveis em `requests.http`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.1`: Criar roteador modular `src/routes/task-router.js` com rotas relativas. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.2`: Criar entrypoint de aplicação `src/app.js` desacoplado de portas de rede. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.3`: Isolar inicialização de porta em `src/server.js`. *(Assignee: `luiz.chaves`)*

### Sprint 2 · Camadas MVC e Migração para TypeScript Nativo
- `[x]` `TK03.1`: Criar model de tarefas `src/models/task-model.js` desacoplado de objetos HTTP. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.2`: Criar controller `src/controllers/task-controller.js` com tradução de erros. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.3`: Criar middleware de tratamento de erros `src/middlewares/error-handler.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.4`: Criar middleware de log estruturado `src/middlewares/logger.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.5`: Implementar rotas de atualização (`PUT`) e exclusão (`DELETE`) no roteador. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.6`: Reorganizar cadeia central de middlewares em `src/app.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.1`: Configurar `tsconfig.json` e subpath imports (`#*`) em `package.json`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.2`: Declarar tipos TypeScript `Task` e `TaskInput` em `src/types/task.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.3`: Criar classe tipada de erro `src/errors/HttpError.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.4`: Migrar todas as camadas para TypeScript nativo com validação `parseId`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.5`: Criar middleware `src/middlewares/require-json.ts` rejeitando tipos MIME inválidos (415). *(Assignee: `luiz.chaves`)*

### Sprint 3 · Validação Estrita Zod, Documentação OpenAPI e SQLite
- `[x]` `TK05.1`: Criar schemas de validação Zod `src/schemas/task.ts` com `strictObject` e coerções. *(Assignee: `luiz.chaves`)*
- `[x]` `TK05.2`: Criar middleware de fábrica `src/middlewares/validate.ts` e tipagem `express.d.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK05.3`: Formatar issues do Zod em `HttpError.ts` respondendo com status 422. *(Assignee: `luiz.chaves`)*
- `[x]` `TK05.4`: Implementar filtros compostos, ordenação e envelope de paginação em `task-model.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK05.5`: Integrar validação declarativa nas rotas e remover condicionais do controller. *(Assignee: `luiz.chaves`)*
- `[x]` `TK05.6`: Criar utilitário `src/utils/cookies.ts` e validar cookies e headers sem pacotes externos. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.1`: Criar conversor OpenAPI `src/docs/openapi.ts` via `z.toJSONSchema()`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.2`: Criar rotas `/docs` (Swagger UI) e `/openapi.json` em `docs-router.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.3`: Integrar documentação na cadeia do Express antes do manipulador de 404. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.1`: Criar módulo de conexão singleton `src/database/database.ts` sobre `node:sqlite`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.2`: Criar scripts de migração e sementes (`migration.ts`, `seed.ts`). *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.3`: Reescrever model de tarefas com consultas SQL parametrizadas (`?`). *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.4`: Atualizar controllers para operações assíncronas com `await`. *(Assignee: `luiz.chaves`)*

### Sprint 4 · Modelagem Prisma ORM, Criptografia Argon2id e Autenticação JWT
- `[x]` `TK08.1`: Modelar `prisma/schema.prisma` com entidades `Task`, `Tag` e relação N-N. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.2`: Criar `prisma.config.ts` e `.env.example` com driver adapter SQLite. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.3`: Criar client singleton em `src/database/prisma.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.4`: Gerar migração versionada e reescrever script `seed.ts` com `upsert`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.5`: Atualizar model para consultas via Prisma Client com tradução de erros `P2025`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.6`: Remover camada legada de SQL manual (`database.ts`, `migration.ts`). *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.1`: Adicionar model `User` no schema Prisma com restrição de unicidade por dono. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.2`: Criar utilitário `src/utils/password.ts` com hash Argon2id e sal individual via `node:crypto`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.3`: Criar utilitário `src/utils/jwt.ts` com emissão e verificação HMAC-SHA256 nativa. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.4`: Criar model `src/models/user-model.ts` com omissão estrita do hash de senha. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.5`: Criar rotas e controllers de autenticação (`signup`, `signin`, `me`). *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.6`: Criar middlewares `authenticate.ts` e `authorize.ts` protegendo as rotas de tarefas. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.7`: Escopar todas as consultas e operações de tarefas pelo `userId` do token. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.8`: Declarar `bearerSchema` e `cookieSessionSchema` em `schemas/auth.ts`. *(Assignee: `luiz.chaves`)*

### Sprint 5 · Endurecimento Operacional e Serviços de Periferia
- `[x]` `TK10.1`: Criar validação de ambiente no arranque `src/config.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.2`: Criar middleware de rastreabilidade `request-id.ts` e log estruturado em JSON. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.3`: Criar rotas `/health`, `/ready` e exportação de métricas `/metrics`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.4`: Criar middlewares de segurança `cors.ts` e `security-headers.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.5`: Criar middleware de limitação de taxa `rate-limit.ts` com baldes dedicados. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.6`: Configurar encerramento gracioso (`SIGTERM`) e `trust proxy` em `server.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.1`: Configurar Multer em `src/config/upload.ts` com validação de tipos MIME e limite de 2 MB. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.2`: Criar controller de upload de fotos de perfil `avatar-controller.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.3`: Criar serviço de envio de e-mails transacionais assíncronos `mail-service.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.4`: Implementar fluxo de verificação de conta `GET /auth/verify` com token temporário. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.5`: Criar barramento de eventos em tempo real `events-service.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.6`: Criar endpoint Server-Sent Events `GET /events` emitindo mutações de tarefas. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.7`: Criar serviço de medição de latência `ping-service.ts` com `execFile` seguro. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.8`: Criar rota `GET /ping` com limitação estrita e validação de hostname. *(Assignee: `luiz.chaves`)*

### Sprint 6 · Suíte de Testes, Empacotamento Docker e Extensão de Tags
- `[x]` `TK12.1`: Criar testes de autenticação e integridade de senhas `auth-router.test.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.2`: Criar testes de integração de rotas com isolamento por usuário `task-router.test.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.3`: Criar testes unitários para o analisador de saída do ping `ping-service.test.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.4`: Criar `Dockerfile` multi-estágio com usuário sem privilégio e `HEALTHCHECK`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.5`: Configurar `.dockerignore` excluindo segredos e dependências locais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.6`: Criar `compose.yaml` com injeção de variáveis e volumes persistentes. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.7`: Criar testes unitários de cookies e cabeçalhos malformados. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK22.1`: Ampliar schema de tarefas para criação de tags sob demanda. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK22.2`: Atualizar model com `connectOrCreate` para associação dinâmica de tags. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK22.3`: Atualizar contrato OpenAPI documentando campos de tags. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK22.4`: Escrever testes de integração para o ciclo completo de tags na API. *(Assignee: `luiz.chaves`)*
