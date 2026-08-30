---
title: 'InvestApp: Trilha Prática & Backlog'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# InvestApp: Trilha Prática & Backlog

## Épicos e Decomposição (EP ➔ FT ➔ US ➔ CA & TK)

### EP01 Experiência e Carteira
- FT01 Telas do sistema (Etapa 1 - Front static)
  - US01 Conhecer o sistema antes de usá-lo
    - Critérios de Aceitação (CA)
      - CA01.1 Sem servidor
      - CA01.2 Links navegáveis
      - CA01.3 Atributos name
      - CA01.4 Sem JS
    - Tasks de Implementação (TK)
      - TK01.1 `index.html`
      - TK01.2 `components.css`
      - TK01.3 `signup.html`
      - TK01.4 `signin.html`
      - TK01.5 `profile.html`
- FT02 CRUD de investimentos (Etapa 2 - API em memória)
  - US02 Manter a carteira pela aplicação
    - Critérios de Aceitação (CA)
      - CA02.1 Listar investimentos
      - CA02.2 Filtro por nome
      - CA02.3 POST 201 com id
      - CA02.4 Validação value 400
      - CA02.5 ID inexistente 404
      - CA02.6 DELETE 204
      - CA02.7 Fetch no front
      - CA02.8 Reset no restart
    - Tasks de Implementação (TK)
      - TK02.1 Server Express
      - TK02.2 Array em memória
      - TK02.3 Rotas CRUD
      - TK02.4 `api.js` com `fetch`
      - TK02.5 `requests.http`
      - TK02.6 CSS compilado pelo Tailwind
- FT03 Classificação da carteira (Etapa 7 - Prisma ORM)
  - US07 Enxergar distribuição do patrimônio
    - Critérios de Aceitação (CA)
      - CA07.1 `prisma migrate deploy`
      - CA07.2 Include category/broker
      - CA07.3 Auto-criação corretora
      - CA07.4 FK inexistente 400
      - CA07.5 Versionamento
    - Tasks de Implementação (TK)
      - TK07.1 `schema.prisma`
      - TK07.2 Singleton Prisma
      - TK07.3 Model Prisma
      - TK07.4 Remoção SQL cru
      - TK07.5 Recursos Category e Broker
      - TK07.6 Categoria e corretora no front

### EP02 Identidade e Acesso
- FT04 Cadastro de investidor (Etapa 8 - User)
  - US08 Ter uma carteira própria
    - Critérios de Aceitação (CA)
      - CA08.1 `POST /api/users` 201
      - CA08.2 E-mail duplicado 409
      - CA08.3 Confirmação de senha 400
      - CA08.4 Hash `$argon2id$`
      - CA08.5 Salts individuais
      - CA08.6 Redirect para signin
    - Tasks de Implementação (TK)
      - TK08.1 Schema `User`
      - TK08.2 Util Argon2id
      - TK08.3 Rota `POST /users`
      - TK08.4 Form `signup.js`
      - TK08.5 `userId` no investimento
- FT05 Login, sessão e isolamento (Etapa 9 - Autenticação)
  - US09 Entrar no sistema
    - Critérios de Aceitação (CA)
      - CA09.1 `POST /api/signin` JWT
      - CA09.2 Mensagem única 401
      - CA09.3 Header ausente 401
      - CA09.4 Token adulterado 401
      - CA09.5 Token no `localStorage`
    - Tasks de Implementação (TK)
      - TK09.1 Util JWT & Auth middleware
      - TK09.2 Rota `POST /signin`
      - TK09.4 Front com Auth header
      - TK09.5 Rotas protegidas e `/users/me`
  - US10 Ver apenas a minha carteira
    - Critérios de Aceitação (CA)
      - CA10.1 Carteira isolada por dono
      - CA10.2 Recurso de outro dono 404
      - CA10.3 Delete de outro dono 404
      - CA10.4 `userId` oriundo do token
    - Tasks de Implementação (TK)
      - TK09.3 Query escopada por `userId`
- FT06 Recuperação de senha (Backlog)
  - US15 Solicitar recuperação de senha
    - Critérios de Aceitação (CA)
      - CA15.1 Entrada de e-mail
      - CA15.2 Envio de link de reset
      - CA15.3 Expiração do token
    - Tasks de Implementação (TK)
      - TK15.1 Endpoint `/password-reset`
      - TK15.2 Mailer de recuperação
      - TK15.3 Tabela de tokens
      - TK15.4 Tela de reset
      - TK15.5 Suíte de testes

### EP03 Perfil e Notificações
- FT07 E-mail de boas-vindas (Etapa 10 - E-mail)
  - US11 Confirmar criação de conta
    - Critérios de Aceitação (CA)
      - CA11.1 Envios de boas-vindas
      - CA11.2 Sem e-mail em erro 409
      - CA11.3 URL prévia em dev
      - CA11.4 Formato HTML e Texto
      - CA11.5 Resiliência a falhas SMTP
      - CA11.6 Desacoplamento Nodemailer
    - Tasks de Implementação (TK)
      - TK10.1 Serviço Nodemailer
      - TK10.2 Configuração SMTP
      - TK10.3 Trigger no cadastro
      - TK10.4 Retorno ao usuário no front
