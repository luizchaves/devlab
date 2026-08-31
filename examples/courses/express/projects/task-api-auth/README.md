# task-api-auth

Etapa 9 da **TaskAPI**: a API deixa de ser publica. Cadastro com hash Argon2id,
login com JWT HS256 e isolamento por dono — tudo com `node:crypto`, sem `bcrypt`
e sem `jsonwebtoken`.

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

| Metodo | Caminho         | Publica? | Descricao                          |
| ------ | --------------- | -------- | ---------------------------------- |
| GET    | `/health`       | sim      | Estado do servico                  |
| POST   | `/auth/signup`  | sim      | Cria uma conta                     |
| POST   | `/auth/signin`  | sim      | Troca e-mail e senha por um token  |
| GET    | `/auth/me`      | nao      | Quem e o dono do token             |
| *      | `/tasks`        | nao      | CRUD, restrito as tarefas do dono  |

Usuarios semeados: `ana@example.com` (admin) e `bruno@example.com` (user), ambos
com a senha `senha-de-desenvolvimento`.

`pnpm test` roda os testes de unidade do hash e do JWT.

Documentacao: `courses/expressjs/auth/authentication`.
