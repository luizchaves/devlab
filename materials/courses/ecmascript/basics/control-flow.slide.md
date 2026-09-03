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
    padding-bottom: 0;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: 'JavaScript: Estruturas de Controle'
description: 'Statements de decisão, repetição, break, continue, switch e laços aninhados em JavaScript.'
---

<!-- _class: lead -->

# JavaScript: Estruturas de Controle

Decisão, repetição, interrupção e laços aninhados em JavaScript.

---

## Objetivo

Controlar a ordem de execução do programa através de estruturas de decisão, repetição e interrupção.

- Aplicar **estruturas condicionais** (`if`, `else if`, `else`) com chaves explícitas.
- Evitar **armadilhas de condição** como atribuição acidental (`=`) e coerções *truthy/falsy*.
- Estruturar decisões com **`switch`**, igualdade estrita (`===`) e controle de *fall-through*.
- Implementar laços de repetição com **`while`**, **`do...while`** e **`for`**.
- Controlar o fluxo interno dos laços com **`break`**, **`continue`** e **labels**.
- Construir **laços aninhados** para geração de matrizes e séries dimensionais.

---

## Mapa do Tópico

- Statements de Controle
- Decisão: `if`, `else if`, `else`
- Cuidados: Chaves, Atribuição e *Truthy/Falsy*
- Múltiplas Opções: `switch`, *Fall-Through* e `switch(true)`
- Repetição: `while` vs `do...while`
- Repetição por Contador: `for`
- Interrupção: `break`, `continue` e Labels
- Laços Aninhados e Séries Numéricas
- Exercícios, Desafio e Revisão

---

## Statements de Controle

Um *statement* de controle altera o fluxo linear do programa:

- **Decisão**: executa blocos específicos com base em condições lógicas (`if`, `else`, `switch`).
- **Repetição**: executa um bloco repetidas vezes enquanto uma condição for atendida (`while`, `do...while`, `for`).
- **Interrupção**: altera o comportamento interno do laço (`break`, `continue`, `label`).
- **Aninhamento**: estruturas dentro de estruturas para modelar matrizes e combinações.

---

## Decisão com `if`

O bloco do `if` só executa quando a condição for verdadeira ou *truthy*:

```js
const positiveNumber = 10;

if (positiveNumber > 0) {
  console.log("Positive number"); // "Positive number"
}
```

- **Sempre utilize chaves `{}`**:
```js
const negativeNumber = -5;

// Sem chaves: apenas a linha imediatamente seguinte pertence ao if
if (negativeNumber > 0)
  console.log("Positive number");
console.log("End of verification"); // "End of verification" (SEMPRE executa!)
```

---

## Atribuição Acidental em Condições

O operador `=` **atribui** valor; o operador `===` **compara**:

```js
let value = 0;

// Erro clássico: value = 10 atribui 10 e resulta em 10 (truthy!)
if (value = 10) {
  console.log("Entrou!", value); // "Entrou!" 10
}
```

```js
// Forma correta: comparação com igualdade estrita
let value = 0;

if (value === 10) {
  console.log("Entrou!", value);
} else {
  console.log("Valor diferente"); // "Valor diferente"
}
```

---

## Truthy e Falsy em Decisões

Valores *falsy*: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.

- **Atenção**: Arrays vazios `[]` e Objetos vazios `{}` são **`truthy`**!

```js
const list = [];

if (list) {
  console.log("Array vazio é truthy!"); // Executa!
}

// Para testar se o array possui itens, verifique .length:
if (list.length > 0) {
  console.log("Array possui itens");
} else {
  console.log("Array vazio"); // "Array vazio"
}
```

- Para verificar se o valor é de fato um array: `Array.isArray(list)`.

---

## Cadeias: `if`, `else if` e `else`

```js
const number = 0;

if (number > 0) {
  console.log("Positivo");
} else if (number < 0) {
  console.log("Negativo");
} else {
  console.log("Zero"); // "Zero"
}
```

- `else if` avalia a próxima condição apenas se as anteriores falharem.
- O bloco `else` final captura todos os casos não contemplados.

