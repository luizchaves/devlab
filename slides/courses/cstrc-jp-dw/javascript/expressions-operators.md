---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Expressões e Operadores"
description: "Slides completos da aula de expressões, precedência, associatividade e operadores em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Expressões e Operadores

Expressões, *statements*, precedência, associatividade, operadores aritméticos, relacionais, lógicos, *bitwise*, atribuição e acesso a propriedades.

---

## Objetivo

Compreender o uso de expressões e a atuação dos operadores em JavaScript:

- Diferenciar **expressões** (que geram valores) de ***statements*** (instruções de fluxo).
- Entender **precedência** e **associatividade** para forçar a ordem correta com parênteses `()`.
- Dominar operadores aritméticos, unários, incremento/decremento (`++`/`--`) e resto (`%`).
- Utilizar operadores relacionais (`>`, `<`) e de igualdade estrita (`===` vs `==`).
- Aplicar avaliação de curto-circuito (`&&`, `||`), *Nullish Coalescing* (`??`) e operador ternário (`? :`).
- Conhecer operadores *bitwise*, atribuições lógicas (`&&=`, `||=`, `??=`) e acesso seguro com *Optional Chaining* (`?.`).

---

## Expressões (*Expressions*)

Combinação de código que **produz um valor**:

```js
1 + 1 // 2
age >= 18 // true
condition ? "Adulto" : "Menor" // "Adulto"
```

*Uma expressão pode ser usada em qualquer lugar onde um valor é esperado.*

---

## Instruções (*Statements*)

Instrução de código que **organiza a execução** do programa (não produz valor diretamente):

```js
if (true) { console.log("OK"); }
let count = 0;
```

---

## Ponto e Vírgula e ASI

JavaScript possui **ASI** (*Automatic Semicolon Insertion*), que insere `;` automaticamente em muitas quebras de linha.

No entanto, linhas iniciando com `(`, `[`, `/`, `+` ou `-` podem continuar a instrução anterior:

```js
// Pode ser interpretado como tentar chamar 10 como função: 10(...)
const total = 10
(function show() { console.log(total) })()

// Forma segura com ponto e vírgula explícito:
const total = 10;
(function show() { console.log(total); })();
```

---

## Precedência e Associatividade

- **Precedência**: Determina qual operador executa primeiro em uma expressão.
- **Agrupamento**: O uso de parênteses `()` força uma ordem específica.
- **Associatividade**: Define a direção de avaliação para operadores de mesma precedência.

```js
// Precedência da multiplicação:
console.log(20 - 10 * 2); // 0 (10 * 2 = 20, depois 20 - 20)

// Agrupamento com parênteses:
console.log((20 - 10) * 2); // 20 (20 - 10 = 10, depois 10 * 2)

// Associatividade da esquerda para a direita (subtração):
console.log(20 - 10 - 5); // 5 ((20 - 10) - 5)
```

---

## Operadores Aritméticos

Adição (`+`), Subtração (`-`), Multiplicação (`*`), Divisão (`/`), Resto (`%`), Exponenciação (`**`).

```js
console.log(7 / 2); // 3.5 (sempre produz number)
console.log(Math.trunc(7 / 2)); // 3 (descarta decimal)
console.log(7 % 3); // 1 (resto)
console.log(2 ** 3); // 8 (2 elevado a 3)
```

---

## Operadores Unários

Atuam em um único operando: `+` (coerção para número), `-` (inversão de sinal), `!` (negação booleana), `typeof`.

```js
console.log(+"5"); // 5 (number)
console.log(!!"texto"); // true (boolean)
```

---

## Incremento e Decremento (`++` e `--`)

A posição do operador altera o valor retornado pela expressão:

- **Pós-fixo (`count++`)**: Retorna o valor **atual** e depois incrementa.
- **Prefixo (`++count`)**: Incrementa **primeiro** e retorna o valor atualizado.

```js
let count = 0;

console.log(count++); // 0 (retorna 0, count passa a ser 1)
console.log(count);   // 1

console.log(++count); // 2 (incrementa para 2, retorna 2)
console.log(count);   // 2
```

---

## Operadores Relacionais

`>`, `<`, `>=`, `<=`. Comparação entre strings é lexicográfica:

```js
console.log(10 > 9);       // true
console.log("2" > "10");   // true (comparação de texto por caractere '2' > '1')
console.log("2" > 10);     // false ("2" convertido para number 2)
```

---

## Igualdade Ampla (`==`) vs Estrita (`===`)

- **`==` / `!=`**: Realizam **coerção automática de tipo** (evite usar).
- **`===` / `!==`**: Comparam **valor e tipo** (sem coerção).

```js
console.log(1 == "1");  // true (coerção)
console.log(1 === "1"); // false (tipos diferentes: number vs string)
```

---

## Operadores Lógicos e Curto-Circuito

