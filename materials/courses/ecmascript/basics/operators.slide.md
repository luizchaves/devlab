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
title: "JavaScript: Expressões e Operadores"
description: "Expressões, statements, precedência, associatividade e operadores essenciais em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Expressões e Operadores

Expressões, statements, precedência, associatividade e operadores essenciais em JavaScript.

---

## Objetivo

- Reconhecer expressões e statements, entender precedência e associatividade, usar operadores de cálculo, concatenação, comparação.

---

## Mapa da Aula

- Expressões e statements
- Precedência e agrupamento
- Associatividade
- Operadores
- Taxonomia completa dos operadores

---

## Expressões e statements

- Uma expressão produz um valor.
- Esse valor pode ser exibido, atribuído a uma variável, passado para uma função ou combinado com outra expressão.
- Um statement é uma instrução que organiza a execução do programa.
- Declarações, `if`, `for`, `while`, `return` e blocos com `{}` são exemplos comuns.
- Nem todo statement pode ser usado onde uma expressão é esperada.

---

## Expressões e statements (Exemplo)

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

## Ponto e vírgula e ASI

- JavaScript possui ASI (Automatic Semicolon Insertion): em muitos casos, a engine insere `.
- Por isso, muitos códigos funcionam mesmo sem ponto e vírgula no fim da linha.
- Isso não significa que `;` seja sempre opcional.
- Quando a próxima linha começa com tokens que podem continuar a expressão anterior, como `(`, `[`, `/`, `+` ou `-`.
- O código acima pode ser lido como uma tentativa de chamar `10` como função.

---

## Ponto e vírgula e ASI (Exemplo)

```js
const subtotal = 10 + 5
console.log(subtotal) // 15
```

---

## Objeto global

- Algumas expressões dependem do ambiente em que o JavaScript está rodando.
- No navegador existe `window`; no Node.js, `window` normalmente não existe.
- `globalThis` é a forma padronizada de acessar o objeto global do ambiente atual.
- Ao testar expressões, confirme onde o código está rodando.
- Um exemplo que usa `document`, `window` ou elementos HTML depende do navegador.

---

## Objeto global (Exemplo)

```js
console.log(typeof window); // "undefined", quando roda no Node.js
console.log(typeof globalThis); // "object"

// ReferenceError: window is not defined.
// console.log(window);
```

---

## Precedência e agrupamento

- Quando uma expressão tem vários operadores, JavaScript precisa decidir o que será calculado primeiro.
- Essa ordem é chamada de precedência.
- A conversão de Fahrenheit para Celsius mostra por que parênteses não são apenas detalhe visual.
- A fórmula correta é `(fahrenheit - 32) / 1.8`.
- Sem agrupamento, a divisão acontece antes da subtração

---

## Precedência e agrupamento (Comparação)

| Conceito | Pergunta que responde | Exemplo |
| -------- | --------------------- | ------- |
| Precedência | Qual operador executa primeiro? | `20 - 10 * 2` |
| Agrupamento | Como forçar uma ordem? | `(20 - 10) * 2` |
| Associatividade | Em qual direção operadores iguais agrupam? | `20 - 10 - 5` |

---

## Precedência e agrupamento (Exemplo)

```js
const fahrenheit = 50;
const wrongCelsius = fahrenheit - 32 / 1.8;

console.log(wrongCelsius); // 32.22222222222222
```

---

## Associatividade

- Associatividade decide como operadores de mesma precedência são agrupados.
- A maioria dos operadores aritméticos agrupa da esquerda para a direita; exponenciação agrupa da direita para a esquerda.
- Associatividade também afeta concatenação e coerção quando `+` mistura números e strings.
- No primeiro caso, `2 + 3` acontece antes e gera `5`; depois ocorre concatenação com `"4"`.
- No segundo, a primeira operação já envolve string, então o restante segue como concatenação.

---

## Associatividade (Exemplo)

```js
console.log(20 - 10 - 5); // 5, associatividade: →
console.log(2 ** 3 ** 2); // 512, associatividade: ←
```

---

## Operadores

- Operadores são símbolos ou palavras que combinam valores.
- Alguns calculam números, outros comparam, outros escolhem valores ou alteram uma variável.
- Aritméticos, concatenação, incremento, decremento, resto e exponenciação.
- Relacionais, igualdade estrita, igualdade solta, `in` e `instanceof`.
- `&&`, `||`, `!`, `??` e operador condicional ternário.

---

## Visão geral

- A tabela abaixo organiza os principais grupos.
- Ela não precisa ser decorada; use-a como mapa de consulta para reconhecer operadores quando eles aparecerem no código.

---

## Visão geral (Comparação)

| Grupo | Operadores | Uso comum |
| ----- | ---------- | --------- |
| Aritméticos | `+`, `-`, `*`, `/`, `%`, `**` | Cálculos numéricos |
| Concatenação | `+`, `+=` | Juntar strings ou converter para string quando um lado já é texto |
| Unários | `+`, `-`, `!`, `typeof`, `delete` | Converter, negar, inspecionar ou remover |
| Incremento e decremento | `++`, `--` | Alterar um número em uma unidade |
| Relacionais | `<`, `<=`, `>`, `>=`, `in`, `instanceof` | Comparar ordem, presença ou tipo de objeto |

---

## Aritméticos

- Operadores aritméticos fazem cálculos com números e, em geral, produzem valores do tipo `number`.
- Isso vale inclusive para `/`: JavaScript não separa automaticamente divisão inteira de divisão decimal.
- O operador `%` retorna o resto da divisão, não uma porcentagem.
- JavaScript não possui um operador próprio de divisão inteira.
- A divisão com `/` sempre produz um valor `number`; para descartar ou ajustar a parte decimal.

---

## Aritméticos (Exemplo)

```js
console.log(10 + 5); // 15
console.log(10 - 5); // 5
console.log(10 * 5); // 50
console.log(10 / 5); // 2
console.log(10 % 3); // 1
console.log(2 ** 3); // 8
```

---

## Unários

- Operadores unários atuam sobre um único operando.
- Eles aparecem bastante em conversão rápida, negação booleana e inspeção de tipo.
- JavaScript permite sequências como `20 - + + +10 * 2`, mas esse tipo de expressão é difícil de ler.
- Em código de aula e produção, prefira conversões explícitas e parênteses quando a intenção não estiver óbvia.

---

## Unários (Exemplo)

```js
console.log(+"5"); // 5
console.log(-"5"); // -5
console.log(!true); // false
console.log(!!"text"); // true
console.log(typeof "DW"); // "string"
console.log(typeof undeclaredName); // "undefined"
```

---

## Incremento e decremento

- `++` e `--` alteram uma variável em uma unidade.
- A posição do operador muda o valor retornado pela expressão.
- O mesmo vale para decremento

---

## Incremento e decremento (Exemplo)

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

## Relacionais

- Operadores relacionais retornam booleanos.
- Quando tipos diferentes são comparados, JavaScript pode fazer coerção; quando duas strings são comparadas.
- `in` verifica se uma propriedade existe em um objeto ou índice existe em um array.
- Para verificar se um valor aparece dentro de um array, `includes()` costuma ser mais direto.
- `instanceof` verifica se um objeto foi criado a partir de uma função construtora ou classe na cadeia de protótipos.

---

## Relacionais (Exemplo)

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

## Igualdade

- Use `===` e `!==` como padrão.
- Eles comparam valor e tipo.
- `==` e `!=` permitem coerção antes da comparação, o que pode esconder resultados inesperados.
- A página Equality comparisons and sameness | MDN explica as diferenças entre igualdade solta.
- A JavaScript Equality Table ajuda a visualizar casos curiosos de coerção com `==`; use-a como consulta para entender o comportamento.

---

## Igualdade (Exemplo)

```js
console.log(1 == 1); // true
console.log(1 === 1); // true
console.log(1 == "1"); // true
console.log(1 === "1"); // false
console.log(1 != "1"); // false
console.log(1 !== "1"); // true
```

---

## Lógicos e nullish coalescing

- Operadores lógicos combinam booleanos, mas também retornam um dos operandos.
- Isso é muito usado para valores padrão e encadeamento de expressões.
- `||` trata qualquer valor falsy como ausência.
- `??` trata apenas `null` e `undefined` como ausência.
- Se `0`, `""` ou `false` forem valores válidos, `??` costuma ser mais adequado que `||`, porque só substitui `null` e `undefined`.

---

## Lógicos e nullish coalescing (Exemplo)

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

## Bitwise

- Operadores bitwise trabalham com bits de inteiros.
- Eles aparecem menos no começo do desenvolvimento Web, mas são úteis em flags, máscaras, baixo nível e alguns cálculos específicos.
- Em uma operação bitwise, cada posição binária é comparada com a posição equivalente do outro número.
- O resultado também é formado bit a bit.
- A conta fica mais clara na vertical

---

## Bitwise (Exemplo)

```txt
  0101
& 0011
------
  0001  // 1
```

---

## Condicional ternário

- O operador condicional escolhe entre dois valores.
- Ele é uma expressão, então pode ser atribuído a uma variável ou passado como argumento.
- Use ternário para escolhas curtas.
- Quando a lógica tiver muitos passos, `if` tende a ser mais legível.

---

## Condicional ternário (Exemplo)

```js
const age = 18;
const ageStatus = age >= 18 ? "adult" : "minor";

console.log(ageStatus); // "adult"
```

---

## Atribuição

- Operadores de atribuição guardam ou atualizam valores.
- Atribuições compostas combinam uma operação com uma nova atribuição.
- Quando `+` envolve string, ele concatena.
- Outros operadores aritméticos tendem a converter o texto para número quando possível.
- Desestruturação também é uma forma de atribuição: ela extrai partes de arrays ou objetos para nomes locais.

---

## Atribuição (Exemplo)

```js
let total = 10;

total += 5;
console.log(total); // 15

total *= 2;
console.log(total); // 30
```

---

## Optional chaining

- Optional chaining evita erro ao acessar propriedades ou métodos de valores que podem ser `null` ou `undefined`.
- Sem `?.`, o acesso tenta continuar mesmo quando `address` é `null`, gerando erro em tempo de execução.

---

## Optional chaining (Exemplo)

```js
const student = { name: "Fulano", address: null };

console.log(student.address?.city); // undefined
console.log(student.contact?.email); // undefined
console.log(student.save?.()); // undefined
console.log(student.address?.city ?? "not informed"); // "not informed"
```

---

## Outros operadores comuns

- Alguns operadores aparecem o tempo todo em JavaScript, mesmo quando não parecem operadores à primeira vista.
- Eles acessam propriedades, chamam funções, criam objetos ou espalham valores.
- O exemplo abaixo reúne alguns desses operadores em usos comuns.
- `delete` remove uma propriedade do objeto, mas não deve ser confundido com “apagar uma variável”.
- O operador `...` aparece em arrays, objetos, chamadas de função e parâmetros.

---

## Outros operadores comuns (Comparação)

| Operador | Exemplo | Ideia principal |
| -------- | ------- | --------------- |
| `.` | `user.name` | Acessa propriedade por nome fixo |
| `[]` | `user["name"]`, `items[0]` | Acessa propriedade ou índice por expressão |
| `()` | `sum(2, 3)` | Chama uma função |
| `new` | `new Date()` | Cria objeto a partir de construtor ou classe |
| `delete` | `delete user.age` | Remove uma propriedade de objeto |

---

## Outros operadores comuns (Exemplo)

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
```

---

## Taxonomia completa dos operadores

- Expressions and operators \| MDN
- A especificação agrupa os operadores por categoria.
- A tabela serve como mapa: cada linha reúne os operadores de um mesmo grupo, na ordem de precedência da linguagem.

---

## Taxonomia completa dos operadores (Comparação)

| Operator type              | Operators                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Primary expressions        | `this`, `function`, `class`, `function*`, `yield`, `yield*`, `async function*`, `await`, `[]`, `{}`, `/ab+c/i`, `( )` |
| Left-hand-side expressions | `object.property`, `object["property"]`, `new`, `new.target`, `super`, `...obj`                                       |
| Increment and decrement    | `A++`, `A--`, `++A`, `--A`                                                                                            |
| Unary operators            | `delete`, `void`, `typeof`, `+`, `-`, `~`, `!`                                                                        |
| Arithmetic operators       | `+`, `-`, `*`, `/`, `%`, `**`                                                                                         |

---

## Expressões

- Qual é a diferença entre expressão e statement?
- Expressão produz um valor.
- Statement organiza a execução, como uma declaração, bloco, `if`, `for` ou `return`.
- Por que `(fahrenheit - 32) / 1.8` precisa de parênteses?
- Porque divisão tem precedência maior que subtração.

---

## Operadores

- Por que preferir `===` a `==`?
- Porque `===` compara valor e tipo sem coerção.
- `==` pode converter valores antes de comparar, gerando resultados menos previsíveis.
- Qual é a diferença entre `||` e `??` para valores padrão?
- `||` substitui qualquer valor falsy, como `0`, `""` e `false`.

---

## Executando

- Crie um arquivo chamado `expression.js`
- Execute com Node.js
- Altere uma expressão por vez e execute novamente.
- Se aparecer erro, leia o tipo, a mensagem, o arquivo e a linha indicados no
- Os exemplos podem ser testados no Node.js ou no Console do navegador.

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

## Resumo da Aula

- **Igualdade**: Use sempre igualdade estrita (`===` e `!==`) para evitar coerções implícitas perigosas do operador solto (`==`).
- **Curto-Circuito**: `&&` retorna o primeiro falsy ou último truthy; `||` retorna o primeiro truthy ou último falsy.
- **Nullish Coalescing (`??`)**: Trata apenas `null` e `undefined` como ausência de valor, preservando `0`, `""` e `false`.
- **Optional Chaining (`?.`)**: Permite acesso seguro a propriedades, arrays (`arr?.[0]`) e métodos (`fn?.()`) sem disparar TypeError.
- **Precedência & Unários**: Operador ternário (`c ? t : f`) e unários (`+str` para número, `!!val` para booleano).
