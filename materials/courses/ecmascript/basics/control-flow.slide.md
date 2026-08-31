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
title: 'JavaScript: Estruturas de Controle'
description: 'Statements de decisão, repetição, break, continue, switch e laços aninhados em JavaScript.'
---

<!-- _class: lead -->

# JavaScript: Estruturas de Controle

Decisão, repetição, interrupção e laços aninhados em JavaScript.

---

## Objetivo

- Usar `if`, `else if`, `else` e `switch`.
- Evitar atribuição acidental em condições.
- Reconhecer valores _truthy_ e _falsy_.
- Escrever `while`, `do...while` e `for` com parada clara.
- Diferenciar `break`, `continue` e labels.

---

## Mapa da Aula

- Statements de controle
- Decisão com `if` e `switch`
- Cuidados com condições
- Repetição com `while`, `do...while` e `for`
- Interrupção, aninhamento e labels
- Execução, exercícios e desafio

---

## Fluxo de um Programa

```txt
valor + operador
      |
      v
condição? ── sim ──► executa bloco
      |
     não
      v
segue para o próximo statement
```

- Estruturas de controle mudam a ordem natural de execução.
- O código deixa de ser apenas uma sequência linear.

---

## Statements de Controle

- Um _statement_ de controle organiza o fluxo do programa.
- Ele decide se um bloco será executado.
- Ele decide quantas vezes um bloco será repetido.
- `break` e `continue` controlam o interior dos laços.

---

## Famílias de Controle

| Grupo             | Statements          | Uso comum                 |
| ----------------- | ------------------- | ------------------------- |
| Decisão simples   | `if`, `else`        | Executar um caminho       |
| Decisão em cadeia | `else if`           | Testar prioridades        |
| Múltiplas opções  | `switch`            | Comparar casos conhecidos |
| Repetição         | `while`, `for`      | Repetir com uma regra     |
| Interrupção       | `break`, `continue` | Encerrar ou pular         |

---

## Decisão

- Estruturas de decisão avaliam uma condição.
- A condição pode ser `true`, `false`, _truthy_ ou _falsy_.
- O bloco escolhido deve revelar a intenção do código.

```txt
condição ── true/truthy ──► bloco executa
condição ── false/falsy ──► bloco não executa
```

---

## `if`

- O `if` executa o bloco quando a condição passa.
- Use chaves para mostrar claramente o corpo.

```js
const positiveNumber = 10;

if (positiveNumber > 0) {
  console.log('Positive number'); // "Positive number"
}
```

---

## `if` Sem Chaves

- Sem chaves, só a primeira instrução pertence ao `if`.
- A segunda chamada de `console.log` sempre executa.

```js
const negativeNumber = -5;

if (negativeNumber > 0) console.log('Positive number');
console.log('End of verification'); // sempre executa
```

---

## Atribuição na Condição

- `=` atribui valor.
- `===` compara valor e tipo.
- `value = 10` produz `10`, que é _truthy_.

```js
let value = 0;

if ((value = 10)) {
  console.log('Entered', value); // "Entered" 10
}
```

---

## Comparação Explícita

- Quando a intenção é comparar, use `===`.
- O `else` registra o caminho alternativo.

```js
let value = 0;

if (value === 10) {
  console.log('Entered', value);
} else {
  console.log('Different value'); // "Different value"
}
```

---

## _Truthy_ e _Falsy_

- _Falsy_: `0`, `""`, `null`, `undefined`, `NaN` e `false`.
- Quase todo o resto é _truthy_.
- Arrays e objetos vazios são _truthy_.
- Isso surpreende quando o teste queria medir conteúdo.

---

## Array Vazio é _Truthy_

```js
const list = [];

if (list) {
  console.log('Empty array is truthy'); // executa
}
```

- O teste confirma que `list` existe.
- Ele não confirma que o array tem itens.

---

## Testando Tamanho

```js
const list = [];

if (list.length) {
  console.log('Array has items');
} else {
  console.log('Array has no items'); // executa
}
```

- `list.length` vale `0`.
- `0` é _falsy_.

---

## Confirmando que é Array

```js
const list = [];
const maybeList = 'not a list';

console.log(Array.isArray(list)); // true
console.log(Array.isArray(maybeList)); // false

if (Array.isArray(list) && list.length > 0) {
  console.log('Array has items');
}
```

