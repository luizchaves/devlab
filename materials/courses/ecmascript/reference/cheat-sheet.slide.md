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
title: "Guia de Referência: ECMAScript"
description: "Guia completo de referência rápida de todas as assinaturas de métodos, funções e operadores nativos do ECMAScript (JavaScript)."
---

<!-- _class: lead -->

# Guia de Referência: ECMAScript

Guia completo de referência rápida de todas as assinaturas de métodos, funções e operadores nativos do ECMAScript (JavaScript).

---

## Objetivo

- Reconhecer os conceitos centrais da página e aplicá-los em código JavaScript.
- Diferenciar sintaxes parecidas pelo comportamento em tempo de execução.
- Ler exemplos reais com atenção a entrada, saída e efeitos colaterais.
- Praticar o tema com exercícios progressivos.

---

## Mapa da Aula

- Legenda e Convenções
- Operadores, Estruturas e Sintaxe Base
- Funções Globais e Utilitários de Tipo
- Array (`Array` Estático e `Array.prototype`)
- String (`String` Estático e `String.prototype`)
- Object (`Object` Estáticos e `Object.prototype`)

---

## Legenda e Convenções

- `param?`: parâmetro opcional.
- `...args`: operador rest (aceita múltiplos argumentos).
- `Mutador`: altera o objeto/array original diretamente (in-place).
- `Acessor`: não altera o original (retorna uma cópia ou novo valor).
- `HOF`: Higher-Order Function (função que recebe outra callback como parâmetro).

---

## Operadores Especiais e Atribuição Lógica

| Operador / Sintaxe | Assinatura / Exemplo | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `typeof` | `typeof operand` | `string` | Retorna o nome do tipo primitivo ou `"object"` / `"function"`. |
| `instanceof` | `obj instanceof Constructor` | `boolean` | Testa se `Constructor.prototype` está na cadeia de protótipos de `obj`. |
| `in` | `'prop' in obj` | `boolean` | Verifica se a propriedade existe no objeto ou em sua cadeia de protótipos. |
| `delete` | `delete obj.prop` | `boolean` | Remove uma propriedade de um objeto. |
| `void` | `void expression` | `undefined` | Avalia a expressão e retorna `undefined`. |

---

## Operadores Especiais e Atribuição Lógica (Exemplo)

```js
const user = null;
const name = user?.profile?.name ?? "Visitante"; // "Visitante"

let config = {};
config.theme ||= "dark"; // config.theme vira "dark"
```

---

## Funções Globais e Utilitários de Tipo

| Função / Operador | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Array.isArray()` | `Array.isArray(value)` | `boolean` | Verifica se `value` é uma instância de `Array`. |
| `Number.isNaN()` | `Number.isNaN(value)` | `boolean` | Verifica se `value` é estritamente `NaN` (sem coerção de tipo). |
| `Number.isFinite()` | `Number.isFinite(value)` | `boolean` | Verifica se `value` é um número finito (sem coerção). |
| `Number.isInteger()` | `Number.isInteger(value)` | `boolean` | Verifica se `value` é um número inteiro. |
| `Number.isSafeInteger()`| `Number.isSafeInteger(value)`| `boolean` | Verifica se é um inteiro seguro (`-(2^53 - 1)` a `2^53 - 1`). |

---

## Funções Globais e Utilitários de Tipo (Exemplo)

```js
const original = { a: 1, b: { c: 2 }, d: new Date() };
const copy = structuredClone(original); // Clone profundo real de objeto e data
```

---

## Métodos Estáticos de Array

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Array.isArray()` | `Array.isArray(value)` | `boolean` | Testa se o valor fornecido é um `Array`. |
| `Array.from()` | `Array.from(arrayLike, mapFn?, thisArg?)` | `Array` | Cria um `Array` a partir de um objeto iterável ou array-like. |
| `Array.fromAsync()` | `Array.fromAsync(asyncIterable, mapFn?, thisArg?)` | `Promise<Array>` | (ES2024) Cria um `Array` a partir de um iterável assíncrono. |
| `Array.of()` | `Array.of(...elementN)` | `Array` | Cria um novo `Array` contendo todos os argumentos fornecidos. |

---

