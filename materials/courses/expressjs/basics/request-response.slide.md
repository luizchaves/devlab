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
    padding-bottom: 0;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Express.js: Requisição e Resposta"
description: "Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos."
---

<!-- _class: lead -->

# Express.js: Requisição e Resposta

Explorando os objetos `req` e `res`: cabeçalhos, negociação de conteúdo, status codes, arquivos estáticos e cache.

---

## Objetivo

Dominar o fluxo completo de dados e metadados entre cliente e servidor HTTP no Express.

- Extrair metadados, parâmetros e cabeçalhos com o objeto **`req`**.
- Utilizar **`req.get()`** para leitura de cabeçalhos sem sensibilidade a maiúsculas/minúsculas.
- Aplicar **negociação de conteúdo** com **`res.format()`** e tratar formatos inválidos (**`406`** / **`415`**).
- Diferenciar métodos de **configuração** (encadeáveis) de métodos de **término** em **`res`**.
- Prevenir o erro fatal **`ERR_HTTP_HEADERS_SENT`**.
- Servir arquivos estáticos com **`express.static()`** e implementar downloads forçados com **`res.download()`**.

---

## Projeto de Referência

- **Projeto modelo**: `examples/courses/expressjs/projects/task-api-hello`
- Os objetos `req` e `res` são o canal de comunicação entre o cliente HTTP e os handlers do servidor:

```txt
task-api-hello/
├── package.json
├── requests.http
└── src/
    └── server.js
```

- Esta aula explora recursos avançados de cabeçalhos, cache e manipulação de fluxos.

---

## Mapa da Aula

- Anatomia de uma Mensagem HTTP (`req` vs `res`)
- Lendo a Requisição: Metadados e Cabeçalhos (`req.get`)
- Middleware de Log e o Evento `res.on('finish')`
- Negociação de Conteúdo com `res.format()` e `req.is()`
- Escrevendo a Resposta: Configuração vs Término
- O Erro `ERR_HTTP_HEADERS_SENT` e Como Evitar
- Redirecionamentos HTTP (`301`, `302`, `303`, `307`)
- Servindo Arquivos Estáticos e Downloads (`res.download`)
- Cabeçalhos de Cache (`ETag` e `304 Not Modified`)
- Exercício Prático, Desafio e Revisão

---

## Anatomia de uma Mensagem HTTP

A mensagem HTTP é estruturada em três partes: linha inicial, cabeçalhos e corpo:

| Camada HTTP | Na Requisição (`req`) | Na Resposta (`res`) |
| :--- | :--- | :--- |
| **Linha Inicial** | `req.method`, `req.path`, `req.query` | `res.status(code)` |
| **Cabeçalhos** | `req.headers`, `req.get('nome')` | `res.set('nome', 'valor')` |
| **Corpo (Payload)** | `req.body` (via middleware) | `res.json(data)`, `res.send()` |

---

## Lendo a Requisição: Metadados

Além dos parâmetros de rota e corpo, `req` fornece metadados do contexto da conexão:

```js
app.get('/info', (req, res) => {
  res.json({
    method: req.method,        // 'GET'
    path: req.path,            // '/info' (sem query string)
    originalUrl: req.originalUrl, // '/info?debug=true' (completa)
    ip: req.ip,                // '127.0.0.1'
    protocol: req.protocol,    // 'http' ou 'https'
    userAgent: req.get('user-agent'), // Leitura case-insensitive
  });
});
```

- `req.get(nome)` é a forma segura de ler cabeçalhos sem depender de maiúsculas/minúsculas.

---

## Log com `res.on('finish')`

Para registrar logs com o código de status real retornado pela rota:

```js
export function logger(req, res, next) {
  const start = Date.now();
  const agent = req.get('user-agent') ?? 'desconhecido';

  // Dispara APÓS a resposta ser enviada ao cliente
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms (${agent})`);
    // output: GET /tasks/1 200 — 4ms (curl/8.7.1)
  });

  next();
}
```

> *Logar antes do handler não tem acesso ao `res.statusCode` final.*

---

## Negociação de Conteúdo (`res.format`)

Permite responder em formatos diferentes conforme o cabeçalho `Accept` do cliente:

```js
app.get('/tasks/:id', (req, res) => {
  const task = { id: 1, title: 'Estudar Express', done: true };

  res.format({
    'application/json': () => res.json(task),
    'text/html': () => res.send(`<h1>${task.title}</h1>`),
    'text/csv': () => {
      res.type('text/csv');
      res.send(`id,title,done\n${task.id},${task.title},${task.done}`);
    },
    default: () => res.status(406).send('Not Acceptable'),
  });
});
```

- Se o cliente envia `Accept: application/xml`, o Express responde `406 Not Acceptable`.

---

## Verificação de Formato Recebido (`req.is`)

Protege o endpoint contra formatos de payload inesperados:

```js
export function requireJson(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.is('application/json')) {
      return res.status(415).json({
        message: 'O cabeçalho Content-Type deve ser application/json',
      });
    }
  }
  next();
}
```

- **`400 Bad Request`**: dados/conteúdo inválidos.
- **`415 Unsupported Media Type`**: formato de mídia não suportado.

---

## Escrevendo a Resposta: Configuração vs Término

| Tipo | Método | Efeito |
| :--- | :--- | :--- |
| **Configuração** (encadeável) | `res.status(201)` | Define o código de status HTTP |
| | `res.set('X-Total', '10')` | Define um cabeçalho customizado |
| | `res.type('text/csv')` | Define o MIME type do `Content-Type` |
| | `res.cookie('token', 'abc')`| Configura cabeçalho `Set-Cookie` |
| **Término** (finaliza conexão) | `res.json(data)` | Serializa em JSON e finaliza o ciclo |
| | `res.send(body)` | Envia texto, buffer ou objeto |
| | `res.redirect(url)` | Emite redirecionamento `3xx` com `Location` |
| | `res.sendFile(path)` | Transmite arquivo do disco inline |
| | `res.download(path, name)`| Força download como anexo |

---

## O Erro `ERR_HTTP_HEADERS_SENT`

Ocorre quando o servidor tenta responder mais de uma vez para a mesma requisição:

```js
// ❌ ERRADO: sem 'return', ambos res.status().json() executam!
app.get('/tasks/:id', (req, res) => {
  if (!task) {
    res.status(404).json({ message: 'Não encontrada' });
  }
  res.json(task); // ERRO: Headers already sent!
});

