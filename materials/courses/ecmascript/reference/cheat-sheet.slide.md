---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Guia de Referência: ECMAScript"
description: "Slides completos da aula Guia de Referência: ECMAScript."
---

<!-- _class: lead -->

# Guia de Referência: ECMAScript

Guia completo de referência rápida de todas as assinaturas de métodos, funções e operadores nativos do ECMAScript (JavaScript).

---

## Objetivo

- Guia completo de referência rápida de todas as assinaturas de métodos, funções e operadores nativos do ECMAScript...

---

## Mapa da Aula

- Legenda e Convenções
- Funções Globais e Utilitários de Tipo
- Objeto Estático `JSON`

---

## Introdução

- Esta página é um guia completo de referência rápida contendo todas as assinaturas, parâmetros, tipos de retorno, exemplos...

---

## Legenda e Convenções

- `param?`: parâmetro opcional.
- `...args`: operador *rest* (aceita múltiplos argumentos).
- `Mutador`: altera o objeto/array original diretamente (*in-place*).
- `Acessor`: não altera o original (retorna uma cópia ou novo valor).
- `HOF`: *Higher-Order Function* (função que recebe outra callback como parâmetro).

---

## Operadores Especiais e Atribuição Lógica: Comparação

| Operador / Sintaxe | Assinatura / Exemplo | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `typeof` | `typeof operand` | `string` | Retorna o nome do tipo primitivo ou `"object"` / `"function"`. |
| `instanceof` | `obj instanceof Constructor` | `boolean` | Testa se `Constructor.prototype` está na cadeia de protótipos de `obj`. |
| `in` | `'prop' in obj` | `boolean` | Verifica se a propriedade existe no objeto ou em sua cadeia de protótipos. |
| `delete` | `delete obj.prop` | `boolean` | Remove uma propriedade de um objeto. |
| `void` | `void expression` | `undefined` | Avalia a expressão e retorna `undefined`. |
| ... | ... | ... | ... |

---

## Exemplo: Operadores Modernos

```js
const user = null;
const name = user?.profile?.name ?? "Visitante"; // "Visitante"

let config = {};
config.theme ||= "dark"; // config.theme vira "dark"
```

---

## Funções Globais e Utilitários de Tipo: Comparação

| Função / Operador | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Array.isArray()` | `Array.isArray(value)` | `boolean` | Verifica se `value` é uma instância de `Array`. |
| `Number.isNaN()` | `Number.isNaN(value)` | `boolean` | Verifica se `value` é estritamente `NaN` (sem coerção de tipo). |
| `Number.isFinite()` | `Number.isFinite(value)` | `boolean` | Verifica se `value` é um número finito (sem coerção). |
| `Number.isInteger()` | `Number.isInteger(value)` | `boolean` | Verifica se `value` é um número inteiro. |
| `Number.isSafeInteger()`| `Number.isSafeInteger(value)`| `boolean` | Verifica se é um inteiro seguro (`-(2^53 - 1)` a `2^53 - 1`). |
| ... | ... | ... | ... |

---

## Exemplo: Utilitários Globais e structuredClone

```js
const original = { a: 1, b: { c: 2 }, d: new Date() };
const copy = structuredClone(original); // Clone profundo real de objeto e data
```

---

## Métodos Estáticos de Array: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Array.isArray()` | `Array.isArray(value)` | `boolean` | Testa se o valor fornecido é um `Array`. |
| `Array.from()` | `Array.from(arrayLike, mapFn?, thisArg?)` | `Array` | Cria um `Array` a partir de um objeto iterável ou array-like. |
| `Array.fromAsync()` | `Array.fromAsync(asyncIterable, mapFn?, thisArg?)` | `Promise<Array>` | (ES2024) Cria um `Array` a partir de um iterável assíncrono. |
| `Array.of()` | `Array.of(...elementN)` | `Array` | Cria um novo `Array` contendo todos os argumentos fornecidos. |

---

## Métodos Mutadores (Alteram o Array Original): Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `push()` | `arr.push(...elementN)` | `number` | Adiciona elementos ao **final**. Retorna o novo `length`. |
| `pop()` | `arr.pop()` | `element \| undefined` | Remove e retorna o **último** elemento. |
| `unshift()` | `arr.unshift(...elementN)` | `number` | Adiciona elementos ao **início**. Retorna o novo `length`. |
| `shift()` | `arr.shift()` | `element \| undefined` | Remove e retorna o **primeiro** elemento. |
| `splice()` | `arr.splice(start, deleteCount?, ...items)` | `Array` | Remove, substitui ou adiciona elementos em qualquer posição. Retorna removidos. |
| ... | ... | ... | ... |

---

## Métodos Acessores (Não Mutadores): Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `at()` | `arr.at(index)` | `element \| undefined` | Retorna o elemento na posição `index` (aceita índices negativos). |
| `concat()` | `arr.concat(...valueN)` | `Array` | Retorna um novo array combinando o original com os valores/arrays fornecidos. |
| `slice()` | `arr.slice(start?, end?)` | `Array` | Retorna uma cópia de uma fatia do array (índice `start` até `end` exclusive). |
| `includes()` | `arr.includes(searchElement, fromIndex?)` | `boolean` | Verifica se o array contém determinado elemento. |
| `indexOf()` | `arr.indexOf(searchElement, fromIndex?)` | `number` | Retorna o primeiro índice do elemento ou `-1`. |
| ... | ... | ... | ... |

---

## Iteradores e HOFs (Higher-Order Functions): Comparação

| Método | Assinatura Callback | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `forEach()` | `arr.forEach(fn(element, index?, array?), thisArg?)` | `undefined` | Executa a função `fn` para cada elemento. |
| `map()` | `arr.map(fn(element, index?, array?), thisArg?)` | `Array` | Retorna novo array contendo o resultado da aplicação de `fn` em cada item. |
| `filter()` | `arr.filter(fn(element, index?, array?), thisArg?)` | `Array` | Retorna novo array com elementos que passaram no teste lógico da `fn`. |
| `reduce()` | `arr.reduce(fn(acc, val, index?, array?), initialVal?)` | `any` | Reduz o array a um único valor acumulado (da esquerda para a direita). |
| `reduceRight()`| `arr.reduceRight(fn(acc, val, index?, array?), initialVal?)` | `any` | Reduz o array a um único valor acumulado (da direita para a esquerda). |
| ... | ... | ... | ... |

---

## Métodos Imutáveis de Alteração (ES2023) e Agrupamento (ES2024): Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `toSorted()` | `arr.toSorted(compareFn?)` | `Array` | Retorna nova cópia do array ordenada sem modificar o original. |
| `toReversed()`| `arr.toReversed()` | `Array` | Retorna nova cópia do array invertida sem modificar o original. |
| `toSpliced()` | `arr.toSpliced(start, deleteCount?, ...items)` | `Array` | Retorna nova cópia do array modificada por corte/inserção sem alterar o original. |
| `with()` | `arr.with(index, value)` | `Array` | Retorna novo array substituindo o elemento no `index` especificado por `value`. |
| `Object.groupBy()` | `Object.groupBy(iterable, callbackFn(element, index))` | `Object` | (ES2024) Agrupa elementos de um iterável em um objeto baseado nas chaves retornadas pela callback. |
| `Map.groupBy()` | `Map.groupBy(iterable, callbackFn(element, index))` | `Map` | (ES2024) Agrupa elementos de um iterável em um `Map` chaveado por qualquer tipo. |

---

## Exemplo: ES2023 (Cópia Imutável) & ES2024 (Object.groupBy)

```js
const items = [{ name: "Maçã", category: "fruta" }, { name: "Cenoura", category: "legume" }];

// ES2024 Object.groupBy
const grouped = Object.groupBy(items, (item) => item.category);
// { fruta: [{ name: "Maçã", ... }], legume: [{ name: "Cenoura", ... }] }
```

---

