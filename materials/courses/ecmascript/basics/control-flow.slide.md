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
title: "JavaScript: Estruturas de Controle"
description: "Statements de decisão, repetição, break, continue, switch e laços aninhados em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Estruturas de Controle

Statements de decisão, repetição, break, continue, switch e laços aninhados em JavaScript.

---

## Objetivo

- Usar `if`, `else if`, `else`, `switch`, `while`, `do...while`, `for`, `break`, `continue`, laços aninhados e labels.

---

## Mapa da Aula

- Statements de controle
- Visão geral
- Decisão
- Repetição

---

## Statements de controle

- Um statement de controle organiza o fluxo do programa.
- Ele decide se um bloco será executado, quantas vezes será repetido ou em qual ponto a execução deve parar.
- `if`, `else if`, `else` e `switch` escolhem caminhos com base em condições.
- `while`, `do...while` e `for` repetem um bloco enquanto uma condição permitir.
- `break` encerra um laço ou `switch`; `continue` pula para a próxima repetição.

---

## Visão geral

- A tabela abaixo funciona como mapa inicial.
- O uso correto depende menos de decorar a sintaxe e mais de escolher a estrutura que deixa a intenção do código clara.

---

## Visão geral (Comparação)

| Grupo | Statements | Uso comum |
| ----- | ---------- | --------- |
| Decisão simples | `if`, `else` | Executar um bloco ou outro |
| Decisão em cadeia | `if`, `else if`, `else` | Testar faixas, prioridades ou estados |
| Múltiplas opções | `switch`, `case`, `default` | Comparar um valor contra casos conhecidos |
| Repetição por condição | `while`, `do...while` | Repetir até uma condição mudar |
| Repetição por contador | `for` | Percorrer uma sequência controlada por índice |

---

## Decisão

- Estruturas de decisão avaliam uma condição e escolhem qual bloco executar.
- Em JavaScript, a condição não precisa ser literalmente `true` ou `false`; ela pode ser um valor truthy ou falsy.

---

## if

- O `if` executa o bloco apenas quando a condição é verdadeira ou truthy.
- Use chaves para deixar claro quais linhas pertencem ao `if`.
- Sem chaves, apenas a primeira instrução logo após o `if` fica condicionada.
- No exemplo acima, `console.log("End of verification")` sempre executa, porque ele não pertence ao corpo do `if`.
- JavaScript permite `if` sem chaves quando existe apenas uma instrução.

---

## if (Exemplo)

```js
const positiveNumber = 10;

if (positiveNumber > 0) {
  console.log("Positive number"); // "Positive number"
}
```

---

## Condição e atribuição

- Um erro comum é usar `=` quando a intenção era comparar.
- O operador `=` atribui valor; `===` compara valor e tipo.
- O código entra no `if` porque `value = 10` atribui `10` e a própria expressão de atribuição produz `10`, que é um valor truthy.

---

## Condição e atribuição (Exemplo)

```js
let value = 0;

if (value = 10) {
  console.log("Entered", value); // "Entered" 10
}
```

---

## Truthy e falsy

- Valores como `0`, `""`, `null`, `undefined`, `NaN` e `false` são falsy.
- A maioria dos outros valores é truthy, inclusive arrays e objetos vazios.
- Para saber se um array tem itens, teste o tamanho.
- Já `Array.isArray()` responde outra pergunta: ele verifica se o valor é um array.
- Isso é útil quando o dado pode vir de uma API, formulário, arquivo JSON ou função externa.

---

## Truthy e falsy (Exemplo)

```js
const list = [];

if (list) {
  console.log("Empty array is truthy"); // "Empty array is truthy"
}
```

---

## if, else if e else

- O `else` define o caminho alternativo.
- O `else if` permite testar novas condições quando as anteriores falham.
- Quando existem três ou mais possibilidades, a cadeia com `else if` pode separar os casos.

---

## if, else if e else (Exemplo)

```js
const number = 0;

if (number > 0) {
  console.log("Positive number");
} else {
  console.log("Non-positive number"); // "Non-positive number"
}
```

---

## Ordem das condições

- A ordem dos testes importa.
- Em uma cadeia `if / else if`, o primeiro bloco que passar interrompe o restante da cadeia.
- Como `95 >= 60` já é verdadeiro, o teste `grade >= 90` nunca chega a executar.
- A condição mais específica deve vir antes da mais geral.
- Quando duas mensagens são independentes, dois `if` separados podem fazer mais sentido do que `else if`.

---

## Ordem das condições (Exemplo)

