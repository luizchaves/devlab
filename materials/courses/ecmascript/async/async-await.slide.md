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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Async/Await"
description: "Sintaxe async/await como camada sobre Promises, tratamento de erros com try...catch...finally, execução sequencial vs. paralela e top-level await no Node.js."
---

<!-- _class: lead -->

# JavaScript: Async/Await

Sintaxe async/await como camada sobre Promises, tratamento de erros com try...catch...finally, execução sequencial vs. paralela e top-level await no Node.js.

---

## Objetivo

- Compreender o papel de `async` e `await` como camada de sintaxe (syntactic sugar) sobre Promises.

---

## Mapa da Aula

- O que é Async/Await? (Açúcar Sintático sobre Promises)
- Declaração e Comportamento de Funções Async
- Coerção de Retorno e Exceções
- Tratamento de Erros com `try...catch...finally`
- Execução Sequencial vs. Execução Paralela
- Top-Level Await e Aplicações no Node.js / Express

---

## O que é Async/Await? (Açúcar Sintático sobre Promises)

- Introduzidas no ES2017 (ES8), as palavras-chave `async` e `await` não substituem as Promises — elas trabalham juntas com as Promises.
- Por baixo dos panos, a instrução `await` só funciona quando colocada antes de um valor ou função que retorne uma Promise.
- Além disso, o retorno de toda função marcada com `async` é automaticamente envolvido em uma Promise.
- Referência: async function | MDN.

---

## O que é Async/Await? (Açúcar Sintático sobre Promises) (Comparação)

| Recurso | Descrição | Comportamento |
| ------- | --------- | ------------- |
| **`async`** | Modificador colocado antes da declaração de uma função | Faz a função **retornar obrigatoriamente uma Promise** |
| **`await`** | Operador utilizado dentro de uma função `async` | **Pausa a execução** da função até que a Promise seja liquidada |

---

## O que é Async/Await? (Açúcar Sintático sobre Promises) (Exemplo)

```js
// 1. Consumo com Promises e encadeamento .then()
function fetchUserThen(id) {
  return fetch(`https://api.devlab.org/users/${id}`)
    .then((response) => response.json())
    .then((user) => console.log(user))
    .catch((error) => console.error(error));
}

