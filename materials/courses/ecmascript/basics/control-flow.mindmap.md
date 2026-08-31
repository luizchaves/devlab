---
title: 'JavaScript: Estruturas de Controle'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Estruturas de Controle

## Objetivo
- Usar `if`, `else if`, `else`, `switch`, `while`, `do...while`, `for`, `break`, `continue`, laços aninhados e labels.

## Statements de controle
- Um statement de controle organiza o fluxo do programa.
- Ele decide se um bloco será executado, quantas vezes será repetido ou em qual ponto a execução deve parar.

## Visão geral
- Decisão simples: `if`, `else`; Executar um bloco ou outro
- Decisão em cadeia: `if`, `else if`, `else`; Testar faixas, prioridades ou estados
- Múltiplas opções: `switch`, `case`, `default`; Comparar um valor contra casos conhecidos
- Repetição por condição: `while`, `do...while`; Repetir até uma condição mudar
- Repetição por contador: `for`; Percorrer uma sequência controlada por índice
- Controle interno: `break`, `continue`; Encerrar ou pular uma repetição

## Decisão
- Estruturas de decisão avaliam uma condição e escolhem qual bloco executar.
- Em JavaScript, a condição não precisa ser literalmente `true` ou `false`; ela pode ser um valor truthy ou falsy.
### if
- O `if` executa o bloco apenas quando a condição é verdadeira ou truthy.
- Use chaves para deixar claro quais linhas pertencem ao `if`.
- Sem chaves, apenas a primeira instrução logo após o `if` fica condicionada.
- No exemplo acima, `console.log("End of verification")` sempre executa, porque ele não pertence ao corpo do `if`.
### Condição e atribuição
- Um erro comum é usar `=` quando a intenção era comparar.
- O operador `=` atribui valor; `===` compara valor e tipo.
- O código entra no `if` porque `value = 10` atribui `10` e a própria expressão de atribuição produz `10`.
### Truthy e falsy
- Valores como `0`, `""`, `null`, `undefined`, `NaN` e `false` são falsy.
- A maioria dos outros valores é truthy, inclusive arrays e objetos vazios.
- Para saber se um array tem itens, teste o tamanho.
- Já `Array.isArray()` responde outra pergunta: ele verifica se o valor é um array.
- Isso é útil quando o dado pode vir de uma API, formulário, arquivo JSON ou função externa.
### if, else if e else
- O `else` define o caminho alternativo.
- O `else if` permite testar novas condições quando as anteriores falham.
- Quando existem três ou mais possibilidades, a cadeia com `else if` pode separar os casos.
### Ordem das condições
- A ordem dos testes importa.
- Em uma cadeia `if / else if`, o primeiro bloco que passar interrompe o restante da cadeia.
- Como `95 >= 60` já é verdadeiro, o teste `grade >= 90` nunca chega a executar.
- A condição mais específica deve vir antes da mais geral.
- Quando duas mensagens são independentes, dois `if` separados podem fazer mais sentido do que `else if`.
### switch
- O `switch` compara uma expressão com vários `case`.
- Ele é útil quando um mesmo valor pode assumir opções conhecidas, como comandos, tipos ou operadores.
- Cada `case` normalmente termina com `break`.
- Sem `break`, a execução continua para os próximos casos.

## Repetição
- Estruturas de repetição executam o mesmo bloco várias vezes.
- Toda repetição precisa ter uma condição de parada clara; caso contrário.
### while
- O `while` testa a condição antes de executar o bloco.
- Se a condição já começar falsa, o bloco não executa nenhuma vez.
- Neste segundo exemplo, nada é exibido porque `count < 10` já é falso no início.
### do...while
- O `do...while` executa o bloco primeiro e testa a condição depois.
- Por isso, o bloco executa pelo menos uma vez.
- Quando a condição continua verdadeira, ele segue repetindo.
### for
- O `for` concentra inicialização, condição e atualização no cabeçalho.
- Ele é comum quando existe um contador ou um intervalo conhecido.
- O mesmo intervalo pode ser escrito com limites diferentes.
- `i <= 5` e `i < 6` produzem a mesma sequência abaixo.
- O `for` também é útil para acumular resultados.
### break e continue
- `continue` pula para a próxima repetição.
- No exemplo, `3` é pulado por `continue`.
- Quando `i` chega a `5`, o `break` encerra o laço antes do `console.log`.
### Laços aninhados
- Um laço pode ficar dentro de outro.
- Isso é útil para gerar combinações, percorrer linhas e colunas ou montar séries.
- O laço externo controla a dezena; o laço interno controla a unidade.
- Para cada valor de `ten`, o laço de `unit` executa completo.
### Labels
- Labels dão nome a um statement.
- Em laços aninhados, eles permitem que `break` ou `continue` atinjam um laço externo.
- Neste caso, `break outerBreak` encerra o laço externo inteiro, não apenas o laço de `j`.
- Aqui, `continue outerContinue` pula para a próxima repetição do laço externo.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição em sala
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras

