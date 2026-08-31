---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Casos \"Bizarros\""
description: "Slides completos da aula JavaScript: Casos \"Bizarros\"."
---

<!-- _class: lead -->

# JavaScript: Casos "Bizarros"

Casos estranhos e famosos do JavaScript: NaN, typeof null, precisão decimal, coerção, igualdade, arrays esparsos, parseInt, truthy/falsy e objetos.

---

## Objetivo

- Entender os principais casos estranhos do JavaScript, identificar a regra que explica cada um, escolher APIs mais seguras...

---

## Mapa da Aula

- Três Fontes de Estranheza
- `NaN !== NaN`
- `typeof null === "object"`
- `0.1 + 0.2 !== 0.3`
- Igualdade: `==` vs `===`
- Soma, Concatenação e Conversão
- Objetos, Arrays e Referências
- Arrays Esparsos

---

## Introdução

- Esta aula reúne comportamentos famosos do JavaScript que parecem errados à primeira vista
- `NaN !== NaN`, `typeof null === "object"`, `0.1 + 0.2 !== 0.3`, coerções inesperadas e arrays com espaços vazios
- Quase todos esses casos deixam de ser "mágica" quando você separa três temas
- representação numérica, compatibilidade histórica e conversão implícita de tipos

---

## Três Fontes de Estranheza

- Muitos exemplos virais de JavaScript misturam sintomas diferentes
- Antes de decorar casos, é melhor classificar a origem do comportamento
- O mapa abaixo organiza as causas mais frequentes
- Diagrama da página
- De onde vêm os casos estranhos

---

## Três Fontes de Estranheza: Comparação

| Caso | Resultado | Causa principal | Forma segura |
| :--- | :--- | :--- | :--- |
| `NaN === NaN` | `false` | Regra IEEE 754 para "não é um número" | `Number.isNaN(value)` |
| `typeof null` | `"object"` | Compatibilidade histórica | `value === null` |
| `0.1 + 0.2 === 0.3` | `false` | Ponto flutuante binário | Comparar com tolerância |
| `[] === []` | `false` | Objetos são comparados por referência | Comparar conteúdo |
| `"5" + 2` | `"52"` | `+` também concatena strings | Converter antes |
| `"5" - 2` | `3` | `-` força conversão numérica | Converter antes |

---

## `NaN !== NaN`

- `NaN` significa *Not-a-Number*, mas o próprio nome engana
- o tipo de `NaN` é `number`
- Ele representa um resultado numérico inválido, como converter texto não numérico ou calcular uma operação sem resultado...
- O detalhe importante é que `NaN` não é igual a nenhum valor, nem a ele mesmo
- Use `Number.isNaN(value)` para verificar `NaN` sem coerção

---

## NaN não é igual a si mesmo

```js
const value = Number("abc");

console.log(value); // NaN
console.log(typeof value); // "number"
console.log(value === NaN); // false
console.log(value !== value); // true
console.log(Number.isNaN(value)); // true
```

---

## `typeof null === "object"`

- `null` representa ausência intencional de valor, mas `typeof null` retorna `"object"`
- Esse é um comportamento antigo da linguagem, preservado porque mudar isso quebraria código real publicado na web
- O teste correto para `null` é comparação direta
- Para diferenciar objetos reais de `null`, combine os testes
- `typeof []` também é `"object"`

---

## Testando null corretamente

```js
const selectedUser = null;

console.log(typeof selectedUser); // "object"
console.log(selectedUser === null); // true
console.log(selectedUser == undefined); // true, mas depende de coerção
console.log(selectedUser === undefined); // false
```

---

## Objeto não nulo

```js
function isObject(value) {
return typeof value === "object" && value !== null;
}

console.log(isObject({})); // true
console.log(isObject([])); // true
console.log(isObject(null)); // false
```

---

## `0.1 + 0.2 !== 0.3`

- JavaScript usa o tipo `number` baseado em ponto flutuante binário de 64 bits
- Alguns decimais simples para humanos não têm representação exata em binário, então pequenas diferenças de arredondamento...
- O exemplo clássico mostra a diferença
- Em dinheiro, uma alternativa comum é trabalhar em centavos
- `toFixed(2)` é útil para exibir valores, mas devolve string e não transforma ponto flutuante em decimal exato

---

## Precisão decimal em number

```js
const result = 0.1 + 0.2;

console.log(result); // 0.30000000000000004
console.log(result === 0.3); // false
console.log(Math.abs(result - 0.3) < Number.EPSILON); // true
```

---

## Dinheiro em centavos

```js
const priceInCents = 10;
const taxInCents = 20;
const totalInCents = priceInCents + taxInCents;

console.log(totalInCents); // 30
console.log(totalInCents / 100); // 0.3
```

---

## Igualdade: `==` vs `===`

- O operador `==` compara depois de aplicar coerções
- O operador `===` compara sem converter tipos
- Em código de aplicação, `===` é a escolha padrão porque a leitura fica previsível
- Os exemplos abaixo mostram por que `==` surpreende
- O fluxo mental para comparar valores em JavaScript deve favorecer a igualdade estrita

