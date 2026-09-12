# AGENTS.md — InvestApp

Instruções e diretrizes operacionais para agentes e assistentes de Inteligência Artificial que trabalham no desenvolvimento, manutenção e evolução do **InvestApp**.

O arquivo [`docs/PRD.md`](docs/PRD.md) é a **fonte da verdade de requisitos e produto**, contendo todos os épicos, features, histórias de usuário (`US`), critérios de aceitação (`CA`) e tasks técnicas (`TK`). Este documento estabelece **como trabalhar no código**: regras invioláveis, fluxo orientado a especificações, arquitetura de camadas, stack e padrões de entrega.

---

## 1. O que é o InvestApp

O **InvestApp** é uma aplicação web full-stack para gestão visual e acompanhamento de carteiras de investimentos pessoais. O projeto é desenvolvido ao longo de 13 etapas cumulativas:
- **Camada 1 (Front-end)**: Telas HTML semânticas navegáveis estilizadas com Tailwind CSS.
- **Camada 2 (Servidor & Estáticos)**: Servidor Express que serve os próprios arquivos estáticos do front-end (`express.static`), eliminando a necessidade de configuração de CORS.
- **Camada 3 (API REST & Persistência)**: Endpoints RESTful sob o prefixo `/api`, com TypeScript, validação Zod, banco SQLite/Prisma ORM, upload de avatares e envio de e-mails transacionais.

| Dimensão | Especificação |
| -------- | ------------- |
| Runtime | Node.js 22+ (módulos ES `"type": "module"`) |
| Front-end | HTML5 semântico, Tailwind CSS, JavaScript modular (`public/js/`) |
| Back-end | Express 5 com TypeScript estrito |
| Validação | Zod (`body`, `query`, `params`, `headers`, `cookies`) |
| Banco de Dados | SQLite via driver nativo (etapa 6) e Prisma ORM (etapa 7+) |
| Autenticação | Hash Argon2id e JWT (HS256) nativos com `node:crypto` |
| Upload & Mail | Multer para imagens multipart e Nodemailer para mensagens transacionais |
| Testes | Vitest/JSDOM no front, Supertest nas rotas e Playwright para E2E |
| Qualidade | Biome (`lint`, `format`, `lint:fix`) |

---

## 2. Regras Invioláveis

1. **Mesma Origem sem CORS**:
   - O servidor Express entrega as páginas estáticas do front-end (`express.static`). Todas as chamadas `fetch` do cliente disparam para a rota relativa `/api/...` na **mesma origem**. Não adicione middleware de CORS a menos que seja explicitamente solicitado para clientes externos.
2. **Zero dependências externas desnecessárias no core**:
   - **Autenticação**: Não instale `bcrypt`, `jsonwebtoken` ou `passport`. Utilize `node:crypto` nativo para Argon2id e assinatura de JWT.
   - **Ambiente**: Utilize `--env-file=.env` nativo do Node.js sem instalar `dotenv`.
   - **Tratamento de erros assíncronos**: Express 5 encaminha rejeições nativamente sem `express-async-errors`.
   - **Cookies**: Utilize o utilitário interno `parseCookies`.
3. **Separação estrita de camadas no backend**:
   - **Rotas (`routes/`)**: Apenas mapeiam caminhos HTTP e associam middlewares aos controllers.
   - **Controllers (`controllers/`)**: Gerenciam requisição/resposta, consomem dados de `req.valid` e invocam models/services.
   - **Models (`models/`)**: Manipulam exclusivamente regras de persistência (SQL ou Prisma Client), sem conhecer `req` ou `res`.
   - **Middlewares (`middlewares/`)**: Funções reutilizáveis para autenticação (`isAuthenticated`), validação (`validate`) e erros (`errorHandler`).
4. **Validação de fronteira com Zod**:
   - Todos os dados recebidos via rede devem ser validados por schemas Zod antes do controller.
   - Respostas de erro de validação devem retornar status `400 Bad Request` com o array detalhado de `issues`.
5. **Isolamento de carteira por investidor**:
   - Toda operação de leitura, alteração ou exclusão de ativos (`Investment`) deve filtrar estritamente pelo `userId` do token autenticado (`req.userId`).
   - Acesso a investimentos de outros usuários deve responder `404 Not Found` (nunca `403`), prevenindo vazamento de inventário.
