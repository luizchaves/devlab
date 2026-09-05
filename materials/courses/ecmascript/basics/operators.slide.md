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
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: 'JavaScript: Expressões e Operadores'
description: 'Expressões, statements, precedência, associatividade e operadores essenciais em JavaScript.'
---

<!-- _class: lead -->

# JavaScript: Expressões e Operadores

Expressões, statements, precedência, associatividade e operadores essenciais.

---

## Objetivo

Compreender a avaliação de expressões, regras de precedência e os operadores essenciais da linguagem.

- Diferenciar **expressões** (geram valor) de **statements** (instruções de fluxo).
- Controlar a ordem de avaliação através de **precedência** e **associatividade**.
- Utilizar operadores **aritméticos**, **unários** e **incremento/decremento**.
- Aplicar **comparações relacionais** e priorizar a **igualdade estrita (`===`)**.
- Dominar operadores **lógicos**, **curto-circuito** e **nullish coalescing (`??`)**.
- Compreender operações **bitwise**, **atribuição lógica** e **optional chaining (`?.`)**.

---

## Mapa da Aula

- Expressões e Statements (e ASI)
- Precedência e Associatividade
- Operadores Aritméticos e Unários
- Comparações e Igualdade
- Lógica, Curto-Circuito e Nullish Coalescing
- Operadores Bitwise
- Atribuição, Atribuição Lógica e Desestruturação
- Acesso, Optional Chaining e Espalhamento
- Exercício e Desafio Práticos
- Perguntas de Revisão e Boas Práticas

---

## Expressões e Statements

- **Expressão**: trecho de código que **produz um valor**. Pode ser atribuída, passada como argumento ou combinada.
- **Statement**: instrução que **organiza a execução** (`if`, `for`, `while`, declarações).

```js
console.log(1 + 1); // 2 (expressão aritmética)

let count = 0;
console.log(count++); // 0 (expressão de incremento)

console.log(18 >= 18 ? "adulto" : "menor"); // "adulto" (expressão ternária)
```

- Statements de controle (`if`, declaração `const`) não podem ficar no lado direito de atribuições.

---

## Ponto e Vírgula e ASI

- **ASI** (*Automatic Semicolon Insertion*): a engine insere `;` automaticamente ao final de instruções na maioria dos casos.
- **Cuidado com quebras de linha**: linhas iniciadas por `(`, `[`, `/`, `+` ou `-` podem ser interpretadas como continuação da linha anterior!

```js
// Sem ponto e vírgula, a engine tenta invocar o número 10 como função:
const total = 10;

(function showTotal() {
  console.log(total); // 10
})();
```

- No cabeçalho do laço `for (let i = 0; i < 3; i++)`, os `;` são **obrigatórios**.

---

## Objeto Global e Ambiente

- O ambiente de execução define onde as expressões rodam.
- No navegador existe `window` e `document`.
- No Node.js não há `window` por padrão.
- **`globalThis`** é a forma universal padronizada pelo ECMAScript.

```js
console.log(typeof globalThis); // "object" (universal)
console.log(typeof window);     // "object" no browser / "undefined" no Node.js
```

---

## Precedência e Agrupamento

Quando uma expressão possui múltiplos operadores, a **precedência** define qual é avaliado primeiro.

| Conceito | Pergunta que responde | Exemplo |
| :--- | :--- | :--- |
| **Precedência** | Qual operador executa primeiro? | `20 - 10 * 2` (multiplicação antes) |
| **Agrupamento `()`** | Como forçar uma ordem explícita? | `(20 - 10) * 2` (subtração antes) |
| **Associatividade** | Em qual direção operadores iguais agrupam? | `20 - 10 - 5` (esquerda para direita) |

---

## Precedência na Prática: Fórmula de Conversão

A fórmula de Fahrenheit para Celsius: $C = \frac{F - 32}{1.8}$