Avaliam expressões booleanas e utilizam **curto-circuito** (*short-circuit evaluation*):

- **`&&` (AND)**: Retorna o primeiro valor *falsy* ou o último valor se todos forem *truthy*.
- **`||` (OR)**: Retorna o primeiro valor *truthy* ou o último valor se todos forem *falsy*.

```js
console.log("User" && "Admin"); // "Admin" (ambos truthy)
console.log("" && "Admin");     // "" (primeiro falsy)

console.log("" || "Visitante");  // "Visitante" (primeiro truthy)
console.log("Ana" || "Visitante");// "Ana"
```

---

## Operador Nullish Coalescing (`??`)

Ao contrário do `||` (que considera `0`, `""` e `false` como *falsy*), o `??` considera apenas `null` e `undefined`:

```js
const count = 0;

console.log(count || 10); // 10 (0 é falsy no ||)
console.log(count ?? 10); // 0  (0 NÃO é null ou undefined!)

const name = null;
console.log(name ?? "Anônimo"); // "Anônimo"
```

- Excelente para fornecer valores padrão mantendo `0`, `""` e `false` válidos.

---

## Operador Ternário (`condição ? a : b`)

Único operador que recebe três operandos. É uma **expressão** e pode ser atribuído a variáveis:

```js
const age = 20;
const status = age >= 18 ? "Adulto" : "Menor";

console.log(status); // "Adulto"
```

Aninhamento de ternários:

```js
const score = 85;
const result = score >= 90 ? "A" : score >= 70 ? "B" : "C";

console.log(result); // "B"
```

---

## Operadores Bitwise (Bits a Bit)

Operam sobre a representação binária inteira de 32 bits dos operandos:

- `&` (AND a bit), `|` (OR a bit), `^` (XOR a bit), `~` (NOT / Inversão de bits).
- `<<` (Shift à esquerda), `>>` (Shift à direita com sinal), `>>>` (Shift à direita sem sinal).

```js
console.log(5 & 3); // 1 (0101 & 0011 = 0001)
console.log(5 | 3); // 7 (0101 | 0011 = 0111)
console.log(5 ^ 3); // 6 (0101 ^ 0011 = 0110)
console.log(~5);    // -6 (-(5 + 1))
console.log(5 << 1);// 10 (multiplica por 2)
```

---

## Atribuições Combinadas

Atribuição simples (`=`) e combinada com operações aritméticas (`+=`, `-=`, `*=`, `/=`, `%=`, `**=`):

```js
let x = 10;
x += 5; // x = x + 5 (15)
```

---

## Atribuições Lógicas (ES2021)

- **`&&=`**: Atribui apenas se o valor atual for *truthy*.
- **`||=`**: Atribui apenas se o valor atual for *falsy*.
- **`??=`**: Atribui apenas se o valor atual for `null` ou `undefined`.

```js
let user = null;
user ??= "Visitante"; // user vira "Visitante"
```

---

## Acesso a Propriedades e Operadores Especiais

### Acesso por Ponto (`.`) e Colchetes (`[]`)
```js
const person = { name: "Ana" };
console.log(person.name);     // "Ana"
console.log(person["name"]); // "Ana"
```

### Encadeamento Opcional (*Optional Chaining* `?.`)
Evita erros ao acessar propriedades de objetos `null` ou `undefined`:

```js
const user = {};
console.log(user.address?.street); // undefined (em vez de TypeError!)
```

---

## Operadores `in` e `instanceof`

- **`in`**: Verifica se uma propriedade existe em um objeto (ou chave em um protótipo):

```js
const car = { brand: "Ford" };
console.log("brand" in car); // true
console.log("year" in car);  // false
```

- **`instanceof`**: Verifica se um objeto foi criado por uma determinada função construtora/classe:

```js
const date = new Date();
console.log(date instanceof Date);   // true
console.log(date instanceof Object); // true
```

---

## Exercício Prático: Avaliador de Expressões

Crie um arquivo `expressions.js` para testar precedência e curto-circuito:

```js
const val1 = 10;
const val2 = "10";

console.log(val1 === val2); // false
console.log(val1 == val2);  // true

const status = 0 ?? "Default";
console.log(status); // 0

const obj = null;
console.log(obj?.property); // undefined
```

---

## Resumo da Aula

- **Expressões** produzem valor; ***statements*** controlam o fluxo.
- Use **`===`** e **`!==`** para evitar coerção implícita de tipo indesejada.
- Lembre-se do **curto-circuito** (`&&`, `||`) e do **Nullish Coalescing** (`??`) para valores padrão.
- Diferencie **`count++`** (retorna antes) de **`++count`** (incrementa antes).
- Use parênteses **`()`** para forçar a precedência desejada e deixar a intenção clara.
- Utilize **`?.`** para acesso seguro a propriedades sem estourar `TypeError`.
