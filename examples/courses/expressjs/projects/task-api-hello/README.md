# task-api-hello

Etapa 1 da **TaskAPI**: um unico arquivo, quatro rotas e o ciclo
requisicao/resposta completo.

```bash
pnpm install
pnpm dev
```

Rotas disponiveis:

| Metodo | Caminho      | Descricao                          |
| ------ | ------------ | ---------------------------------- |
| GET    | `/health`    | Estado do servico                  |
| GET    | `/tasks`     | Lista as tarefas                   |
| GET    | `/tasks/:id` | Busca uma tarefa pelo id           |
| POST   | `/tasks`     | Cria uma tarefa a partir do corpo  |

Documentacao: `courses/expressjs/basics/introduction`.
