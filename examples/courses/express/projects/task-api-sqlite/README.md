# task-api-sqlite

Etapa 7 da **TaskAPI**: os dados saem da memoria e vao para um arquivo SQLite,
usando o modulo nativo `node:sqlite` — sem ORM e sem dependencia.

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

`pnpm db:reset` apaga o banco e refaz migracao e seed.

| Caminho              | Papel                                       |
| -------------------- | ------------------------------------------- |
| `src/database/database.ts`  | involucro assincrono sobre `DatabaseSync`  |
| `src/database/migration.ts` | cria a tabela `tasks` com as restricoes    |
| `src/database/seed.ts`      | popula duas tarefas                        |

As rotas sao as mesmas da etapa 6.

Documentacao: `courses/expressjs/persistence/node-sqlite`.
