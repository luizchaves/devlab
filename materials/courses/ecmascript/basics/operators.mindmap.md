---
title: 'JavaScript: Expressões e Operadores'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Expressões e Operadores

## Objetivo
- Reconhecer expressões e statements, entender precedência e associatividade, usar operadores de cálculo, concatenação.

## Expressões e statements
- Uma expressão produz um valor.
- Esse valor pode ser exibido, atribuído a uma variável, passado para uma função ou combinado com outra expressão.
- Um statement é uma instrução que organiza a execução do programa.
### Ponto e vírgula e ASI
- ASI insere ponto e vírgula automaticamente em muitos casos.
- Por isso, muitos códigos funcionam mesmo sem ponto e vírgula no fim da linha.
- Isso não significa que `;` seja sempre opcional.
- Quando a próxima linha começa com tokens que podem continuar a expressão anterior, como `(`, `[`, `/`, `+` ou `-`.
- O código acima pode ser lido como uma tentativa de chamar `10` como função.
### Objeto global
- Algumas expressões dependem do ambiente em que o JavaScript está rodando.
- No navegador existe `window`; no Node.js, `window` normalmente não existe.
- `globalThis` é a forma padronizada de acessar o objeto global do ambiente atual.

## Precedência e agrupamento
- Precedência: Qual operador executa primeiro?; `20 - 10 * 2`
- Agrupamento: Como forçar uma ordem?; `(20 - 10) * 2`
- Associatividade: Em qual direção operadores iguais agrupam?; `20 - 10 - 5`
- Quando uma expressão tem vários operadores, JavaScript precisa decidir o que será calculado primeiro.
- Essa ordem é chamada de precedência.
- A conversão de Fahrenheit para Celsius mostra por que parênteses não são apenas detalhe visual.

## Associatividade
- Associatividade decide como operadores de mesma precedência são agrupados.
- A maioria dos operadores aritméticos agrupa da esquerda para a direita.
- Associatividade também afeta concatenação e coerção quando `+` mistura números e strings.
- No primeiro caso, `2 + 3` acontece antes e gera `5`; depois ocorre concatenação com `"4"`.
- No segundo, a primeira operação já envolve string, então o restante segue como concatenação.

## Operadores
- Operadores são símbolos ou palavras que combinam valores.
- Alguns calculam números, outros comparam, outros escolhem valores ou alteram uma variável.
### Visão geral
- Aritméticos: `+`, `-`, ``, `/`, `%`, `*`; Cálculos numéricos
- Concatenação: `+`, `+=`; Juntar strings ou converter para string quando um lado já é texto
- Unários: `+`, `-`, `!`, `typeof`, `delete`; Converter, negar, inspecionar ou remover
- Incremento e decremento: `++`, `--`; Alterar um número em uma unidade
- Relacionais: ``, `>=`, `in`, `instanceof`; Comparar ordem, presença ou tipo de objeto
### Aritméticos
- Operadores aritméticos fazem cálculos com números e, em geral, produzem valores do tipo `number`.
- Isso vale inclusive para `/`: JavaScript não separa automaticamente divisão inteira de divisão decimal.
- O operador `%` retorna o resto da divisão, não uma porcentagem.
- JavaScript não possui um operador próprio de divisão inteira.
- A divisão com `/` sempre produz um valor `number`; para descartar ou ajustar a parte decimal.
### Unários
- Operadores unários atuam sobre um único operando.
- Eles aparecem bastante em conversão rápida, negação booleana e inspeção de tipo.
### Incremento e decremento
- `++` e `--` alteram uma variável em uma unidade.
- A posição do operador muda o valor retornado pela expressão.
- O mesmo vale para decremento
### Relacionais
- Operadores relacionais retornam booleanos.
- Quando tipos diferentes são comparados, JavaScript pode fazer coerção; quando duas strings são comparadas.
- `in` verifica se uma propriedade existe em um objeto ou índice existe em um array.
- Para verificar se um valor aparece dentro de um array, `includes()` costuma ser mais direto.
- `instanceof` verifica se um objeto foi criado a partir de uma função construtora ou classe na cadeia de protótipos.
### Igualdade
- Use `===` e `!==` como padrão.
- Eles comparam valor e tipo.
- `==` e `!=` permitem coerção antes da comparação, o que pode esconder resultados inesperados.
- A página Equality comparisons and sameness | MDN explica as diferenças entre igualdade solta.
- A JavaScript Equality Table ajuda a visualizar casos curiosos de coerção com `==`.

## Taxonomia completa dos operadores
- Operator type: Operators
- Primary expressions: `this`, `function`, `class`, `function`, `yield`, `yield`, `async function*`, `await`, `[]`.
- Left-hand-side expressions: `object.property`, `object["property"]`, `new`, `new.target`, `super`, `...obj`
- Increment and decrement: `A++`, `A--`, `++A`, `--A`
- Unary operators: `delete`, `void`, `typeof`, `+`, `-`, `~`, `!`
- Arithmetic operators: `+`, `-`, ``, `/`, `%`, `*`

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
