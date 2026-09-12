# Planejamento de Sprints — InvestApp

Planejamento ágil de sprints e alocação de capacidade para as **67 tasks técnicas** do **InvestApp**, cobrindo as 13 etapas cumulativas e as features de recuperação de senha do backlog, com 100% das tarefas atribuídas ao desenvolvedor e mantenedor **luiz.chaves**.

---

## 1. Visão Geral do Modelo de Sprints

O desenvolvimento do InvestApp é estruturado em **seis sprints quinzenais**, distribuindo as tarefas entre interface web (Tailwind CSS, Vite), API RESTful em TypeScript, persistência com Prisma ORM, serviços e empacotamento com Docker.

### Parâmetros da Simulação
- **Ciclo por Sprint**: 2 semanas (10 dias úteis).
- **Responsável Técnico / Assignee**: `luiz.chaves`.
- **Estimativa Total**: 205 Story Points (média de 34 SP por sprint).
- **Critério de Aceite da Sprint**: `pnpm validate` com 0 erros e 100% dos cenários Gherkin validados.

---

## 2. Resumo das Sprints

| Sprint | Meta e Foco da Entrega | Etapas e Features | Tasks Alocadas | Qtd. Tasks | Estimativa | Responsável | Status |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| **Sprint 1** | Design system, telas estáticas e API Express em memória | Etapa 1 (`FT01`)<br/>Etapa 2 (`FT02`) | `TK01.1`–`TK01.5`<br/>`TK02.1`–`TK02.6` | 11 tasks | 33 SP | `luiz.chaves` | Concluída |
| **Sprint 2** | Arquitetura em camadas, TypeScript e validação Zod | Etapa 3 (`FT09`)<br/>Etapa 4 (`FT10`) | `TK03.1`–`TK03.7`<br/>`TK04.1`–`TK04.3` | 10 tasks | 30 SP | `luiz.chaves` | Concluída |
| **Sprint 3** | Swagger UI, SQLite nativo e relações com Prisma ORM | Etapa 5 (`FT11`)<br/>Etapa 6 (`FT12`)<br/>Etapa 7 (`FT03`) | `TK05.1`–`TK05.2`<br/>`TK06.1`–`TK06.3`<br/>`TK07.1`–`TK07.6` | 11 tasks | 35 SP | `luiz.chaves` | Concluída |
| **Sprint 4** | Cadastro de investidores, Argon2id e JWT com isolamento | Etapa 8 (`FT04`)<br/>Etapa 9 (`FT05`) | `TK08.1`–`TK08.5`<br/>`TK09.1`–`TK09.6` | 11 tasks | 35 SP | `luiz.chaves` | Concluída |
| **Sprint 5** | E-mail transacional e upload de foto de perfil | Etapa 10 (`FT07`)<br/>Etapa 11 (`FT08`) | `TK10.1`–`TK10.4`<br/>`TK11.1`–`TK11.5` | 9 tasks | 27 SP | `luiz.chaves` | Concluída |
| **Sprint 6** | Suíte de testes, Docker Compose e recuperação de senha | Etapa 12 (`FT13`)<br/>Etapa 13 (`FT14`)<br/>Backlog (`FT06`) | `TK12.1`–`TK12.6`<br/>`TK13.1`–`TK13.4`<br/>`TK15.1`–`TK15.5` | 15 tasks | 45 SP | `luiz.chaves` | 10 Concl. / 5 Backlog |

---

## 3. Detalhamento das Tasks por Sprint

### Sprint 1 · Design System, Telas Estáticas e API em Memória
- `[x]` `TK01.1`: Criar `index.html`, métricas da carteira, `docs/PRD.md`, `AGENTS.md`, `README.md`, `biome.json` e `specs/`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.2`: Criar `css/components.css` com tokens de cores e componentes visuais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.3`: Criar tela de cadastro `signup.html`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.4`: Criar tela de login `signin.html`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK01.5`: Criar tela de perfil do investidor `profile.html`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.1`: Criar servidor Express em `back/src/server.js` com Morgan e CORS. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.2`: Criar repositório em memória `back/src/data/investments.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.3`: Criar rotas CRUD RESTful para investimentos. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.4`: Criar cliente de API `front/js/services/api.js` e renderização de cartões em `index.js`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.5`: Criar catálogo de requisições HTTP `back/requests.http`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK02.6`: Configurar compilação do Tailwind via Vite no front-end. *(Assignee: `luiz.chaves`)*

### Sprint 2 · Arquitetura em Camadas, TypeScript e Validação Zod
- `[x]` `TK03.1`: Configurar `tsconfig.json` e scripts no backend. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.2`: Migrar entrypoint para `back/src/index.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.3`: Declarar interfaces `Investment` e `InvestmentInput` em `types/`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.4`: Criar model assíncrono `models/Investment.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.5`: Criar controller HTTP `controllers/investments.controller.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.6`: Criar classe tipada de erro `errors/HttpError.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK03.7`: Criar roteador modular `routes/investments.routes.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.1`: Criar middleware genérico `middlewares/validate.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.2`: Criar schemas de validação `schemas/investment.schema.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK04.3`: Criar utilitário `utils/cookies.ts` para validação de cabeçalhos e cookies. *(Assignee: `luiz.chaves`)*

### Sprint 3 · Documentação Swagger, Persistência SQLite e Prisma ORM
- `[x]` `TK05.1`: Criar gerador OpenAPI `docs/openapi.ts` acoplado aos schemas Zod. *(Assignee: `luiz.chaves`)*
- `[x]` `TK05.2`: Criar rota `/api/docs` renderizando interface Swagger UI. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.1`: Criar módulo singleton `database/database.ts` sobre `node:sqlite`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.2`: Criar scripts de migração e sementes relacionais. *(Assignee: `luiz.chaves`)*
- `[x]` `TK06.3`: Reescrever model com consultas SQL parametrizadas. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.1`: Modelar schema Prisma com `Investment`, `Category` e `Broker`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.2`: Criar client singleton Prisma e migração inicial versionada. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.3`: Reescrever model com Prisma Client e `include` de relações. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.4`: Remover camada legada de consultas manuais SQL. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.5`: Criar rotas e controllers para categorias e corretoras. *(Assignee: `luiz.chaves`)*
- `[x]` `TK07.6`: Exibir categorias e corretoras nos cartões e formulários do front. *(Assignee: `luiz.chaves`)*

