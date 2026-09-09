---
title: 'Web APIs: Drag and Drop API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Drag and Drop API

## Ideia Central
- **Papel**: Arrastar e soltar no navegador com eventos dragstart, dragover, drop e DataTransfer
- **Contexto**: A Drag and Drop API permite criar interações de arrastar e soltar. Ela aparece em kanbans, uploads, reordenação de listas e interfaces em que o gesto espacial ajuda mais do que um formulário
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O ciclo de um arrasto
- **Ideia**: Arrastar e soltar não é um evento, é uma sequência deles, disparados em dois elementos diferentes
- **Detalhe**: A origem informa o que está sendo levado; o destino precisa declarar que aceita receber, e só então recebe

## Modelo da API
- **Ideia**: O fluxo depende de eventos encadeados
- **Detalhe**: O destino só aceita o item quando o código cancela o comportamento padrão em `dragover`

## Exemplo com preview e código
- **Ideia**: O exemplo importado mostra a origem do arrasto, a área de destino e o uso dos eventos principais
- **Detalhe**: Prévia HTML interativa disponível na página do tópico

## Cuidados práticos
- **Ideia**: Drag and drop é útil, mas não deve ser a única forma de executar uma ação importante

## Quando usar, e quando não usar?
- **Ideia**: O arrastar e soltar nativo é um gesto de mouse
- **Detalhe**: Ele não tem equivalente por teclado, funciona mal em telas de toque e depende de precisão motora, o que o torna uma escolha ruim como caminho único para qualquer ação

## Executando
- **Ideia**: Os passos abaixo separam o gesto do usuário dos quatro eventos que ele dispara no código: Abra o exemplo `dragdrop
- **Detalhe**: html`
- **Ponto**: Abra o exemplo `dragdrop.html`
- **Ponto**: Arraste o item para a área de destino
- **Ponto**: Observe no código os listeners de `dragstart`, `dragover` e `drop`
- **Ponto**: Remova temporariamente o `preventDefault()` de `dragover` e teste a diferença

## Exercício
- **Ideia**: Os itens acrescentam destinos e estado visual, exercitando os eventos que sobram além de `drop`: Adicione uma segunda área de destino
- **Detalhe**: Mostre uma classe visual enquanto o item estiver sobre uma área válida
- **Ponto**: Adicione uma segunda área de destino
- **Ponto**: Mostre uma classe visual enquanto o item estiver sobre uma área válida
- **Ponto**: Guarde no `DataTransfer` o ID do elemento arrastado

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o fluxo de eventos de arrastar e soltar e a transferência de dados no navegador:
- **Ponto**: Por que uma área da página não aceita um item solto sobre ela sem código adicional?
- **Ponto**: Em qual evento o dado transportado deve ser gravado?
- **Ponto**: Qual a função do atributo `draggable="true"`?
- **Ponto**: Para que serve o evento `dragend`, já que o `drop` conclui a ação?
### Sequência de eventos
- **Ideia**: As questões a seguir avaliam o ciclo de vida dos eventos de arrasto e a preparação da zona de soltura: Por que uma área da página não aceita um item solto sobre ela sem código adicional?
- **Ponto**: Por que uma área da página não aceita um item solto sobre ela sem código adicional?
- **Ponto**: Em qual evento o dado transportado deve ser gravado?
### Dados e alternativas
- **Ideia**: As questões a seguir avaliam o objeto DataTransfer, recebimento de arquivos e acessibilidade: Por que se costuma transportar o identificador do elemento e não o elemento em si?
- **Ponto**: Por que se costuma transportar o identificador do elemento e não o elemento em si?
- **Ponto**: Como receber arquivos arrastados da área de trabalho?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