## Métodos Estáticos de String: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `fromCharCode()` | `String.fromCharCode(...codes)` | `string` | Cria uma string a partir de uma sequência de valores UTF-16. |
| `fromCodePoint()`| `String.fromCodePoint(...codePoints)` | `string` | Cria uma string a partir de pontos de código Unicode (Code Points). |
| `raw()` | `String.raw(strings, ...substitutions)` | `string` | Retorna a forma raw/bruta de um template literal sem interpretar sequências de escape. |

---

## Acesso, Busca e Validação: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `at()` | `str.at(index)` | `string \| undefined` | Retorna o caractere na posição `index` (suporta índices negativos). |
| `charAt()` | `str.charAt(index)` | `string` | Retorna o caractere na posição `index`. |
| `charCodeAt()` | `str.charCodeAt(index)` | `number` | Retorna o código UTF-16 no índice especificado. |
| `codePointAt()` | `str.codePointAt(index)` | `number \| undefined` | Retorna o valor numérico do Code Point Unicode na posição. |
| `includes()` | `str.includes(searchString, position?)` | `boolean` | Verifica se a string contém a subsequência informada. |
| ... | ... | ... | ... |

---

## Fatiamento, Divisão e Transformação: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `slice()` | `str.slice(start, end?)` | `string` | Extrai uma seção da string e a retorna como uma nova string. |
| `substring()` | `str.substring(start, end?)` | `string` | Retorna os caracteres entre dois índices da string. |
| `split()` | `str.split(separator?, limit?)` | `string[]` | Divide a string em um array de substrings com base no `separator`. |
| `toLowerCase()` | `str.toLowerCase()` | `string` | Converte todos os caracteres da string para minúsculo. |
| `toUpperCase()` | `str.toUpperCase()` | `string` | Converte todos os caracteres da string para maiúsculo. |
| ... | ... | ... | ... |

---

## Métodos Estáticos de Object: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Object.keys()` | `Object.keys(obj)` | `string[]` | Retorna um array com os nomes das propriedades enumeráveis próprias de `obj`. |
| `Object.values()` | `Object.values(obj)` | `any[]` | Retorna um array com os valores das propriedades enumeráveis próprias de `obj`. |
| `Object.entries()` | `Object.entries(obj)` | `[string, any][]` | Retorna um array de pares `[chave, valor]` enumeráveis próprios de `obj`. |
| `Object.fromEntries()` | `Object.fromEntries(iterable)` | `object` | Transforma uma lista de pares `[chave, valor]` em um objeto JavaScript. |
| `Object.assign()` | `Object.assign(target, ...sources)` | `object` | Copia propriedades enumeráveis próprias de objetos fonte para o objeto alvo. |
| ... | ... | ... | ... |

---

## Métodos de Instância do Protótipo Object: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `hasOwnProperty()` | `obj.hasOwnProperty(prop)` | `boolean` | Verifica se o objeto possui a propriedade própria indicada. |
| `isPrototypeOf()` | `obj.isPrototypeOf(target)` | `boolean` | Verifica se `obj` está na cadeia de protótipos de `target`. |
| `propertyIsEnumerable()`| `obj.propertyIsEnumerable(prop)` | `boolean` | Verifica se a propriedade própria indicada é enumerável. |
| `toString()` | `obj.toString()` | `string` | Retorna uma representação em string do objeto (ex: `"[object Object]"`). |
| `valueOf()` | `obj.valueOf()` | `any` | Retorna o valor primitivo do objeto especificado. |

---

## Formas de declaração de funções

```js
// Declaração tradicional (com hoisting)
function add(a, b = 0) { return a + b; }

// Expressão de função
const multiply = function(a, b) { return a * b; };

// Arrow Function (sem 'this' ou 'arguments' próprios)
const subtract = (a, b) => a - b;

// Parâmetro Rest (...args)
const sumAll = (...numbers) => numbers.reduce((acc, n) => acc + n, 0);

// Função Geradora (Generator Function)
function* idGenerator() {
let id = 1;
while (true) yield id++;
}
```

---