- `Array.isArray()` responde sobre tipo.
- `.length` responde sobre quantidade.

---

## `if`, `else if` e `else`

- `if` abre o primeiro caminho.
- `else if` testa uma nova condição.
- `else` cobre o caso restante.

```js
const number = 0;

if (number > 0) {
  console.log('Positive number');
} else {
  console.log('Non-positive number'); // "Non-positive number"
}
```

---

## Cadeia com Três Caminhos

```js
const number = 0;

if (number > 0) {
  console.log('Positive number');
} else if (number < 0) {
  console.log('Negative number');
} else {
  console.log('Zero'); // "Zero"
}
```

- Apenas um bloco da cadeia executa.
- A ordem dos testes decide qual bloco vence.

---

## Ordem das Condições

- A cadeia para no primeiro teste verdadeiro.
- Uma condição geral pode esconder uma específica.

```js
const grade = 95;

if (grade >= 60) {
  console.log('Approved'); // executa cedo demais
} else if (grade >= 90) {
  console.log('Approved with distinction');
}
```

---

## Ordem Corrigida

```js
const grade = 95;

if (grade >= 90) {
  console.log('Approved with distinction'); // correto
} else if (grade >= 60) {
  console.log('Approved');
} else {
  console.log('Failed');
}
```

- `grade >= 90` é mais específico.
- `grade >= 60` cobre o aprovado comum.

---

## Testes Independentes

```js
const grade = 95;

if (grade >= 60) console.log('Approved'); // executa
if (grade >= 90) console.log('Approved with distinction'); // executa
```

- Use `else if` quando só um caminho deve executar.
- Use `if` separados quando vários efeitos podem acontecer juntos.

---

## `switch`

- O `switch` compara uma expressão com vários `case`.
- É útil para comandos, tipos, operadores e opções conhecidas.
- Cada `case` normalmente termina com `break`.

```txt
operator ─► "+" ─► soma
         ├► "-" ─► subtração
         ├► "*" ─► multiplicação
         └► outro ─► inválido
```

---

## Calculadora com `switch`

```js
const number1 = 10;
const number2 = 20;
const operator = '+';
let result;

switch (operator) {
  case '+':
    result = number1 + number2;
    break;
  case '-':
    result = number1 - number2;
    break;
  default:
    result = 'Invalid operator';
}
```

---

## `switch` Usa Igualdade Estrita

- A comparação do `case` se comporta como `===`.
- `1` e `"1"` são casos diferentes.

```js
const option = '1';

switch (option) {
  case 1:
    console.log('number one');
    break;
  case '1':
    console.log('string one'); // executa
    break;
}
```

---

## _Fall-through_

- Sem `break`, a execução continua nos próximos `case`.
- Pode ser erro ou técnica intencional.

```js
const selectedOperator = '-';

switch (selectedOperator) {
  case '+':
    console.log('addition');
  case '-':
    console.log('subtraction'); // executa
  case '*':
    console.log('multiplication'); // também executa
}
```

---

## Agrupando `case`

```js
const selectedOperator = 'add';

switch (selectedOperator) {
  case '+':
  case 'add':
    console.log('additive operator'); // executa
    break;
  case '*':
  case 'x':
    console.log('multiplicative operator');
}
```

- O agrupamento intencional fica visível.
- A ausência de código entre `case` evita ambiguidade.

---

## `switch (true)`

- Cada `case` vira uma condição booleana.
- Funciona para faixas.
- `if / else if` costuma ser mais direto.

```js
const positiveNumber = 10;

switch (true) {
  case positiveNumber > 0:
    console.log('Positive number'); // executa
    break;
  case positiveNumber < 0:
    console.log('Negative number');
}
```

---

## Repetição

- Repetição executa o mesmo bloco várias vezes.
- Toda repetição precisa de condição de parada.
- Se a condição nunca mudar, o programa fica preso.

```txt
início ─► testa condição ─► executa bloco ─► atualiza estado
             ▲                                  │
             └──────── enquanto verdadeiro ◄────┘
```

---

## `while`

- O `while` testa a condição antes do bloco.
- Se a condição já começar falsa, o bloco não roda.

