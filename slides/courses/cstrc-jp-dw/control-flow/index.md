---
marp: true
theme: default
paginate: true
lang: pt-BR
title: "JavaScript: Decisão e Repetição"
description: "Slides completos da aula de controle de fluxo, decisão e repetição em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Decisão e Repetição

Estruturas de decisão (`if`, `else`, `switch`), repetição (`while`, `do...while`, `for`), interrupções (`break`, `continue`), *labels* e laços aninhados.

---

## Objetivo

Compreender o controle da ordem de execução em programas JavaScript:

- Utilizar estruturas de decisão (`if`, `else if`, `else`, `switch`).
- Dominar estruturas de repetição (`while`, `do...while`, `for`).
- Controlar iterações com `break`, `continue` e *labels*.
- Reconhecer armadilhas comuns: *truthy/falsy*, atribuição acidental (`=`), *fall-through* no `switch` e laços infinitos.
- Construir laços aninhados e séries numéricas crescentes e decrescentes.

---

## Visão Geral das Estruturas de Controle

| Categoria | Estruturas | Uso Principal |
| --- | --- | --- |
| **Decisão simples** | `if`, `else` | Executar um bloco ou outro com base em condição |
| **Decisão em cadeia** | `if`, `else if`, `else` | Testar faixas de valores ou prioridades |
| **Múltiplas opções** | `switch`, `case`, `default` | Comparar um valor contra casos conhecidos |
| **Repetição por condição** | `while`, `do...while` | Repetir enquanto uma regra for verdadeira |
| **Repetição por contador** | `for` | Percorrer sequências controladas por índice |
| **Controle de iteração** | `break`, `continue`, `label` | Interromper laço ou pular a iteração atual |

---

## Estruturas de Decisão: `if`

O `if` executa um bloco apenas se a condição for verdadeira ou *truthy*:

```js
const positiveNumber = 10;

if (positiveNumber > 0) {
  console.log("Número positivo"); // "Número positivo"
}
```

---

## Uso de Chaves `{...}` em `if`

- **Sempre prefira usar chaves `{...}`**:
  Sem chaves, apenas a primeira linha seguinte fica condicionada ao `if`.

```js
if (number > 0)
  console.log("Positivo");
console.log("Fim da checagem"); // Sempre executa!
```

---

## Armadilha: Atribuição em Condições

Usar `=` dentro da condição atribui o valor e retorna esse valor (que é avaliado como *truthy* se diferente de zero):

```js
let value = 0;

// ERRADO: Atribui 10 a value e a expressão resulta em 10 (truthy)
if (value = 10) {
  console.log("Entrou!", value); // Executa incorretamente!
}
```

---

## Comparação Estrita com `===`

Sempre utilize comparações estritas (`===`) para evitar atribuições ou coerções acidentais:

```js
let value = 0;

// CORRETO: Comparação estrita com ===
if (value === 10) {
  console.log("Entrou!");
} else {
  console.log("Valor diferente"); // "Valor diferente"
}
```

---

## Valores Truthy e Falsy

Em JavaScript, condições testam se um valor é *truthy* ou *falsy*.

- **Valores Falsy**: `false`, `0`, `""` (string vazia), `null`, `undefined`, `NaN`.
- **Valores Truthy**: Todos os outros (inclusive `[]` array vazio e `{}` objeto vazio!).

```js
const list = [];

if (list) {
  console.log("Array vazio é TRUTHY!"); // Executa!
}

if (list.length) {
  console.log("Tem itens");
} else {
  console.log("Array está vazio"); // "Array está vazio"
}
```

---

## Decisão em Cadeia: `if`, `else if`, `else`

Permite testar múltiplas alternativas sequencialmente.

- Organize as condições da **mais específica** para a **mais geral**:

```js
const grade = 95;

if (grade >= 90) {
  console.log("Aprovado com distinção"); // Executa primeiro
} else if (grade >= 60) {
  console.log("Aprovado");
} else {
  console.log("Reprovado");
}
```

Se a ordem fosse invertida (`grade >= 60` primeiro), a nota `95` cairia na condição geral e nunca atingiria o prêmio de distinção!

---

## Múltiplas Opções: `switch`

Avalia uma expressão e compara o resultado contra blocos `case`:

```js
const option = 2;

switch (option) {
  case 1:
    console.log("Opção 1 selecionada");
    break;
  case 2:
    console.log("Opção 2 selecionada"); // Executa
    break;
  default:
    console.log("Opção inválida");
}
```

---

## Múltiplas Opções: O Papel do `break`

- A palavra-chave `break` é **essencial** para interromper a execução e evitar que o código continue nos casos seguintes (*fall-through*).
- O bloco `default` é opcional e executa caso nenhum `case` seja atendido.

---

## `switch`: Agrupamento de Casos

O *fall-through* pode ser usado intencionalmente para agrupar múltiplos casos que compartilham o mesmo código:

```js
const operator = "+";

switch (operator) {
  case "+":
  case "-":
    console.log("Operador aditivo");
    break;
  case "*":
  case "/":
    console.log("Operador multiplicativo");
    break;
  default:
    console.log("Operador não suportado");
}
```