## Métodos Mutadores (Alteram o Array Original)

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `push()` | `arr.push(...elementN)` | `number` | Adiciona elementos ao **final**. Retorna o novo `length`. |
| `pop()` | `arr.pop()` | `element \| undefined` | Remove e retorna o **último** elemento. |
| `unshift()` | `arr.unshift(...elementN)` | `number` | Adiciona elementos ao **início**. Retorna o novo `length`. |
| `shift()` | `arr.shift()` | `element \| undefined` | Remove e retorna o **primeiro** elemento. |
| `splice()` | `arr.splice(start, deleteCount?, ...items)` | `Array` | Remove, substitui ou adiciona elementos em qualquer posição. Retorna removidos. |

---

## Métodos Acessores (Não Mutadores)

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `at()` | `arr.at(index)` | `element \| undefined` | Retorna o elemento na posição `index` (aceita índices negativos). |
| `concat()` | `arr.concat(...valueN)` | `Array` | Retorna um novo array combinando o original com os valores/arrays fornecidos. |
| `slice()` | `arr.slice(start?, end?)` | `Array` | Retorna uma cópia de uma fatia do array (índice `start` até `end` exclusive). |
| `includes()` | `arr.includes(searchElement, fromIndex?)` | `boolean` | Verifica se o array contém determinado elemento. |
| `indexOf()` | `arr.indexOf(searchElement, fromIndex?)` | `number` | Retorna o primeiro índice do elemento ou `-1`. |

---

## Iteradores e HOFs (Higher-Order Functions)

| Método | Assinatura Callback | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `forEach()` | `arr.forEach(fn(element, index?, array?), thisArg?)` | `undefined` | Executa a função `fn` para cada elemento. |
| `map()` | `arr.map(fn(element, index?, array?), thisArg?)` | `Array` | Retorna novo array contendo o resultado da aplicação de `fn` em cada item. |
| `filter()` | `arr.filter(fn(element, index?, array?), thisArg?)` | `Array` | Retorna novo array com elementos que passaram no teste lógico da `fn`. |
| `reduce()` | `arr.reduce(fn(acc, val, index?, array?), initialVal?)` | `any` | Reduz o array a um único valor acumulado (da esquerda para a direita). |
| `reduceRight()`| `arr.reduceRight(fn(acc, val, index?, array?), initialVal?)` | `any` | Reduz o array a um único valor acumulado (da direita para a esquerda). |

---

## Métodos Imutáveis de Alteração (ES2023) e Agrupamento (ES2024)

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `toSorted()` | `arr.toSorted(compareFn?)` | `Array` | Retorna nova cópia do array ordenada sem modificar o original. |
| `toReversed()`| `arr.toReversed()` | `Array` | Retorna nova cópia do array invertida sem modificar o original. |
| `toSpliced()` | `arr.toSpliced(start, deleteCount?, ...items)` | `Array` | Retorna nova cópia do array modificada por corte/inserção sem alterar o original. |
| `with()` | `arr.with(index, value)` | `Array` | Retorna novo array substituindo o elemento no `index` especificado por `value`. |
| `Object.groupBy()` | `Object.groupBy(iterable, callbackFn(element, index))` | `Object` | (ES2024) Agrupa elementos de um iterável em um objeto baseado nas chaves retornadas pela callback. |

---

## Métodos Imutáveis de Alteração (ES2023) e Agrupamento (ES2024) (Exemplo)

```js
const items = [{ name: "Maçã", category: "fruta" }, { name: "Cenoura", category: "legume" }];

// ES2024 Object.groupBy
const grouped = Object.groupBy(items, (item) => item.category);
// { fruta: [{ name: "Maçã", ... }], legume: [{ name: "Cenoura", ... }] }
```

---

## Métodos Estáticos de String

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `fromCharCode()` | `String.fromCharCode(...codes)` | `string` | Cria uma string a partir de uma sequência de valores UTF-16. |
| `fromCodePoint()`| `String.fromCodePoint(...codePoints)` | `string` | Cria uma string a partir de pontos de código Unicode (Code Points). |
| `raw()` | `String.raw(strings, ...substitutions)` | `string` | Retorna a forma raw/bruta de um template literal sem interpretar sequências de escape. |

---

## Acesso, Busca e Validação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `at()` | `str.at(index)` | `string \| undefined` | Retorna o caractere na posição `index` (suporta índices negativos). |
| `charAt()` | `str.charAt(index)` | `string` | Retorna o caractere na posição `index`. |
| `charCodeAt()` | `str.charCodeAt(index)` | `number` | Retorna o código UTF-16 no índice especificado. |
| `codePointAt()` | `str.codePointAt(index)` | `number \| undefined` | Retorna o valor numérico do Code Point Unicode na posição. |
| `includes()` | `str.includes(searchString, position?)` | `boolean` | Verifica se a string contém a subsequência informada. |

