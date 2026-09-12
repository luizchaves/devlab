# AGENTS.md — MonitorApp

Instruções e diretrizes operacionais para agentes e assistentes de Inteligência Artificial que trabalham no desenvolvimento, manutenção e evolução do **MonitorApp**.

O arquivo [`docs/PRD.md`](docs/PRD.md) é a **fonte da verdade de requisitos e produto**, contendo todos os épicos, features, histórias de usuário (`US`), critérios de aceitação (`CA`) e tasks técnicas (`TK`). Este documento estabelece **como trabalhar no código**: regras invioláveis, fluxo orientado a especificações, arquitetura de duas origens, stack e padrões de entrega.

---

## 1. O que é o MonitorApp

O **MonitorApp** é uma plataforma de observabilidade e monitoramento de infraestrutura em rede. O sistema permite cadastrar hosts de rede, executar pings periódicos e sob demanda, categorizar equipamentos com tags, consultar o histórico temporal de disponibilidade e transmitir medições em tempo real via Server-Sent Events (SSE).

### Arquitetura de Duas Origens
Diferente de aplicações monolíticas, o MonitorApp opera em dois processos desacoplados:
1. **Front-end (`front/`)**: Aplicação SPA em HTML, Tailwind CSS e Vite, consumindo a API sob o prefixo `/api` (via proxy em desenvolvimento e via Nginx em produção).
2. **Back-end (`back/`)**: API RESTful pura em Express 5 e TypeScript, responsável pela lógica de monitoramento, banco SQLite/Prisma, autenticação JWT e SSE.

| Dimensão | Especificação |
| -------- | ------------- |
| Runtime | Node.js 22+ (módulos ES `"type": "module"`) |
| Front-end | HTML5 semântico, Tailwind CSS, Vite, SSE client (`events.js`) |
| Back-end | Express 5 com TypeScript estrito em camadas |
| Validação | Zod (`strictObject`, `coerce`, parsing de 5 fontes) |
| Banco de Dados | SQLite via driver nativo (etapa 6) e Prisma ORM (etapa 7+) |
| Observabilidade | Chamada nativa `ping` via `execFile` e SSE (`/api/events`) |
| Autenticação | Hash Argon2id e JWT (HS256) nativos via `node:crypto` |
| Testes | Vitest/JSDOM no front, Supertest nas rotas e Playwright para E2E |
| Qualidade | Biome (`lint`, `format`, `lint:fix`) |

---

## 2. Regras Invioláveis

1. **Arquitetura de Duas Origens sem Preflight de CORS**:
   - Em desenvolvimento, o front-end utiliza o proxy configurado em `front/vite.config.js` para encaminhar chamadas `/api` ao backend.
   - Em produção, o Nginx atua como proxy reverso para `/api`.
   - O middleware `cors` no backend existe para clientes externos, mas chamadas do front principal não devem disparar preflight.
2. **Execução Segura de Comandos de Rede (`ping`)**:
   - **Proibido invocar `child_process.exec`**: O comando `ping` deve ser executado exclusivamente através de `child_process.execFile` com argumentos em array isolado.
   - **Validação estrita de endereços**: Todo endereço (`address`) deve ser validado pelo Zod antes da execução, aceitando apenas IPv4 ou nomes de domínio válidos (RFC 1035), rejeitando pontuação de shell (`;`, `&&`, `|`, espaços).
3. **Zero dependências externas desnecessárias no core**:
   - **Autenticação**: Não instale `bcrypt` nem `jsonwebtoken`. Utilize `node:crypto` para Argon2id e HMAC-SHA256.
   - **Ambiente**: Utilize `--env-file=.env` nativo do Node.js sem `dotenv`.
   - **Tratamento assíncrono**: Express 5 encaminha rejeições nativamente sem `express-async-errors`.
   - **Cookies**: Utilize o utilitário interno `parseCookies`.
