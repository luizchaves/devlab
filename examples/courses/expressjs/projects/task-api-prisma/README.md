# task-api-prisma

Etapa 8 da **TaskAPI**: o SQL escrito a mao da etapa 7 vira um schema declarativo
com Prisma 7 e driver adapter, e a tarefa ganha tags numa relacao muitos-para-muitos.

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

| Caminho                   | Papel                                            |
| ------------------------- | ------------------------------------------------ |
| `prisma/schema.prisma`    | modelo de dados declarativo                      |
| `prisma.config.ts`        | ambiente: string de conexao, migracoes e seed    |
| `src/database/prisma.ts`  | client unico, com o driver adapter               |
| `src/database/seed.ts`    | tags e tarefas, idempotente por `upsert`         |

As rotas sao as mesmas da etapa 7; a resposta de uma tarefa agora traz `tags`.

Documentacao: `courses/expressjs/persistence/prisma`.