```js
const grade = 95;

if (grade >= 60) {
  console.log("Approved"); // "Approved"
} else if (grade >= 90) {
  console.log("Approved with distinction");
} else {
  console.log("Failed");
}
```

---

## switch

- O `switch` compara uma expressão com vários `case`.
- Ele é útil quando um mesmo valor pode assumir opções conhecidas, como comandos, tipos ou operadores.
- Cada `case` normalmente termina com `break`.
- Sem `break`, a execução continua para os próximos casos.

---

## switch (Exemplo)

```js
const number1 = 10;
const number2 = 20;
const operator = "+";
let result;

switch (operator) {
  case "+":
    result = number1 + number2;
    break;
  case "-":
    result = number1 - number2;
    break;
// ...
```

---

## switch usa igualdade estrita

- O `switch` compara os casos usando igualdade estrita, como `===`.
- Por isso, `1` e `"1"` são casos diferentes.

---

## switch usa igualdade estrita (Exemplo)

```js
const option = "1";

switch (option) {
  case 1:
    console.log("number one");
    break;
  case "1":
    console.log("string one"); // "string one"
    break;
  default:
    console.log("none");
}
```

---

## Fall-through

- Quando um `case` não possui `break`, JavaScript continua executando os próximos casos até encontrar um `break` ou o fim do `switch`.
- Esse comportamento é chamado de fall-through.
- O fall-through também pode ser usado de forma intencional para agrupar casos que devem executar o mesmo bloco.
- Quando um `case` não tiver `break` de propósito, deixe o agrupamento explícito ou comente a intenção.
- Caso contrário, a ausência de `break` costuma parecer erro.

---

## Fall-through (Exemplo)

```js
const selectedOperator = "-";

switch (selectedOperator) {
  case "+":
    console.log("addition");
  case "-":
    console.log("subtraction"); // "subtraction"
  case "*":
    console.log("multiplication"); // "multiplication"
    break;
  default:
    console.log("invalid");
}
```

---

## switch(true)

- Também é possível usar `switch (true)` para avaliar condições em cada `case`.
- Isso pode funcionar para faixas, mas `if / else if` costuma ser mais direto para esse tipo de lógica.

---

## switch(true) (Exemplo)

```js
const positiveNumber = 10;

switch (true) {
  case positiveNumber > 0:
    console.log("Positive number"); // "Positive number"
    break;
  case positiveNumber < 0:
    console.log("Negative number");
    break;
  default:
    console.log("Zero");
}
```

---

## Repetição

- Estruturas de repetição executam o mesmo bloco várias vezes.
- Toda repetição precisa ter uma condição de parada clara; caso contrário, o programa pode ficar preso em um laço infinito.

---

## while

- O `while` testa a condição antes de executar o bloco.
- Se a condição já começar falsa, o bloco não executa nenhuma vez.
- Neste segundo exemplo, nada é exibido porque `count < 10` já é falso no início.

---

## while (Exemplo)

```js
let count = 1;

while (count <= 5) {
  console.log(count); // 1, 2, 3, 4, 5
  count++;
}
```

---

## do...while

- O `do...while` executa o bloco primeiro e testa a condição depois.
- Por isso, o bloco executa pelo menos uma vez.
- Quando a condição continua verdadeira, ele segue repetindo.

---

## do...while (Exemplo)

```js
let count = 10;

do {
  console.log(count); // 10
  count++;
} while (count < 10);
```

---

## for

- O `for` concentra inicialização, condição e atualização no cabeçalho.
- Ele é comum quando existe um contador ou um intervalo conhecido.
- O mesmo intervalo pode ser escrito com limites diferentes.
- `i <= 5` e `i < 6` produzem a mesma sequência abaixo.
- O `for` também é útil para acumular resultados.

---

## for (Exemplo)

```js
for (let i = 1; i <= 5; i++) {
  console.log(i); // 1, 2, 3, 4, 5
}
```

---

## break e continue

- `continue` pula para a próxima repetição.
- `break` encerra o laço.
- No exemplo, `3` é pulado por `continue`.
- Quando `i` chega a `5`, o `break` encerra o laço antes do `console.log`.
- Se um teste ficar preso em um laço infinito no terminal, interrompa com

---

## break e continue (Exemplo)

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;
  if (i === 5) break;

  console.log(i); // 1, 2, 4
}
```

---

## Laços aninhados

- Um laço pode ficar dentro de outro.
- Isso é útil para gerar combinações, percorrer linhas e colunas ou montar séries.
- O laço externo controla a dezena; o laço interno controla a unidade.
- Para cada valor de `ten`, o laço de `unit` executa completo.

---

## Laços aninhados (Exemplo)

```js
let output = "";

