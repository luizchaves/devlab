---
title: 'JavaScript: Expressões e Operadores'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Expressões e Operadores

## Ideia Central

- Expressões geram e retornam valores
- Operadores manipulam, comparam, transformam e atribuem valores

## Expressões vs. Statements

### Expressão
- Produz valor utilizável
- Ex: `1 + 1`, `a >= b`, `condition ? x : y`

### Statement
- Instrução de controle de fluxo
- Ex: `if`, `for`, `while`, declarações de variáveis
- ASI (*Automatic Semicolon Insertion*): Cuidados ao iniciar linhas com `(`, `[`, `/`, `+`, `-`

## Precedência e Associatividade

- **Precedência**: Ordem de execução dos operadores (ex: `*` e `/` executam antes de `+` e `-`)
- **Agrupamento**: Parênteses `()` forçam a ordem e clarificam a intenção
- **Associatividade**: Esquerda para a direita (`-`, `+`) ou Direita para a esquerda (`=`, `**`)

## Operadores Aritméticos e Unários

- **Aritméticos**: `+`, `-`, `*`, `/`, `%` (resto), `**` (exponenciação)
- **Divisão**: `/` gera `number` decimal; arredondamentos com `Math.trunc()`, `Math.floor()`
- **Unários**: `+` (coerção), `-` (inversão), `!` (negação), `typeof`
- **Incremento/Decremento**:
  - Pós-fixo (`count++`): Retorna o valor original e depois incrementa
  - Prefixo (`++count`): Incrementa primeiro e depois retorna

## Operadores Relacionais e de Igualdade

- **Relacionais**: `>`, `<`, `>=`, `<=`, comparação lexicográfica de strings
- **Igualdade Ampla (`==`, `!=`)**: Realizam coerção automática de tipo (evitar)
- **Igualdade Estrita (`===`, `!==`)**: Comparam valor e tipo sem coerção (recomendado)

## Operadores Lógicos e Ternário

- **Curto-Circuito**:
  - `&&` (AND): Retorna o primeiro *falsy* ou o último valor
  - `||` (OR): Retorna o primeiro *truthy* ou o último valor
- **Nullish Coalescing (`??`)**: Retorna fallback apenas para `null` e `undefined` (preserva `0`, `""`, `false`)
- **Operador Ternário**: `condição ? a : b` (expressão de decisão compacta)

## Operadores Bitwise e Atribuições

- **Bitwise**: `&` (AND), `|` (OR), `^` (XOR), `~` (NOT), `<<`, `>>`, `>>>` (shifts de bits)
- **Atribuição Combinada**: `+=`, `-=`, `*=`, `/=`, `%=`, `**=`
- **Atribuição Lógica**: `&&=`, `||=`, `??=`

## Operadores de Acesso e Especiais

- **Acesso**: Ponto (`.`) e Colchetes (`[]`)
- **Optional Chaining (`?.`)**: Acesso seguro a propriedades em objetos nulos ou indefinidos
- **`in`**: Verifica existência de propriedade em objeto
- **`instanceof`**: Verifica protótipo/construtor de um objeto