## Métodos de Instância de Function: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `call()` | `fn.call(thisArg, arg1, arg2, ...)` | `any` | Invoca a função configurando explicitamente `thisArg` e passando os argumentos individualmente. |
| `apply()` | `fn.apply(thisArg, argsArray)` | `any` | Invoca a função configurando `thisArg` e passando os argumentos em uma estrutura de array. |
| `bind()` | `fn.bind(thisArg, arg1, arg2, ...)` | `Function` | Retorna uma **nova função** vinculada permanentemente ao `thisArg` e aos argumentos pré-fixados. |

---

## Objeto Estático e Protótipo `Number`: Comparação

| Método / Propriedade | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Number.parseInt()` | `Number.parseInt(string, radix?)` | `number` | Analisa uma string e retorna um inteiro na base especificada. |
| `Number.parseFloat()`| `Number.parseFloat(string)` | `number` | Analisa uma string e retorna um número de ponto flutuante. |
| `Number.isNaN()` | `Number.isNaN(value)` | `boolean` | Testa estritamente se o valor é `NaN`. |
| `Number.isFinite()` | `Number.isFinite(value)` | `boolean` | Testa se o valor é um número finito. |
| `Number.isInteger()` | `Number.isInteger(value)` | `boolean` | Testa se o valor é um número inteiro. |
| ... | ... | ... | ... |

---

## Objeto Estático `Math`: Comparação

| Método / Constante | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Math.PI` | `Math.PI` | `number` | Constante pi (~3.14159). |
| `Math.E` | `Math.E` | `number` | Constante de Euler (~2.718). |
| `Math.abs()` | `Math.abs(x)` | `number` | Retorna o valor absoluto de `x`. |
| `Math.sign()` | `Math.sign(x)` | `number` | Retorna o sinal de `x` (`1`, `-1`, `0`, `-0`, `NaN`). |
| `Math.floor()` | `Math.floor(x)` | `number` | Arredonda `x` para baixo (maior inteiro menor ou igual a `x`). |
| ... | ... | ... | ... |

---

## Sintaxe do Construtor Promise

```js
const myPromise = new Promise((resolve, reject) => {
if (sucesso) resolve(resultado);
else reject(novoErro);
});
```

---

## Métodos de Instância do Protótipo `Promise`: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `then()` | `promise.then(onFulfilled?, onRejected?)` | `Promise` | Encadeia manipuladores para a resolução ou rejeição da promessa. |
| `catch()` | `promise.catch(onRejected)` | `Promise` | Encadeia um manipulador de rejeição para erros na promessa. |
| `finally()` | `promise.finally(onFinally)` | `Promise` | Executa a função `onFinally` quando a promessa for concluída (resolvida ou rejeitada). |

---

## Métodos Estáticos de `Promise`: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Promise.resolve()` | `Promise.resolve(value)` | `Promise` | Retorna uma promessa já resolvida com o valor fornecido. |
| `Promise.reject()` | `Promise.reject(reason)` | `Promise` | Retorna uma promessa já rejeitada com o motivo fornecido. |
| `Promise.all()` | `Promise.all(iterable)` | `Promise` | Aguarda **todas** as promessas resolverem. Falha imediatamente na primeira rejeição. |
| `Promise.allSettled()` | `Promise.allSettled(iterable)` | `Promise` | Aguarda **todas** as promessas terminarem, retornando o estado de cada uma (`fulfilled` ou `rejected`). |
| `Promise.race()` | `Promise.race(iterable)` | `Promise` | Retorna a primeira promessa que for concluída (seja resolvida ou rejeitada). |
| ... | ... | ... | ... |

---

## Exemplo: ES2024 Promise.withResolvers

```js
const { promise, resolve, reject } = Promise.withResolvers();
setTimeout(() => resolve("Dados prontos!"), 1000);
const result = await promise;
```

---

