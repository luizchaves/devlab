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
- Operadores, precedência e palavras-chave da linguagem
- Funções Globais e Utilitários de Tipo
- Objeto Estático `JSON`
- Expressões Regulares: flags, classes, quantificadores e grupos
- Iterator Helpers (ES2025), Proxy e Reflect
- Dados Binários, Atomics, Intl e Referências Fracas

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

## Operadores Aritméticos e de Atribuição: Comparação

| Operador | Exemplo | Descrição |
| :--- | :--- | :--- |
| `+` `-` `*` `/` `%` | `a + b` | Soma (ou concatenação), subtração, multiplicação, divisão e resto. |
| `**` | `base ** exponent` | Exponenciação (ES2016), **associativa à direita**. |
| `++` `--` | `++x` / `x++` | Prefixado devolve o valor alterado; pós-fixado, o anterior. |
| `+=` `-=` `*=` `/=` `%=` `**=` | `x += v` | Atribuições compostas: aplicam a operação e reatribuem. |
| `+x` `-x` | `+"42"` | Unários: coagem para número (e invertem o sinal). |

---

## Operadores de Comparação e Lógicos: Comparação

| Operador | Exemplo | Descrição |
| :--- | :--- | :--- |
| `===` `!==` | `a === b` | Igualdade estrita: compara valor **e** tipo. Padrão recomendado. |
| `==` `!=` | `a == b` | Igualdade frouxa, com coerção. Evite: `0 == "0"` é `true`. |
| `>` `>=` `<` `<=` | `a > b` | Relacionais; em strings, comparam pontos de código Unicode. |
| `&&` `\|\|` `!` | `a && b` | Lógicos com curto-circuito; devolvem operandos, não booleanos. |
| `? :` | `cond ? x : y` | Ternário: único operador com três operandos. |
| `??` | `left ?? right` | Coalescência nula: só reage a `null` e `undefined`. |

---

## Operadores Bit a Bit e Deslocamento: Comparação

| Operador | Exemplo | Descrição |
| :--- | :--- | :--- |
| `&` `\|` `^` `~` | `a & b` | E, OU, OU exclusivo e negação sobre inteiros de 32 bits com sinal. |
| `<<` | `a << b` | Deslocamento à esquerda. |
| `>>` | `a >> b` | Deslocamento à direita preservando o sinal. |
| `>>>` | `a >>> b` | Deslocamento à direita sem sinal, preenchendo com zeros. |

---

## Operadores de Tipo, Objeto e Estrutura: Comparação

| Operador / Sintaxe | Assinatura / Exemplo | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| `typeof` | `typeof operand` | `string` | Nome do tipo primitivo ou `"object"` / `"function"`. |
| `instanceof` | `obj instanceof Constructor` | `boolean` | Testa a cadeia de protótipos de `obj`. |
| `in` | `'prop' in obj` | `boolean` | Propriedade existe no objeto ou em sua cadeia. |
| `delete` | `delete obj.prop` | `boolean` | Remove uma propriedade de um objeto. |
| `void` | `void expression` | `undefined` | Avalia a expressão e devolve `undefined`. |
| `?.` | `obj?.prop`, `arr?.[0]`, `fn?.()` | `any` | Acesso seguro sem erro em `null` / `undefined`. |
| `...` | `...iterable` / `...args` | — | Espalha um iterável ou agrupa argumentos restantes. |
| `new` | `new Constructor(...args)` | `object` | Cria a instância e devolve o novo objeto. |
| `new.target` | `new.target` | `Function` | Construtor invocado com `new`; `undefined` em chamada comum. |
| `,` | `a, b` | `any` | Avalia da esquerda para a direita e devolve o último. |

---

## Atribuições Lógicas e Sintaxes de Módulo: Comparação

| Sintaxe | Exemplo | Descrição |
| :--- | :--- | :--- |
| `??=` | `target ??= value` | Atribui apenas se `target` for `null` ou `undefined` (ES2021). |
| `\|\|=` | `target \|\|= value` | Atribui se `target` for *falsy*. |
| `&&=` | `target &&= value` | Atribui se `target` for *truthy*. |
| `await` | `await promise` | Suspende até resolver; válido no topo de módulos ES (ES2022). |
| `yield` / `yield*` | `yield value` | Produz um valor da geradora; `yield*` delega a outro iterável. |
| `import()` | `import(specifier)` | Importação dinâmica; devolve uma promessa do namespace. |
| `import.meta` | `import.meta.url` | Metadados do módulo em execução. |