### Sprint 4 · Cadastro de Investidor, Criptografia e Autenticação JWT
- `[x]` `TK08.1`: Adicionar model `User` no schema Prisma com unicidade de e-mail. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.2`: Criar utilitário `utils/password.ts` com hash Argon2id via `node:crypto`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.3`: Criar rota `POST /api/users` com validação de confirmação de senha. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.4`: Conectar formulário `front/js/signup.js` ao endpoint de cadastro. *(Assignee: `luiz.chaves`)*
- `[x]` `TK08.5`: Associar campo `userId` a todos os registros de investimentos. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.1`: Criar utilitário JWT e middleware `middlewares/isAuthenticated.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.2`: Criar rota `POST /api/signin` emitindo token assinado HS256. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.3`: Escopar todas as consultas e mutações pelo `userId` do token. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.4`: Criar `front/js/lib/auth.js` e injetar token nas requisições do front. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.5`: Proteger rotas privadas e criar endpoint `GET /api/users/me`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK09.6`: Declarar `bearerSchema` e `cookieSessionSchema` em `schemas/auth.schema.ts`. *(Assignee: `luiz.chaves`)*

### Sprint 5 · E-mail Transacional e Upload de Fotos de Perfil
- `[x]` `TK10.1`: Configurar Nodemailer e serviço de disparo de e-mails em `services/mail.ts`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.2`: Configurar parâmetros SMTP e templates de boas-vindas. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.3`: Acionar envio de boas-vindas assíncrono após cadastro do investidor. *(Assignee: `luiz.chaves`)*
- `[x]` `TK10.4`: Apresentar feedback visual de envio no front-end. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.1`: Configurar Multer com restrição de 2 MB e tipos PNG/JPEG/WebP. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.2`: Criar rotas `POST /api/images` e `PUT /api/images` para foto de perfil. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.3`: Criar model `Image` e vincular arquivo ao perfil do investidor. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.4`: Conectar formulário `profile.js` ao endpoint de upload. *(Assignee: `luiz.chaves`)*
- `[x]` `TK11.5`: Exibir avatar do usuário na barra de navegação e em todas as telas. *(Assignee: `luiz.chaves`)*

### Sprint 6 · Suíte de Testes, Deploy Docker e Recuperação de Senha
- `[x]` `TK12.1`: Escrever testes unitários de regras de negócio e schemas Zod. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.2`: Escrever testes de integração de endpoints com Supertest. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.3`: Escrever testes de componentes do front com Vitest e JSDOM. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.4`: Escrever testes end-to-end com Playwright (`invest-app.spec.js`). *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.5`: Configurar `vitest.config.js`, `playwright.config.js` e scripts no `package.json`. *(Assignee: `luiz.chaves`)*
- `[x]` `TK12.6`: Escrever testes de cookies e cabeçalhos malformados. *(Assignee: `luiz.chaves`)*
- `[x]` `TK13.1`: Criar `Dockerfile` multi-estágio da API. *(Assignee: `luiz.chaves`)*
- `[x]` `TK13.2`: Configurar `.dockerignore` para exclusão de arquivos desnecessários. *(Assignee: `luiz.chaves`)*
- `[x]` `TK13.3`: Criar `compose.yaml` com mapeamento de serviços, portas e variáveis. *(Assignee: `luiz.chaves`)*
- `[x]` `TK13.4`: Configurar volumes Docker para persistência de banco e avatares. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.1`: Criar endpoint `POST /api/password-reset` para geração de token temporário. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.2`: Criar template e serviço de envio de e-mail de recuperação de senha. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.3`: Modelar tabela `PasswordResetToken` no schema do Prisma. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.4`: Criar tela `reset-password.html` conectada ao endpoint de redefinição. *(Assignee: `luiz.chaves`)*
- `[ ]` `TK15.5`: Escrever testes unitários e de integração para o fluxo de reset de senha. *(Assignee: `luiz.chaves`)*