## Métodos Estáticos de Date: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Date.now()` | `Date.now()` | `number` | Retorna o timestamp em milissegundos transcorridos desde 01/01/1970 UTC. |
| `Date.parse()` | `Date.parse(dateString)` | `number` | Converte uma representação em string de data em seu timestamp em ms. |
| `Date.UTC()` | `Date.UTC(year, monthIndex, day?, hours?, minutes?, seconds?, ms?)` | `number` | Retorna o timestamp em ms aceitando componentes na hora UTC. |

---

## Métodos de Instância de Date: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `getFullYear()` | `date.getFullYear()` | `number` | Retorna o ano completo de 4 dígitos (local). |
| `getMonth()` | `date.getMonth()` | `number` | Retorna o mês (0 a 11, onde `0` é Janeiro). |
| `getDate()` | `date.getDate()` | `number` | Retorna o dia do mês (1 a 31). |
| `getDay()` | `date.getDay()` | `number` | Retorna o dia da semana (0 a 6, onde `0` é Domingo). |
| `getHours()` | `date.getHours()` | `number` | Retorna a hora (0 a 23). |
| ... | ... | ... | ... |

---

## Criando Expressões Regulares

```js
// Literal com flags (g: global, i: case-insensitive, m: multiline, s: dotAll, u: unicode, v: unicodeSets)
const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/gi;

// Construtor dinâmico
const dynamicRegex = new RegExp("padrao", "gi");
```

---

## Métodos de Instância de RegExp: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `test()` | `regexp.test(string)` | `boolean` | Testa se a expressão regular encontra correspondência na string. |
| `exec()` | `regexp.exec(string)` | `Array \| null` | Executa uma busca na string e retorna um array de resultados (com índices e grupos de captura) ou `null`. |

---

## Protótipo `Set` (Coleção de Valores Únicos): Comparação

| Método / Propriedade | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `add()` | `set.add(value)` | `Set` | Adiciona um novo elemento com o valor especificado ao `Set`. |
| `delete()` | `set.delete(value)` | `boolean` | Remove o elemento especificado do `Set`. Retorna `true` se ele existia. |
| `has()` | `set.has(value)` | `boolean` | Verifica se o valor está presente no `Set`. |
| `clear()` | `set.clear()` | `undefined` | Remove todos os elementos do `Set`. |
| `size` | `set.size` | `number` | Propriedade que indica o número total de elementos no `Set`. |
| ... | ... | ... | ... |

---

## Protótipo `Map` (Pares Chave-Valor): Comparação

| Método / Propriedade | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `set()` | `map.set(key, value)` | `Map` | Adiciona ou atualiza um elemento com a chave e valor informados. |
| `get()` | `map.get(key)` | `value \| undefined` | Retorna o valor associado à chave ou `undefined` se a chave não existir. |
| `has()` | `map.has(key)` | `boolean` | Verifica se a chave existe no `Map`. |
| `delete()` | `map.delete(key)` | `boolean` | Remove o elemento associado à chave. Retorna `true` se ele existia. |
| `clear()` | `map.clear()` | `undefined` | Remove todos os pares chave-valor do `Map`. |
| `size` | `map.size` | `number` | Propriedade com o total de pares chave-valor no `Map`. |

---

## `WeakMap` e `WeakSet` (Coleções com Referências Fracas): Comparação

| Classe | Assinatura / Métodos | Descrição |
| :--- | :--- | :--- |
| `WeakMap` | `new WeakMap(entries?)` <br /> `.set(obj, val)`, `.get(obj)`, `.has(obj)`, `.delete(obj)` | Coleção de pares chave-valor onde as chaves devem ser objetos (ou símbolos) mantidos por referência fraca (*garbage collector*). |
| `WeakSet` | `new WeakSet(iterable?)` <br /> `.add(obj)`, `.has(obj)`, `.delete(obj)` | Coleção de objetos mantidos por referência fraca. |

---

## Objeto Estático `JSON`: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `JSON.parse()` | `JSON.parse(text, reviver?)` | `any` | Analisa uma string formatada em JSON e constrói o valor/objeto correspondente. |
| `JSON.stringify()` | `JSON.stringify(value, replacer?, space?)` | `string` | Converte um valor ou objeto JavaScript em uma string JSON formatada. |