---

## Precedência de Operadores (do mais forte ao mais fraco)

| Nível | Operadores | Associatividade |
| :--- | :--- | :--- |
| Acesso e chamada | `obj.prop`, `obj[expr]`, `fn()`, `new C(...)`, `?.` | Esquerda |
| Unários | `!`, `~`, `+`, `-`, `++`, `--`, `typeof`, `void`, `delete`, `await` | Direita |
| Exponenciação | `**` | Direita |
| Multiplicativos / Aditivos | `*`, `/`, `%` e depois `+`, `-` | Esquerda |
| Deslocamento / Relacionais | `<<`, `>>`, `>>>`, `<`, `>`, `in`, `instanceof` | Esquerda |
| Igualdade | `==`, `!=`, `===`, `!==` | Esquerda |
| Bit a bit / Lógicos | `&`, `^`, `\|`, depois `&&`, `\|\|`, `??` | Esquerda |
| Condicional / Atribuição | `? :`, `=`, `+=`, `??=` e compostas | Direita |

Na dúvida, prefira parênteses explícitos a memorizar a tabela.

---

## Exemplo: Operadores Modernos

```js
const user = null;
const name = user?.profile?.name ?? "Visitante"; // "Visitante"

let config = {};
config.theme ||= "dark"; // config.theme vira "dark"

// ?? preserva valores falsy que || descartaria
const timeout = 0;
console.log(timeout || 30); // 30 (|| descarta o zero)
console.log(timeout ?? 30); // 0  (?? só reage a null/undefined)

console.log(2 ** 3 ** 2); // 512, e não 64 (associativo à direita)
```

---

## Declaração de Valores e Funções: Comparação

| Palavra-chave | Sintaxe | Descrição |
| :--- | :--- | :--- |
| `const` / `let` | `const name = value` | Escopo de bloco; `const` impede reatribuição, não mutação. |
| `var` | `var name` | Escopo de função, com *hoisting* iniciado em `undefined`. |
| `function` | `function name(params) { }` | Declaração com *hoisting* completo; expressões não têm. |
| `function*` / `async` | `async function*` | Geradora, assíncrona e geradora assíncrona. |
| Arrow | `(params) => expression` | Sem `this`, `arguments`, `super` ou `new.target` próprios. |
| `class` | `class Name extends Base { }` | Classe, herança (`extends`), `super`, `static`, `get` / `set`. |
| `#private` | `#campo`, `#metodo()` | Membros privados de classe (ES2022). |
| `"use strict"` | Diretiva | Modo estrito; implícito em módulos ES e classes. |

---

## Controle de Fluxo: Comparação

| Palavra-chave | Sintaxe | Descrição |
| :--- | :--- | :--- |
| `if` / `else` | `if (cond) { } else { }` | Condição avaliada por *truthiness*, não por `=== true`. |
| `switch` | `switch (e) { case v: ... }` | Comparação **estrita**; sem `break` ocorre *fall-through*. |
| `for` / `while` / `do` | `do { } while (cond)` | Contador, teste prévio e teste posterior. |
| `for...in` | `for (const key in obj)` | Percorre **chaves** enumeráveis, inclusive herdadas. |
| `for...of` | `for (const item of iterable)` | Percorre **valores** de qualquer iterável. |
| `break` / `continue` | `break outer` | Interrompe ou salta; aceita rótulo para laços externos. |
| `try` / `catch` / `finally` | `try { } catch { }` | Parâmetro de `catch` opcional (ES2019); `finally` sempre roda. |
| `return` / `throw` | `throw new Error(msg)` | Encerra a função ou lança uma exceção. |

---

## Palavras Reservadas

| Categoria | Palavras |
| :--- | :--- |
| Declaração | `var`, `let`, `const`, `function`, `class`, `import`, `export` |
| Fluxo | `if`, `else`, `switch`, `case`, `default`, `for`, `while`, `do`, `break`, `continue`, `return` |
| Exceções | `try`, `catch`, `finally`, `throw` |
| Operadores | `typeof`, `instanceof`, `in`, `of`, `new`, `delete`, `void` |
| Classes e contexto | `this`, `super`, `extends`, `static`, `get`, `set` |
| Assincronismo | `async`, `await`, `yield` |
| Literais | `true`, `false`, `null` |
| Modo estrito | `implements`, `interface`, `package`, `private`, `protected`, `public`, `arguments`, `eval` |
| Futuro / Descontinuada | `enum` / `with` |