```js
const fahrenheit = 50;

// Incorreto: divisão tem precedência maior que subtração
const wrong = fahrenheit - 32 / 1.8;
console.log(wrong); // 32.22222222222222

// Correto: parênteses forçam a subtração antes da divisão
const celsius = (fahrenheit - 32) / 1.8;
console.log(celsius); // 10
```

- Multiplicação e divisão precedem soma e subtração na árvore sintática (AST).
- Parênteses reestruturam os nós da AST, forçando a avaliação prioritária.
- Em operadores lógicos, `&&` possui precedência superior a `||`.

---

## Associatividade

Define a direção de agrupamento para operadores de **mesma precedência**:

- **Esquerda para a Direita (→)**: maioria dos operadores aritméticos e lógicos.
- **Direita para a Esquerda (←)**: exponenciação (`**`) e atribuição (`=`).

```js
console.log(20 - 10 - 5); // 5  -> (20 - 10) - 5
console.log(2 ** 3 ** 2); // 512 -> 2 ** (3 ** 2) = 2 ** 9
```

- **Associatividade com coerção**:
```js
console.log(2 + 3 + "4"); // "54"  ((2 + 3) = 5 -> 5 + "4")
console.log("2" + 3 + 4); // "234" (("2" + 3) = "23" -> "23" + 4)
```

---

## Operadores Aritméticos

```js
console.log(10 + 5); // 15 (soma)
console.log(10 - 5); // 5  (subtração)
console.log(10 * 5); // 50 (multiplicação)
console.log(10 / 5); // 2  (divisão)
console.log(10 % 3); // 1  (resto da divisão / módulo)
console.log(2 ** 3); // 8  (exponenciação)
```

- A divisão `/` sempre gera `number` com ponto flutuante (não há divisão inteira automática).
- Para truncar decimais: `Math.trunc()`, `Math.floor()`, `Math.ceil()`, `Math.round()`.

---

## Divisão e Resto (`%`)

```js
console.log(7 / 2);             // 3.5
console.log(Math.trunc(7 / 2)); // 3 (descarta decimais)
console.log(Math.floor(7 / 2)); // 3 (arredonda para baixo)

console.log(7 % 3);   // 1  (resto positivo)
console.log(-7 % 3);  // -1 (o sinal acompanha o dividendo)
```

- Para normalizar índices circulares negativos:
```js
const index = -7;
const normalized = ((index % 3) + 3) % 3;
console.log(normalized); // 2
```

---

## Operadores Unários

Atuam sobre um único operando:

```js
console.log(+"5");      // 5     (conversão rápida para número)
console.log(-"5");      // -5    (inversão de sinal)
console.log(!true);     // false (negação lógica)
console.log(!!"texto"); // true  (coerção explícita para booleano)
console.log(typeof 42); // "number" (inspeção de tipo)
```

- Prefira sempre clareza a sequências confusas como `20 - + + +10 * 2`.

---

## Incremento e Decremento (`++` e `--`)

A posição do operador determina se o valor retornado é **anterior** ou **posterior** à alteração:

```js
let count = 0;

// Pós-fixo: retorna o valor original, depois incrementa
const postfix = count++;
console.log(postfix); // 0
console.log(count);   // 1

// Prefixo: incrementa primeiro, depois retorna o novo valor
const prefix = ++count;
console.log(prefix);  // 2
console.log(count);   // 2
```

---

## Operadores Relacionais

Retornam valores booleanos (`true` ou `false`):

```js
console.log(10 > 9);        // true
console.log(10 >= 10);      // true
console.log(9 <= 10);       // true
console.log("10" > 9);      // true  (coerção de "10" para número)
console.log("2" > "10");    // true  (comparação lexicográfica de strings!)
console.log("abc" < "abd"); // true
```

- **Atenção**: comparar duas strings compara códigos de caractere em ordem alfabética (`"2"` vem depois de `"1"`).

---

## Operadores `in` e `instanceof`

- **`in`**: verifica a existência de propriedade no objeto ou índice no array.
- **`instanceof`**: verifica a cadeia de protótipos em relação a um construtor/classe.

```js
const person = { name: "Ana", address: null };

console.log("name" in person); // true
console.log("age" in person);  // false
console.log(0 in [10, 20]);    // true (índice 0 existe)

console.log([] instanceof Array);          // true
console.log(new Date() instanceof Date);   // true
console.log((() => {}) instanceof Function); // true
```

---

## Igualdade: Estrita (`===`) vs Solta (`==`)

```js
console.log(1 === 1);   // true  (mesmo tipo e valor)
console.log(1 === "1"); // false (tipos diferentes: number vs string)

console.log(1 == "1");  // true  (converte a string antes de comparar)
console.log(0 == false); // true  (coerção implícita perigosa)
console.log(null == undefined); // true
```

- **Regra de Ouro**: utilize sempre **`===`** e **`!==`** para evitar armadilhas de coerção implícita.

---

## Operadores Lógicos e Curto-Circuito

- **`&&` (AND)**: retorna o primeiro valor *falsy* ou o último operando.
- **`||` (OR)**: retorna o primeiro valor *truthy* ou o último operando.
- **`!` (NOT)**: inverte o valor booleano.

```js
console.log(true && false); // false
console.log("a" && "b");    // "b"
console.log(0 && "x");      // 0

console.log(false || true); // true
console.log("" || "padrão"); // "padrão"
```

- **Curto-circuito**: se o resultado for determinado pelo primeiro operando, o segundo **não é avaliado**.

---

## Operador Nullish Coalescing (`??`)

Diferença crucial entre `||` e `??`:

- **`||`**: substitui qualquer valor *falsy* (`0`, `""`, `false`, `NaN`, `null`, `undefined`).
- **`??`**: substitui **apenas** `null` e `undefined` (*nullish*).

```js
const port = 0;

console.log(port || 3000); // 3000 (descarta 0 incorretamente)
console.log(port ?? 3000); // 0    (preserva 0 como valor válido)

const input = "";
console.log(input || "default"); // "default"
console.log(input ?? "default"); // ""
```

---

## Operadores Bitwise (Bit a Bit)

Operam diretamente sobre inteiros de 32 bits em base binária:

```txt
  0101 (5)        0101 (5)        0101 (5)
& 0011 (3)      | 0011 (3)      ^ 0011 (3)
----------      ----------      ----------
  0001 (1)        0111 (7)        0110 (6)
```

```js
console.log(5 & 3);  // 1 (AND: 1 apenas se ambos forem 1)
console.log(5 | 3);  // 7 (OR: 1 se ao menos um for 1)
console.log(5 ^ 3);  // 6 (XOR: 1 se os bits forem diferentes)
console.log(~5);     // -6 (NOT bitwise: inverte todos os bits)
```

---

## Deslocamento de Bits e Diferenças com Lógicos

```js
console.log(3 << 1); // 6 (shift left: equivale a multiplicar por 2)
console.log(12 >> 1); // 6 (shift right: equivale a dividir por 2)
console.log(1 << 3); // 8 (1 * 2³ = 8)
```

- **Bitwise vs Lógico**:
  - `&&` e `||` são lógicos e fazem **curto-circuito**.
  - `&` e `|` são bitwise e **sempre avaliam ambos os operandos**.

```js
function trace() { console.log("executou"); return true; }
false && trace(); // não executa trace()
false & trace();  // executa trace() e retorna 0
```

---

## Operador Condicional Ternário

Único operador JavaScript que recebe três operandos: `condição ? exprSeVerdade : exprSeFalso`

```js
const age = 18;
const status = age >= 18 ? "adulto" : "menor";
console.log(status); // "adulto"

// Por ser uma expressão, pode ser aninhado ou interpolado:
const score = 85;
const grade = score >= 90 ? "A" : score >= 70 ? "B" : "C";
console.log(`Nota final: ${grade}`); // "Nota final: B"
```

