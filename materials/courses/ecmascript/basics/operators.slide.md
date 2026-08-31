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
description: "Slides completos da aula JavaScript: Expressões e Operadores."
---

<!-- _class: lead -->

# JavaScript: Expressões e Operadores

Expressões, statements, precedência, associatividade e operadores essenciais em JavaScript.

---

## Objetivo

- Reconhecer expressões e *statements*, entender precedência e associatividade, usar operadores de cálculo, concatenação,...

---

## Mapa da Aula

- Expressões e statements
- Precedência e agrupamento
- Associatividade
- Operadores
- Taxonomia completa dos operadores
- Executando
- Exercício
- Desafio

---

## Introdução

- Depois de criar valores e variáveis, o próximo passo é combinar esses valores
- Expressões produzem resultados
- operadores descrevem como esses resultados são calculados, comparados, atribuídos ou escolhidos

---

## Expressões e statements

- Uma expressão produz um valor
- Esse valor pode ser exibido, atribuído a uma variável, passado para uma função ou combinado com outra expressão
- Um *statement* é uma instrução que organiza a execução do programa
- Declarações, `if`, `for`, `while`, `return` e blocos com ` ` são exemplos comuns
- Nem todo *statement* pode ser usado onde uma expressão é esperada

---

## Expressões

```js
console.log(1 + 1); // 2

let assignedValue;
console.log((assignedValue = 5)); // 5

let expressionCount = 0;
console.log(expressionCount++); // 0
console.log(expressionCount); // 1

console.log(18 >= 18 ? "adult" : "minor"); // "adult"
```

---

## Statement não é expressão

```js
// SyntaxError: Unexpected token 'if'.
// const result = if (true) { 1 } else { 2 };

// Uma declaração é um statement, não uma expressão.
// const total = const value = 5;
```

---

## Ponto e vírgula e ASI

- JavaScript possui ASI (*Automatic Semicolon Insertion*)
- em muitos casos, a engine insere `;` automaticamente ao interpretar que uma instrução terminou
- Por isso, muitos códigos funcionam mesmo sem ponto e vírgula no fim da linha
- Isso não significa que `;` seja sempre opcional
- Quando a próxima linha começa com tokens que podem continuar a expressão anterior, como `(`, `[`, `/`, `+` ou `-`, o...

---

## ASI em caso simples

```js
const subtotal = 10 + 5
console.log(subtotal) // 15
```

---

## Quando o ponto e vírgula importa

```js
const total = 10
(function showTotal() {
console.log(total)
})()
```

---

## Separando instruções

```js
const total = 10;

(function showTotal() {
console.log(total);
})();
```

---

## Objeto global

- Algumas expressões dependem do ambiente em que o JavaScript está rodando
- No navegador existe `window`
- no Node.js, `window` normalmente não existe
- `globalThis` é a forma padronizada de acessar o objeto global do ambiente atual
- Ao testar expressões, confirme onde o código está rodando

---

## Ambiente de execução

```js
console.log(typeof window); // "undefined", quando roda no Node.js
console.log(typeof globalThis); // "object"

// ReferenceError: window is not defined.
// console.log(window);
```

---

## Precedência e agrupamento

- Quando uma expressão tem vários operadores, JavaScript precisa decidir o que será calculado primeiro
- Essa ordem é chamada de precedência
- A conversão de Fahrenheit para Celsius mostra por que parênteses não são apenas detalhe visual
- A fórmula correta é `(fahrenheit - 32) / 1.8`
- Fórmula destacada na página

---

## Precedência e agrupamento: Comparação

| Conceito | Pergunta que responde | Exemplo |
| -------- | --------------------- | ------- |
| Precedência | Qual operador executa primeiro? | `20 - 10 * 2` |
| Agrupamento | Como forçar uma ordem? | `(20 - 10) * 2` |
| Associatividade | Em qual direção operadores iguais agrupam? | `20 - 10 - 5` |

