---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Strings"
description: "Slides completos da aula de Strings em JavaScript (Imutabilidade, métodos de busca, fatiamento, template literals e Unicode)."
---

<!-- _class: lead -->

# JavaScript: Strings

Delimitadores, imutabilidade, interpolação com *template literals*, métodos de busca, fatiamento, transformação, conversão em arrays e suporte a Unicode em JavaScript.

---

## Objetivo

Compreender a manipulação de texto em JavaScript:

- Dominar os delimitadores de texto (aspas simples, duplas e *template literals*).
- Compreender o princípio da **imutabilidade** das strings.
- Utilizar acesso a caracteres com notação de colchetes, `.charAt()` e `.at()`.
- Aplicar métodos de busca (`includes`, `startsWith`, `endsWith`, `indexOf`).
- Realizar fatiamento (`slice`), transformações (`trim`, `pad`, `replace`) e conversões com `.split()`.
- Lidar com caracteres especiais e contagem real de Emojis em Unicode.

---

## O Que É Uma String?

Uma **String** é uma sequência imutável de caracteres usada para representar texto.

```js
const single = 'Aspas simples';
const double = "Aspas duplas";
const template = `Template literal`;

console.log(typeof single); // "string"
console.log(single.length);  // 13
```

- As aspas simples (`'`) e duplas (`"`) possuem comportamento idêntico.
- A crase (`` ` ``) habilita o recurso avançado de **Template Literals**.

---

## O Princípio da Imutabilidade

Em JavaScript, strings são **primitivos imutáveis**.

Nenhum método ou atribuição por índice altera o valor da string original na memória; qualquer operação de transformação **retorna uma nova string**.

```js
let text = "javascript";

// Tentar alterar um caractere por índice NÃO funciona (silenciosamente falha)
text[0] = "J";
console.log(text); // "javascript"

// Métodos retornam uma NOVA string
const upper = text.toUpperCase();
console.log(text);  // "javascript" (original intacta)
console.log(upper); // "JAVASCRIPT" (nova string criada)
```

---

## Template Literals (Crase `` ` ``)

Introduzidos no ES6+, os *template literals* trazem dois grandes avanços:

1. **Interpolação de Expressões** usando a sintaxe `${expressão}`.
2. **Strings Multilinhas** nativas sem necessidade de concatenação com `+` ou `\n`.

---

## Template Literals (Exemplo de Código)

```js
const user = "Ana";
const age = 25;

// Interpolação de variáveis e expressões matemáticas
const greeting = `Olá, ${user}! Você terá ${age + 1} anos no próximo ano.`;
console.log(greeting);

// String multilinha
const htmlSnippet = `
  <div>
    <h1>Perfil: ${user}</h1>
  </div>
`;
```

---

## Caracteres de Escape