---

## `BigInt` (Inteiros de Precisão Arbitrária): Comparação

| Função / Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `BigInt()` | `BigInt(value)` | `bigint` | Converte números ou strings para um inteiro de tamanho arbitrário (ex: `100n`). |
| `BigInt.asIntN()` | `BigInt.asIntN(bits, bigint)` | `bigint` | Trunca o valor BigInt para um inteiro assinado de `bits` bits. |
| `BigInt.asUintN()`| `BigInt.asUintN(bits, bigint)` | `bigint` | Trunca o valor BigInt para um inteiro não-assinado de `bits` bits. |

---

## `Symbol` (Valores Primitivos Únicos e Imutáveis): Comparação

| Função / Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `Symbol()` | `Symbol(description?)` | `symbol` | Cria um símbolo único e primitivo. |
| `Symbol.for()` | `Symbol.for(key)` | `symbol` | Busca no registro global de símbolos por `key`. Cria se não existir. |
| `Symbol.keyFor()` | `Symbol.keyFor(sym)` | `string \| undefined` | Retorna a chave do registro global para o símbolo `sym`. |
| Símbolos Conhecidos | `Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.hasInstance` | `symbol` | Símbolos nativos usados pela linguagem para alterar o comportamento de objetos. |

---

## Erros Nativos e Construtor `Error`: Comparação

| Classe de Erro | Assinatura | Descrição |
| :--- | :--- | :--- |
| `Error` | `new Error(message?, options?)` | Erro genérico base. `options` aceita `{ cause: error }` para encadeamento de erros. |
| `TypeError` | `new TypeError(message?)` | Lançado quando um valor não é do tipo esperado. |
| `SyntaxError` | `new SyntaxError(message?)` | Lançado quando ocorre um erro na sintaxe do código. |
| `RangeError` | `new RangeError(message?)` | Lançado quando um valor numérico está fora do intervalo válido. |
| `ReferenceError` | `new ReferenceError(message?)` | Lançado ao tentar acessar uma variável não declarada. |

---

## Exemplo: Erros com Causa (ES2022) e Símbolos

```js
try {
JSON.parse("{ invalid }");
} catch (err) {
throw new Error("Falha no processamento do arquivo", { cause: err });
}
```

---

## Protocolo de Iteração e Sintaxes: Comparação

| Recurso / Sintaxe | Exemplo de Sintaxe | Descrição |
| :--- | :--- | :--- |
| `for...of` | `for (const item of iterable) { ... }` | Itera sobre os valores de um objeto iterável (`Array`, `Set`, `Map`, `String`). |
| `for await...of` | `for await (const item of asyncIterable) { ... }` | Itera sobre os valores de um iterável assíncrono ou promessas. |
| Gerador (`function*`) | `function* gen() { yield 1; yield 2; }` | Cria uma função geradora que pode ser pausada (`yield`) e retomada. |
| Métodos de Generator | `gen.next(value?)`, `gen.return(val)`, `gen.throw(err)` | Controla a execução da função geradora e consome seus valores. |

---

## Exemplo: Generator Function e Iterador Customizado

```js
function* countUp(max) {
for (let i = 1; i <= max; i++) {
 yield i;
}
}

const counter = countUp(3);
console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: false }
console.log(counter.next()); // { value: undefined, done: true }
```

---

## Operadores e Sintaxe Base

- `typeof operand`
- `obj instanceof Constructor`
- `'prop' in obj`
- `delete obj.prop`
- `void expression`

---

## String (`String` e `String.prototype`)

- `String.fromCharCode(...codes)`
- `String.fromCodePoint(...codePoints)`
- `String.raw(strings, ...substitutions)`
- `str.at(index)`
- `str.charAt(index)`

---

## Array (`Array` e `Array.prototype`)

- `Array.isArray(value)`
- `Array.from(arrayLike, mapFn?, thisArg?)`
- `Array.fromAsync(asyncIterable, mapFn?, thisArg?)`
- `Array.of(...elementN)`
- `arr.push(...elementN)`

---

