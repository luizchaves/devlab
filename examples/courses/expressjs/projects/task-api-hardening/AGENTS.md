# AGENTS.md — TaskAPI

Instruções e diretrizes operacionais para agentes e assistentes de Inteligência Artificial que trabalham no desenvolvimento, manutenção e evolução da **TaskAPI**.

O arquivo [`docs/PRD.md`](docs/PRD.md) é a **fonte da verdade de requisitos e produto**, contendo todos os épicos, features, histórias de usuário (`US`), critérios de aceitação (`CA`) e tasks técnicas (`TK`). Este documento estabelece **como trabalhar no código**: regras invioláveis, fluxo orientado a especificações, convenções arquiteturais, stack e padrões de entrega.

---

## 1. O que é a TaskAPI

A **TaskAPI** é o projeto modelo de referência do Guia de Express.js. É uma **API RESTful pura**, sem front-end, construída em 12 etapas cumulativas e incrementais (do servidor básico em arquivo único até testes com Supertest e contêiner Docker).

| Dimensão | Especificação |
| -------- | ------------- |
| Runtime | Node.js 22+ (módulos ES `"type": "module"`) |
| Framework | Express 5 (com roteamento assíncrono nativo) |
| Linguagem | JavaScript (etapas 1-3) e TypeScript nativo estrito (etapas 4-12) |
| Execução TS | Nativa pelo Node.js, sem `tsx`, sem bundlers e sem build intermediário |
| Validação | Zod (`strictObject`, `coerce`, parsing de 5 fontes) |
| Banco de Dados | SQLite via `node:sqlite` nativo (etapa 7) e Prisma 7 ORM (etapa 8+) |
| Autenticação | `node:crypto` nativo (Argon2id + JWT HS256) sem dependências externas |
| Documentação | OpenAPI 3.0 dinâmico via Swagger UI (`/docs` e `/openapi.json`) |
| Qualidade | Biome (`lint`, `format`, `lint:fix`) e `node:test` + Supertest |

---

## 2. Regras Invioláveis

1. **Zero dependências externas desnecessárias**:
   - **Autenticação**: Não instale `bcrypt`, `argon2`, `jsonwebtoken` ou `passport`. Utilize `node:crypto` nativo (`scryptSync` / Argon2id e HMAC-SHA256).
   - **Variáveis de ambiente**: Não instale `dotenv`. Utilize o suporte nativo do Node.js (`--env-file=.env`).
   - **Tratamento assíncrono**: Não instale `express-async-errors`. O Express 5 encaminha automaticamente rejeições de Promises para o `errorHandler`.
   - **Cookies**: Não instale `cookie-parser`. Utilize a função interna `parseCookies` do projeto.
2. **Separação estrita de camadas (MVC)**:
   - **Rotas (`routes/`)**: Apenas mapeiam caminhos HTTP e middlewares para métodos de controllers. Proibido conter lógica de negócio ou queries de banco.
   - **Controllers (`controllers/`)**: Tratam requisição/resposta, leem dados validados de `req.valid` e delegam para models/services. Não executam SQL/Prisma diretamente.
   - **Models (`models/`)**: Manipulam exclusivamente dados e persistência. Proibido acessar objetos `req`, `res` ou emitir status HTTP.
   - **Middlewares (`middlewares/`)**: Funções reutilizáveis na cadeia de requisição (validação, autenticação, logging, tratamento de erro).
3. **Validação de fronteira obrigatória**:
   - Todo input recebido da rede (`body`, `query`, `params`, `headers`, `cookies`) deve ser validado via schemas Zod através do middleware `validate()`.
   - O controlador consome dados saneados exclusivamente de `req.valid`.
4. **Tratamento de erros centralizado**:
   - Erros operacionais conhecidos devem lançar instâncias de `HttpError(status, message, issues?)`.
   - O middleware `errorHandler` (4 parâmetros) deve ser o último da cadeia, garantindo respostas de erro uniformes no formato `{ "error": { "status": number, "message": string, "issues"?: Array } }`.
5. **Isolamento absoluto de dados por usuário**:
   - Nenhuma consulta ou mutação de dados pode ser executada sem filtrar pelo `userId` extraído do token JWT autenticado (`req.auth.sub`).
   - Acesso a recursos pertencentes a outro usuário deve responder `404 Not Found` (nunca `403`), evitando confirmar a existência de dados alheios.
6. **Convenções de Idioma**:
   - **Inglês**: Nomes de variáveis, funções, classes, arquivos, rotas, tipos, especificações (`specs/`) e mensagens de commit.
   - **Português do Brasil**: Comentários didáticos no código, documentação de requisitos (`docs/PRD.md`) e mensagens de erro voltadas ao usuário final.

---

## 3. Comandos e Scripts de Automação

Utilize sempre `pnpm` para execução de comandos:

| Comando | O que faz |
| ------- | --------- |
| `pnpm dev` | Inicia o servidor em modo de desenvolvimento com hot-reload (`--watch`) |
| `pnpm start` | Inicia o servidor em modo de produção |
| `pnpm lint` | Executa a verificação estática de regras e código com o Biome (`biome check .`) |
| `pnpm format` | Formata automaticamente todos os arquivos do projeto (`biome format --write .`) |
| `pnpm lint:fix` | Aplica formatação e correções automáticas de lint em uma única passagem |
| `pnpm typecheck` | Executa a checagem estrita de tipos com TypeScript (`tsc --noEmit`) *(a partir da etapa 4)* |
| `pnpm test` | Executa a suíte de testes automatizados com `node:test` e Supertest *(etapa 12)* |
| `pnpm db:migrate` | Aplica migrações pendentes no banco de dados SQLite |
| `pnpm db:seed` | Executa o povoamento idempotente de dados iniciais |
| `pnpm db:reset` | Recria o banco de dados do zero aplicando migrações e seeds |

---

## 4. Mapa da Arquitetura e Diretórios

```
task-api-hello/
├── .agents/
│   └── skills/
│       ├── task-spec-generator/     # Skill de IA para geração de specs técnicas
│       │   └── SKILL.md
│       └── task-pr-finalizer/       # Skill de IA para finalização, commit e criação de PR
│           └── SKILL.md
├── docs/
│   └── PRD.md                       # Especificação completa de requisitos e backlog
├── specs/
│   ├── active/                      # Especificações técnicas de tasks em andamento
│   └── archived/                    # Especificações técnicas concluídas e validadas
├── src/
│   ├── config/                      # Schemas de ambiente e upload (Zod)
│   ├── controllers/                 # Handlers HTTP de cada recurso
│   ├── database/                    # Conexão SQLite / Prisma Client e seeds
│   ├── errors/                      # Classe HttpError e catálogo de falhas
│   ├── middlewares/                 # Middlewares (validate, auth, logger, error)
│   ├── models/                      # Camada de persistência e acesso a dados
│   ├── routes/                      # Roteadores modulares da API
│   ├── schemas/                     # Schemas Zod de validação de input
│   ├── services/                    # Serviços auxiliares (e-mail, eventos SSE, ping)
│   ├── types/                       # Interfaces e tipos TypeScript de domínio
│   └── server.js                    # Entrypoint da aplicação Express
├── tests/                           # Suíte de testes automatizados com node:test
├── .github/
│   └── pull_request_template.md     # Template padrão para Pull Requests
├── AGENTS.md                        # Este guia de governança para agentes de IA
├── biome.json                       # Configuração do linter e formatador Biome
├── package.json                     # Scripts, dependências e subpath imports (#*)
├── README.md                        # Documentação e onboarding do projeto
├── requests.http                    # Catálogo de requisições HTTP executáveis
└── tsconfig.json                    # Configuração estrita do TypeScript nativo
```

---

## 5. Fluxo de Desenvolvimento Orientado a Specs (Spec-Driven Development)

Toda implementação técnica de tarefas segue obrigatoriamente este fluxo de 5 etapas:

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
Localize a task a ser implementada no `docs/PRD.md` pelo seu código identificador (ex: `TK01.2`, `TK05.1`, `TK09.3`). Identifique a User Story (`US`), os Critérios de Aceitação (`CA`) e os arquivos envolvidos.

### Etapa 2 · Criação de Branch e Elaboração da Spec Técnica
Utilize a skill [`.agents/skills/task-spec-generator/SKILL.md`](.agents/skills/task-spec-generator/SKILL.md) para:
1. Criar e alternar para a branch dedicada da task:
   ```bash
   git checkout -b feat/tkXX-Y-<task-name>
   ```
2. Gerar a spec técnica detalhada no caminho: `specs/active/spec-TKXX.Y-<task-name>.md`

A spec deve conter:
- Cabeçalho com Task ID, Branch, US relacionada, status e data.
- Contexto e objetivos verificáveis.
- Checklist de critérios de aceitação em formato Gherkin (Dado/Quando/Então).
- Lista de arquivos criados/modificados com a proposta de código.
- Comandos de teste e passos de validação.

### Etapa 3 · Implementação Incremental
Escreva o código na branch da tarefa estritamente aderente à spec aprovada, respeitando a separação de camadas e a tipagem estrita.

### Etapa 4 · Validação, Qualidade e Build
Execute a suíte de qualidade e garanta que não há erros de build:
```bash
pnpm check && pnpm format
pnpm build # a aplicação não deve apresentar erros de compilação ou build
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

- Utilize o padrão **Conventional Commits** exclusivamente em **inglês**.
- Inclua a tag da task técnica no escopo ou mensagem do commit.

### Prefixos Válidos
- `feat: [TKXX.Y] <description>` — Nova funcionalidade, endpoint ou rota.
- `fix: [TKXX.Y] <description>` — Correção de bug, falha de validação ou erro de contrato.
- `docs: [TKXX.Y] <description>` — Atualização de documentação, `PRD.md`, `AGENTS.md` ou specs.
- `refactor: [TKXX.Y] <description>` — Reestruturação interna de código sem alteração de comportamento externo.
- `test: [TKXX.Y] <description>` — Adição ou ajuste de testes automatizados.
- `chore: [TKXX.Y] <description>` — Manutenção de configurações, linter ou scripts do `package.json`.

**Exemplos**:
- `feat: [TK01.2] implement health check route and express server`
- `feat: [TK05.1] add zod schemas for task validation and pagination`
- `test: [TK12.2] add integration tests for user task isolation`
- `docs: [TK01.1] finalize project prd and agents governance guide`