```js
let count = 1;

while (count <= 5) {
  console.log(count); // 1, 2, 3, 4, 5
  count++;
}
```

---

## `while` Sem Execução

```js
let count = 10;

while (count < 10) {
  console.log(count);
  count++;
}
```

- A condição é falsa desde o início.
- Nada aparece no console.

---

## `do...while`

- O bloco executa antes do teste.
- Por isso, ele roda pelo menos uma vez.

```js
let count = 10;

do {
  console.log(count); // 10
  count++;
} while (count < 10);
```

---

## `do...while` Repetindo

```js
let count = 1;

do {
  console.log(count); // 1, 2, 3, 4, 5
  count++;
} while (count <= 5);
```

- A atualização `count++` muda a condição.
- Sem essa atualização, o laço não para.

---

## `for`

- O `for` concentra inicialização, condição e atualização.
- É comum quando há contador ou intervalo conhecido.

```txt
for (início; condição; atualização) {
  bloco
}
```

```js
for (let i = 1; i <= 5; i++) {
  console.log(i); // 1, 2, 3, 4, 5
}
```

---

## Limites Equivalentes

```js
for (let i = 1; i <= 5; i++) {
  console.log(i); // 1, 2, 3, 4, 5
}

for (let i = 1; i < 6; i++) {
  console.log(i); // 1, 2, 3, 4, 5
}
```

- Os dois laços geram a mesma sequência.
- Escolha o limite que deixa a intenção mais clara.

---

## Somatório com `for`

```js
let total = 0;

for (let i = 1; i <= 10; i++) {
  total += i;
}

console.log(total); // 55
```

- `total += i` guarda o estado entre as repetições.

---

## `break` e `continue`

- `continue` pula o restante da repetição atual.
- `break` encerra o laço inteiro.
- A ordem dos testes importa.

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;
  if (i === 5) break;

  console.log(i); // 1, 2, 4
}
```

---

## Laço Infinito

```js
let count = 1;

while (count <= 5) {
  console.log(count);
  // faltou count++
}
```

- A condição `count <= 5` nunca muda.
- No terminal, interrompa com `Ctrl + C`.
- Depois procure a atualização do estado.

---

## Laços Aninhados

- Um laço pode ficar dentro de outro.
- Isso aparece em linhas, colunas e combinações.

```js
let output = '';

for (let ten = 0; ten <= 2; ten++) {
  for (let unit = 0; unit <= 2; unit++) {
    output += `${ten}${unit} `;
  }
}
```

---

## Saída do Laço Aninhado

```js
console.log(output.trim());
// "00 01 02 10 11 12 20 21 22"
```

```txt
ten = 0: 00 01 02
ten = 1: 10 11 12
ten = 2: 20 21 22
```

- Para cada `ten`, o laço de `unit` executa completo.

---

## Labels

- Labels dão nome a um statement.
- `break` e `continue` podem mirar o laço externo.
- Use com cuidado: labels tornam o fluxo menos comum.

```txt
outerBreak:
  for i
    for j
      break outerBreak ─► encerra o laço externo
```

---

## `break` com Label

```js
outerBreak: for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (j === 2) break outerBreak;

    console.log(i, j); // 1 1
  }
}
```

- Ele encerra o statement marcado por `outerBreak`.

---

## `continue` com Label

```js
outerContinue: for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (j === 2) continue outerContinue;

    console.log(i, j); // 1 1, 2 1, 3 1
  }
}
```

- A próxima repetição acontece no laço externo.

---

## Como Executar

- Crie um arquivo `statement.js`.
- Rode com `node statement.js`.
- Altere uma condição por vez.
- Confira o resultado com `console.log`.

```bash
node statement.js
```

---

## Arquivo de Teste

```js
const grade = 95;

if (grade >= 90) {
  console.log('Approved with distinction');
} else if (grade >= 60) {
  console.log('Approved');
} else {
  console.log('Failed');
}

