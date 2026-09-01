# task-api-mvc

Etapa 3 da **TaskAPI**: as responsabilidades se separam em model, controller e
router, com log e tratamento de erro centralizado.

```bash
pnpm install
pnpm dev
```

Rotas disponiveis:

| Metodo | Caminho      | Descricao                |
| ------ | ------------ | ------------------------ |
| GET    | `/health`    | Estado do servico        |
| GET    | `/tasks`     | Lista as tarefas         |
| GET    | `/tasks/:id` | Busca uma tarefa         |
| POST   | `/tasks`     | Cria uma tarefa          |
| PUT    | `/tasks/:id` | Atualiza uma tarefa      |
| DELETE | `/tasks/:id` | Remove uma tarefa        |

Documentacao: `courses/expressjs/architecture/mvc`.