6. **Segurança no Upload de Avatares**:
   - Limite máximo estrito de 2 MB por arquivo.
   - Validação MIME type estrita (apenas PNG, JPEG e GIF permitidos).
   - Nomes de arquivos gravados no disco gerados exclusivamente como UUID v4 pelo servidor.
7. **Convenções de Idioma**:
   - **Inglês**: Nomes de variáveis, funções, classes, arquivos, rotas, tipos, especificações (`specs/`) e mensagens de commit.
   - **Português do Brasil**: Conteúdo visual das páginas HTML, documentação de requisitos (`docs/PRD.md`), textos de interface e mensagens ao usuário.

---

## 3. Comandos e Scripts de Automação

Utilize sempre `pnpm` para execução de comandos:

| Comando | O que faz |
| ------- | --------- |
| `pnpm dev` | Inicia o servidor local de desenvolvimento |
| `pnpm build` | Compila artefatos de produção e otimiza assets |
| `pnpm preview` | Pré-visualiza localmente o build de produção |
| `pnpm lint` | Executa a checagem estática com o Biome (`biome check .`) |
| `pnpm format` | Formata automaticamente arquivos do projeto (`biome format --write .`) |
| `pnpm lint:fix` | Aplica correções automáticas de lint e formatação em uma única passagem |
| `pnpm typecheck` | Executa a verificação estrita de tipos com TypeScript (`tsc --noEmit`) *(etapa 3+)* |
| `pnpm test` | Executa os testes de backend e rotas via Supertest |
| `pnpm test:front` | Executa os testes de componentes e lógica front-end no Vitest com JSDOM |
| `pnpm test:e2e` | Executa a suíte de testes de ponta a ponta com Playwright |
| `pnpm db:load` | Inicializa o banco SQLite executando migrações e sementes iniciais |

---

## 4. Mapa da Arquitetura e Diretórios

```
invest-app-static/
├── .agents/
│   └── skills/
│       ├── task-spec-generator/     # Skill de IA para geração de specs técnicas
│       │   └── SKILL.md
│       └── task-pr-finalizer/       # Skill de IA para finalização, commit e criação de PR
│           └── SKILL.md
├── css/
│   └── components.css               # Vocabulário visual reutilizável do produto
├── docs/
│   └── PRD.md                       # Especificação completa de requisitos e backlog
├── public/
│   ├── css/                         # Folhas de estilo compiladas
│   ├── imgs/                        # Assets estáticos (avatar padrão, logotipos)
│   └── js/                          # Lógica client-side (services/api.js, signup.js)
├── specs/
│   ├── active/                      # Especificações de tasks em andamento
│   └── archived/                    # Especificações de tasks concluídas e aprovadas
├── src/
│   ├── config/                      # Configurações de upload (Multer) e SMTP (Nodemailer)
│   ├── controllers/                 # Controladores HTTP de investimentos, usuários e auth
│   ├── database/                    # Conexão SQLite / Prisma Client e seeders
│   ├── errors/                      # Classe HttpError e catálogo de erros
│   ├── middlewares/                 # Middlewares validate, isAuthenticated, errorHandler
│   ├── models/                      # Camada de dados (Investment, User, Category, Broker)
│   ├── routes/                      # Roteadores modulares da API REST
│   ├── schemas/                     # Schemas Zod de validação
│   ├── services/                    # Serviços externos (SendMail para e-mails)
│   └── types/                       # Tipos e interfaces TypeScript
├── tests/                           # Suíte de testes E2E com Playwright
├── .github/
│   └── pull_request_template.md     # Template padrão para Pull Requests
├── index.html                       # Dashboard principal da carteira
├── profile.html                     # Painel de perfil do investidor e avatar
├── signin.html                      # Tela de login
├── signup.html                      # Tela de cadastro
├── AGENTS.md                        # Este guia de governança para agentes de IA
├── biome.json                       # Configuração do linter e formatador Biome
├── package.json                     # Scripts, dependências e configurações
└── README.md                        # Guia de onboarding e execução
```