Quando precisamos incluir caracteres especiais dentro de uma string delimitada por aspas, utilizamos a barra invertida (`\`):

| Caractere | Descrição | Exemplo |
| --- | --- | --- |
| `\'` | Aspas simples dentro de aspas simples | `'Ele disse: \'Olá!\''` |
| `\"` | Aspas duplas dentro de aspas duplas | `"Ela respondeu \"Sim\""` |
| `\n` | Nova linha (*Line Feed*) | `"Linha 1\nLinha 2"` |
| `\t` | Tabulação (*Tab*) | `"Coluna 1\tColuna 2"` |
| `\\` | Barra invertida literal | `"C:\\Windows\\System32"` |

---

## Acesso a Caracteres: Notações e Métodos

| Método / Notação | Exemplo | Comportamento para Índice Inválido | Suporta Negativo? |
| --- | --- | --- | --- |
| **Colchetes `[i]`** | `text[0]` | Retorna `undefined` | Não |
| **`.charAt(i)`** | `text.charAt(0)` | Retorna string vazia `""` | Não |
| **`.at(i)`** | `text.at(-1)` | Retorna `undefined` | **Sim** (do final) |

---

## Acesso a Caracteres (Exemplo de Código)

```js
const word = "Desenvolvimento";

console.log(word[0]);         // "D"
console.log(word.charAt(0));  // "D"

// Notação moderna .at() aceita índices negativos a partir do final
console.log(word.at(-1));     // "o" (última letra)
console.log(word.at(-2));     // "t" (penúltima letra)
```

---

## Métodos de Busca e Inspeção de Texto

Verificam a existência ou a posição de uma subcadeia dentro da string:

```js
const phrase = "Aprender JavaScript é excelente!";

// 1. .includes(sub) -> Retorna boolean
console.log(phrase.includes("JavaScript")); // true
console.log(phrase.includes("python"));     // false

// 2. .startsWith(sub) e .endsWith(sub) -> Retornam boolean
console.log(phrase.startsWith("Aprender")); // true
console.log(phrase.endsWith("excelente!")); // true

// 3. .indexOf(sub) e .lastIndexOf(sub) -> Retornam a posição (ou -1 se não achar)
console.log(phrase.indexOf("JavaScript")); // 9
console.log(phrase.indexOf("Python"));     // -1
```

---

## Métodos de Fatiamento: `.slice()` e `.substring()`

Extraem uma porção da string sem modificar a original: `string.slice(início, fimExclusivo)`

```js
const text = "JavaScript";

// .slice(início, fimExclusivo)
console.log(text.slice(0, 4));  // "Java"
console.log(text.slice(4));     // "Script" (até o final)

// Suporte a índices negativos no .slice()
console.log(text.slice(-6));    // "Script" (últimos 6 caracteres)
console.log(text.slice(-6, -2)); // "Scri"

// Diferença para .substring(): .substring() NÃO aceita negativos (trata como 0)
console.log(text.substring(0, 4)); // "Java"
```

> **Recomendação:** Prefira utilizar `.slice()`, pois aceita índices negativos de forma consistente.

---

## Métodos de Transformação: `trim()`, `toUpperCase()`, `repeat()`

```js
const rawInput = "   Ana Maria   ";

// Remoção de espaços nas pontas
console.log(rawInput.trim());      // "Ana Maria"
console.log(rawInput.trimStart()); // "Ana Maria   "
console.log(rawInput.trimEnd());   // "   Ana Maria"

// Caixas alta e baixa
const lang = "JavaScript";
console.log(lang.toUpperCase()); // "JAVASCRIPT"
console.log(lang.toLowerCase()); // "javascript"

// Repetição de texto
console.log("Ha".repeat(3)); // "HaHaHa"
```

---

## Preenchimento de Strings: `padStart()` e `padEnd()`

Preenchem a string até atingir um tamanho desejado, adicionando caracteres no início ou no fim:

```js
// padStart(tamanhoAlvo, caracterePreenchimento)
const code = "42";
console.log(code.padStart(5, "0")); // "00042" (útil para formatação de números/códigos)

const hour = "9";
const minute = "5";
console.log(`${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`); // "09:05"

// padEnd()
const label = "Item";
console.log(label.padEnd(10, ".")); // "Item......"
```

---

## Substituição de Texto: `replace()` e `replaceAll()`

```js
const text = "O gato subiu no telhado. O gato miou.";

// .replace() substitui APENAS a primeira ocorrência
const singleReplace = text.replace("gato", "cachorro");
console.log(singleReplace); // "O cachorro subiu no telhado. O gato miou."

// .replaceAll() substitui TODAS as ocorrências (ES2021+)
const allReplace = text.replaceAll("gato", "cachorro");
console.log(allReplace); // "O cachorro subiu no telhado. O cachorro miou."

// Também aceita Expressões Regulares (RegExp com flag /g)
console.log(text.replace(/gato/g, "pássaro"));
```

---

## Conversão String <-> Array: `split()` e `join()`

O método `.split(separador)` divide uma string em um **array de partes**:

```js
const csv = "maçã,banana,laranja,uva";

// Convertendo string para Array usando separador vírgula
const fruits = csv.split(",");
console.log(fruits); // ['maçã', 'banana', 'laranja', 'uva']

// Reconstruindo a string com .join()
const formatted = fruits.join(" | ");
console.log(formatted); // "maçã | banana | laranja | uva"

// Split por caractere vazio traz cada letra individualmente
const letters = "JS".split("");
console.log(letters); // ['J', 'S']
```

---

## Emojis, Unicode e a Armadilha da Propriedade `.length`

Internamente, o JavaScript codifica strings em **UTF-16**. Caracteres especiais e Emojis ocupam mais de um *code unit* (pares substitutos / *surrogate pairs*):

```js
const emoji = "🚀";

// A propriedade .length conta os code units UTF-16, NÃO os caracteres visíveis!
console.log(emoji.length); // 2! (Surpresa!)

// Forma correta de contar caracteres visíveis (Unicode Code Points):
// 1. Usando Array.from()
console.log(Array.from(emoji).length); // 1

// 2. Usando o operador Spread [...]
console.log([...emoji].length); // 1
```

---

## Invertendo uma String em JavaScript

Podemos combinar o operador *spread* `[...]` ou `.split("")` para preservar Emojis e inverter textos:

```js
function reverseString(str) {
  // O operador spread [...] lida corretamente com Emojis e Unicode!
  return [...str].reverse().join("");
}

console.log(reverseString("JavaScript")); // "tpircSavaJ"
console.log(reverseString("dev 🚀"));      // "🚀 ved"
```

---

## Exercício Prático: Sanitização de Nome de Usuário

Crie uma função `sanitizeUsername(fullName)` que:
1. Remova espaços extras nas pontas.
2. Converta todo o texto para letras minúsculas.
3. Substitua espaços internos por hífens `-`.

```js
function sanitizeUsername(fullName) {
  return fullName.trim().toLowerCase().replaceAll(" ", "-");
}

console.log(sanitizeUsername("  Luiz Carlos Chaves  "));
// "luiz-carlos-chaves"
```

---

## Desafio: Mascarando Cartão de Crédito

Crie uma função `maskCreditCard(cardNumber)` que exiba apenas os **últimos 4 dígitos** do cartão e preencha o restante com asteriscos `*` no início:

```js
function maskCreditCard(cardNumber) {
  const lastFour = cardNumber.slice(-4);
  return lastFour.padStart(cardNumber.length, "*");
}

console.log(maskCreditCard("1234567812345678")); // "************5678"
console.log(maskCreditCard("4532111122223333")); // "************3333"
```

---

## Resumo da Aula

- Strings são **primitivos imutáveis**; todos os métodos retornam novas strings.
- Use **Template Literals** (`` ` ``) para interpolação de variáveis (`${}`) e texto multilinha.
- Utilize `.at(-1)` para acessar caracteres a partir do final.
- Prefira `.slice()` para fatiar strings e `.includes()` / `.startsWith()` para buscas booleanas.
- Use `.split()` para converter strings em arrays e `.join()` para fazer o caminho inverso.
- Para contar o número real de caracteres incluindo Emojis, utilize `[...str].length` ou `Array.from(str).length`.
