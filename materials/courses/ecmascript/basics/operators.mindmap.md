---
title: 'JavaScript: Expressões e Operadores'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Expressões e Operadores

## Ideia Central

- **Expressão**: produz um valor avaliável (atribuível e combinável).
- **Statement**: instrução de controle de fluxo e organização (`if`, `for`, `const`).
- **ASI**: inserção automática de `;` (cuidado com linhas iniciadas por `(`, `[`, `/`).
- **Ambiente**: `globalThis` padroniza o objeto global (`window` no navegador).

## Precedência e Agrupamento

- **Precedência**: define qual operador executa primeiro em expressões compostas.
- **Agrupamento `()`**: força a ordem explícita de cálculo (`(f - 32) / 1.8`).
- **Associatividade**:
  - Esquerda para direita ($\rightarrow$): soma, subtração, multiplicação, divisão.
  - Direita para esquerda ($\leftarrow$): exponenciação (`**`) e atribuições (`=`).
- **Coerção na Ordem**: `2 + 3 + "4"` resulta em `"54"`, mas `"2" + 3 + 4` resulta em `"234"`.

## Operadores de Cálculo e Unários

- **Aritméticos**: soma (`+`), subtração (`-`), multiplicação (`*`), divisão (`/`), resto (`%`), exponenciação (`**`).
- **Divisão Inteira**: não nativa em `/`; use `Math.trunc()`, `Math.floor()`, `Math.ceil()`.
- **Resto (`%`)**: mantém o sinal do dividendo (`-7 % 3 === -1`).
- **Unários**: conversão numérica (`+`), inversão (`-`), negação (`!`), booleano (`!!`), tipo (`typeof`), remoção (`delete`).
- **Incremento/Decremento**:
  - Prefixo (`++x`, `--x`): altera o valor e retorna o resultado atualizado.
  - Pós-fixo (`x++`, `x--`): retorna o valor original e depois altera.

## Comparações e Igualdade

- **Relacionais**: menor (`<`), menor/igual (`<=`), maior (`>`), maior/igual (`>=`).
- **Strings**: comparação lexicográfica por código de caractere (`"2" > "10"` é `true`).
- **Existência e Tipos**:
  - `in`: verifica chave em objeto (`"name" in user`) ou índice em array.
  - `instanceof`: valida cadeia de protótipos (`arr instanceof Array`).
- **Igualdade**:
  - **Estrita (`===`, `!==`)**: compara valor e tipo sem coerção (regra recomendada).
  - **Solta (`==`, `!=`)**: permite coerções implícitas imprevisíveis.

## Lógica e Escolha

- **Lógicos**: AND (`&&`), OR (`||`), NOT (`!`) com avaliação em curto-circuito.
- **Nullish Coalescing (`??`)**: substitui apenas `null` e `undefined`, preservando `0`, `""` e `false`.
- **Condicional Ternário**: `condição ? exprVerdade : exprFalso` (expressão de escolha direta).

## Bitwise

- **Operações 32-bit**: AND (`&`), OR (`|`), XOR (`^`), NOT (`~`).
- **Deslocamento**: shift left (`<<`), shift right (`>>`), unsigned shift (`>>>`).
- **Sem Curto-Circuito**: operadores bitwise sempre avaliam ambos os operandos.

## Atribuição e Estrutura

- **Atribuição Composta**: `+=`, `-=`, `*=`, `/=`, `%=`.
- **Atribuição Lógica (ES2021)**: `||=`, `??=`, `&&=`.
- **Desestruturação**: extração declarativa de arrays `[a, b]` e objetos `{ name, age }`.
- **Optional Chaining (`?.`)**: navegação segura contra `null`/`undefined` sem gerar `TypeError`.
- **Outros**: acesso (`.`, `[]`), chamada (`()`), construtor (`new`), espalhamento (`...`).

## Boas Práticas

- **Igualdade Estrita**: priorize `===` e `!==` em todas as comparações.
- **Parênteses de Clareza**: explicite a precedência em cálculos compostos.
- **Valores Padrão**: use `??` para preservar zeros numéricos e strings vazias.
- **Proteção de Propriedades**: utilize `?.` em objetos dinâmicos ou de API externa.

