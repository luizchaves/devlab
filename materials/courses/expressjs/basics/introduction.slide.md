---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Express.js: Fundamentos"
description: "O que o Express resolve sobre o módulo http do Node.js: instalação, o primeiro servidor, o ciclo requisição/resposta e a anatomia de uma rota."
---

<!-- _class: lead -->

# Express.js: Fundamentos

O que o Express acrescenta ao Node.js: o primeiro servidor, ciclo de requisições e anatomia de rotas.

---

## Objetivo

Compreender a arquitetura básica de servidores HTTP com Express 5 em Node.js.

- Explicar as vantagens e conveniências do Express sobre o módulo nativo **`node:http`**.
- Subir uma aplicação que responde JSON em múltiplas rotas.
- Entender o papel do middleware **`express.json()`** na leitura do payload.
- Dominar o ciclo de vida completo: **requisição → middlewares → rotas → resposta**.
- Compreender a anatomia de rotas, parâmetros de caminho (**`req.params`**) e query string (**`req.query`**).
- Conhecer o endpoint de diagnóstico padrão (**`GET /health`**).

---

## Projeto de Referência

- **Projeto modelo**: `examples/courses/expressjs/projects/task-api-hello`
- Estrutura mínima de uma API HTTP em Node.js com Express 5:

```txt
task-api-hello/
├── package.json
├── requests.http
└── src/
    └── server.js
```

- Execute os testes no terminal com `curl` ou com a extensão **REST Client** no editor.

---

## Mapa da Aula

- O Que o Express Resolve Sobre o `node:http`
- Comparação: `node:http` Puro vs Express 5
- O Primeiro Servidor e o Middleware `express.json()`
- O Endpoint de Saúde (`GET /health`)
- O Ciclo da Requisição HTTP
- Anatomia de uma Rota e Métodos HTTP
- Onde os Dados Chegam (`req`) e Por Onde Saem (`res`)
- Execução, Testes com REST Client, Exercício e Desafio

---

## O Que o Express Resolve?

O módulo nativo `node:http` entrega conexões de rede em baixo nível, exigindo código manual para tarefas repetitivas:

1. **Roteamento**: exige condicionais `if (req.method === 'GET' && req.url === '...')` manuais.
2. **Parâmetros de URL**: exige fatiamento manual de strings ou Regex para extrair `:id`.
3. **Corpo JSON**: exige ouvir eventos `data`/`end` em streams para fazer `JSON.parse`.
4. **Respostas**: exige definir cabeçalhos `Content-Type` e serializar buffers à mão.
5. **Middlewares**: não oferece encadeamento sequencial para autenticação e logs.

---

## `node:http` Puro vs Express 5

```js
// node:http - Roteamento e JSON manuais
import { createServer } from 'node:http';
const server = createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'Ana' }]));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not Found' }));
});
server.listen(3000);
```

```js
// Express 5 - Roteamento declarativo e res.json()
import express from 'express';
const app = express();
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Ana' }]);
});
app.listen(3000);
```

---

## Tabela de Responsabilidades

| Tarefa | `node:http` nativo | Express 5 |
| :--- | :--- | :--- |
| **Roteamento** | `if (req.method === 'GET' && req.url === '/users')` | `app.get('/users', handler)` |
| **Parâmetro de URL** | Recortar string ou Regex manual | `/users/:id` → `req.params.id` |
| **Corpo JSON** | Acumular chunks de buffer `data` | `express.json()` → `req.body` |
| **Resposta JSON** | `res.writeHead()` + `res.end(JSON.stringify)` | `res.status(200).json(data)` |
| **Comportamentos Comuns** | Repetir lógica em cada branch `if` | Middlewares com `app.use()` |
| **Arquivos Estáticos** | `node:fs` + tabela MIME manual | `express.static('public')` |

> *`app.listen()` cria um servidor `node:http` por baixo e passa `app` como handler.*

---

## O Primeiro Servidor

```js
import express from 'express';

const app = express();
const port = 3000;

// Middleware essencial: parse de corpos JSON no req.body
app.use(express.json());

// Rota de diagnóstico / health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
```

- Sem `app.use(express.json())`, a propriedade `req.body` chega `undefined`.

---

## O Ciclo da Requisição HTTP

Toda requisição percorre um caminho linear e determinístico:

```txt
Cliente (GET /tasks/1)
   │
   ▼
[node:http] recebe a conexão de rede
   │
   ▼
[Middlewares Globais] (ex: express.json(), logger)
   │
   ▼
[Roteador] Busca casamento de Método + Caminho
   ├─► Encontrou: Executa Handler (req, res) => { res.json(...) }
   └─► Não encontrou: Responde 404 Not Found padrão
   │
   ▼
Cliente recebe a resposta HTTP
```

- A resposta só é enviada quando um método de término é chamado (`res.json()`, `res.send()`).

---

## Anatomia de uma Rota (`app.get`)