4. **Gerenciamento de Conexões em Tempo Real (SSE)**:
   - Toda conexão `GET /api/events` deve manter o cabeçalho `Content-Type: text/event-stream` com `Connection: keep-alive`.
   - Fechamento de conexão (`req.on('close')`) deve obrigatoriamente remover o ouvinte da memória e limpar o intervalo de heartbeat (`clearInterval`), prevenindo vazamento de memória.
   - Eventos de ping só devem ser entregues a clientes autenticados proprietários do host correspondente.
5. **Separação estrita de camadas no backend**:
   - **Rotas (`routes/`)**: Apenas mapeiam caminhos HTTP e associam middlewares aos controllers.
   - **Controllers (`controllers/`)**: Gerenciam requisição/resposta e delegam para models/services.
   - **Models (`models/`)**: Executam persistência e consultas, sem acessar objetos `req`/`res`.
   - **Services (`services/`)**: Agendam coletas (`monitor.ts`), gerenciam barramento SSE (`events.ts`) e executam ping (`ping.ts`).
6. **Isolamento de hosts por proprietário**:
   - Nenhuma operação de leitura, alteração ou exclusão de host pode ser executada sem filtrar pelo `userId` do token autenticado (`req.userId`).
   - Acesso a hosts de outros usuários deve responder `404 Not Found` (nunca `403`).
7. **Convenções de Idioma**:
   - **Inglês**: Nomes de variáveis, funções, classes, arquivos, rotas, tipos, especificações (`specs/`) e mensagens de commit.
   - **Português do Brasil**: Conteúdo das páginas HTML, documentação de requisitos (`docs/PRD.md`), textos da interface e mensagens de erro.

---

## 3. Comandos e Scripts de Automação

Utilize sempre `pnpm` para execução de comandos:

| Comando | O que faz |
| ------- | --------- |
| `pnpm dev` | Inicia o front-end no Vite com recarregamento rápido e proxy para `/api` |
| `pnpm build` | Compila o front-end estático para distribuição em produção |
| `pnpm preview` | Pré-visualiza localmente os artefatos compilados do front-end |
| `pnpm lint` | Executa a verificação estática de regras com o Biome (`biome check .`) |
| `pnpm format` | Formata automaticamente todos os arquivos do projeto (`biome format --write .`) |
| `pnpm lint:fix` | Aplica formatação e correções automáticas em uma única passagem |
| `pnpm typecheck` | Executa a verificação estrita de tipos com TypeScript (`tsc --noEmit`) *(etapa 3+)* |
| `pnpm test` | Executa a suíte de testes de rotas da API com Supertest |
| `pnpm test:front` | Executa os testes de componentes e lógica front-end no Vitest |
| `pnpm test:e2e` | Executa testes de ponta a ponta com Playwright |
| `pnpm db:load` | Inicializa o banco de dados SQLite com migrações e dados de teste |

---

## 4. Mapa da Arquitetura e Diretórios