---

## Repetição por Condição: `while`

O `while` testa a condição **antes** de executar o bloco. Se a condição já for falsa no início, o bloco não executa nenhuma vez:

```js
let count = 1;

while (count <= 5) {
  console.log(count); // 1, 2, 3, 4, 5
  count++; // Atualização da condição de parada
}
```

- **Atenção**: Sempre garanta que a condição de parada será atingida para evitar laços infinitos!

---

## Repetição Garantida: `do...while`

O `do...while` executa o bloco **primeiro** e testa a condição **depois**. Por isso, o bloco executa **pelo menos uma vez**:

```js
let count = 10;

do {
  console.log(count); // Exibe 10!
  count++;
} while (count < 10);
```

Útil em situações onde a primeira interação precisa acontecer antes de validar a regra (ex: leitura de dados ou menus interativos).

---

## Repetição por Contador: `for`

Concentra inicialização, condição de parada e incremento em uma única linha no cabeçalho:

```js
for (let i = 1; i <= 5; i++) {
  console.log(i); // 1, 2, 3, 4, 5
}
```

Acumulando somatórios com o laço `for`:

```js
let total = 0;

for (let i = 1; i <= 10; i++) {
  total += i;
}

console.log(total); // 55
```

---

## Controle de Iteração: `break` e `continue`

- **`continue`**: Interrompe a iteração atual e pula imediatamente para a próxima.
- **`break`**: Encerra o laço completamente.

```js
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue; // Pula o 3
  if (i === 5) break;    // Encerra antes do 5

  console.log(i); // 1, 2, 4
}
```

*Se o terminal travar em um laço infinito, interrompa com <kbd>Ctrl</kbd> + <kbd>C</kbd>.*

---

## Laços Aninhados

Laços colocados dentro de outros laços são usados para percorrer matrizes, tabelas e gerar combinações:

```js
let output = "";

for (let ten = 0; ten <= 2; ten++) {
  for (let unit = 0; unit <= 2; unit++) {
    output += `${ten}${unit} `;
  }
}

console.log(output.trim());
// Output: "00 01 02 10 11 12 20 21 22"
```

Para cada iteração do laço externo (`ten`), o laço interno (`unit`) executa completamente.

---

## Controle de Laços Externos: `labels`

*Labels* identificam laços para permitir que o `break` ou `continue` atuem em laços externos em estruturas aninhadas:

```js
outerBreak:
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    if (j === 2) break outerBreak; // Quebra o laço externo!

    console.log(i, j); // Imprime apenas: 1 1
  }
}
```

*Nota: Use labels com moderação, pois podem dificultar a leitura do código.*

---

## Exemplo Prático: Séries Numéricas Formatadas

Gerando uma sequência formatada de `00` a `99` com quebra de linha por dezena:

```js
let numbers = "";

for (let ten = 0; ten < 10; ten++) {
  for (let unit = 0; unit < 10; unit++) {
    numbers += `${ten}${unit}`;
    if (unit === 9 && ten !== 9) {
      numbers += ",\n";
    } else if (unit !== 9) {
      numbers += ", ";
    }
  }
}

console.log(numbers);
```

---

## Executando Código: `statement.js`

Crie um arquivo `statement.js` com o exemplo de decisão:

```js
// statement.js
const grade = 95;

if (grade >= 90) {
  console.log("Approved with distinction");
} else if (grade >= 60) {
  console.log("Approved");
} else {
  console.log("Failed");
}
```

---

## Executando Código no Terminal

Execute o arquivo usando o comando Node.js no terminal:

```bash
node statement.js
```

---

## Exercício Prático: Status de Nota (`grade-status.js`)

```js
const grade = 95;

if (grade >= 90) {
  console.log("Approved with distinction");
} else if (grade >= 60) {
  console.log("Approved");
} else {
  console.log("Failed");
}
```

- Teste com as notas `95`, `75` e `40`.
- Observe a importância de manter a condição mais restritiva (`>= 90`) no topo.

---

## Desafio: Relatório de Operadores — Part 1 (`switch`)

```js
const operator = "*";

switch (operator) {
  case "+":
  case "-":
    console.log("additive operator");
    break;
  case "*":
  case "/":
    console.log("multiplicative operator");
    break;
  default:
    console.log("invalid");
}
```

---

## Desafio: Relatório de Operadores — Part 2 (`loop`)

```js
for (let i = 1; i <= 10; i++) {
  if (i === 5) continue;
  if (i === 9) break;
  console.log(String(i).padStart(2, "0")); // 01, 02, 03, 04, 06, 07, 08
}
```

---

## Resumo da Aula

- Use `if/else` para condições booleanas e `switch` para comparar um valor contra casos discretos.
- Lembre-se de usar `===` em vez de `=` em condições.
- Cuidado com *truthy* e *falsy*: Arrays vazios `[]` são *truthy*; use `.length` para checar se há elementos.
- Use `while` quando a repetição depender de uma condição e `for` quando houver contador/limite conhecido.
- Use `break` para encerrar laços e `continue` para pular para a próxima iteração.
- Utilize laços aninhados para gerar matrizes e combinações numéricas.
