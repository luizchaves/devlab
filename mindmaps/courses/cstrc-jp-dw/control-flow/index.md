---
title: 'JavaScript: Decisão e Repetição'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Decisão e Repetição

## Ideia Central

- Controle da ordem de execução do programa
- Escolha de caminhos (Decisão) e repetição de tarefas (Laços)

## Estruturas de Decisão

### `if` / `else if` / `else`
- Bloco `if`: Executa se condição for *truthy*
- Uso recomendado de chaves `{...}` para evitar ambiguidades
- Armadilha da atribuição: `if (x = 10)` vs `if (x === 10)`
- Avaliação *Truthy* vs *Falsy*:
  - *Falsy*: `false`, `0`, `""`, `null`, `undefined`, `NaN`
  - *Truthy*: Todos os outros (incluindo `[]` e `{}`)
- Testar tamanho de arrays: `list.length`

### `switch` / `case` / `default`
- Comparação de valor estrito contra casos discretos
- `break`: Evita *fall-through* indesejado
- Agrupamento de casos: *fall-through* intencional para código compartilhado

## Estruturas de Repetição

### `while`
- Avalia a condição **antes** da execução
- Pode executar 0 vezes se condição inicial for falsa
- Exige atualização interna da condição de parada

### `do...while`
- Avalia a condição **depois** da execução
- Garante execução de pelo menos 1 vez

### `for`
- Concentra inicialização, condição e incremento no cabeçalho
- Ideal para repetições por contador ou índice de intervalo
- Limites equivalentes (`i <= 5` vs `i < 6`)

## Controle de Iteração e Laços Aninhados

### `break` e `continue`
- `continue`: Pula a iteração atual e avança para a próxima
- `break`: Encerra o laço imediatamente
- Interrupção de laço infinito com <kbd>Ctrl</kbd> + <kbd>C</kbd>

### Laços Aninhados e Labels
- Matrizes, tabelas e séries (ex: dezenas e unidades)
- `label`: Nomeia um laço externo para ser atingido por `break label` ou `continue label`

## Aplicações Práticas

- Classificação de notas e faixas de valores (`grade-status.js`)
- Relatório de operadores e geração controlada de índices (`operator-report.js`)
- Geração de séries numéricas crescentes (`00` a `99`) e decrescentes (`99` a `00`)