---

## Sem agrupamento

```js
const fahrenheit = 50;
const wrongCelsius = fahrenheit - 32 / 1.8;

console.log(wrongCelsius); // 32.22222222222222
```

---

## Com agrupamento

```js
const fahrenheit = 50;
const celsius = (fahrenheit - 32) / 1.8;

console.log(celsius); // 10
```

---

## Precedência

```js
console.log(20 - 10 * 2); // 0
console.log((20 - 10) * 2); // 20

console.log(2 * 3 ** 2); // 18
console.log((2 * 3) ** 2); // 36

console.log(true || false && false); // true
console.log((true || false) && false); // false
```

---

## Associatividade

- Associatividade decide como operadores de mesma precedência são agrupados
- A maioria dos operadores aritméticos agrupa da esquerda para a direita
- exponenciação agrupa da direita para a esquerda
- Associatividade também afeta concatenação e coerção quando `+` mistura números e strings
- No primeiro caso, `2 + 3` acontece antes e gera `5`

---

## Associatividade

```js
console.log(20 - 10 - 5); // 5, associatividade: →
console.log(2 ** 3 ** 2); // 512, associatividade: ←
```

---

## Associatividade e coerção

```js
console.log(2 + 3 + "4"); // "54"
console.log("2" + 3 + 4); // "234"
```

---

## Operadores

- Operadores são símbolos ou palavras que combinam valores
- Alguns calculam números, outros comparam, outros escolhem valores ou alteram uma variável
- Aritméticos, concatenação, incremento, decremento, resto e exponenciação
- Relacionais, igualdade estrita, igualdade solta, `in` e `instanceof`
- `&&`, `||`, `!`, `??` e operador condicional ternário

---

## Visão geral

- A tabela abaixo organiza os principais grupos
- Ela não precisa ser decorada
- use-a como mapa de consulta para reconhecer operadores quando eles aparecerem no código

---

## Visão geral: Comparação

| Grupo | Operadores | Uso comum |
| ----- | ---------- | --------- |
| Aritméticos | `+`, `-`, `*`, `/`, `%`, `**` | Cálculos numéricos |
| Concatenação | `+`, `+=` | Juntar strings ou converter para string quando um lado já é texto |
| Unários | `+`, `-`, `!`, `typeof`, `delete` | Converter, negar, inspecionar ou remover |
| Incremento e decremento | `++`, `--` | Alterar um número em uma unidade |
| Relacionais | `<`, `<=`, `>`, `>=`, `in`, `instanceof` | Comparar ordem, presença ou tipo de objeto |
| ... | ... | ... |

---

## Aritméticos

- Operadores aritméticos fazem cálculos com números e, em geral, produzem valores do tipo `number`
- Isso vale inclusive para `/`
- JavaScript não separa automaticamente divisão inteira de divisão decimal
- O operador `%` retorna o resto da divisão, não uma porcentagem
- JavaScript não possui um operador próprio de divisão inteira

---

## Operadores aritméticos

```js
console.log(10 + 5); // 15
console.log(10 - 5); // 5
console.log(10 * 5); // 50
console.log(10 / 5); // 2
console.log(10 % 3); // 1
console.log(2 ** 3); // 8
```

---

## Divisão inteira por arredondamento

```js
console.log(7 / 2); // 3.5
console.log(Math.trunc(7 / 2)); // 3
console.log(Math.floor(7 / 2)); // 3
console.log(Math.ceil(7 / 2)); // 4
console.log(Math.round(7 / 2)); // 4
```

---

## Divisão com número negativo

```js
console.log(Math.trunc(-7 / 2)); // -3
console.log(Math.floor(-7 / 2)); // -4
```

---

## Unários