---

## Coerções com igualdade solta

```js
console.log(0 == false); // true
console.log("" == false); // true
console.log("5" == 5); // true
console.log(null == undefined); // true

console.log(0 === false); // false
console.log("" === false); // false
console.log("5" === 5); // false
console.log(null === undefined); // false
```

---

## Soma, Concatenação e Conversão

- O operador `+` é ambíguo
- ele soma números, mas concatena se algum lado virar string
- Outros operadores aritméticos, como `-`, `*` e `/`, forçam conversão numérica
- O contraste fica claro nestes exemplos
- Quando o valor vem de formulário, faça a conversão de forma explícita

---

## O operador + tem dois papéis

```js
console.log(5 + 2); // 7
console.log("5" + 2); // "52"
console.log(5 + "2"); // "52"
console.log("5" - 2); // 3
console.log("5" * "2"); // 10
```

---

## Entrada de formulário como texto

```js
const quantityInput = "3";
const price = 25;

const quantity = Number(quantityInput);
const total = quantity * price;

console.log(total); // 75
```

---

## Objetos, Arrays e Referências

- Primitivos são comparados por valor
- Objetos e arrays são comparados por referência
- duas estruturas com o mesmo conteúdo continuam sendo objetos diferentes se foram criadas em lugares diferentes da memória
- O exemplo abaixo parece estranho só até lembrar que cada literal cria uma nova referência
- Para comparar conteúdo, escolha uma regra explícita

---

## Comparação por referência

```js
console.log([] === []); // false
console.log({} === {}); // false

const first = [];
const second = first;

console.log(first === second); // true
```

---

## Comparando conteúdo de arrays simples

```js
function sameNumbers(a, b) {
return a.length === b.length && a.every((value, index) => value === b[index]);
}

console.log(sameNumbers([1, 2], [1, 2])); // true
console.log(sameNumbers([1, 2], [2, 1])); // false
```

---

## Arrays Esparsos

- Um array pode ter "buracos"
- posições sem valor definido
- Isso é diferente de uma posição que existe contendo `undefined`
- O comportamento aparece quando alguns métodos pulam posições vazias
- Prefira criar arrays preenchidos quando quiser percorrer todas as posições

---

## Buracos em arrays

```js
const sparse = [1, , 3];
const explicit = [1, undefined, 3];

console.log(sparse.length); // 3
console.log(1 in sparse); // false
console.log(1 in explicit); // true

sparse.forEach((value) => console.log(value));
// 1
// 3
```

---

## Array preenchido

```js
const scores = Array.from({ length: 3 }, () => 0);

console.log(scores); // [0, 0, 0]
console.log(scores.map((score) => score + 1)); // [1, 1, 1]
```

---

## Executando

- Crie um arquivo `weird-cases.js`:
- Execute com Node.js:
- Repita no console do navegador com F12 . Os resultados são os mesmos porque

---

## weird-cases.js

```js
console.log("NaN === NaN:", NaN === NaN);
console.log("Number.isNaN(NaN):", Number.isNaN(NaN));
console.log("typeof null:", typeof null);
console.log("0.1 + 0.2:", 0.1 + 0.2);
console.log("0.1 + 0.2 === 0.3:", 0.1 + 0.2 === 0.3);
console.log("[] === []:", [] === []);
console.log('"5" + 2:', "5" + 2);
console.log('"5" - 2:', "5" - 2);
```

---

## Terminal

```bash
node weird-cases.js
```

---

## Output

```txt
NaN === NaN: false
Number.isNaN(NaN): true
typeof null: object
0.1 + 0.2: 0.30000000000000004
0.1 + 0.2 === 0.3: false
[] === []: false
"5" + 2: 52
"5" - 2: 3
```

---

## Exercício

- `Number.isNaN(Number("abc"))`
- `Array.isArray([])`
- `Boolean("false")`
- `[1, , 3].map((n) => n * 2)`
- `Object.is(NaN, NaN)`

---

## Desafio

- Escreva uma função `safeSum(a, b)` que aceite números ou strings numéricas, rejeite valores inválidos e compare o...

---

## Números e valores especiais

- Por que `NaN === NaN` retorna `false`
- Qual é a forma recomendada de testar `NaN`
- Por que `0.1 + 0.2` não resulta exatamente em `0.3`

---

## Tipos, coerção e referência

- Por que `typeof null` retorna `"object"`
- Por que `"5" + 2` resulta em `"52"`
- Por que `[] === []` retorna `false`

---

## Próxima aula

- Depois de entender as principais armadilhas, use o Guia de Referência para consultar operadores, métodos e APIs nativas...

---

## Resumo da Aula

- Revise três Fontes de Estranheza
- Revise `NaN !== NaN`
- Revise `typeof null === "object"`
- Revise `0.1 + 0.2 !== 0.3`
- Revise igualdade: `==` vs `===`
- Revise soma, Concatenação e Conversão
- Revise objetos, Arrays e Referências
