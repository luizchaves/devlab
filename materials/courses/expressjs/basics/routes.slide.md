---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Rotas"
description: "Roteamento no Express: caminhos e padrões, parâmetros de rota, query string e corpo, encadeamento de handlers e modularização com express.Router()."
---

<!-- _class: lead -->

# Express.js: Rotas

Roteamento no Express: caminhos e padrões, parâmetros de rota, query string e corpo, encadeamento de handlers e modularização com express.Router().

---

## Objetivo

- Ao final você saberá declarar rotas com parâmetros, ler dados de `req.params`, `req.query` e `req.body`, encadear handlers em uma mesma rota e extrair...

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/task-api-router`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **Caminho, método e handler**
- **Os três lugares por onde os dados chegam**: Parâmetro de rota, Query string, Corpo da requisição
- **Encadeando handlers**
- **Modularizando com `express.Router()`**
- **Executando**
- **Testando**
- **Exercício**

---

## Contexto da Aula

- Roteamento é a decisão de qual função responde a qual requisição.
- Esta aula percorre as formas de escrever um caminho, os três lugares por onde os dados chegam e a modularização com `express.Router()`.

---

## Caminho, método e handler

- Uma rota casa quando o método e o caminho batem. O Express avalia na ordem de registro e para na primeira que casar:
- Os padrões de caminho aceitos pelo Express 5 são poucos e explícitos:
- No Express 4 escrevia-se `'*'` e `'/files/*'`.
- No Express 5 o curinga precisa ser nomeado: `'/{*splat}'` e `'/files/*splat'`: e o valor chega em `req.params.splat` como um array de segmentos.
- Código antigo copiado da internet costuma quebrar aqui.

---

## Caminho, método e handler: Exemplo

```js
app.get('/tasks/pending', listPending); // avaliada primeiro
app.get('/tasks/:id', showTask);
// Invertidas, '/tasks/pending' cairia em '/tasks/:id'
// com req.params.id === 'pending'.
```

---

## Os três lugares por onde os dados chegam

- Uma requisição carrega dados em três posições diferentes, e cada uma tem um uso próprio.
- A tabela resume quando usar cada um:

---

## Os três lugares por onde os dados chegam: Tabela

- Rota: `req.params` | sempre string | identificar qual recurso: `/tasks/:id`
- Query string: `req.query` | string ou array | filtrar, ordenar e paginar: `?page=2&sort=name`
- Corpo: `req.body` | tipos do JSON | enviar dados de criação e atualização

---

## Parâmetro de rota

- O trecho iniciado por `:` vira uma chave em `req.params`, sempre como string:
- Sem a conversão, `item.id === req.params.id` compara número com string e falha silenciosamente: a rota responde `404` para uma tarefa que existe.

---

## Parâmetro de rota: Exemplo

```js
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id); // '2' -> 2
  const task = tasks.find((item) => item.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }
  res.json(task);
});
```

---

## Query string

- Tudo depois do `?` chega em `req.query` já convertido em objeto. Um mesmo nome repetido vira array, o que é uma armadilha comum:

---

## Query string: Exemplo

```js
// GET /tasks?page=2&tag=estudo&tag=urgente
app.get('/tasks', (req, res) => {
  const page = Number(req.query.page ?? 1);
  //          => 2
  const tags = [req.query.tag].flat();
  //          => ['estudo', 'urgente']
  res.json({ page, tags });
});
```

---

## Corpo da requisição

- O corpo só existe depois de um middleware interpretá-lo. Cada formato tem o seu:
- Registrados esses middlewares, o handler apenas lê `req.body`:

---

## Corpo da requisição: Exemplo

```js
app.use(express.json()); // application/json           -> objeto
app.use(express.urlencoded({ extended: true })); // formulário HTML -> objeto
app.use(express.text()); // text/plain                 -> string
app.use(express.raw()); //  application/octet-stream   -> Buffer
```

---

## Encadeando handlers

- Uma rota aceita vários handlers em sequência.
- Cada um decide se responde ou se passa adiante com `next()`: é assim que validação e autorização entram antes do handler final:
- Quando várias rotas compartilham o caminho, `app.route()` evita repeti-lo:

---

## Encadeando handlers: Exemplo 1

```js
app.post('/tasks', requireJson, validateTask, createTask);
// Equivalente, com array:
app.post('/tasks', [requireJson, validateTask], createTask);
```

---

## Encadeando handlers: Exemplo 2

```js
app.route('/tasks/:id')
  .get(showTask)
  .put(updateTask)
  .delete(destroyTask);