// 2. Consumo idêntico usando Async/Await
async function fetchUserAsync(id) {
  try {
    const response = await fetch(`https://api.devlab.org/users/${id}`);
// ...
```

---

## Declaração e Comportamento de Funções Async

- Você pode utilizar a palavra-chave `async` em qualquer tipo de declaração de função em JavaScript.

---

## Declaração e Comportamento de Funções Async (Exemplo)

```js
// 1. Declaração de Função Tradicional
async function getData() {
  return "Dados carregados";
}

// 2. Arrow Function Assíncrona
const getCategories = async () => {
  return ["Tecnologia", "Redes", "Web"];
};

// 3. Método Assíncrono em Objeto ou Classe
const apiService = {
// ...
```

---

## Coerção de Retorno e Exceções

- Retornar um valor comum (ex: `return "sucesso"`) equivale a retornar `Promise.resolve("sucesso")`.
- Lançar um erro com `throw` (ex: `throw new Error("falha")`) equivale a retornar `Promise.reject(erro)`.
- Dentro de uma função `async`

---

## Coerção de Retorno e Exceções (Exemplo)

```js
async function checkNumber(num) {
  if (num < 0) {
    throw new Error("Número negativo não permitido"); // Vira Promise.reject
  }
  return num * 2; // Vira Promise.resolve
}

// Consumindo o retorno da função async como uma Promise normal
checkNumber(5)
  .then((res) => console.log("Resultado:", res)) // "Resultado: 10"
  .catch((err) => console.error(err.message));

checkNumber(-1)
  .catch((err) => console.error("Erro capturado:", err.message)); // "Erro capturado: Número..."
```

---

## Tratamento de Erros com `try...catch...finally`

- Em código assíncrono baseado em `.then()`, os erros são capturados com `.catch()`.
- Com `async/await`, o tratamento de erros utiliza a estrutura tradicional `try...catch...finally` do JavaScript.
- A função nativa `fetch()` só rejeita a Promise em caso de falha de conexão de rede.
- Para códigos de erro HTTP (como 404 Not Found ou 500 Server Error), a Promise resolve normalmente com `response.ok = false`.
- Sempre verifique `if (!response.ok)` para lançar um erro intencional!

---

## Tratamento de Erros com `try...catch...finally` (Exemplo)

```js
async function loadUserProfile(userId) {
  try {
    console.log("Buscando usuário...");
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

    // Verificação de erros de status HTTP (ex: 404 Not Found ou 500 Server Error)
    if (!response.ok) {
      throw new Error(`Erro na requisição: Status ${response.status}`);
    }

    const user = await response.json();
    return user;
// ...
```

---

## O Gargalo da Execução Sequencial

- Quando colocamos `await` na frente de cada chamada de forma isolada.

---

## O Gargalo da Execução Sequencial (Exemplo)

```js
function delay(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function loadDataSequentially() {
  console.time("Tempo Sequencial");

  // A segunda busca aguarda a primeira terminar!
  const users = await delay(2000, ["Ana", "Bruno"]);
  const posts = await delay(2000, ["Post A", "Post B"]);

  console.timeEnd("Tempo Sequencial"); // ~4000ms
  return { users, posts };
}
```

---

## A Solução em Paralelo com `Promise.all()` e `await`

- O método `.forEach()` de arrays não aguarda Promises.
- Colocar `await` dentro do callback de um `.forEach()` fará o laço continuar executando sem esperar pelas requisições!
- Para executar requisições em paralelo a partir de um array de itens, utilize `.map()` com `Promise.all()`

---

## A Solução em Paralelo com `Promise.all()` e `await` (Comparação)

| Abordagem | Funcionamento | Tempo de Execução Total | Quando Utilizar? |
| --------- | ------------- | ----------------------- | ---------------- |
| **Sequencial** | Um `await` após o outro | Soma de todos os tempos ($\sum t$) | Quando a 2ª chamada depende dos dados da 1ª |
| **Paralela** | Dispara todas e faz `await Promise.all()` | Tempo da operação mais longa ($\max t$) | Quando as chamadas são independentes |

---

## A Solução em Paralelo com `Promise.all()` e `await` (Exemplo)

```js
async function loadDataInParallel() {
  console.time("Tempo Paralelo");

  // Dispara ambas as requisições em paralelo (sem await inicial)
  const usersPromise = delay(2000, ["Ana", "Bruno"]);
  const postsPromise = delay(2000, ["Post A", "Post B"]);

  // Aguarda a resolução simultânea das duas Promises
  const [users, posts] = await Promise.all([usersPromise, postsPromise]);

  console.timeEnd("Tempo Paralelo"); // ~2000ms
  return { users, posts };
}
```

---

## Top-Level Await

- Em Módulos ES (ESM com `"type": "module"` no `package.json`), você pode utilizar a palavra-chave `await` no nível superior do arquivo.

---

## Top-Level Await (Exemplo)

```js
// database.js (Módulo ES)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Top-Level Await: aguarda a conexão com o banco antes de exportar
await prisma.$connect();
console.log("Conexão com o banco de dados estabelecida com sucesso!");

export default prisma;
```

---

## Controllers Assíncronos no Express 5

- No ecossistema Node.js (especialmente com Express e ORMs como Prisma ou Sequelize).

---

## Controllers Assíncronos no Express 5 (Exemplo)

```js
import prisma from "../database.js";

// Controller de listagem de usuários
export async function index(req, res) {
  // O await aguarda a consulta ao banco de dados sem travar o servidor Node.js
  const users = await prisma.user.findMany();
  res.json(users);
}

// Controller de busca por ID
export async function show(req, res) {
  const { id } = req.params;
// ...
```

---

## Resumo e Boas Práticas

- Toda função declarada com `async` retorna uma Promise.
- Utilize blocos `try...catch...finally` em volta dos comandos `await` para gerenciar exceções.
- Lembre-se de verificar `response.ok` ao usar a Fetch API nativa.
- Não encadeie `await` sequenciais para chamadas independentes; utilize `await Promise.all()` para disparar requisições em paralelo.
- Substitua laços `.forEach()` com `await` por `array.map()` combinado a `Promise.all()`.

---

## Declaração e Funcionamento

- O que são as palavras-chave `async` e `await` e qual é a sua relação com Promises?
- `async` e `await` são uma camada de sintaxe mais limpa (syntactic sugar) construída diretamente sobre Promises.
- A palavra-chave `async` faz uma função retornar obrigatoriamente uma Promise.
- O que acontece com o valor retornado por uma função declarada como `async`?
- O valor retornado é automaticamente encapsulado em uma Promise resolvida (`Promise.resolve(valor)`).

---

## Tratamento de Erros e Fetch API

- Como é feito o tratamento de erros ao utilizar a sintaxe `async/await`?
- O tratamento de erros é feito utilizando a estrutura tradicional `try...catch...finally`.
- Qualquer rejeição de Promise aguardada com `await` é capturada como uma exceção dentro do bloco `catch`.
- Por que a função nativa `fetch()` não entra no bloco `catch` em respostas com status HTTP 404 ou 500?
- Porque a função `fetch()` só rejeita a Promise em caso de falha de conexão física de rede.

---

## Desempenho e Aplicações

- O que é o gargalo da execução sequencial com `await` e como evitá-lo em chamadas independentes?
- O gargalo ocorre quando colocamos `await` seguidos antes de disparar cada requisição, fazendo uma esperar o término da outra.
- Para evitá-lo em requisições independentes, devemos disparar todas em paralelo e aguardar os resultados combinados com `await Promise.
- Por que não devemos usar `await` dentro de um laço `.forEach()` ao iterar sobre arrays?
- Porque a função de callback do `.forEach()` não aguarda o retorno de Promises.

---

## Executando

- Crie um arquivo chamado `async-demo.js`
- Execute o arquivo com Node.js no terminal
- Altere os IDs da busca para observar os fluxos de sucesso e exceção.
- Os conceitos de `async/await` e tratamento de erros podem ser testados diretamente no terminal com o Node.js.

---

## Exercício

- Escreva uma função assíncrona `fetchUserNames()` que faça uma requisição HTTP para a API pública `https://jsonplaceholder.typicode.
- Utilize `try/catch` para tratar possíveis erros de conexão ou requisição;
- Verifique a propriedade `response.ok` antes de converter a resposta para JSON;
- Mapeie o array de usuários retornado e imprima apenas uma lista com o `name` e o `email` de cada usuário no console.
- Crie um arquivo chamado `async-exercise.js` para exercitar requisições de API com `async/await` e `try/catch`

---

## Desafio

- Crie 3 funções que retornem Promises simulando APIs de serviço
- `fetchServerHealth()` (resolve em 300ms com `{ status: "Healthy", uptime: "99.9%" }`);
- `fetchStorageMetrics()` (resolve em 400ms com `{ usedGb: 450, totalGb: 1000 }`);
- `fetchBackupLogs()` (simula falha em 200ms rejeitando com `"Falha ao conectar ao serviço de backup"`);
- Crie uma função assíncrona `loadDashboardData()` que dispare as 3 chamadas simultaneamente em paralelo utilizando `Promise.

---

## Resumo da Aula

- **Syntactic Sugar**: `async/await` simplifica o consumo de Promises mantendo a legibilidade de código estruturado sequencial.
- **Funções async**: Sempre retornam uma Promise (valores de retorno são empacotados com `Promise.resolve()`).
- **Operador await**: Pausa a execução da função assíncrona até a resolução da Promise sem bloquear a thread principal.
- **Tratamento com try/catch**: Exceções e rejeições são tratadas com blocos `try...catch...finally` padrão da linguagem.
- **Paralelismo & Top-Level Await**: Usar `Promise.all()` para evitar sequenciamento lento; `await` direto no escopo raiz de módulos ESM.
