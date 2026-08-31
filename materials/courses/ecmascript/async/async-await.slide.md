---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Async/Await"
description: "Slides completos da aula JavaScript: Async/Await."
---

<!-- _class: lead -->

# JavaScript: Async/Await

Sintaxe async/await como camada sobre Promises, tratamento de erros com try...catch...finally, execução sequencial vs. paralela e top-level await no Node.js.

---

## Objetivo

- Compreender o papel de `async` e `await` como camada de sintaxe (*syntactic sugar*) sobre Promises, declarar e consumir...

---

## Mapa da Aula

- O que é Async/Await? (Açúcar Sintático sobre Promises)
- Declaração e Comportamento de Funções Async
- Coerção de Retorno e Exceções
- Tratamento de Erros com `try...catch...finally`
- Execução Sequencial vs. Execução Paralela
- Resumo e Boas Práticas
- Executando
- Exercício

---

## Introdução

- Esta aula apresenta as palavras-chave `async` e `await` em JavaScript
- como escrever código assíncrono com a mesma legibilidade e estrutura do código síncrono, como tratar erros com blocos...

---

## O que é Async/Await? (Açúcar Sintático sobre Promises)

- Introduzidas no ES2017 (ES8), as palavras-chave `async` e `await` não substituem as Promises — elas trabalham juntas com...
- O diagrama a seguir demonstra como o motor do JavaScript pausa temporariamente a função `async` no ponto do `await` e...
- Diagrama da página
- Fluxo de Execução com Async/Await e Liberação da Thread Principal
- Por baixo dos panos, a instrução `await` só funciona quando colocada antes de um valor ou função que retorne uma Promise

---

## O que é Async/Await? (Açúcar Sintático sobre Promises): Comparação

| Recurso | Descrição | Comportamento |
| ------- | --------- | ------------- |
| **`async`** | Modificador colocado antes da declaração de uma função | Faz a função **retornar obrigatoriamente uma Promise** |
| **`await`** | Operador utilizado dentro de uma função `async` | **Pausa a execução** da função até que a Promise seja liquidada |

---

## Comparação de Sintaxe: Promises .then() vs Async/Await

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
 const user = await response.json();
 console.log(user);
} catch (error) {
 console.error(error);
}
}
```

---

## Declaração e Comportamento de Funções Async

- Você pode utilizar a palavra-chave `async` em qualquer tipo de declaração de função em JavaScript

---

## Formas de declaração de funções async

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
async fetchStatus() {
 return { status: "OK", uptime: 99.9 };
},
};
```

---

## Coerção de Retorno e Exceções

- Retornar um valor comum (ex: `return "sucesso"`) equivale a retornar `Promise.resolve("sucesso")`.
- Lançar um erro com `throw` (ex: `throw new Error("falha")`) equivale a retornar `Promise.reject(erro)`.

---

## Coerção de retornos em funções async

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

- Em código assíncrono baseado em `.then()`, os erros são capturados com `.catch()`
- Com `async/await`, o tratamento de erros utiliza a estrutura tradicional `try...catch...finally` do JavaScript
- A função nativa `fetch()` só rejeita a Promise em caso de falha de conexão de rede
- Para códigos de erro HTTP (como 404 Not Found ou 500 Server Error), a Promise resolve normalmente com `response.ok = false`
- Sempre verifique `if (!response.ok)` para lançar um erro intencional

---

## Estrutura completa de tratamento de erros

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

} finally {
 console.log("Operação de busca encerrada.");
}
}
```

---

## Execução Sequencial vs. Execução Paralela

- Uma das armadilhas mais comuns ao utilizar `async/await` é criar gargalos de desempenho executando operações...

---

## O Gargalo da Execução Sequencial

- Quando colocamos `await` na frente de cada chamada de forma isolada, a segunda requisição só começará a ser executada...

---

## Execução Sequencial (Lenta: 2s + 2s = 4s total)

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

- Se as operações forem independentes, devemos disparar ambas as Promises simultaneamente e aguardar o resultado combinado...
- O método `.forEach()` de arrays não aguarda Promises
- Colocar `await` dentro do callback de um `.forEach()` fará o laço continuar executando sem esperar pelas requisições
- Para executar requisições em paralelo a partir de um array de itens, utilize `.map()` com `Promise.all()`:

---

## A Solução em Paralelo com `Promise.all()` e `await`: Comparação

| Abordagem | Funcionamento | Tempo de Execução Total | Quando Utilizar? |
| --------- | ------------- | ----------------------- | ---------------- |
| **Sequencial** | Um `await` após o outro | Soma de todos os tempos ($\sum t$) | Quando a 2ª chamada depende dos dados da 1ª |
| **Paralela** | Dispara todas e faz `await Promise.all()` | Tempo da operação mais longa ($\max t$) | Quando as chamadas são independentes |

---

## Execução Paralela com Promise.all (Rápida: Max(2s, 2s) = 2s total)

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

## A Solução em Paralelo com `Promise.all()` e `await`

```js
const users = await Promise.all(userIds.map((id) => fetchUser(id)));
```

---

## Top-Level Await

- Em Módulos ES (ESM com `"type"
- "module"` no `package.json`), você pode utilizar a palavra-chave `await` no nível superior do arquivo, fora de qualquer...

---

## Exemplo de Top-Level Await em arquivo ES Module

```js
// database.js (Módulo ES)