- Operadores unários atuam sobre um único operando
- Eles aparecem bastante em conversão rápida, negação booleana e inspeção de tipo
- JavaScript permite sequências como `20 - + + +10 * 2`, mas esse tipo de expressão é difícil de ler
- Em código de aula e produção, prefira conversões explícitas e parênteses quando a intenção não estiver óbvia

---

## Operadores unários

```js
console.log(+"5"); // 5
console.log(-"5"); // -5
console.log(!true); // false
console.log(!!"text"); // true
console.log(typeof "DW"); // "string"
console.log(typeof undeclaredName); // "undefined"
```

---

## Unários difíceis de ler

```js
// SyntaxError: Invalid left-hand side expression in prefix operation.
// console.log(20 - +++10 * 2);
// console.log(20 - ++10);

console.log(20 - + + +10 * 2); // 0
```

---

## Incremento e decremento

- `++` e `--` alteram uma variável em uma unidade
- A posição do operador muda o valor retornado pela expressão
- O mesmo vale para decremento:

---

## Prefixo e pós-fixo

```js
let count = 0;

const postfix = count++;
console.log(postfix); // 0
console.log(count); // 1

const prefix = ++count;
console.log(prefix); // 2
console.log(count); // 2
```

---

## Decremento

```js
let decrement = 2;

const decrementPostfix = decrement--;
console.log(decrementPostfix); // 2
console.log(decrement); // 1

const decrementPrefix = --decrement;
console.log(decrementPrefix); // 0
console.log(decrement); // 0
```

---

## Relacionais

- Operadores relacionais retornam booleanos
- Quando tipos diferentes são comparados, JavaScript pode fazer coerção
- quando duas strings são comparadas, a comparação é lexicográfica
- `in` verifica se uma propriedade existe em um objeto ou índice existe em um array
- Para verificar se um valor aparece dentro de um array, `includes()` costuma ser mais direto

---

## Comparações relacionais

```js
console.log(10 > 9); // true
console.log(10 >= 10); // true
console.log(9 <= 10); // true
console.log("10" > 9); // true
console.log("2" > "10"); // true
console.log("10" > "9"); // false
console.log("abc" < "abd"); // true
console.log("2" > 10); // false
```

---

## Operador in

```js
const person = { name: "Fulano", address: null };

console.log("name" in person); // true
console.log("age" in person); // false
console.log(3 in [1, 2, 3]); // false
console.log(0 in [1, 2, 3]); // true
console.log([1, 2, 3].includes(3)); // true
```

---

## instanceof

```js
console.log([] instanceof Array); // true
console.log([] instanceof Object); // true
console.log(new Date() instanceof Date); // true
console.log((() => {}) instanceof Function); // true
console.log("text" instanceof String); // false
console.log(42 instanceof Number); // false
```

---

## Igualdade

- Use `===` e `!==` como padrão
- Eles comparam valor e tipo
- `==` e `!=` permitem coerção antes da comparação, o que pode esconder resultados inesperados
- A página Equality comparisons and sameness | MDN explica as diferenças entre igualdade solta, igualdade estrita e outras...
- A JavaScript Equality Table ajuda a visualizar casos curiosos de coerção com `==`

---

## Igualdade

```js
console.log(1 == 1); // true
console.log(1 === 1); // true
console.log(1 == "1"); // true
console.log(1 === "1"); // false
console.log(1 != "1"); // false
console.log(1 !== "1"); // true
```

---

## Coerção

```js
console.log("5" + 9); // "59"
console.log("5" - 3); // 2
console.log(`total: ${42}`); // "total: 42"

if ("text") {
 console.log("entered"); // "entered"
}

console.log(Number("5") + 9); // 14
console.log(String(42)); // "42"
```

---

## Coerção que gera erro

```js
// TypeError: Cannot mix BigInt and other types.
// console.log(1n + 1);

// TypeError: Cannot convert a Symbol value to a string.
// console.log("id: " + Symbol("id"));
```

---

## Lógicos e nullish coalescing

