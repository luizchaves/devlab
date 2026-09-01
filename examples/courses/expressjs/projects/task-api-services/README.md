# task-api-hardening

Etapa 10 da **TaskAPI**: a mesma API, pronta para sair da sua maquina.
Configuracao validada no arranque, log estruturado com id de requisicao,
metricas, CORS por lista de permitidos, cabecalhos de seguranca, limite de
requisicoes e encerramento gracioso — tudo sem dependencia nova.

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

| Caminho     | Para que serve                                           |
| ----------- | -------------------------------------------------------- |
| `/health`   | Liveness: o processo esta de pe (nao consulta o banco)   |
| `/ready`    | Readiness: o servico consegue atender (consulta o banco) |
| `/metrics`  | Contadores e percentis no formato do Prometheus          |

As rotas de `/auth` e `/tasks` sao as mesmas da etapa 9. O login tem um limite
proprio, de cinco tentativas por minuto.

Documentacao: `courses/expressjs/security/hardening`.