```
monitor-app-static/
├── .agents/
│   └── skills/
│       ├── task-spec-generator/     # Skill de IA para geração de specs técnicas
│       │   └── SKILL.md
│       └── task-pr-finalizer/       # Skill de IA para finalização, commit e criação de PR
│           └── SKILL.md
├── docs/
│   └── PRD.md                       # Especificação completa de requisitos e backlog
├── front/                           # Aplicação Front-end SPA
│   ├── css/                         # Folhas de estilo e components.css
│   ├── js/                          # Lógica client-side (services/api.js, lib/events.js)
│   ├── host.html                    # Painel de histórico e métricas de um host
│   ├── index.html                   # Painel principal de hosts e formulário de cadastro
│   ├── signin.html                  # Tela de autenticação
│   ├── signup.html                  # Tela de criação de conta
│   ├── package.json                 # Scripts e dependências do front-end
│   └── vite.config.js               # Configuração do Vite com proxy /api
├── back/                            # API RESTful Backend (a partir da etapa 2)
│   ├── src/
│   │   ├── config/                  # Variáveis de ambiente e portas
│   │   ├── controllers/             # Handlers HTTP de hosts, auth e pings
│   │   ├── database/                # Conexão SQLite / Prisma Client e seeds
│   │   ├── errors/                  # Classe HttpError e catálogo de falhas
│   │   ├── lib/                     # Execução de ping nativo (execFile)
│   │   ├── middlewares/             # Middlewares validate, isAuthenticated, errorHandler
│   │   ├── models/                  # Camada de dados (Host, Ping, Tag, User)
│   │   ├── routes/                  # Roteadores modulares da API
│   │   ├── schemas/                 # Schemas Zod de validação
│   │   ├── services/                # Agendador de monitoramento e barramento SSE
│   │   └── types/                   # Declarações de tipos TypeScript
│   └── requests.http                # Catálogo de requisições HTTP executáveis
├── specs/
│   ├── active/                      # Especificações técnicas de tasks ativas
│   └── archived/                    # Especificações técnicas concluídas
├── tests/                           # Suíte de testes E2E com Playwright
├── .github/
│   └── pull_request_template.md     # Template padrão para Pull Requests
├── AGENTS.md                        # Este guia de governança para agentes de IA
├── biome.json                       # Configuração do linter e formatador Biome
└── README.md                        # Guia de onboarding e execução
```

---

## 5. Fluxo de Desenvolvimento Orientado a Specs (Spec-Driven Development)

Toda tarefa técnica segue o ciclo padronizado de 5 etapas:

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
Localize a tarefa no `docs/PRD.md` pelo código da task (ex: `TK01.2`, `TK08.1`, `TK11.3`). Identifique a User Story (`US`), os Critérios de Aceitação (`CA`) e os arquivos a serem criados/modificados.

### Etapa 2 · Criação de Branch e Elaboração da Spec Técnica
Utilize a skill [`.agents/skills/task-spec-generator/SKILL.md`](.agents/skills/task-spec-generator/SKILL.md) para:
1. Criar e alternar para a branch dedicada da task:
   ```bash
   git checkout -b feat/tkXX-Y-<task-name>
   ```
2. Gerar a spec técnica detalhada em: `specs/active/spec-TKXX.Y-<task-name>.md`

A spec deve conter:
- Metadados: Identificação da Task, Branch, US relacionada, status e data.
- Contexto da funcionalidade e resultados observáveis.
- Critérios de Aceitação em formato Gherkin (Dado/Quando/Então).
- Arquitetura proposta (afetando `front/` e/ou `back/`) com lista de arquivos.
- Plano de execução e comandos de teste/validação.

### Etapa 3 · Implementação Incremental
Codifique as alterações na branch da tarefa respeitando o isolamento entre `front/` e `back/`, a segurança das chamadas de rede e o desacoplamento de camadas.

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
- `feat: [TKXX.Y] <description>` — Nova funcionalidade, endpoint, tela ou evento SSE.
- `fix: [TKXX.Y] <description>` — Correção de bug, falha de ping ou erro de conexão.
- `docs: [TKXX.Y] <description>` — Atualização de `PRD.md`, `AGENTS.md` ou especificações.
- `refactor: [TKXX.Y] <description>` — Refatoração interna de código ou desacoplamento.
- `test: [TKXX.Y] <description>` — Adição ou ajuste de testes unitários, rotas ou E2E.
- `chore: [TKXX.Y] <description>` — Manutenção de configurações, linter ou scripts do build.

**Exemplos**:
- `feat: [TK01.1] setup project governance, linter and vite multi-page layout`
- `feat: [TK08.1] implement native ping executor and latency parser`
- `feat: [TK11.1] implement server sent events bus and realtime stream`
- `docs: [TK01.1] add full product requirements document and ai guidelines`