```js
app.get('/tasks/:id', (req, res) => {
  res.json({ id: req.params.id });
});
//   │       │           │     │
//   │       │           │     └─ res: constrói e envia a resposta
//   │       │           └─────── req: dados da requisição recebida
//   │       └─────────────────── caminho com parâmetro dinâmico (:id)
//   └─────────────────────────── método / verbo HTTP
```

- **Verbos HTTP suportados**: `app.get()`, `app.post()`, `app.put()`, `app.patch()`, `app.delete()`.
- **Casos Especiais**:
  - `app.all(path, handler)`: atende **qualquer verbo** naquele caminho.
  - `app.use(handler)`: intercepta **qualquer verbo e qualquer caminho** (middleware).

---

## Ordem de Registro das Rotas

O Express avalia as rotas na **ordem exata em que foram declaradas** (de cima para baixo):

```js
// ❌ CUIDADO com a ordem:
app.get('/tasks/:id', (req, res) => {
  res.json({ id: req.params.id });
});

app.get('/tasks/count', (req, res) => {
  res.json({ total: 10 }); // NUNCA SERÁ ALCANÇADA!
});
```

- A requisição `GET /tasks/count` cai na primeira rota com `req.params.id === "count"`.
- **Regra**: rotas estáticas e específicas devem vir **antes** de rotas com parâmetros dinâmicos!

---

## Onde os Dados Chegam e Por Onde Saem?

| Propriedade / Método | Papel no Ciclo | Exemplo de Uso |
| :--- | :--- | :--- |
| **`req.params`** | Parâmetros nomeados da rota | `/tasks/:id` → `req.params.id` |
| **`req.query`** | Parâmetros de busca na URL | `?done=true` → `req.query.done` |
| **`req.body`** | Payload JSON enviado no corpo | `req.body.title` |
| **`res.status(code)`** | Define o código de status HTTP | `res.status(201)` (encadeável) |
| **`res.json(data)`** | Serializa JSON e encerra o ciclo | `res.status(200).json({ ok: true })` |

---

## Executando e Testando a Aplicação

1. Suba o servidor com `node --watch src/server.js`:

```bash
cd examples/courses/expressjs/projects/task-api-hello
npm install
npm run dev
```

2. Teste o endpoint de diagnóstico:

```bash
curl http://localhost:3000/health
```

```json
{
  "status": "ok",
  "uptime": 1.204
}
```

---

## Testando as Rotas da TaskAPI

**1. Buscar tarefa por ID (`GET /tasks/1`):**

```bash
curl http://localhost:3000/tasks/1
```

```json
{
  "id": 1,
  "title": "Estudar rotas do Express",
  "done": true
}
```

**2. Criar nova tarefa com JSON (`POST /tasks`):**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Ler documentação do Express"}'
```

```json
{
  "id": 3,
  "title": "Ler documentação do Express",
  "done": false
}
```

---

## Exercício Prático: Filtro por Query String

Partindo da etapa 1 da TaskAPI (`task-api-hello`):

1. Crie o endpoint `GET /tasks/count?done=true` lendo o valor de `req.query`.
2. Responda `400 Bad Request` se `done` for diferente de `"true"` ou `"false"`.
3. Garanta que a rota `/tasks/count` seja registrada antes de `/tasks/:id`.

---

## Solução do Exercício

```js
// Registrar ANTES de /tasks/:id para evitar colisão de rota!
app.get('/tasks/count', (req, res) => {
  const { done } = req.query;

  if (done !== 'true' && done !== 'false') {
    return res.status(400).json({
      message: 'O parâmetro "done" deve ser true ou false',
    });
  }

  const isDone = done === 'true';
  const total = tasks.filter((task) => task.done === isDone).length;

  res.json({ total });
});

// GET /tasks/count?done=true  -> 200 { "total": 1 }
// GET /tasks/count?done=talvez -> 400 { "message": "O parâmetro..." }
```

---

## Desafio: Roteador em `node:http` Puro

Reescreva o endpoint `GET /tasks/:id` usando apenas o módulo `node:http` do Node.js:

```js
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  const match = req.url.match(/^\/tasks\/(\d+)$/);

  if (req.method === 'GET' && match) {
    const id = Number(match[1]);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Not found' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(task));
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Rota inexistente' }));
});
```

---

## Perguntas de Revisão

- O Express substitui o módulo `node:http`?
- Por que `req.body` chega como `undefined` se esquecermos `app.use(express.json())`?
- O que acontece com a conexão do cliente se uma rota nunca invocar `res.json()`?
- Por que rotas estáticas como `/tasks/count` devem vir antes de rotas dinâmicas como `/tasks/:id`?
- Qual a diferença entre `app.get('/path', handler)` e `app.use('/path', handler)`?

---

## Resumo da Aula

- **Express 5**: camada minimalista e declarativa sobre o `node:http`.
- **`express.json()`**: middleware fundamental para leitura de payloads no `req.body`.
- **Health Check (`GET /health`)**: endpoint de diagnóstico essencial para microsserviços.
- **Roteamento Determinístico**: o Express avalia rotas na ordem sequencial de registro.
- **Ciclo HTTP**: requisições são recebidas, transformadas por middlewares e encerradas pelo handler com `res.json()`.