const prisma = new PrismaClient();

// Top-Level Await: aguarda a conexão com o banco antes de exportar
await prisma.$connect();
console.log("Conexão com o banco de dados estabelecida com sucesso!");

export default prisma;
```

---

## Controllers Assíncronos no Express 5

- No ecossistema Node.js (especialmente com Express e ORMs como Prisma ou Sequelize), as funções de controller que acessam...
- A partir do Express 5, qualquer rejeição de Promise ou erro lançado em um controller `async` é repassado automaticamente...

---

## src/controllers/user-controller.js

```js

// Controller de listagem de usuários
export async function index(req, res) {
// O await aguarda a consulta ao banco de dados sem travar o servidor Node.js
const users = await prisma.user.findMany();
res.json(users);
}

// Controller de busca por ID
export async function show(req, res) {
const { id } = req.params;
const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  // ...
 return res.status(404).json({ error: "Usuário não encontrado" });
}

res.json(user);
}
```

---

## Resumo e Boas Práticas

- Toda função declarada com `async` retorna uma Promise.
- Utilize blocos `try...catch...finally` em volta dos comandos `await` para gerenciar exceções.
- Lembre-se de verificar `response.ok` ao usar a Fetch API nativa.
- Não encadeie `await` sequenciais para chamadas independentes; utilize `await Promise.all()` para disparar requisições em...
- Substitua laços `.forEach()` com `await` por `array.map()` combinado a `Promise.all()`.

---

## Executando

- Crie um arquivo chamado `async-demo.js`:
- Execute o arquivo com Node.js no terminal:
- Altere os IDs da busca para observar os fluxos de sucesso e exceção.

---

## async-demo.js

```js
function fetchUserData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({ id: 1, name: "Ana Silva", role: "Engenheira de Redes" });
      } else {
        reject(new Error("Usuário não localizado no sistema"));
      }
    }, 500);
  });
}

  // ...
    console.log("Encerrando execução.");
  }
}

main();
```

---

## Terminal

```bash
node async-demo.js
```

---

## Output

```txt
Iniciando busca assíncrona...
Usuário encontrado: Ana Silva
Tentando buscar usuário inexistente...
Capturado no bloco catch: Usuário não localizado no sistema
Encerrando execução.
```

---

## Exercício

- Escreva uma função assíncrona `fetchUserNames()` que faça uma requisição HTTP para a API pública...
- Utilize `try/catch` para tratar possíveis erros de conexão ou requisição;
- Verifique a propriedade `response.ok` antes de converter a resposta para JSON;
- Mapeie o array de usuários retornado e imprima apenas uma lista com o `name` e o `email` de cada usuário no console.

---

## Desafio

- Crie 3 funções que retornem Promises simulando APIs de serviço:
- `fetchServerHealth()` (resolve em 300ms com ` `);
- `fetchStorageMetrics()` (resolve em 400ms com ` `);
- `fetchBackupLogs()` (simula falha em 200ms rejeitando com `"Falha ao conectar ao serviço de backup"`);
- Crie uma função assíncrona `loadDashboardData()` que dispare as 3 chamadas simultaneamente em paralelo utilizando...

---

## Declaração e Funcionamento

- O que são as palavras-chave `async` e `await` e qual é a sua relação com Promises
- O que acontece com o valor retornado por uma função declarada como `async`
- É possível utilizar o operador `await` fora de uma função marcada como `async`

---

## Tratamento de Erros e Fetch API

- Como é feito o tratamento de erros ao utilizar a sintaxe `async/await`
- Por que a função nativa `fetch()` não entra no bloco `catch` em respostas com status HTTP 404 ou 500
- Para que serve o bloco `finally` em uma estrutura `try...catch...finally` assíncrona

---

## Desempenho e Aplicações

- O que é o gargalo da execução sequencial com `await` e como evitá-lo em chamadas independentes
- Por que não devemos usar `await` dentro de um laço `.forEach()` ao iterar sobre arrays
- Por que os controllers que acessam banco de dados no Node.js/Express são declarados como funções `async`
- Qual é a vantagem de utilizar `Promise.allSettled()` junto com `await` em vez de `Promise.all()`

---

## Próxima aula

- Expressões Regulares (RegExp)
- Padrões de busca, quantificadores, classes de caracteres e métodos RegExp

---

## Resumo da Aula

- Revise o que é Async/Await? (Açúcar Sintático sobre Promises)
- Revise declaração e Comportamento de Funções Async
- Revise coerção de Retorno e Exceções
- Revise tratamento de Erros com `try...catch...finally`
- Revise execução Sequencial vs. Execução Paralela
- Revise resumo e Boas Práticas
- Revise executando