- Operadores lógicos combinam booleanos, mas também retornam um dos operandos
- Isso é muito usado para valores padrão e encadeamento de expressões
- `||` trata qualquer valor *falsy* como ausência
- `??` trata apenas `null` e `undefined` como ausência
- Se `0`, `""` ou `false` forem valores válidos, `??` costuma ser mais adequado que `||`, porque só substitui `null` e...

---

## Operadores lógicos

```js
console.log(true && true); // true
console.log(true && false); // false
console.log(false || true); // true
console.log(false || false); // false
console.log(!false); // true

console.log("a" && "b"); // "b"
console.log("" || "default"); // "default"
console.log(0 && "x"); // 0
console.log(typeof (1 && 2)); // "number"
```

---

## || e ??

```js
let value;
console.log(value || 10); // 10
console.log(value ?? 10); // 10

value = 0;
console.log(value || 10); // 10
console.log(value ?? 10); // 0
```

---

## Bitwise

- Operadores bitwise trabalham com bits de inteiros
- Eles aparecem menos no começo do desenvolvimento Web, mas são úteis em flags, máscaras, baixo nível e alguns cálculos...
- Em uma operação bitwise, cada posição binária é comparada com a posição equivalente do outro número
- O resultado também é formado bit a bit
- A conta fica mais clara na vertical

---

## 5 & 3

```txt
0101
& 0011
------
0001  // 1
```

---

## 5 | 3

```txt
0101
| 0011
------
0111  // 7
```

---

## 5 ^ 3

```txt
0101
^ 0011
------
0110  // 6
```

---

## Condicional ternário

- O operador condicional escolhe entre dois valores
- Ele é uma expressão, então pode ser atribuído a uma variável ou passado como argumento
- Use ternário para escolhas curtas
- Quando a lógica tiver muitos passos, `if` tende a ser mais legível

---

## Operador condicional

```js
const age = 18;
const ageStatus = age >= 18 ? "adult" : "minor";

console.log(ageStatus); // "adult"
```

---

## Atribuição

- Operadores de atribuição guardam ou atualizam valores
- Atribuições compostas combinam uma operação com uma nova atribuição
- Quando `+` envolve string, ele concatena
- Outros operadores aritméticos tendem a converter o texto para número quando possível
- Desestruturação também é uma forma de atribuição

---

## Atribuições compostas

```js
let total = 10;

total += 5;
console.log(total); // 15

total *= 2;
console.log(total); // 30
```

---

## Atribuição e coerção

```js
let text = "10";
text += 5;
console.log(text); // "105"
console.log(typeof text); // "string"

let numericText = "10";
numericText -= 5;
console.log(numericText); // 5
```

---

## Desestruturação

```js
const [first, second] = [1, 2];
console.log(first); // 1
console.log(second); // 2

const { name, course } = { name: "Fulano", course: "DW" };
console.log(name); // "Fulano"
console.log(course); // "DW"
```

---

## Optional chaining

- Optional chaining evita erro ao acessar propriedades ou métodos de valores que podem ser `null` ou `undefined`
- Sem `?.`, o acesso tenta continuar mesmo quando `address` é `null`, gerando erro em tempo de execução

---

## Optional chaining

```js
const student = { name: "Fulano", address: null };

console.log(student.address?.city); // undefined
console.log(student.contact?.email); // undefined
console.log(student.save?.()); // undefined
console.log(student.address?.city ?? "not informed"); // "not informed"
```

---

## Acesso sem optional chaining

```js
// TypeError: Cannot read properties of null (reading 'city').
// console.log(student.address.city);
```

---

## Outros operadores comuns

- Alguns operadores aparecem o tempo todo em JavaScript, mesmo quando não parecem operadores à primeira vista
- Eles acessam propriedades, chamam funções, criam objetos ou espalham valores
- O exemplo abaixo reúne alguns desses operadores em usos comuns
- `delete` remove uma propriedade do objeto, mas não deve ser confundido com “apagar uma variável”
- O operador `...` aparece em arrays, objetos, chamadas de função e parâmetros