---

## Fatiamento, Divisão e Transformação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `slice()` | `str.slice(start, end?)` | `string` | Extrai uma seção da string e a retorna como uma nova string. |
| `substring()` | `str.substring(start, end?)` | `string` | Retorna os caracteres entre dois índices da string. |
| `split()` | `str.split(separator?, limit?)` | `string[]` | Divide a string em um array de substrings com base no `separator`. |
| `toLowerCase()` | `str.toLowerCase()` | `string` | Converte todos os caracteres da string para minúsculo. |
| `toUpperCase()` | `str.toUpperCase()` | `string` | Converte todos os caracteres da string para maiúsculo. |

---

## Métodos Estáticos de Object

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Object.keys()` | `Object.keys(obj)` | `string[]` | Retorna um array com os nomes das propriedades enumeráveis próprias de `obj`. |
| `Object.values()` | `Object.values(obj)` | `any[]` | Retorna um array com os valores das propriedades enumeráveis próprias de `obj`. |
| `Object.entries()` | `Object.entries(obj)` | `[string, any][]` | Retorna um array de pares `[chave, valor]` enumeráveis próprios de `obj`. |
| `Object.fromEntries()` | `Object.fromEntries(iterable)` | `object` | Transforma uma lista de pares `[chave, valor]` em um objeto JavaScript. |
| `Object.assign()` | `Object.assign(target, ...sources)` | `object` | Copia propriedades enumeráveis próprias de objetos fonte para o objeto alvo. |

---

## Métodos de Instância do Protótipo Object

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `hasOwnProperty()` | `obj.hasOwnProperty(prop)` | `boolean` | Verifica se o objeto possui a propriedade própria indicada. |
| `isPrototypeOf()` | `obj.isPrototypeOf(target)` | `boolean` | Verifica se `obj` está na cadeia de protótipos de `target`. |
| `propertyIsEnumerable()`| `obj.propertyIsEnumerable(prop)` | `boolean` | Verifica se a propriedade própria indicada é enumerável. |
| `toString()` | `obj.toString()` | `string` | Retorna uma representação em string do objeto (ex: `"[object Object]"`). |
| `valueOf()` | `obj.valueOf()` | `any` | Retorna o valor primitivo do objeto especificado. |

---

## Sintaxes de Declaração de Funções (Exemplo)

```js
// Declaração tradicional (com hoisting)
function add(a, b = 0) { return a + b; }

// Expressão de função
const multiply = function(a, b) { return a * b; };

// Arrow Function (sem 'this' ou 'arguments' próprios)
const subtract = (a, b) => a - b;

// Parâmetro Rest (...args)
const sumAll = (...numbers) => numbers.reduce((acc, n) => acc + n, 0);

// ...
```

---

## Métodos de Instância de Function

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `call()` | `fn.call(thisArg, arg1, arg2, ...)` | `any` | Invoca a função configurando explicitamente `thisArg` e passando os argumentos individualmente. |
| `apply()` | `fn.apply(thisArg, argsArray)` | `any` | Invoca a função configurando `thisArg` e passando os argumentos em uma estrutura de array. |
| `bind()` | `fn.bind(thisArg, arg1, arg2, ...)` | `Function` | Retorna uma **nova função** vinculada permanentemente ao `thisArg` e aos argumentos pré-fixados. |

---

## Objeto Estático e Protótipo `Number`

| Método / Propriedade | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Number.parseInt()` | `Number.parseInt(string, radix?)` | `number` | Analisa uma string e retorna um inteiro na base especificada. |
| `Number.parseFloat()`| `Number.parseFloat(string)` | `number` | Analisa uma string e retorna um número de ponto flutuante. |
| `Number.isNaN()` | `Number.isNaN(value)` | `boolean` | Testa estritamente se o valor é `NaN`. |
| `Number.isFinite()` | `Number.isFinite(value)` | `boolean` | Testa se o valor é um número finito. |
| `Number.isInteger()` | `Number.isInteger(value)` | `boolean` | Testa se o valor é um número inteiro. |

---

## Objeto Estático `Math`

