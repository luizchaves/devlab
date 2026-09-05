---
title: 'Express.js: Fundamentos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express.js: Fundamentos

## Ideia Central

- **Camada sobre o `node:http`**: abstração ergonômica para servidores HTTP em Node.js.
- **Produtividade**: roteamento declarativo, middlewares e simplificação de requisição e resposta.

## O Que o Express Resolve?

- **Roteamento**: métodos declarativos (`app.get`, `app.post`) substituem cadeias `if/else`.
- **Parâmetros de URL**: extração automática de `/tasks/:id` em `req.params.id`.
- **Corpo JSON**: `express.json()` acumula buffers e popula `req.body`.
- **Respostas JSON**: `res.status().json()` define status, headers e serialização.
- **Middlewares**: cadeia de execução sequencial e reutilizável com `app.use()`.
- **Arquivos Estáticos**: `express.static('public')` para servir assets sem código manual.

## Ciclo e Anatomia da Requisição

- **Fluxo Linear**: Cliente → `node:http` → Middlewares → Rota → `res.json()`.
- **Ordem de Avaliação**: rotas avaliadas na ordem de declaração (específicas antes de dinâmicas).
- **Término do Ciclo**: obrigatório invocar um método finalizador (`res.json()`, `res.send()`).

## Manipulação de Dados (`req` e `res`)

- **Entrada (`req`)**:
  - `req.params`: parâmetros de rota nomeados.
  - `req.query`: parâmetros de busca da URL (*query string*).
  - `req.body`: corpo JSON da requisição.
- **Saída (`res`)**:
  - `res.status(code)`: definição do código HTTP.
  - `res.json(data)`: envio de payload e encerramento da conexão.

## Boas Práticas

- **Ordem dos Middlewares**: registre `express.json()` antes de qualquer rota com payload.
- **Endpoint de Saúde**: mantenha `GET /health` para orquestradores e diagnóstico.
- **Prevenção de Colisões**: declare rotas estáticas (`/tasks/count`) antes de parâmetros (`/tasks/:id`).
