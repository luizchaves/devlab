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
- [ ] **[TASK-002] Guia de Banco de Dados:**
  - [ ] `[TASK-002.1]` Adicionar seção sobre modelagem de dados (normalização, relacionamentos, chaves primárias e estrangeiras, índices)
  - [ ] `[TASK-002.2]` Exemplos práticos de modelagem para diferentes tipos de aplicações (e-commerce, redes sociais, sistemas financeiros, etc.)
  - [ ] `[TASK-002.3]` Comparativo entre paradigmas (relacional, NoSQL, grafos, etc.)
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
  - [x] `[TASK-023.5]` Construir e rodar a imagem da etapa 12 — o build revelou **cinco defeitos** que a leitura não pegava (`prisma generate` sem schema, pnpm não pinada, `EACCES` em `uploads/` e no volume, `prisma.config.ts` ausente no runtime, `loadEnvFile` sem `.env`); corrigidos e verificados: `docker compose up` sobe *healthy*, aplica migrations, e os dados sobrevivem ao restart
- [ ] **[TASK-024] Inclusão e Integração de Exercícios e BrainCheck:**
  - [ ] `[TASK-024.1]` Avaliar a inclusão do acervo de exercícios do `ifpb/exercises` no DevLab (migração/incorporação dos problemas práticos ou estruturação via `exercises/*.exercise.md` vinculados às aulas)
  - [ ] `[TASK-024.2]` Avaliar a inclusão/integração do BrainCheck (`brain-check-questions` / quizzes interativos) no DevLab (seção de quizzes embutida ou estruturação via `exercises/*.braincheck.md`)
- [x] **[TASK-025] Padronização de Terminologia (Tópico / Página em vez de Aula):**
  - [x] `[TASK-025.1]` Atualizar convenções de escrita em `AGENTS.md` e nas skills de geração de conteúdo (`.agents/skills/`)
  - [x] `[TASK-025.2]` Substituir cabeçalhos `## Próxima aula` por `## Próximo tópico` e harmonizar linguagem nos arquivos `.mdx` em `src/content/docs/`

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