## Object (`Object` e `Object.prototype`)

- `Object.keys(obj)`
- `Object.values(obj)`
- `Object.entries(obj)`
- `Object.fromEntries(iterable)`
- `Object.assign(target, ...sources)`

---

## Function (`Function.prototype`)

- `function name(param1 = defaultVal, ...rest) `
- `const fn = function(param) ;`
- `const fn = (param1, param2) => expression;`
- `function* gen() `
- `fn.call(thisArg, arg1, arg2, ...)`

---

## Number e Math

- `parseInt(string, radix?)` | `parseFloat(string)`
- `Number.parseInt(string, radix?)` | `Number.parseFloat(string)`
- `Number.isNaN(value)` | `Number.isFinite(value)` | `Number.isInteger(value)` | `Number.isSafeInteger(value)`
- `num.toFixed(digits?)` | `num.toPrecision(precision?)` | `num.toExponential(fractionDigits?)` | `num.toString(radix?)`
- `Math.abs(x)` | `Math.sign(x)`

---

## Promise e Async

- `new Promise((resolve, reject) => )`
- `promise.then(onFulfilled?, onRejected?)`
- `promise.catch(onRejected)`
- `promise.finally(onFinally)`
- `Promise.resolve(value)` | `Promise.reject(reason)`

---

## Date (`Date` e `Date.prototype`)

- `Date.now()` | `Date.parse(dateString)` | `Date.UTC(year, monthIndex, ...)`
- `date.getFullYear()` | `date.getMonth()` | `date.getDate()` | `date.getDay()`
- `date.getHours()` | `date.getMinutes()` | `date.getSeconds()` | `date.getMilliseconds()` | `date.getTime()` |...
- `date.setFullYear(year, month?, day?)` | `date.setMonth(monthIndex, day?)` | `date.setDate(day)` | `date.setHours(hours,...
- `date.toISOString()` | `date.toLocaleDateString(locales?, options?)` | `date.toLocaleTimeString(locales?, options?)` |...

---

## RegExp

- `/pattern/flags` | `new RegExp(pattern, flags?)`
- `regexp.test(string)`
- `regexp.exec(string)`

---

## Map, Set, WeakMap e WeakSet

- `new Set(iterable?)` | `set.add(val)` | `set.delete(val)` | `set.has(val)` | `set.clear()` | `set.size`
- `set.intersection(other)` | `set.union(other)` | `set.difference(other)` | `set.symmetricDifference(other)`
- `set.isSubsetOf(other)` | `set.isSupersetOf(other)` | `set.isDisjointFrom(other)`
- `new Map(entries?)` | `map.set(key, val)` | `map.get(key)` | `map.has(key)` | `map.delete(key)` | `map.clear()` | `map.size`
- `new WeakMap(entries?)` | `weakMap.set(obj, val)` | `weakMap.get(obj)` | `weakMap.has(obj)` | `weakMap.delete(obj)`

---

## JSON

- `JSON.parse(text, reviver?)`
- `JSON.stringify(value, replacer?, space?)`

---

## Utilitários Globais e URI

- `encodeURI(uri)` | `decodeURI(encodedURI)`
- `encodeURIComponent(str)` | `decodeURIComponent(encodedStr)`
- `structuredClone(value, options?)`

---

## BigInt, Symbol e Erros

- `BigInt(value)` | `BigInt.asIntN(bits, bigint)` | `BigInt.asUintN(bits, bigint)`
- `Symbol(description?)` | `Symbol.for(key)` | `Symbol.keyFor(sym)`
- `new Error(message?, options?)` | `new TypeError(message?)` | `new SyntaxError(message?)` | `new RangeError(message?)` |...

---

## Iteradores e Geradores

- `for (const item of iterable) `
- `for await (const item of asyncIterable) `
- `function* gen() `
- `gen.next(value?)` | `gen.return(value)` | `gen.throw(exception)`

---

## Resumo da Aula

- Revise legenda e Convenções
- Revise funções Globais e Utilitários de Tipo
- Revise objeto Estático `JSON`
