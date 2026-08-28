# express-prisma

CRUD completo com Express, Prisma ORM e SQLite.

```bash
pnpm install
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

Rotas disponiveis:

| Metodo | Caminho      | Descricao           |
| ------ | ------------ | ------------------- |
| GET    | `/users`     | Lista os usuarios   |
| GET    | `/users/:id` | Busca com os posts  |
| POST   | `/users`     | Cria um usuario     |
| PUT    | `/users/:id` | Atualiza um usuario |
| DELETE | `/users/:id` | Remove um usuario   |

Documentacao: `courses/database/prisma/introduction`.
