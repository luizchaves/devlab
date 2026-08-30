# task-api-router

Etapa 2 da **TaskAPI**: as rotas saem do arquivo unico e viram um modulo montado
sob um prefixo, com `app.js` separado de `server.js`.

```bash
pnpm install
pnpm dev
```

Rotas disponiveis:

| Metodo | Caminho      | Descricao                         |
| ------ | ------------ | --------------------------------- |
| GET    | `/health`    | Estado do servico                 |
| GET    | `/tasks`     | Lista as tarefas                  |
| GET    | `/tasks/:id` | Busca uma tarefa pelo id          |
| POST   | `/tasks`     | Cria uma tarefa a partir do corpo |

Documentacao: `courses/expressjs/basics/routes`.
