---
title: 'JavaScript: Promises'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Promises

## Objetivo
- Compreender o modelo assíncrono e monotthread do JavaScript, dominar o conceito e o ciclo de vida de uma Promise.

## O que é Assincronismo em JavaScript?
- Modelo: Funcionamento; Problema / Desafio
- Síncrono: Cada instrução é executada em sequência, bloqueando a próxima até terminar.
- Callbacks: Funções passadas como argumento para serem executadas após a conclusão.
- Promises: Objetos que representam o resultado futuro de uma operação assíncrona.
- O JavaScript executa código em um ambiente de linha de execução única (single-threaded) guiado por um Event Loop.
- Operações de entrada e saída (I/O) — como buscar dados em uma API.

## O Conceito e Estados de uma Promise
- Pending: Pendente; Estado inicial. A operação assíncrona ainda está em execução
- Fulfilled: Realizada / Resolvida; A operação foi concluída com sucesso e retornou um valor
### Transições e inspeção no console
- Estado: Descrição; Transição de Estado
- `pending` (Pendente): Estado inicial da Promise. A operação assíncrona ainda está em andamento..
- `fulfilled` (Realizada / Resolvida): A operação assíncrona foi concluída com sucesso. Retorna um valor..
- `rejected` (Rejeitada): A operação assíncrona falhou ou gerou um erro. Retorna um motivo/erro..

## Criando e Consumindo Promises
### Outro exemplo: validação com resolve e reject
- `Promise.resolve(valor)`: Retorna uma Promise já resolvida com o valor especificado.
- `Promise.reject(motivo)`: Retorna uma Promise já rejeitada com o motivo/erro especificado.
### Execução Síncrona do Executor
- A função passada para `new Promise()` é chamada de executor.
- O executor roda imediatamente, antes de `.then()`, `.catch()` ou `await`.
### Consumindo com `.then()`, `.catch()` e `.finally()`
- `.then(onFulfilled)`: Quando a Promise transita para `Fulfilled`; Recebe o valor resolvido
- `.catch(onRejected)`: Quando a Promise transita para `Rejected` ou lança um erro; Recebe o erro ocorrido
- `.finally(onFinally)`: Quando a Promise é liquidada (independente de sucesso ou erro); Executa código de limpeza
- Três métodos encadeáveis cobrem os caminhos possíveis de uma promessa — sucesso, falha e finalização

## Encadeamento de Promises (Promise Chaining)
- Uma das maiores vantagens das Promises é a capacidade de encadear chamadas `.then()`.
- Quando uma função dentro de um `.then()` retorna um valor simples.
- Se ela retornar outra Promise, o próximo `.then()` aguardará a resolução dessa nova Promise antes de prosseguir.

## Combinadores de Promises
- Método Estático: Comportamento de Sucesso; Comportamento de Falha
- `Promise.all([p1, p2])`: Resolve quando todas forem resolvidas (retorna array de resultados).
- `Promise.allSettled([p1, p2])`: Resolve quando todas forem liquidadas (sucesso ou falha); Nunca rejeita globalmente.
- `Promise.race([p1, p2])`: Resolve/rejeita assim que a primeira Promise da lista for liquidada.
- `Promise.any([p1, p2])`: Resolve assim que a primeira com sucesso for resolvida.
- Quando precisamos gerenciar múltiplas Promises simultaneamente.

## Ordem de Execução: Event Loop e Microtask Queue
- Código Síncrono (Call Stack): Executado imediatamente, de cima para baixo.
- Fila de Microtasks (Microtask Queue): Armazena callbacks de Promises (`.then`, `.catch`.
- Fila de Macrotasks (Macrotask / Task Queue): Armazena temporizadores (`setTimeout`.

## Consumo Prático da Fetch API e Validação de `response.ok`
- No consumo de recursos de rede no navegador com a `Fetch API`.

## Conexão com Async/Await
- No ES2017, o JavaScript introduziu as palavras-chave `async` e `await`.

## Resumo e Boas Práticas
- Lembre-se dos 3 estados de uma Promise: `Pending`, `Fulfilled` e `Rejected`.
- O estado de uma Promise transita uma única vez e torna-se imutável após ser liquidado.
- Use `Promise.all()` quando precisar de todas as respostas em paralelo e uma falha deva cancelar o processo.
- Use `Promise.allSettled()` quando quiser obter os resultados de todas as requisições mesmo que algumas falhem.
- Sempre inclua um tratamento de erro com `.catch()` ou `try...catch` ao consumir Promises.
- Retorne Promises para permitir encadeamento com `.then()` ou consumo com `await`.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
