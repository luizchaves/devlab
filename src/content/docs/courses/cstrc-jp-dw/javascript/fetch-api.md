---
title: "JavaScript: Fetch API"
description: Consumindo APIs HTTP com fetch, tanto no navegador quanto no Node.js.
course: cstrc-jp-dw
---

`fetch` é a função padrão para requisições HTTP. Ela existe no navegador e, desde a
versão 18, também no Node.js — sem instalar nada.

## GET

```js title="get.js" showLineNumbers {2,4}
async function listarUsuarios() {
  const resposta = await fetch('http://localhost:3000/users');

  if (!resposta.ok) {
    throw new Error(`Erro HTTP ${resposta.status}`);
  }

  return resposta.json();
}
```

:::caution[`fetch` não rejeita em erro HTTP]
Um `404` ou `500` **não** lança exceção: a Promise resolve normalmente. Sempre
verifique `resposta.ok` ou `resposta.status`.
:::

## POST com JSON

Três coisas são obrigatórias: o método, o cabeçalho `Content-Type` e o corpo
serializado com `JSON.stringify`.

```js title="post.js" showLineNumbers {3-6}
async function criarUsuario(dados) {
  const resposta = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  return resposta.json();
}

await criarUsuario({ name: 'Ana', email: 'ana@example.com' });
```

## PUT e DELETE

```js title="put-delete.js"
await fetch(`http://localhost:3000/users/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ana Silva' }),
});

await fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' });
```

Respostas `204 No Content` não têm corpo — chamar `.json()` nelas lança erro.

## Query string

Monte parâmetros com `URLSearchParams` em vez de concatenar strings:

```js title="query.js"
const params = new URLSearchParams({ page: '1', limit: '10' });
const resposta = await fetch(`http://localhost:3000/users?${params}`);
```

## Testando pelo terminal

Enquanto não há front-end, use `curl` para exercitar a API:

```bash
curl http://localhost:3000/users

curl -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"ana@example.com"}'
```

## Exercício

Escreva um pequeno script Node que crie um usuário, liste todos, atualize o nome do
usuário criado e por fim o remova — imprimindo o status de cada etapa.

## Próxima aula

[Node.js: Fundamentos](../../node/) — executando JavaScript no servidor.