---

## 5. Fluxo de Desenvolvimento Orientado a Specs (Spec-Driven Development)

Toda tarefa técnica de desenvolvimento segue o fluxo padronizado de 5 etapas:

```
[docs/PRD.md] ─(Consulta TKXX.Y)─> [.agents/skills/task-spec-generator]
                                              │
                                              ▼ (Cria branch feat/tkXX-Y-*)
[Validação & Testes] <── [Codificação] <── [specs/active/spec-TKXX.Y-*.md]
        │
        ▼
[.agents/skills/task-pr-finalizer] ──> [specs/archived/ & gh pr create]
```

### Etapa 1 · Consulta ao Backlog
Localize a tarefa técnica no `docs/PRD.md` pelo seu código identificador (ex: `TK01.2`, `TK07.3`, `TK11.1`). Identifique a User Story (`US`), os Critérios de Aceitação (`CA`) e os arquivos a serem criados/modificados.

### Etapa 2 · Criação de Branch e Elaboração da Spec Técnica
Acione a skill [`.agents/skills/task-spec-generator/SKILL.md`](.agents/skills/task-spec-generator/SKILL.md) para:
1. Criar e alternar para a branch dedicada da task:
   ```bash
   git checkout -b feat/tkXX-Y-<task-name>
   ```
2. Gerar o documento técnico em: `specs/active/spec-TKXX.Y-<task-name>.md`

A spec deve conter:
- Metadados: Task ID, Branch, US correspondente, status e data.
- Contexto da funcionalidade e metas observáveis.
- Critérios de Aceitação em formato Gherkin (Dado/Quando/Então).
- Arquitetura proposta e lista de alterações no código.
- Roteiro de execução incremental e comandos de validação.

### Etapa 3 · Implementação Incremental
Codifique as alterações na branch dedicada respeitando rigorosamente a separação entre camadas de apresentação (front), controle (controllers) e domínio/persistência (models).

### Etapa 4 · Validação, Qualidade e Build
Execute as verificações de qualidade e garanta que não há erros de build:
```bash
pnpm check && pnpm format
pnpm build # o projeto não deve apresentar erros de build
pnpm test  # quando aplicável
```

### Etapa 5 · Arquivamento, Commit e Pull Request Rico
Utilize a skill [`.agents/skills/task-pr-finalizer/SKILL.md`](.agents/skills/task-pr-finalizer/SKILL.md) para automatizar a finalização:
1. Mover a especificação para `specs/archived/`:
   ```bash
   git mv specs/active/spec-TKXX.Y-<task-name>.md specs/archived/
   ```
2. Realizar o commit atômico referenciando o ID da task (`feat: [TKXX.Y] ...`).
3. Enviar a branch (`git push -u origin <branch-name>`).
4. Gerar e abrir o Pull Request rico com o template padrão via GitHub CLI:
   ```bash
   gh pr create --base main --head <branch-name> --title "feat: [TKXX.Y] <título em inglês>" --body "<corpo-formatado>"
   ```

---

## 6. Padrões de Commits e Mensagens

- Padrão **Conventional Commits** exclusivamente em **inglês**.
- Inclua a tag da task técnica no escopo da mensagem.

### Prefixos Válidos
- `feat: [TKXX.Y] <description>` — Nova funcionalidade, tela, endpoint ou migration.
- `fix: [TKXX.Y] <description>` — Correção de bug, falha de validação ou layout quebrado.
- `docs: [TKXX.Y] <description>` — Alterações no `PRD.md`, `AGENTS.md`, documentação ou specs.
- `refactor: [TKXX.Y] <description>` — Refatoração interna de código ou migração de camadas.
- `test: [TKXX.Y] <description>` — Adição ou ajuste de testes unitários, de rotas ou E2E.
- `chore: [TKXX.Y] <description>` — Manutenção de configurações, dependências ou scripts.

**Exemplos**:
- `feat: [TK01.1] setup project governance, linter and base templates`
- `feat: [TK07.3] migrate investment model to prisma orm`
- `test: [TK12.4] add playwright e2e tests for investment creation flow`
- `docs: [TK01.1] add full product requirements document and ai guidelines`