`undefined`, `NaN` e `globalThis` **não** são reservadas: são propriedades globais somente leitura.

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
// Literal: compilado uma vez, na análise do código
const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/gi;

// Construtor dinâmico: exige duplicar as contrabarras
const dynamicRegex = new RegExp("\\d{3}-\\d{4}", "g");
```

---

## Flags de RegExp: Comparação

| Flag | Propriedade | Efeito |
| :--- | :--- | :--- |
| `g` | `global` | Busca todas as ocorrências, não apenas a primeira. |
| `i` | `ignoreCase` | Ignora a diferença entre maiúsculas e minúsculas. |
| `m` | `multiline` | `^` e `$` casam em cada linha, não só no início e fim. |
| `s` | `dotAll` | O `.` passa a casar também com quebras de linha. |
| `u` | `unicode` | Trata o padrão em pontos de código; habilita `\p{...}`. |
| `v` | `unicodeSets` | Sucessor de `u` (ES2024): conjuntos dentro de classes. |
| `y` | `sticky` | Casa apenas exatamente em `lastIndex`, sem avançar. |
| `d` | `hasIndices` | Acrescenta `.indices` com o intervalo de cada grupo. |

---

## Metacaracteres e Classes: Comparação

| Sintaxe | Significado |
| :--- | :--- |
| `.` | Qualquer caractere, exceto quebra de linha (salvo com `s`). |
| `\d` / `\D` | Dígito / não dígito. |
| `\w` / `\W` | Caractere de palavra (`[A-Za-z0-9_]`) / o complemento. |
| `\s` / `\S` | Espaço em branco / não espaço. |
| `[abc]` / `[^abc]` | Conjunto de caracteres / negação do conjunto. |
| `[a-z0-9]` | Intervalos dentro de um conjunto. |
| `\p{L}`, `\p{Script=Greek}` | Propriedade Unicode (exige a flag `u` ou `v`). |
| `\b` / `\B` | Fronteira de palavra / posição que não é fronteira. |
| `^` / `$` | Início / fim da string (ou da linha, com a flag `m`). |

---

## Quantificadores: Comparação

| Sintaxe | Repetições | Versão preguiçosa |
| :--- | :--- | :--- |
| `*` | Zero ou mais | `*?` |
| `+` | Uma ou mais | `+?` |
| `?` | Zero ou uma | `??` |
| `{n}` | Exatamente `n` | (não se aplica) |
| `{n,}` | Ao menos `n` | `{n,}?` |
| `{n,m}` | Entre `n` e `m` | `{n,m}?` |

Por padrão os quantificadores são **gulosos**: consomem o máximo possível e recuam apenas se o restante do padrão falhar.

---

## Grupos, Alternância e Verificações: Comparação

| Sintaxe | Significado |
| :--- | :--- |
| `(...)` | Grupo de captura, acessível por índice no resultado. |
| `(?:...)` | Grupo sem captura, apenas para agrupar. |
| `(?<nome>...)` | Grupo de captura nomeado, lido em `.groups.nome`. |
| `\1`, `\k<nome>` | Retrovisor: repete o texto casado pelo grupo indicado. |
| `a\|b` | Alternância: casa `a` ou `b`. |
| `(?=...)` / `(?!...)` | Verificação à frente positiva / negativa. |
| `(?<=...)` / `(?<!...)` | Verificação atrás positiva / negativa (ES2018). |

Verificações testam o entorno **sem consumir** caracteres da string.

---

## Métodos e Propriedades de RegExp: Comparação

| Membro | Assinatura | Descrição |
| :--- | :--- | :--- |
| `test()` | `regexp.test(string)` | Indica se há correspondência; com `g` avança `lastIndex`. |
| `exec()` | `regexp.exec(string)` | Array com `index`, `groups` e `indices`, ou `null`. |
| `lastIndex` | `regexp.lastIndex` | Posição da próxima busca nas flags `g` e `y`. |
| `source` / `flags` | `regexp.source` | Texto do padrão sem barras e flags ativas. |
| `RegExp.escape()` | `RegExp.escape(string)` | Escapa metacaracteres de texto externo (ES2025). |

---

## Métodos de String que Recebem RegExp: Comparação

| Método | Assinatura | Descrição |
| :--- | :--- | :--- |
| `match()` | `str.match(regexp)` | Sem `g`, primeira correspondência detalhada; com `g`, só os textos. |
| `matchAll()` | `str.matchAll(regexp)` | Exige `g`; devolve iterador com todos os detalhes. |
| `replace()` | `str.replace(pat, repl)` | `repl` aceita `$1`, `$&`, `$<nome>` ou uma função. |
| `replaceAll()` | `str.replaceAll(pat, repl)` | Com RegExp, exige a flag `g`. |
| `search()` | `str.search(regexp)` | Índice da primeira correspondência, ou `-1`. |
| `split()` | `str.split(sep, limit?)` | Grupos de captura no padrão entram no resultado. |

---

## Exemplo: Grupos Nomeados, Verificação e Escape

```js
// Grupos nomeados
const { groups } = /(?<year>\d{4})-(?<month>\d{2})/.exec("2026-09");
console.log(groups); // { year: '2026', month: '09' }

