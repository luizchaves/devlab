# task-api-openapi

Etapa 6 da **TaskAPI**: o contrato da API publicado em OpenAPI 3, gerado a partir
dos mesmos schemas Zod que validam as requisicoes — e navegavel em `/docs`.

```bash
pnpm install
pnpm dev
```

| Caminho         | O que serve                                   |
| --------------- | --------------------------------------------- |
| `/docs`         | Swagger UI, para pessoas                      |
| `/openapi.json` | O documento cru, para ferramentas             |

As rotas de `/tasks` sao as mesmas da etapa 5.

Documentacao: `courses/expressjs/api/documentation`.