```

---

## Modularizando com `express.Router()`

- Um arquivo único funciona bem com três rotas; com trinta, vira um problema.
- O `Router` é um mini-aplicativo: tem as próprias rotas e os próprios middlewares, e é montado sob um prefixo.
- Dentro do router os caminhos são relativos ao prefixo: `'/'` vira `/tasks` e `'/:id'` vira `/tasks/:id`.
- O projeto de exemplo separa ainda a montagem da aplicação da subida do servidor:
- A mudança em `app.js` é pequena, mas muda a arquitetura:

---

## Modularizando com `express.Router()`: Exemplo

```js
// antes: a rota morava no arquivo da aplicação
app.get('/tasks', (req, res) => {
  res.json(tasks);
});
app.use('/tasks', taskRouter);
```

---

## Executando

- Entre no projeto e instale as dependências:
- Suba o servidor:
- Liste as tarefas:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/express/projects/task-api-router
   pnpm install
```

---

## Executando: Exemplo 2

```bash
   pnpm dev
```

---

## Testando

- Nesta seção, testamos o roteamento modularizado com `express.Router()`.
- O objetivo é validar tanto a rota de listagem completa quanto a busca por ID inexistente.
- A rota montada sob o prefixo `/tasks` responde com a coleção de tarefas e status `200 OK`:
- `[ { "id": 1, "title": "Estudar rotas do Express", "done": true }, { "id": 2, "title": "Escrever a primeira API", "done": false } ]`
- Já a busca com um parâmetro de rota apontando para um recurso inexistente (`GET /tasks/99`) ativa a lógica de validação do router e retorna status `404...

---

## Testando: Exemplo 1

```txt
  ### Listar as tarefas
  GET http://localhost:3000/tasks
```

---

## Testando: Exemplo 2

```txt
  ### Buscar uma tarefa inexistente
  GET http://localhost:3000/tasks/99
```

---

## Exercício

- Ainda na etapa 2 da TaskAPI:
- Crie `src/routes/tag-router.js` com `GET /tags` e `GET /tags/:id`.
- Monte-o em `app.js` sob o prefixo `/tags`.
- Acrescente `GET /tags?minTasks=2` filtrando pela query string.
- Responda `400` quando `minTasks` não for numérico e `404` quando o `id` não existir.

---

## Exercício: Exemplo

```js
  import { Router } from 'express';
  const router = Router();
  const tags = [
    { id: 1, name: 'estudo', tasks: 3 },
    { id: 2, name: 'urgente', tasks: 1 },
  ];
  router.get('/', (req, res) => {
    const { minTasks } = req.query;
    if (minTasks === undefined) {
      return res.json(tags);
    }
    const limit = Number(minTasks);
    if (Number.isNaN(limit)) {
      return res.status(400).json({ message: '"minTasks" deve ser numérico' });
    }
    res.json(tags.filter((tag) => tag.tasks >= limit));
  });
```

---

## Desafio

- Escreva uma rota `GET /files/*splat` que devolva os segmentos capturados como array, e uma rota `GET /tasks/:id?` que responda a lista completa quando o id não vier.
- Verifique em qual ordem as duas precisam ser registradas para não se anularem.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Roteamento no Express: caminhos e padrões, parâmetros de rota, query string e corpo, encadeamento de handlers e modularização com express.Router().
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Parâmetros

- Qual a diferença de propósito entre `req.params` e `req.query`?
- Por que `req.query.tag` pode ser um array?
- Porque a query string aceita o mesmo nome repetido: `?tag=estudo&tag=urgente` vira `['estudo', 'urgente']`.
- Código que assume string quebra quando o cliente repete o parâmetro: `[req.query.tag].flat()` normaliza os dois casos.
- O que falta quando `req.body` é `undefined` em um `POST` com JSON?

---

## Router

- Por que o caminho dentro do router é `'/'` e não `'/tasks'`?
- Porque o prefixo é definido na montagem: `app.use('/tasks', taskRouter)`. Repetir `/tasks` dentro do router produziria `/tasks/tasks`.
- Isso permite remontar o mesmo router em outro prefixo: por exemplo, versionar a API em `/api/v1`.
- Qual a vantagem de `app.js` exportar o `app` sem chamar `listen`?
- Testes importam o `app` e fazem requisições sem abrir porta, e o mesmo `app` pode ser servido por outro processo (serverless, cluster) sem alteração.

---

## Na prática

- Os projetos executáveis desta aula são a etapa 2 da TaskAPI e a BMI API, que compara as três origens de dados no mesmo cálculo.

---

## Próxima aula

- Requisição e Resposta: cabeçalhos, negociação de conteúdo, status e os métodos que encerram a resposta.

---

## Resumo da Aula

- **Express.js: Rotas** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