---

## Outros operadores comuns: Comparação

| Operador | Exemplo | Ideia principal |
| -------- | ------- | --------------- |
| `.` | `user.name` | Acessa propriedade por nome fixo |
| `[]` | `user["name"]`, `items[0]` | Acessa propriedade ou índice por expressão |
| `()` | `sum(2, 3)` | Chama uma função |
| `new` | `new Date()` | Cria objeto a partir de construtor ou classe |
| `delete` | `delete user.age` | Remove uma propriedade de objeto |
| ... | ... | ... |

---

## Outros operadores comuns

```js
const user = {
name: "Ana",
age: 20,
};

const numbers = [1, 2, 3];
const today = new Date();

console.log(user.name); // "Ana"
console.log(user["age"]); // 20
console.log(numbers[0]); // 1
console.log(today instanceof Date); // true
  // ...

let x = 1;
const result = (x += 1, x * 2);

console.log(result); // 4
```

---

## Taxonomia completa dos operadores

- Expressions and operators \| MDN

---

## Taxonomia completa dos operadores: Comparação

| Operator type              | Operators                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Primary expressions        | `this`, `function`, `class`, `function*`, `yield`, `yield*`, `async function*`, `await`, `[]`, `{}`, `/ab+c/i`, `( )` |
| Left-hand-side expressions | `object.property`, `object["property"]`, `new`, `new.target`, `super`, `...obj`                                       |
| Increment and decrement    | `A++`, `A--`, `++A`, `--A`                                                                                            |
| Unary operators            | `delete`, `void`, `typeof`, `+`, `-`, `~`, `!`                                                                        |
| Arithmetic operators       | `+`, `-`, `*`, `/`, `%`, `**`                                                                                         |
| ... | ... |

---

## Executando

- Crie um arquivo chamado `expression.js`:
- Execute com Node.js:
- Altere uma expressão por vez e execute novamente.
- Se aparecer erro, leia o tipo, a mensagem, o arquivo e a linha indicados no

---

## expression.js

```js
const fahrenheit = 50;
const celsius = (fahrenheit - 32) / 1.8;

console.log(celsius);
console.log(2 + 3 + "4");
console.log("2" + 3 + 4);
```

---

## Terminal

```bash
node expression.js
```

---

## Output

```txt
10
54
234
```

---

## Exercício

- Declare `unitPrice`, `quantity`, `discount` e `shipping`;
- Calcule `subtotal`, `discountValue` e `total`;
- Use parênteses para deixar a ordem do cálculo explícita;
- Monte uma mensagem usando concatenação com `+`;
- Use `total >= 100 ? "free shipping" : "paid shipping"`;

---

## Desafio

- Use `grade1`, `grade2`, `absences` e `student`;
- Calcule a média com parênteses;
- Use `?.` para acessar `student.address.city`;
- Use `??` para exibir `"Cidade não informada"` quando a cidade estiver ausente;
- Use `&&`, `||` e ternário para decidir se o estudante foi aprovado;

---

## Expressões

- Qual é a diferença entre expressão e statement
- Por que `(fahrenheit - 32) / 1.8` precisa de parênteses
- O que é associatividade

---

## Operadores

- Por que preferir `===` a `==`
- Qual é a diferença entre `||` e `??` para valores padrão
- O que `student.address?.city` evita
- Por que `2 + 3 + "4"` e `"2" + 3 + 4` têm resultados diferentes
- Quando operadores bitwise costumam aparecer

---

## Próxima aula

- Estruturas de Controle
- `if`, `switch`, laços e controle de fluxo

---

## Resumo da Aula

- Revise expressões e statements
- Revise precedência e agrupamento
- Revise associatividade
- Revise operadores
- Revise taxonomia completa dos operadores
- Revise executando
- Revise exercício