---

## Ordem das Condições: Específico vs Geral

Em uma cadeia `if / else if`, o primeiro bloco verdadeiro encerra a avaliação.

```js
const grade = 95;

// Incorreto: grade >= 60 intercepta 95 antes do teste de distinção!
if (grade >= 60) {
  console.log("Aprovado"); // "Aprovado"
} else if (grade >= 90) {
  console.log("Aprovado com distinção"); // Nunca executa!
}
```

```js
// Correto: a condição mais específica deve vir primeiro
if (grade >= 90) {
  console.log("Aprovado com distinção"); // "Aprovado com distinção"
} else if (grade >= 60) {
  console.log("Aprovado");
} else {
  console.log("Reprovado");
}
```

---

## Decisão com `switch`

Avalia uma expressão contra múltiplos valores com cláusulas `case`:

```js
const operator = "+";
let result;

switch (operator) {
  case "+":
    result = 10 + 20;
    break;
  case "-":
    result = 10 - 20;
    break;
  case "*":
    result = 10 * 20;
    break;
  default:
    result = "Operador inválido";
}
console.log(result); // 30
```

- `default` é executado quando nenhum `case` corresponder.

---

## `switch` usa Igualdade Estrita (`===`)

O `switch` compara valor e tipo sem coerção implícita:

```js
const option = "1";

switch (option) {
  case 1:
    console.log("Número 1");
    break;
  case "1":
    console.log("String 1"); // "String 1" (correspondência exata)
    break;
  default:
    console.log("Outro");
}
```

---

## Fall-Through no `switch`

Sem a instrução `break`, a execução continua nos `case` subsequentes:

```js
// Agrupamento intencional de casos com fall-through:
const day = "saturday";

switch (day) {
  case "saturday":
  case "sunday":
    console.log("Fim de semana"); // "Fim de semana"
    break;
  case "monday":
  case "tuesday":
  case "wednesday":
  case "thursday":
  case "friday":
    console.log("Dia útil");
    break;
  default:
    console.log("Dia inválido");
}
```

- Deixe claro e documentado quando o *fall-through* for intencional.

---

## Padrão `switch (true)`

Permite avaliar expressões lógicas em cada cláusula `case`:

```js
const positiveNumber = 10;

switch (true) {
  case positiveNumber > 0:
    console.log("Número positivo"); // "Número positivo"
    break;
  case positiveNumber < 0:
    console.log("Número negativo");
    break;
  default:
    console.log("Zero");
}
```

- Útil quando há múltiplas faixas, embora `if / else if` seja frequentemente mais legível.

---

## Repetição com `while`

Testa a condição **antes** de executar o bloco:

```js
let count = 1;

while (count <= 3) {
  console.log(count); // 1, 2, 3
  count++;
}
```

- Se a condição for falsa inicialmente, o bloco **não executa nenhuma vez**:
```js
let count = 10;
while (count < 10) {
  console.log(count); // Não executa
  count++;
}
```

---

## Repetição com `do...while`

Executa o bloco **primeiro** e testa a condição **depois**:

```js
let count = 10;

do {
  console.log(count); // 10 (executa pelo menos uma vez!)
  count++;
} while (count < 10);
```

- Ideal para menus interativos ou operações onde a primeira iteração é obrigatória antes da validação.

---

## Repetição com `for`

Reúne **inicialização**, **condição** e **atualização** no cabeçalho:

```js
// Contagem de 1 a 5
for (let i = 1; i <= 5; i++) {
  console.log(i); // 1, 2, 3, 4, 5
}

// Acumulador / Somatório
let total = 0;
for (let i = 1; i <= 10; i++) {
  total += i;
}
console.log(total); // 55
```

---

## Interrupção: `break` e `continue`