- Use para escolhas curtas e diretas; prefira `if`/`switch` para fluxos complexos.

---

## Operadores de Atribuição

```js
let total = 10;
total += 5; // total = total + 5 -> 15
total *= 2; // total = total * 2 -> 30
total -= 4; // total = total - 4 -> 26
total /= 2; // total = total / 2 -> 13
```

- **Atribuição Lógica (ES2021)**:
```js
let a = 0;
let b = null;
let c = "texto";

a ||= 10;              // se falsy, atribui -> 10
b ??= 20;              // se null/undefined, atribui -> 20
c &&= c.toUpperCase(); // se truthy, atribui -> "TEXTO"
console.log(a, b, c);  // 10, 20, "TEXTO"
```

---

## Desestruturação e Espalhamento (`...`)

- **Desestruturação**: extrai valores para identificadores locais.
- **Spread (`...`)**: espalha elementos em arrays, objetos ou funções.

```js
// Desestruturação de Array e Objeto
const [first, second] = [10, 20];
const { name, course } = { name: "Fulano", course: "DevLab" };
console.log(first, name); // 10 "Fulano"

// Espalhamento (Spread)
const numbers = [1, 2, 3];
const extended = [0, ...numbers, 4];
console.log(extended); // [0, 1, 2, 3, 4]
```

---

## Optional Chaining (`?.`)

Evita erros de execução `TypeError` ao navegar por propriedades nulas ou indefinidas:

```js
const student = { name: "Ana", address: null };

// Sem ?.: TypeError: Cannot read properties of null
// console.log(student.address.city);

// Com ?.: retorna undefined com segurança
console.log(student.address?.city); // undefined
console.log(student.contact?.phone); // undefined
console.log(student.save?.()); // undefined

// Combinado com ??:
const city = student.address?.city ?? "Cidade não informada";
console.log(city); // "Cidade não informada"
```

---

## Outros Operadores Comuns

| Operador | Exemplo | Papel |
| :--- | :--- | :--- |
| `.` e `[]` | `user.name`, `arr[0]` | Acesso a propriedades por identificador ou expressão |
| `()` | `sum(2, 3)` | Invocação de função |
| `new` | `new Date()` | Instanciação de objetos |
| `delete` | `delete user.age` | Remoção de propriedade em objeto |
| `,` | `(x += 1, x * 2)` | Avaliação sequencial (retorna a última expressão) |

```js
const user = { name: "Ana", age: 20 };
delete user.age;
console.log("age" in user); // false
```

---

## Taxonomia de Precedência (Resumo)

| Ordem | Grupo de Operadores | Exemplos |
| :--- | :--- | :--- |
| **1 (Mais alta)** | Acesso e Agrupamento | `()`, `.`, `[]`, `?.`, `new` |
| **2** | Incremento e Unários | `++`, `--`, `+`, `-`, `!`, `typeof`, `delete`, `~` |
| **3** | Exponenciação e Aritméticos | `**`, `*`, `/`, `%`, `+`, `-` |
| **4** | Deslocamento Bitwise | `<<`, `>>`, `>>>` |
| **5** | Relacionais e Igualdade | `<`, `<=`, `>`, `>=`, `in`, `instanceof`, `===`, `!==` |
| **6** | Bitwise & Lógicos | `&`, `^`, `\|`, `&&`, `\|\|`, `??` |
| **7** | Ternário e Atribuição | `? :`, `=`, `+=`, `??=`, `\|\|=` |
| **8 (Mais baixa)** | Vírgula | `,` |

---

## Exercício Prático: Resumo de Compra

Crie um script para calcular o resumo financeiro de um pedido:

1. Declare `unitPrice`, `quantity`, `discount` e `shipping`.
2. Calcule `subtotal = unitPrice * quantity` e `discountValue = subtotal * discount`.
3. Calcule `total = (subtotal - discountValue) + shipping` com parênteses explícitos.
4. Concatene a mensagem `"Total: R$ " + total`.
5. Calcule o frete com ternário: `total >= 100 ? "free shipping" : "paid shipping"`.
6. Compare `shipping || 10` com `shipping ?? 10` para `shipping = 0`.
7. Crie o objeto `order` com `product`, `total` e `temporaryNote`.
8. Remova `temporaryNote` com `delete` e teste com `in`.

---

## Solução do Exercício

Confira a implementação que combina cálculos, precedência explícita e operadores de escolha:

```js
const unitPrice = 49.9, quantity = 3, discount = 0.1, shipping = 0;

const subtotal = unitPrice * quantity;
const discountValue = subtotal * discount;
const total = (subtotal - discountValue) + shipping;
const message = "Total: R$ " + total;
const shippingStatus = total >= 100 ? "free shipping" : "paid shipping";

const order = { product: "Mouse", total, temporaryNote: "remover" };
delete order.temporaryNote;

console.log(total);                  // 134.73
console.log(message);                // "Total: R$ 134.73"
console.log(shippingStatus);         // "free shipping"
console.log(shipping || 10);         // 10 (falsy)
console.log(shipping ?? 10);         // 0  (nullish)
console.log("temporaryNote" in order); // false
```

---

## Desafio: Classificação de Estudante

Classifique a situação acadêmica de um estudante:

1. Declare `grade1`, `grade2`, `absences` e o objeto `student = { name: "Ana", address: null }`.
2. Calcule a média com parênteses: `(grade1 + grade2) / 2`.
3. Obtenha a cidade com `student.address?.city ?? "Cidade não informada"`.
4. Avalie a aprovação com `&&` e ternário: média ≥ 7 e faltas ≤ 5.
5. Teste o status final com igualdade estrita (`===`).

---

## Solução do Desafio

Confira a resolução completa integrando optional chaining, coalescência e operador ternário:

```js
const grade1 = 8, grade2 = 6, absences = 3;
const student = { name: "Ana", address: null };

const average = (grade1 + grade2) / 2;
const city = student.address?.city ?? "Cidade não informada";
const hasMinGrade = average >= 7;
const hasAcceptableAbsences = absences <= 5;
const status = hasMinGrade && hasAcceptableAbsences ? "approved" : "failed";

console.log(student.name);         // "Ana"
console.log(average);              // 7
console.log(city);                 // "Cidade não informada"
console.log(status);               // "approved"
console.log(status === "approved"); // true
```

---

## Perguntas de Revisão

- Qual a diferença fundamental entre **expressão** e **statement**?
- Por que `(fahrenheit - 32) / 1.8` exige parênteses?
- O que é **associatividade** e qual a direção de `**` vs `-`?
- Por que devemos usar `===` em vez de `==`?
- Como `??` se diferencia de `||` com valores como `0` e `""`?
- O que `student.address?.city` evita quando `address` é `null`?
- Qual a diferença entre operadores **lógicos** e **bitwise** em relação a curto-circuito?
- O que o operador `delete` realmente remove?

---

## Boas Práticas

- **Igualdade Estrita**: priorize `===` e `!==` incondicionalmente em todas as checagens.
- **Valores Padrão Seguros**: use `??` para preservar números válidos como `0` e strings vazias `""`.
- **Navegação em Objetos**: proteja leituras dinâmicas com `?.` para evitar `TypeError`.
- **Agrupamento Explícito**: aplique parênteses `()` em expressões com múltiplos operadores.

---

## Resumo da Aula

- Expressões produzem valores; statements organizam o fluxo do programa.
- Parênteses `()` definem agrupamento explícito sobre a precedência.
- Use `===` e `!==` para evitar coerções implícitas imprevisíveis.
- Prefira `??` para valores padrão preservando `0`, `""` e `false`.
- `?.` acessa propriedades opcionais sem disparar `TypeError`.
- Desestruturação e spread simplificam o manuseio de arrays e objetos.
