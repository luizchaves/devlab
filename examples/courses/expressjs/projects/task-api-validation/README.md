# task-api-validation

Etapa 5 da **TaskAPI**: nenhum dado invalido chega ao controller. Os schemas Zod
validam `body`, `params` e `query`, e a listagem ganha filtros, ordenacao e
paginacao.

```bash
pnpm install
pnpm dev
```

Rotas disponiveis:

| Metodo | Caminho      | Descricao                                  |
| ------ | ------------ | ------------------------------------------ |
| GET    | `/health`    | Estado do servico                          |
| GET    | `/tasks`     | Lista com `page`, `perPage`, `done`, `priority`, `q` e `sort` |
| GET    | `/tasks/:id` | Busca uma tarefa                           |
| POST   | `/tasks`     | Cria uma tarefa                            |
| PUT    | `/tasks/:id` | Atualiza uma tarefa                        |
| DELETE | `/tasks/:id` | Remove uma tarefa                          |

Documentacao: `courses/expressjs/api/validation`.