- FT08 Avatar do perfil (Etapa 11 - Upload)
  - US12 Personalizar foto do perfil
    - Critérios de Aceitação (CA)
      - CA12.1 Token obrigatório 401
      - CA12.2 Upload PNG/JPG 201
      - CA12.3 Exibição do avatar público
      - CA12.4 Limite 2MB 400
      - CA12.5 Validação MIME type 400
      - CA12.6 Nomes únicos de arquivo
      - CA12.7 Subscrição de imagem
    - Tasks de Implementação (TK)
      - TK11.1 Configuração Multer
      - TK11.2 Rotas `POST/PUT /image`
      - TK11.3 Model Image
      - TK11.4 Form `profile.js`
      - TK11.5 Avatar no resto da aplicação

### EP04 Fundação Técnica
- FT09 Arquitetura em camadas e tipos (Etapa 3 - TS)
  - US03 Mudar o código sem medo
    - Critérios de Aceitação (CA)
      - CA03.1 `npm run typecheck`
      - CA03.2 Sem `.js` em `src/`
      - CA03.3 Roteador limpo
      - CA03.4 Desacoplamento
      - CA03.5 `errorHandler`
      - CA03.6 Compatibilidade HTTP
    - Tasks de Implementação (TK)
      - TK03.1 `tsconfig.json`
      - TK03.2 Entrypoint TS
      - TK03.3 Interfaces TS
      - TK03.4 Model assíncrono
      - TK03.5 Controller HTTP
      - TK03.6 `HttpError.ts`
      - TK03.7 Router modular
- FT10 Validação de entrada (Etapa 4 - Validação)
  - US04 Saber exatamente o que corrigir
    - Critérios de Aceitação (CA)
      - CA04.1 Issues Zod (400)
      - CA04.2 Path body/params/query
      - CA04.3 Validação de ID 400
      - CA04.4 UUID inexistente 404
      - CA04.5 Query vazia 400
      - CA04.6 Sem `if` em controllers
    - Tasks de Implementação (TK)
      - TK04.1 Middleware Zod
      - TK04.2 Schemas Zod
- FT11 Documentação da API (Etapa 5 - Documentação)
  - US05 Integrar sem ler o código
    - Critérios de Aceitação (CA)
      - CA05.1 `/api/docs`
      - CA05.2 `/api/openapi.json`
      - CA05.3 Sincronia com schema
      - CA05.4 Atualização automática
      - CA05.5 Sem alterar código
    - Tasks de Implementação (TK)
      - TK05.1 Generator OpenAPI
      - TK05.2 Rota Swagger UI
- FT12 Persistência de dados (Etapa 6 - SQLite)
  - US06 Não perder carteira ao fechar sistema
    - Critérios de Aceitação (CA)
      - CA06.1 `npm run db:load`
      - CA06.2 Persistência SQLite
      - CA06.3 SQL parametrizado (`?`)
      - CA06.4 UUIDs mantidos
      - CA06.5 Controllers intactos
    - Tasks de Implementação (TK)
      - TK06.1 Driver `node:sqlite`
      - TK06.2 Migration & Seeders
      - TK06.3 Model SQL

### EP05 Qualidade e Operação
- FT13 Suíte de testes e cobertura (Etapa 12 - Testes)
  - US13 Alterar sem quebrar o existente
    - Critérios de Aceitação (CA)
      - CA13.1 `npm test` isolado
      - CA13.2 Front test em JSDOM
      - CA13.3 Idempotência nos testes
      - CA13.4 Threshold de cobertura
      - CA13.5 Teste de isolamento por dono
      - CA13.6 Export `app` no index
    - Tasks de Implementação (TK)
      - TK12.1 Testes unitários
      - TK12.2 Testes com `supertest`
      - TK12.3 Testes de front no Vitest
      - TK12.4 Testes E2E Playwright
      - TK12.5 `playwright.config.js`
- FT14 Empacotamento e deploy (Etapa 13 - Docker)
  - US14 Subir aplicação em qualquer máquina
    - Critérios de Aceitação (CA)
      - CA14.1 `docker compose up`
      - CA14.2 Auto-migrations
      - CA14.3 Env vars via Compose
      - CA14.4 Usuário não-root (`node`)
      - CA14.5 Persistência via volumes
      - CA14.6 Clean com `down -v`
      - CA14.7 Aplicação sem alterações
    - Tasks de Implementação (TK)
      - TK13.1 `Dockerfile` multi-stage
      - TK13.2 `.dockerignore`
      - TK13.3 `compose.yaml`
      - TK13.4 Volumes nomeados

## Etapas de Construção (Visão Sequencial da Trilha)

### Etapas 1 a 4 (Front, API & Validação)
- 1. Front estático (HTML/Tailwind)
- 2. API em memória (Express)
- 3. TypeScript (Camadas e tipos)
- 4. Validação Zod (Query/Body/Params)

### Etapas 5 a 8 (Docs, DB & Usuário)
- 5. OpenAPI / Swagger
- 6. SQLite nativo (node:sqlite)
- 7. Prisma ORM (Category & Broker)
- 8. Cadastro de Usuário (Argon2id)

### Etapas 9 a 13 (Auth, Mídia, Testes & Docker)
- 9. JWT & Escopo de Carteira
- 10. E-mail Nodemailer (Boas-vindas)
- 11. Upload Multer (Avatar)
- 12. Suíte de Testes (Vitest & Playwright)
- 13. Containerização Docker Compose
