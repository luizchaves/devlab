# task-api-typescript

Etapa 4 da **TaskAPI**: a mesma API em camadas, migrada para TypeScript e
executada nativamente pelo Node — sem passo de build, sem `tsx` e sem bundler.

```bash
pnpm install
pnpm dev
```

Rotas disponiveis:

| Metodo | Caminho      | Descricao           |
| ------ | ------------ | ------------------- |
| GET    | `/health`    | Estado do servico   |
| GET    | `/tasks`     | Lista as tarefas    |
| GET    | `/tasks/:id` | Busca uma tarefa    |
| POST   | `/tasks`     | Cria uma tarefa     |
| PUT    | `/tasks/:id` | Atualiza uma tarefa |
| DELETE | `/tasks/:id` | Remove uma tarefa   |

Documentacao: `courses/expressjs/basics/typescript`.