for (let i = 1; i <= 3; i++) {
  console.log(i);
}
```

---

## Saída Esperada

```txt
Approved with distinction
1
2
3
```

- Depois de validar a saída, mude `grade`.
- Troque também os limites do `for`.

---

## Node.js REPL

```js
$ node
Welcome to Node.js v24.19.0.
Type ".help" for more information.
> const grade = 95;
undefined
> grade >= 60 ? "Approved" : "Failed"
"Approved"
> .exit
```

- O REPL é útil para condições pequenas.
- Para exemplos maiores, prefira um arquivo `.js`.

---

## Exercício 1: Nota

Crie `grade-status.js` com uma variável `grade`:

- `grade >= 90`: `"Approved with distinction"`.
- `grade >= 60`: `"Approved"`.
- demais casos: `"Failed"`.
- Teste com `95`, `75` e `40`.

---

## Exercício 1: Possível Resposta

```js
const grade = 95;

if (grade >= 90) {
  console.log('Approved with distinction');
} else if (grade >= 60) {
  console.log('Approved');
} else {
  console.log('Failed');
}
```

- A condição mais específica vem primeiro.
- Inverter a ordem classificaria `95` apenas como aprovado.

---

## Exercício 2: Série Numérica

Crie `numeric-series.js` com laços aninhados:

- gerar números de `00` a `99`;
- organizar 10 números por linha;
- separar números por vírgula e espaço;
- não deixar vírgula depois de `99`;
- desafio extra: gerar de `99` até `00`.

---

## Exercício 2: Saída

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

## Exercício 2: Possível Resposta

```js
let numbers = '';

for (let ten = 0; ten < 10; ten++) {
  for (let unit = 0; unit < 10; unit++) {
    numbers += `${ten}${unit}`;

    if (unit === 9 && ten !== 9) numbers += ',\n';
    else if (unit !== 9) numbers += ', ';
  }
}

console.log(numbers);
```

---

## Exercício 2: Versão Decrescente

```js
let numbers = '';

for (let ten = 9; ten >= 0; ten--) {
  for (let unit = 9; unit >= 0; unit--) {
    numbers += `${ten}${unit}`;

    if (unit === 0 && ten !== 0) numbers += ',\n';
    else if (unit !== 0) numbers += ', ';
  }
}

console.log(numbers);
```

---

## Desafio

Crie `operator-report.js`:

- use `switch` para classificar o operador;
- `+` e `-` viram `"additive operator"`;
- `*` e `/` viram `"multiplicative operator"`;
- outro valor vira `"invalid"`;
- gere `01` a `10`, pule `05` e pare antes de `09`.

---

## Desafio: `switch`

```js
const selectedOperator = '-';

switch (selectedOperator) {
  case '+':
  case '-':
    console.log('additive operator');
    break;
  case '*':
  case '/':
    console.log('multiplicative operator');
    break;
  default:
    console.log('invalid');
}
```

---

## Desafio: Laço

```js
for (let i = 1; i <= 10; i++) {
  if (i === 5) continue;
  if (i === 9) break;

  console.log(String(i).padStart(2, '0'));
}
```

```txt
01
02
03
04
06
07
08
```

---

## Perguntas de Revisão: Decisão

- Qual é a diferença entre usar `if` com e sem chaves?
- Por que `if (value = 10)` entra no bloco?
- Um array vazio é _truthy_ ou _falsy_?
- Como testar se um array tem itens?
- Qual comparação o `switch` usa?
- O que é _fall-through_?

---

## Perguntas de Revisão: Repetição

- Qual é a diferença prática entre `while` e `do...while`?
- Quais são as três partes do cabeçalho de um `for`?
- Qual é a diferença entre `break` e `continue`?
- Quando um laço aninhado é útil?
- Para que servem labels com `break` ou `continue`?

---

## Resumo da Aula

- **Decisão**: `if / else if / else` escolhe caminhos por condição.
- **Comparação**: `===` evita confundir teste com atribuição.
- **`switch`**: compara com igualdade estrita e exige atenção ao `break`.
- **Repetição**: `while`, `do...while` e `for` precisam de condição de parada.
- **Controle interno**: `break` encerra; `continue` pula a repetição atual.
- **Aninhamento**: laços internos modelam dimensões e combinações.
- **Labels**: resolvem casos específicos, mas devem ser raros.

---

## Próxima Aula

O foco passa para manipulação de texto:

**Strings e Template Literals**

- criação e imutabilidade;
- concatenação;
- template literals;
- métodos do objeto `String`.
