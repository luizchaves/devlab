---
title: JavaScript: Async/Await
description: Promises, async/await e tratamento de erros em código assíncrono.
course: cstrc-jp-dw
sidebar:
  label: Async/Await
  order: 3
---

Operações de entrada e saída — ler um arquivo, consultar um banco, chamar uma API —
não terminam imediatamente. Em JavaScript elas retornam uma **Promise**.

## Promise

Uma Promise representa um valor que ainda não existe. Ela pode ser resolvida (com um
valor) ou rejeitada (com um erro).

```js title="promise.js"
const promessa = new Promise((resolve) => {
  setTimeout(() => resolve('pronto'), 1000);
});

promessa.then((valor) => console.log(valor));
```

## async/await

`await` pausa a função até a Promise resolver, deixando o código com aparência
sequencial. Só pode ser usado dentro de uma função `async`.

```js title="async.js" showLineNumbers {2,5}
async function carregarUsuarios() {
  const resposta = await fetch('http://localhost:3000/users');
  const usuarios = await resposta.json();

  return usuarios;
}
```

Toda função `async` retorna uma Promise — por isso quem a chama também precisa de
`await` (ou `.then()`).

## Tratamento de erros

Use `try`/`catch` em volta do `await`:

```js title="erros.js" {2-7}
async function carregar() {
  try {
    const resposta = await fetch('http://localhost:3000/users');
    return await resposta.json();
  } catch (erro) {
    console.error('Falha ao carregar usuários:', erro);
    return [];
  }
}
```

## Sequencial vs. paralelo

Dois `await` seguidos executam em sequência. Quando as operações são independentes,
dispare todas e aguarde com `Promise.all`:

```js title="paralelo.js" del={2-3} ins={5}
// 2 segundos no total
const usuarios = await buscarUsuarios();
const posts = await buscarPosts();

const [usuarios, posts] = await Promise.all([buscarUsuarios(), buscarPosts()]);
```

## Por que isso importa no Express

Os controllers que acessam banco de dados são funções `async`. A partir do Express 5,
erros lançados dentro delas chegam automaticamente ao middleware de erro — sem
precisar de `try`/`catch` em cada rota.

```js title="src/controllers/user-controller.js"
export async function index(req, res) {
  const users = await prisma.user.findMany();

  res.json(users);
}
```

## Exercício

Escreva uma função `async` que busque `https://jsonplaceholder.typicode.com/users`,
trate o erro de rede com `try`/`catch` e imprima apenas os nomes.

## Próxima aula

[Fetch API](../fetch-api/) — fazendo requisições HTTP.