- **`continue`**: encerra a iteração atual e avança para a próxima.
- **`break`**: encerra completamente o laço.

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue; // Pula o 3
  if (i === 5) break;    // Encerra antes do 5

  console.log(i); // 1, 2, 4
}
```

- Se o laço travar em loop infinito no terminal: pressione <kbd>Ctrl</kbd> + <kbd>C</kbd>.

---

## Laços Aninhados

Um laço dentro de outro para percorrer matrizes, tabelas ou combinações:

```js
let output = "";

for (let ten = 0; ten <= 2; ten++) {
  for (let unit = 0; unit <= 2; unit++) {
    output += `${ten}${unit} `;
  }
}

console.log(output.trim());
// "00 01 02 10 11 12 20 21 22"
```

- O laço externo controla a dezena; o interno completa todas as unidades para cada dezena.

---

## Labels em Laços Aninhados

Identificam statements externos para controle com `break` ou `continue`:

```js
outerBreak:
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (j === 2) break outerBreak; // Encerra o laço EXTERNO (i)

    console.log(i, j); // 1 1
  }
}
```

- Use com moderação; na maioria dos casos, funções isoladas ou `return` são mais limpos.

---

## Exercício 1: Classificação de Notas

Crie um script `grade-status.js`:

1. Declare a nota em uma variável `grade = 95`.
2. Exiba `"Approved with distinction"` para `grade >= 90`.
3. Exiba `"Approved"` para `grade >= 60`.
4. Exiba `"Failed"` para os demais casos.

```js
const grade = 95;

if (grade >= 90) {
  console.log("Approved with distinction"); // "Approved with distinction"
} else if (grade >= 60) {
  console.log("Approved");
} else {
  console.log("Failed");
}
```

---

## Exercício 2: Séries Numéricas (00 a 99)

Gere uma grade formatada de `00` a `99` com 10 elementos por linha:

```js
let numbers = "";

for (let ten = 0; ten < 10; ten++) {
  for (let unit = 0; unit < 10; unit++) {
    numbers += `${ten}${unit}`;

    if (unit === 9 && ten !== 9) {
      numbers += ",\n";
    } else if (unit !== 9 || ten !== 9) {
      numbers += ", ";
    }
  }
}
console.log(numbers);
// 00, 01, 02, 03, 04, 05, 06, 07, 08, 09,
// 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, ...
```

---

## Desafio: Classificação de Dias e Laço

Classifique um dia com `switch` agrupando o fim de semana e gere uma sequência:

```js
const day = "saturday";

switch (day) {
  case "saturday":
  case "sunday":
    console.log("weekend"); // "weekend"
    break;
  case "monday":
  case "tuesday":
  case "wednesday":
  case "thursday":
  case "friday":
    console.log("weekday");
    break;
  default:
    console.log("invalid day");
}

for (let i = 1; i <= 10; i++) {
  if (i === 5) continue;
  if (i === 9) break;
  console.log(String(i).padStart(2, "0")); // 01, 02, 03, 04, 06, 07, 08
}
```

---

## Perguntas de Revisão

- Qual é o perigo de omitir as chaves `{}` no statement `if`?
- Por que `if (value = 10)` entra no bloco indevidamente?
- Arrays vazios `[]` são *truthy* ou *falsy*? Como testar se contêm itens?
- Por que a ordem das condições em um `if / else if` altera o resultado?
- Qual tipo de comparação o `switch` utiliza para avaliar os `case`?
- O que é *fall-through* no `switch` e quando ele é intencional?
- Qual a diferença fundamental de execução entre `while` e `do...while`?
- Como `break` e `continue` alteram o comportamento de repetições?

---

## Resumo e Boas Práticas

- **Decisão**: `if / else if / else` direciona caminhos; `switch` compara opções fixas com `===`.
- **Prevenção de Erros**: use `{}` e nunca confunda `=` (atribuição) com `===` (comparação).
- **Truthy / Falsy**: coleções vazias são *truthy*; verifique `.length > 0`.
- **Repetição**: `while` (pré-teste), `do...while` (pós-teste) e `for` (contador).
- **Controle de Laço**: `continue` avança iterações; `break` encerra o laço.
- **Aninhamento**: laços internos modelam dimensões e combinações.
