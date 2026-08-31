---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Fundamentos"
description: "O que o Express resolve sobre o módulo http do Node.js: instalação, o primeiro servidor, o ciclo requisição/resposta e a anatomia de uma rota."
---

<!-- _class: lead -->

# Express.js: Fundamentos

O que o Express resolve sobre o módulo http do Node.js: instalação, o primeiro servidor, o ciclo requisição/resposta e a anatomia de uma rota.

---

## Objetivo

- Ao final desta aula você saberá instalar o Express, subir um servidor que responde JSON em várias rotas e explicar cada peça do ciclo requisição → rota...

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/hello`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **O que o Express resolve**
- **Instalação**
- **O primeiro servidor**
- **O ciclo de uma requisição**
- **Anatomia de uma rota**
- **Onde os dados chegam e por onde saem**
- **Executando**

---

## Contexto da Aula

- Express é um framework minimalista para servidores HTTP em Node.js.
- Esta aula mostra o que ele acrescenta ao servidor em Node puro e constrói o primeiro servidor que responde JSON.

---

## O que o Express resolve

- O módulo `node:http` já sobe um servidor.
- O problema é que ele entrega a requisição crua: não existe roteamento, o corpo chega em pedaços e a resposta precisa ser montada cabeçalho por cabeçalho.
- Compare as duas versões do mesmo endpoint: responder JSON em `GET /users`:
- A tabela resume o que muda de responsabilidade:
- O Express é uma camada de organização em cima do módulo nativo: não um servidor próprio.

---

## O que o Express resolve: Tabela

- Escolher quem responde: `if (req.method === … && req.url === …)` | `app.get('/users', handler)`
- Parâmetro na URL: recortar a string à mão | `/users/:id` → `req.params.id`
- Ler o corpo JSON: acumular `data` e fazer `JSON.parse` | `express.json()` → `req.body`
- Definir status e `Content-Type`: `res.writeHead(200, { … })` | `res.status(200).json(…)`
- Comportamento comum a rotas: repetir em cada `if` | middleware
- Servir arquivos estáticos: ler do disco e detectar o MIME | `express.static('public')`

---

## O que o Express resolve: Exemplo 1

```js
    import { createServer } from 'node:http';
    const server = createServer((req, res) => {
      // O roteamento é manual: método e caminho viram if/else.
      if (req.method === 'GET' && req.url === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([{ id: 1, name: 'Ana' }]));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not Found' }));
    });
```

---

## O que o Express resolve: Exemplo 2

```js
    import express from 'express';
    const app = express();
    app.get('/users', (req, res) => {
      res.json([{ id: 1, name: 'Ana' }]);
    });
    app.listen(3000);
```

---

## Instalação

- O Express é uma dependência de produção, instalada dentro de um projeto Node com `package.json` e `"type": "module"`:

---

## O primeiro servidor

- Três linhas já sobem uma aplicação: criar o `app`, registrar uma rota e escutar uma porta.
- A linha destacada é o único middleware do arquivo.
- Sem `express.json()`, `req.body` chega `undefined`: alguém precisa ler o corpo da requisição e convertê-lo em objeto JavaScript.

---

## O ciclo de uma requisição

- Toda requisição percorre o mesmo caminho: entra pelo servidor HTTP, atravessa os middlewares registrados, encontra (ou não) uma rota e volta como resposta.
- A resposta só sai quando alguém chama um método que encerra o ciclo: `res.json()`, `res.send()`, `res.end()`, `res.sendFile()`.
- Enquanto isso não acontece, o cliente fica esperando.

---

## Anatomia de uma rota

- Uma rota é a associação entre um método HTTP, um caminho e a função que responde:
- O `app` expõe um método para cada verbo HTTP, além de dois casos especiais:
- O Express testa as rotas de cima para baixo e para na primeira que casar.
- Registrar `app.get('/users/:id')` antes de `app.get('/users/novo')` faz `/users/novo` cair na primeira rota, com `req.params.id === 'novo'`.

---

## Anatomia de uma rota: Exemplo

```js
app.get('/hello/:name', (req, res) => {
  res.json({ message: `Hello ${req.params.name}` });
});
//  │    │              │     │
//  │    │              │     └─ res: como responder
//  │    │              └─────── req: o que chegou
//  │    └────────────────────── caminho (com parâmetro nomeado)
//  └─────────────────────────── método HTTP
```

---

## Onde os dados chegam e por onde saem

- Praticamente toda aula daqui para a frente gira em torno de cinco membros de `req` e `res`:
- A aula de Requisição e Resposta detalha cada um deles.

---

## Executando

- Entre no projeto de exemplo:
- Instale as dependências:
- Suba o servidor em modo watch:
- Confirme que ele responde:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/express/projects/hello
```