// Verificação atrás: substitui o número sem tocar no prefixo
console.log("R$ 100".replace(/(?<=R\$ )\d+/, "200")); // "R$ 200"

// Padrão dinâmico seguro a partir de entrada do usuário
const term = "preço (R$)";
const safe = new RegExp(RegExp.escape(term), "gi");
console.log(safe.test("Qual o preço (R$) final?")); // true
```

---

## Exemplo: Armadilha do lastIndex com a Flag g

```js
const hasDigit = /\d/g;

console.log(hasDigit.test("a1")); // true  (lastIndex vai para 2)
console.log(hasDigit.test("a1")); // false (retoma da posição 2)

hasDigit.lastIndex = 0; // reinicia o percurso
console.log(hasDigit.test("a1")); // true

// Em testes booleanos, o mais seguro é não usar a flag g
console.log(/\d/.test("a1")); // true, sempre
```

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

## Iterator Helpers (ES2025): Comparação

| Método | Categoria | Descrição |
| :--- | :--- | :--- |
| `Iterator.from(src)` | Construção | Adapta qualquer iterável ou iterador aos métodos auxiliares. |
| `.map(fn)` / `.filter(fn)` / `.flatMap(fn)` | Encadeável | Devolve novo iterador preguiçoso, sem materializar a origem. |
| `.take(limit)` / `.drop(count)` | Encadeável | Recorta a sequência; `take` torna fontes infinitas utilizáveis. |
| `.toArray()` / `.reduce(fn, init?)` | Terminal | Consome a sequência e devolve um valor concreto. |
| `.some(fn)` / `.every(fn)` / `.find(fn)` | Terminal | Teste e busca com curto-circuito. |

---

## Exemplo: Iterator Helpers sobre Sequência Infinita

```js
function* naturals() {
let n = 1;
while (true) yield n++;
}

const oddSquares = naturals()
.map((n) => n * n)
.filter((square) => square % 2 === 1)
.take(4)
.toArray();

