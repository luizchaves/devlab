---
title: 'JavaScript: Estruturas de Controle'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Estruturas de Controle

## Ideia Central

- **Controle de Fluxo**: altera a execução linear para responder a regras de negócio.
- **Categorias**: Decisão, Repetição, Interrupção e Aninhamento.

## Decisão Condicional

- **`if` Simples**: executa o bloco quando a condição é verdadeira ou *truthy*.
- **Uso de Chaves `{}`**: obrigatório para clareza e prevenção de erros em múltiplas linhas.
- **Atribuição vs Comparação**: `=` atribui valor (*truthy* acidental); `===` compara valor e tipo.
- **Truthy e Falsy**:
  - *Falsy*: `false`, `0`, `""`, `null`, `undefined`, `NaN`.
  - *Truthy*: arrays vazios `[]` e objetos `{}` (teste itens com `.length > 0` e `Array.isArray()`).
- **Cadeias `if / else if / else`**:
  - Avaliação para no primeiro teste verdadeiro.
  - Condições específicas devem preceder condições gerais.
- **Condições Independentes**: múltiplos `if` separados para regras não exclusivas.

## Múltiplas Opções (switch)

- **Sintaxe**: `switch (expressão) { case valor: ... break; default: ... }`.
- **Igualdade Estrita**: comparações utilizam `===` (`case 1:` ≠ `case "1":`).
- **Fall-Through**:
  - Ocorre quando a cláusula `case` não possui `break`.
  - Útil quando intencional para agrupar múltiplos casos com a mesma ação.
- **Padrão `switch (true)`**: permite avaliar faixas e expressões lógicas por `case`.

## Estruturas de Repetição

- **`while`**: testa a condição antes de executar o bloco (0 a N execuções).
- **`do...while`**: executa primeiro e testa a condição depois (1 a N execuções).
- **`for`**: concentra inicialização, condição e atualização no cabeçalho.
- **Prevenção de Loop Infinito**: garantia de atualização do estado de controle a cada iteração.

## Interrupção e Controle

- **`continue`**: pula a iteração corrente e avança para a próxima.
- **`break`**: encerra o laço ou bloco `switch` imediatamente.
- **Labels**: nomeiam statements externos para direcionamento de `break` e `continue`.

## Laços Aninhados

- **Multidimensão**: iteração completa do laço interno para cada ciclo do laço externo.
- **Casos de Uso**: matrizes, tabelas, coordenadas, séries numéricas formatadas (`00` a `99`).

## Boas Práticas

- **Sempre use chaves `{}`** em declarações condicionais e laços.
- **Prefira igualdade estrita (`===`)** e evite atribuições dentro de testes lógicos.
- **Valide coleções vazias** verificando `.length` explicitamente.
- **Evite labels excessivos**: prefira extrair funções menores e legíveis.