---

## Executando: Exemplo 2

```bash
   curl http://localhost:3000/hello/Ana
```

---

## Testando as rotas

- Esta seção demonstra o comportamento da aplicação em execução.
- Cada teste envia uma requisição simulada e verifica a estrutura da resposta HTTP retornada.
- Uma rota com parâmetro de rota (`/hello/:name`) captura o valor informado na URL (`/hello/Ana`) e o retorna formatado com status `200 OK`:
- { "message": "Hello Ana" }
- Já a rota de eco `POST /echo` recebe um documento JSON no corpo da requisição e devolve os mesmos dados com status `201 Created`.

---

## Testando as rotas: Exemplo 1

```txt
  ### Testar rota Hello com parâmetro
  GET http://localhost:3000/hello/Ana
```

---

## Testando as rotas: Exemplo 2

```txt
  ### Testar rota POST /echo com JSON
  POST http://localhost:3000/echo
  Content-Type: application/json
  {
    "curso": "Desenvolvimento Web"
  }
```

---

## Exercício

- Partindo do projeto `hello`:
- Adicione `GET /soma?a=2&b=3` lendo os valores de `req.query` e respondendo
- Responda `400` quando `a` ou `b` não forem numéricos.
- Adicione `GET /hello` (sem parâmetro) devolvendo `{ "message": "Hello World" }` e
- verifique se ela conflita com `GET /hello/:name`.

---

## Exercício: Exemplo

```js
  app.get('/soma', (req, res) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      return res.status(400).json({ message: 'Os parâmetros "a" e "b" devem ser numéricos' });
    }
    res.json({ resultado: a + b });
  });
```

---

## Desafio

- Reescreva o `GET /hello/:name` usando apenas `node:http`, sem Express: faça o roteamento manualmente, devolva `404` para qualquer outro caminho e...
- Compare o número de linhas com a versão em Express.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- O que o Express resolve sobre o módulo http do Node.js: instalação, o primeiro servidor, o ciclo requisição/resposta e a anatomia de uma rota.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Fundamentos

- O Express substitui o módulo `node:http`?
- Não. `app.listen()` cria um servidor `node:http` e registra `app` como handler.
- O Express organiza o roteamento e a leitura/escrita, mas o transporte continua sendo o módulo nativo.
- Por que `req.body` chega `undefined` mesmo com o cliente enviando JSON?
- Porque falta registrar `app.use(express.json())`: ou ele foi registrado depois da rota.

---

## Rotas

- Qual a diferença entre `app.get('/x', h)` e `app.use('/x', h)`?
- Por que `app.get('/users/:id')` antes de `app.get('/users/novo')` é um problema?
- O Express para na primeira rota que casa.

---

## Na prática

- O projeto executável desta aula é Hello Express.

---

## Próxima aula

- Rotas: parâmetros de rota, query string, corpo e a modularização com `express.Router()`.

---

## Arquivos-Chave da Aula

- **src/server.js**: `examples/courses/express/projects/hello/src/server.js` (linhas marcadas `7`)

---

## Resumo da Aula

- **Express.js: Fundamentos** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