console.log(oddSquares); // [ 1, 9, 25, 49 ]
```

---

## Armadilhas do Proxy (Traps): Comparação

| Armadilha | Operação interceptada | Uso típico |
| :--- | :--- | :--- |
| `get(target, prop, receiver)` | `proxy.prop` | Valores padrão, propriedades computadas, auditoria. |
| `set(target, prop, value, receiver)` | `proxy.prop = value` | Validação de tipo, reatividade, campos protegidos. |
| `has(target, prop)` | `prop in proxy` | Ocultar propriedades privadas. |
| `deleteProperty(target, prop)` | `delete proxy.prop` | Proteger chaves obrigatórias. |
| `apply(target, thisArg, args)` | `proxy(...args)` | Medir tempo de execução, memoização. |
| `construct(target, args)` | `new proxy(...args)` | Controlar a criação de instâncias. |
| `Proxy.revocable(t, h)` | Criação | Devolve `{ proxy, revoke }` para desativar o acesso. |

---

## Objeto Estático `Reflect`: Comparação

| Método | Assinatura | Descrição |
| :--- | :--- | :--- |
| `Reflect.get` | `(target, prop, receiver?)` | Leitura padrão; o `receiver` preserva `this` de getters herdados. |
| `Reflect.set` | `(target, prop, value, receiver?)` | Escrita padrão; devolve `false` em vez de lançar exceção. |
| `Reflect.has` | `(target, prop)` | Equivalente funcional ao operador `in`. |
| `Reflect.ownKeys` | `(target)` | Todas as chaves próprias, inclusive símbolos e não enumeráveis. |
| `Reflect.apply` | `(fn, thisArg, argsList)` | Invocação com `this` e argumentos explícitos. |
| `Reflect.construct` | `(target, argsList, newTarget?)` | Instanciação dinâmica com argumentos em array. |
| `Reflect.defineProperty` | `(target, prop, descriptor)` | Versão de `Object.defineProperty` com retorno booleano. |

---

## Exemplo: Validação com Proxy e Reflect

```js
const product = new Proxy({ name: "Mouse", price: 120 }, {
set(target, prop, value, receiver) {
 if (prop === "price" && (typeof value !== "number" || value < 0)) {
  throw new TypeError("O preço deve ser um número não negativo.");
 }
 return Reflect.set(target, prop, value, receiver);
},
});

product.price = 150; // aceito
product.price = -10; // TypeError
```

---

## Dados Binários: Três Camadas de Acesso

| Objeto | Papel | Assinatura principal |
| :--- | :--- | :--- |
| `ArrayBuffer` | Bloco de memória bruta, sem tipo | `new ArrayBuffer(byteLength, options?)` |
| `TypedArray` | Visão homogênea de números fixos | `new Uint8Array(lenOrBuffer, byteOffset?, length?)` |
| `DataView` | Visão heterogênea por deslocamento | `new DataView(buffer, byteOffset?, byteLength?)` |
| Leitura | Campo a campo, com *endianness* | `view.getInt32(byteOffset, littleEndian?)` |
| Escrita | Campo a campo, com *endianness* | `view.setInt32(byteOffset, value, littleEndian?)` |
| Sem cópia | Nova visão sobre o mesmo buffer | `typedArray.subarray(begin?, end?)` |

Construtores: `Int8Array`, `Uint8Array`, `Uint8ClampedArray`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `Float32Array`, `Float64Array`, `BigInt64Array`, `BigUint64Array`.

---

## Exemplo: Buffer Compartilhado e Endianness

```js
const buffer = new ArrayBuffer(8);
const bytes = new Uint8Array(buffer); // 8 posições de 1 byte
const words = new Uint16Array(buffer); // 4 posições de 2 bytes

bytes[0] = 255;
console.log(words[0]); // 255 (mesma memória, sem cópia)

bytes[1] = 256; // fora da faixa: estouro silencioso
console.log(bytes[1]); // 0

const view = new DataView(buffer);
view.setInt32(0, 1234567, false); // big-endian
console.log(view.getInt32(0, true)); // -2016013824 (ordem invertida)
```

---

## `Atomics` e `SharedArrayBuffer`: Comparação

| Método | Assinatura | Descrição |
| :--- | :--- | :--- |
| Construtor | `new SharedArrayBuffer(byteLength, options?)` | Memória acessível por várias threads, sem cópia. |
| `Atomics.load` | `(typedArray, index)` | Leitura atômica da posição. |
| `Atomics.store` | `(typedArray, index, value)` | Escrita atômica; devolve o valor gravado. |
| `Atomics.add` e afins | `(ta, index, value)` | `add`, `sub`, `and`, `or`, `xor`, `exchange`; devolvem o valor anterior. |
| `Atomics.compareExchange` | `(ta, index, expected, replacement)` | Troca condicional em um único passo. |
| `Atomics.wait` / `notify` | `(ta, index, value, timeout?)` | Bloqueia e acorda threads; `waitAsync` é a variante não bloqueante. |

---

## Família `Intl`: Comparação

| Construtor | Método principal | Finalidade |
| :--- | :--- | :--- |
| `Intl.NumberFormat` | `.format(n)` | Números, moedas, porcentagens e unidades. |
| `Intl.DateTimeFormat` | `.format(date)` | Datas e horas por idioma e fuso. |
| `Intl.RelativeTimeFormat` | `.format(value, unit)` | Expressões relativas como "há 3 dias". |
| `Intl.Collator` | `.compare(a, b)` | Ordenação linguística correta, com acentos. |
| `Intl.PluralRules` | `.select(n)` | Categoria gramatical: `one`, `few`, `many`, `other`. |
| `Intl.ListFormat` | `.format(array)` | Enumeração com "e" (`conjunction`) ou "ou" (`disjunction`). |
| `Intl.DisplayNames` | `.of(code)` | Traduz códigos de região, idioma e moeda. |
| `Intl.Segmenter` | `.segment(text)` | Divide por grafema, palavra ou frase. |

---

## Exemplo: Ordenação, Plural e Enumeração

```js
const names = ["Ana", "álvaro", "Zoe", "Ácaro"];
console.log([...names].sort()); // [ 'Ana', 'Zoe', 'Ácaro', 'álvaro' ] (Unicode)

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
console.log([...names].sort(collator.compare)); // [ 'Ácaro', 'álvaro', 'Ana', 'Zoe' ]