for (let ten = 0; ten <= 2; ten++) {
  for (let unit = 0; unit <= 2; unit++) {
    output += `${ten}${unit} `;
  }
}

console.log(output.trim()); // "00 01 02 10 11 12 20 21 22"
```

---

## Labels

- Labels dão nome a um statement.
- Em laços aninhados, eles permitem que `break` ou `continue` atinjam um laço externo.
- Neste caso, `break outerBreak` encerra o laço externo inteiro, não apenas o laço de `j`.
- Aqui, `continue outerContinue` pula para a próxima repetição do laço externo.
- Labels existem na linguagem, mas aparecem pouco em código Web comum.

---

## Labels (Exemplo)

```js
outerBreak:
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (j === 2) break outerBreak;

    console.log(i, j); // 1 1
  }
}
```

---

## Exercício 1: Classificação de Nota (`grade-status.js`)

- `"Approved with distinction"` quando a nota for maior ou igual a `90`;
- `"Approved"` quando a nota for maior ou igual a `60`;
- `"Failed"` nos demais casos.
- Crie um arquivo `grade-status.js`.
- Ele deve receber uma nota em uma variável `grade` e exibir

---

## Exercício 2: Séries Numéricas com Laços Aninhados (`numeric-series.js`)

- Imprimir os números organizados em linhas contendo 10 elementos por dezena (de `00` a `09`, `10` a `19`, ..., `90` a `99`).
- Cada número dentro de uma mesma linha deve ser separado por vírgula e espaço.
- O último elemento de cada linha deve ser seguido por uma quebra de linha (`\n`).
- O último elemento da série (`99`) não deve conter vírgula no final.
- Crie um arquivo `numeric-series.js` utilizando laços aninhados (`for`) para gerar uma série numérica de `00` a `99` formatada.

---

## Exercício 2: Séries Numéricas com Laços Aninhados (`numeric-series.js`) (Exemplo)

```txt
00, 01, 02, 03, 04, 05, 06, 07, 08, 09,
10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
90, 91, 92, 93, 94, 95, 96, 97, 98, 99
```

---

## Decisão

- Qual é a diferença entre usar `if` com e sem chaves?
- Por que `if (value = 10)` pode entrar no bloco mesmo quando a intenção era
- Um array vazio é truthy ou falsy? Como testar se ele tem itens?
- Por que a ordem dos `else if` pode mudar o resultado?
- Qual comparação o `switch` usa para comparar `case`?

---

## Repetição

- Qual é a diferença prática entre `while` e `do...while`?
- Quais são as três partes comuns do cabeçalho de um `for`?
- Qual é a diferença entre `break` e `continue`?
- Quando um laço aninhado é útil?
- Para que servem labels com `break` ou `continue`?

---

## Como Executar

- Crie um arquivo chamado `statement.js`.
- Execute o arquivo no terminal.
- Altere uma condição por vez e execute novamente para observar o efeito.
- Use um arquivo `.js` para testar os exemplos no terminal.
- Isso facilita alterar uma condição por vez e conferir o resultado com `console.log`.

---

## Como Executar (Exemplo)

```js
$ node
Welcome to Node.js v24.19.0.
Type ".help" for more information.
> const grade = 95;
undefined
> grade >= 60 ? "Approved" : "Failed"
'Approved'
> .exit
```

---

## Desafio

- Crie um arquivo `operator-report.js`.
- Ele deve usar `switch` para classificar um operador em `"additive operator"`, `"multiplicative operator"` ou `"invalid"`.
- Depois, use um `for` para gerar os números de `01` a `10`, pulando o `05` com `continue` e encerrando no `09` com `break`.

---

## Resumo da Aula

- **Condicionais**: `if / else if / else` para desvios booleanos; `switch` com igualdade estrita (`===`) exigindo `break` contra fallthrough.
- **Loops Básicos**: `for` clássico para contadores controlados; `while` e `do...while` para iterações com condição pré/pós-teste.
- **for...of vs for...in**: `for...of` itera sobre **valores** de coleções iteráveis (Arrays, Strings); `for...in` itera sobre **chaves** de objetos.
- **Controle de Salto**: `break` encerra o laço imediatamente; `continue` pula diretamente para a próxima iteração.
- **Guard Clauses**: Padrão de retorno antecipado (Early Return) para eliminar aninhamentos profundos e destacar o caminho principal.