| Método / Constante | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Math.PI` | `Math.PI` | `number` | Constante pi (~3.14159). |
| `Math.E` | `Math.E` | `number` | Constante de Euler (~2.718). |
| `Math.abs()` | `Math.abs(x)` | `number` | Retorna o valor absoluto de `x`. |
| `Math.sign()` | `Math.sign(x)` | `number` | Retorna o sinal de `x` (`1`, `-1`, `0`, `-0`, `NaN`). |
| `Math.floor()` | `Math.floor(x)` | `number` | Arredonda `x` para baixo (maior inteiro menor ou igual a `x`). |

---

## Construtor de Promise (Exemplo)

```js
const myPromise = new Promise((resolve, reject) => {
  if (sucesso) resolve(resultado);
  else reject(novoErro);
});
```

---

## Métodos de Instância do Protótipo `Promise`

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `then()` | `promise.then(onFulfilled?, onRejected?)` | `Promise` | Encadeia manipuladores para a resolução ou rejeição da promessa. |
| `catch()` | `promise.catch(onRejected)` | `Promise` | Encadeia um manipulador de rejeição para erros na promessa. |
| `finally()` | `promise.finally(onFinally)` | `Promise` | Executa a função `onFinally` quando a promessa for concluída (resolvida ou rejeitada). |

---

## Métodos Estáticos de `Promise`

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Promise.resolve()` | `Promise.resolve(value)` | `Promise` | Retorna uma promessa já resolvida com o valor fornecido. |
| `Promise.reject()` | `Promise.reject(reason)` | `Promise` | Retorna uma promessa já rejeitada com o motivo fornecido. |
| `Promise.all()` | `Promise.all(iterable)` | `Promise` | Aguarda **todas** as promessas resolverem. Falha imediatamente na primeira rejeição. |
| `Promise.allSettled()` | `Promise.allSettled(iterable)` | `Promise` | Aguarda **todas** as promessas terminarem, retornando o estado de cada uma (`fulfilled` ou `rejected`). |
| `Promise.race()` | `Promise.race(iterable)` | `Promise` | Retorna a primeira promessa que for concluída (seja resolvida ou rejeitada). |

---

## Métodos Estáticos de `Promise` (Exemplo)

```js
const { promise, resolve, reject } = Promise.withResolvers();
setTimeout(() => resolve("Dados prontos!"), 1000);
const result = await promise;
```

---

## Métodos Estáticos de Date

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Date.now()` | `Date.now()` | `number` | Retorna o timestamp em milissegundos transcorridos desde 01/01/1970 UTC. |
| `Date.parse()` | `Date.parse(dateString)` | `number` | Converte uma representação em string de data em seu timestamp em ms. |
| `Date.UTC()` | `Date.UTC(year, monthIndex, day?, hours?, minutes?, seconds?, ms?)` | `number` | Retorna o timestamp em ms aceitando componentes na hora UTC. |

---

## Métodos de Instância de Date

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `getFullYear()` | `date.getFullYear()` | `number` | Retorna o ano completo de 4 dígitos (local). |
| `getMonth()` | `date.getMonth()` | `number` | Retorna o mês (0 a 11, onde `0` é Janeiro). |
| `getDate()` | `date.getDate()` | `number` | Retorna o dia do mês (1 a 31). |
| `getDay()` | `date.getDay()` | `number` | Retorna o dia da semana (0 a 6, onde `0` é Domingo). |
| `getHours()` | `date.getHours()` | `number` | Retorna a hora (0 a 23). |

---

## Sintaxe e Flags (Exemplo)

```js
// Literal com flags (g: global, i: case-insensitive, m: multiline, s: dotAll, u: unicode, v: unicodeSets)
const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/gi;

// Construtor dinâmico
const dynamicRegex = new RegExp("padrao", "gi");
```

---

## Métodos de Instância de RegExp

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `test()` | `regexp.test(string)` | `boolean` | Testa se a expressão regular encontra correspondência na string. |
| `exec()` | `regexp.exec(string)` | `Array \| null` | Executa uma busca na string e retorna um array de resultados (com índices e grupos de captura) ou `null`. |

---

## Resumo da Aula

- **Declarações**: `const` por padrão para binding imutável; `let` apenas para variáveis que sofrem reatribuição.
- **Operadores**: Use `===` para igualdade, `??` para fallback com zero/false/string vazia válidos e `?.` para navegação segura.
- **Arrays**: Prefira HOFs imutáveis (`map`, `filter`, `reduce`, `toSorted`) para evitar mutações de estado imprevisíveis.
- **Objetos**: Utilize desestruturação `{ prop } = obj`, Property Shorthand e Spread `...` para clonagem e mesclagem rasa.
- **Assincronismo**: Estruture chamadas assíncronas com `async/await` dentro de `try...catch` e use `Promise.all()` para paralelo.