const rules = new Intl.PluralRules("pt-BR");
console.log(rules.select(1), rules.select(2)); // "one" "other"

const list = new Intl.ListFormat("pt-BR", { type: "conjunction" });
console.log(list.format(["HTML", "CSS", "JavaScript"])); // "HTML, CSS e JavaScript"
```

---

## `WeakRef` e `FinalizationRegistry`: Comparação

| Recurso | Assinatura | Descrição |
| :--- | :--- | :--- |
| `WeakRef` | `new WeakRef(target)` | Referência que não impede a coleta do objeto. |
| `deref()` | `weakRef.deref()` | Devolve o objeto ou `undefined` após a coleta. |
| `FinalizationRegistry` | `new FinalizationRegistry(callback)` | Registra limpeza pós-coleta; execução **não** garantida. |
| `register()` | `(target, heldValue, unregisterToken?)` | O `heldValue` é um rótulo, nunca o próprio objeto. |
| `unregister()` | `(unregisterToken)` | Cancela o registro feito com aquele token. |

---

## Operadores e Sintaxe Base

- Aritméticos: `+` `-` `*` `/` `%` | `**` | `++` `--` | `+=` `-=` `*=` `/=` `%=` `**=`
- Comparação: `===` `!==` | `==` `!=` | `>` `>=` `<` `<=`
- Lógicos: `&&` `||` `!` | `cond ? x : y` | `??` | `??=` `||=` `&&=`
- Bit a bit: `&` `|` `^` `~` | `<<` `>>` `>>>`
- Tipo e objeto: `typeof` | `instanceof` | `'prop' in obj` | `delete obj.prop` | `void expr`
- Estrutura: `obj?.prop` | `...spread` | `new C(...)` | `new.target` | `a, b`
- Assíncrono e módulos: `await` | `yield` / `yield*` | `import()` | `import.meta`

---

## Palavras-chave e Declarações

- Valores: `const` | `let` | `var`
- Funções: `function` | `function*` | `async function` | `async function*` | `(p) => expr`
- Classes: `class` | `extends` | `super` | `static` | `get` / `set` | `#private` | `this`
- Fluxo: `if` / `else` | `switch` / `case` / `default` | `for` | `while` | `do` | `for...in` | `for...of`
- Saltos: `break` | `continue` | `label:` | `return` | `throw` | `debugger`
- Exceções: `try` / `catch` / `finally`
- Módulos: `import` | `export` | `export default` | `export * from`
- Diretiva: `"use strict"` (implícita em módulos ES e classes)

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

- `/pattern/flags` | `new RegExp(pattern, flags?)` | `RegExp.escape(string)`
- Flags: `g` | `i` | `m` | `s` | `u` | `v` | `y` | `d`
- Classes: `.` | `\d` `\D` | `\w` `\W` | `\s` `\S` | `[abc]` | `[^abc]` | `\p{L}` | `\b`
- Quantificadores: `*` | `+` | `?` | `{n}` | `{n,}` | `{n,m}` (com `?` viram preguiçosos)
- Grupos: `(...)` | `(?:...)` | `(?<nome>...)` | `(?=...)` | `(?!...)` | `(?<=...)` | `(?<!...)`
- `regexp.test(str)` | `regexp.exec(str)` | `regexp.lastIndex` | `regexp.source` | `regexp.flags`
- Em String: `match()` | `matchAll()` | `replace()` | `replaceAll()` | `search()` | `split()`

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