// ✅ CORRETO: use return para interromper o handler imediatamente
app.get('/tasks/:id', (req, res) => {
  if (!task) {
    return res.status(404).json({ message: 'Não encontrada' });
  }
  res.json(task);
});
```

---

## Redirecionamentos Semânticos

O método `res.redirect(status, url)` emite resposta `3xx` acompanhada do cabeçalho `Location`:

| Status | Nome HTTP | Quando Usar |
| :--- | :--- | :--- |
| **`301`** | Moved Permanently | URL mudou definitivamente (navegador faz cache) |
| **`302`** | Found | Desvio temporário (padrão do `res.redirect`) |
| **`303`** | See Other | Após um `POST`, instrui o cliente a buscar com `GET` |
| **`307`** | Temporary Redirect | Desvio temporário que preserva o método original |

```js
app.post('/tasks', (req, res) => {
  const task = createTask(req.body);
  res.redirect(303, `/tasks/${task.id}`);
});
```

---

## Arquivos Estáticos e Downloads

**1. Servir diretório estático público:**
```js
app.use(express.static('public')); // public/index.html -> GET /
app.use('/assets', express.static('public')); // public/logo.png -> GET /assets/logo.png
```

**2. Envio de arquivo inline vs Download forçado:**
```js
// Inline no navegador
app.get('/relatorio', (req, res) => {
  res.sendFile(path.resolve('docs/relatorio.pdf'));
});

// Força download com nome sugerido
app.get('/relatorio/baixar', (req, res) => {
  res.download(path.resolve('docs/relatorio.pdf'), 'relatorio-2026.pdf');
});
```

---

## Cache HTTP: ETag e `304 Not Modified`

O Express gera cabeçalhos `ETag` automaticamente para respostas com `res.json()` e `res.send()`:

```js
app.get('/tags', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json(['express', 'nodejs', 'typescript']);
});
```

- Quando o cliente envia `If-None-Match: "a1b2c3"`, se o dado não mudou, o Express responde:

```http
HTTP/1.1 304 Not Modified
ETag: "a1b2c3"
(Sem corpo: economia de tráfego de rede)
```

---

## Exercício Prático: Middleware `responseTime`

Crie um middleware que meça a duração de cada requisição em milissegundos:

1. Capture o timestamp de início com alta precisão (`process.hrtime.bigint()`).
2. No evento `finish` do objeto `res`, calcule o tempo decorrido.
3. Imprima no console o método, a URL, o status code e o tempo formatado em `ms`.

---

## Solução do Exercício

```js
export function responseTime(req, res, next) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedNs = process.hrtime.bigint() - start;
    const elapsedMs = Number(elapsedNs) / 1e6;

    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} — ${elapsedMs.toFixed(2)}ms`
    );
    // output: GET /tasks 200 — 1.45ms
  });

  next();
}
```

> *Não tente usar `res.set('X-Response-Time')` dentro de `finish`, pois os cabeçalhos já foram despachados.*

---

## Desafio: Negociação de Formato Multilíngue

Implemente um endpoint `GET /export` que suporte:

- `application/json`: retorna array de tarefas formatado.
- `text/csv`: retorna dados no formato tabular CSV (`id,title,done`).
- `text/html`: retorna tabela HTML (`<table><tr>...`).
- Qualquer outro formato: responde com `406 Not Acceptable`.

```bash
# Teste via terminal:
curl -H "Accept: text/csv" http://localhost:3000/export
curl -H "Accept: application/xml" http://localhost:3000/export # Retorna 406
```

---

## Perguntas de Revisão

- Qual a diferença prática entre `req.path` e `req.originalUrl`?
- Por que devemos usar `req.get('Content-Type')` em vez de acessar `req.headers['Content-Type']`?
- Qual a causa mais comum do erro `ERR_HTTP_HEADERS_SENT`?
- Por que usamos o status `303 See Other` após a submissão de um formulário `POST`?
- Qual a diferença de comportamento entre `res.sendFile()` e `res.download()`?

---

## Resumo da Aula

- **`req`**: encapsula dados de entrada (`params`, `query`, `body`, `headers`, `ip`).
- **`res`**: encadeia configurações (`status`, `set`, `type`) e encerra com `json()`, `send()`, `redirect()`.
- **`res.format()`**: negociação de conteúdo robusta e semântica.
- **`res.on('finish')`**: ponto seguro para métricas de tempo e logs de status pós-processamento.
- **Proteção de Fluxo**: sempre utilize `return res...` em fluxos condicionais de erro.