- `globalThis` | `eval(code)` (desaconselhado) | `isNaN(value)` | `isFinite(value)`
- `encodeURI(uri)` | `decodeURI(encodedURI)`
- `encodeURIComponent(str)` | `decodeURIComponent(encodedStr)`
- `structuredClone(value, options?)` (fornecido pelo ambiente, não pela ECMA-262)

---

## BigInt, Symbol e Erros

- `BigInt(value)` | `BigInt.asIntN(bits, bigint)` | `BigInt.asUintN(bits, bigint)`
- `Symbol(description?)` | `Symbol.for(key)` | `Symbol.keyFor(sym)`
- `new Error(message?, options?)` | `new TypeError(message?)` | `new SyntaxError(message?)` | `new RangeError(message?)` |...

---

## Iteradores e Geradores

- `for (const item of iterable) ` | `for await (const item of asyncIterable) `
- `obj[Symbol.iterator]()` | `obj[Symbol.asyncIterator]()` | `iterator.next()`
- `function* gen() ` | `gen.next(value?)` | `gen.return(value)` | `gen.throw(exception)`
- `Iterator.from(src)` | `.map(fn)` | `.filter(fn)` | `.flatMap(fn)` | `.take(n)` | `.drop(n)`
- `.toArray()` | `.reduce(fn, init?)` | `.forEach(fn)` | `.some(fn)` | `.every(fn)` | `.find(fn)`

---

## Proxy e Reflect

- `new Proxy(target, handler)` | `Proxy.revocable(target, handler)`
- Armadilhas: `get` | `set` | `has` | `deleteProperty` | `apply` | `construct` | `ownKeys`
- `Reflect.get(t, p, r?)` | `Reflect.set(t, p, v, r?)` | `Reflect.has(t, p)` | `Reflect.ownKeys(t)`
- `Reflect.apply(fn, thisArg, args)` | `Reflect.construct(t, args, newTarget?)`
- `Reflect.defineProperty(t, p, d)` | `Reflect.getPrototypeOf(t)` | `Reflect.setPrototypeOf(t, proto)`

---

## Dados Binários e Atomics

- `new ArrayBuffer(byteLength, options?)` | `buffer.slice(begin, end?)` | `buffer.transfer(len?)`
- `ArrayBuffer.isView(value)` | `TypedArray.BYTES_PER_ELEMENT`
- `new Uint8Array(src, byteOffset?, length?)` | `ta.set(src, offset?)` | `ta.subarray(begin?, end?)`
- `new DataView(buffer, byteOffset?, byteLength?)` | `view.getInt32(off, le?)` | `view.setInt32(off, v, le?)`
- `new SharedArrayBuffer(byteLength)` | `Atomics.load` | `Atomics.store` | `Atomics.compareExchange`

---

## Intl

- `new Intl.NumberFormat(locales?, options?)` | `new Intl.DateTimeFormat(locales?, options?)`
- `new Intl.RelativeTimeFormat(locales?, options?)` | `new Intl.Collator(locales?, options?)`
- `new Intl.PluralRules(locales?, options?)` | `new Intl.ListFormat(locales?, options?)`
- `new Intl.DisplayNames(locales, options)` | `new Intl.Segmenter(locales?, options?)`
- `Intl.getCanonicalLocales(locales)` | `Intl.supportedValuesOf(key)`

---

## WeakRef e FinalizationRegistry

- `new WeakRef(target)` | `weakRef.deref()`
- `new FinalizationRegistry(callback)`
- `registry.register(target, heldValue, unregisterToken?)` | `registry.unregister(token)`
- A coleta é não determinística: nunca sustente lógica essencial nesses objetos

---

## Resumo da Aula

- Revise legenda e Convenções
- Revise operadores, precedência e palavras reservadas
- Revise funções Globais e Utilitários de Tipo
- Revise objeto Estático `JSON`
- Revise flags, classes, quantificadores e grupos de RegExp
- Revise os Iterator Helpers, `Proxy` e `Reflect`
- Revise dados binários, `Atomics`, `Intl`, `WeakRef` e `FinalizationRegistry`
