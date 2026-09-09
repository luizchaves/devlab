---
title: 'Web APIs: Elementos Dinâmicos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Elementos Dinâmicos

## Ideia Central
- **Papel**: Criação, inserção, remoção e otimização de elementos HTML dinâmicos com DocumentFragment e a tag template
- **Contexto**: Em aplicações Web interativas, as interfaces não são estáticas: cartões de produtos, linhas de tabelas, comentários e notificações são construídos e renderizados dinamicamente a partir de dados recebidos de APIs ou entradas do usuário
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Criação e Inserção Básica de Nós
- **Ideia**: Para construir elementos via JavaScript, o navegador oferece a API de criação de nós do objeto `document`
### Métodos `createElement` e `appendChild`
- **Ideia**: A criação de um nó acontece em duas etapas separadas: primeiro o elemento passa a existir na memória, depois ele entra na árvore do documento
### Inserção com `insertAdjacentHTML`
- **Ideia**: O método `insertAdjacentHTML()` permite inserir uma string de marcação HTML em uma posição específica em relação ao elemento de referência: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Otimização de Performance com `DocumentFragment`
- **Ideia**: Quando manipulamos o DOM, cada chamada direta como `container
- **Detalhe**: appendChild(el)` faz o navegador recalcular os estilos e a geometria da página (Reflow) e redesenhar a tela (Repaint)

## O Elemento ``
- **Ideia**: A tag `` do HTML5 permite declarar blocos de marcação que permanecem completamente inertes (invisíveis, sem carregar imagens ou executar scripts) até serem clonados e ativados via JavaScript
- **Detalhe**: Para ver esses conceitos aplicados em uma arquitetura completa de componentes dinâmicos e tabelas com estado, acesse a página de projeto prático do MonitorApp (DOM e Storage)

## Quando usar, e quando não usar?
- **Ideia**: Nem toda inserção precisa de `DocumentFragment` ou de ``
- **Detalhe**: Essas ferramentas pagam por si quando há repetição ou marcação declarada no HTML; para um único elemento, elas apenas acrescentam uma etapa

## Executando
- **Ideia**: Siga os passos no console do navegador para testar a criação de elementos: Pressione F12 e abra a aba Console
- **Detalhe**: Cole o código: Pressione Enter e observe o parágrafo verde sendo renderizado no final da página
- **Ponto**: Pressione F12 e abra a aba Console
- **Ponto**: Cole o código:
- **Ponto**: Pressione Enter e observe o parágrafo verde sendo renderizado no final da página

## Exercício
- **Ideia**: Os itens abaixo comparam o custo das técnicas de inserção e exercitam o uso de ``: Qual a diferença de performance entre fazer `container
- **Detalhe**: appendChild(el)` 50 vezes dentro de um laço vs adicionar os 50 elementos em um `DocumentFragment` e fazer uma única chamada?
- **Ponto**: Qual a diferença de performance entre fazer `container.appendChild(el)` 50 vezes dentro de um laço vs adicionar os 50 elementos em um `DocumentFragment` e fazer uma única chamada?
- **Ponto**: Por que a tag `` é considerada inerte antes de ser clonada?
- **Ponto**: Escreva um trecho de código que crie uma tag `` com o texto "Ir para o topo" e a insira no início do `` usando `insertAdjacentElement`
- **Ponto**: Fazer 50 inserções diretas no DOM causa 50 recálculos de layout (*reflows*) e renderizações (*repaints*), desacelerando a aplicação. O `DocumentFragment` armazena todos os elementos na memória e realiza apenas 1 reflow quando o fragmento é adicionado ao DOM

## Desafio
- **Ideia**: Crie uma função `renderizarTabela(dados)` que receba um array de objetos `{ id, produto, preco }` e utilize um `DocumentFragment` para construir e inserir as linhas `` em uma `` existente no DOM

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre inserção dinâmica, otimização com fragmentos e templates:
- **Ponto**: O que acontece com os nós filhos contidos em um `DocumentFragment` após ele ser adicionado a um nó do DOM com `appendChild(fragmento)`?
- **Ponto**: Como remover um elemento do DOM utilizando a API moderna?
- **Ponto**: Por que o conteúdo dentro de uma tag `` não é exibido nem executa scripts durante o carregamento inicial da página?
- **Ponto**: Qual é o papel do argumento `true` no método `template.content.cloneNode(true)`?
### Renderização e Fragmentos
- **Ideia**: As questões a seguir avaliam o desempenho de inserção e remoção de nós: O que acontece com os nós filhos contidos em um `DocumentFragment` após ele ser adicionado a um nó do DOM com `appendChild(fragmento)`?
- **Ponto**: O que acontece com os nós filhos contidos em um `DocumentFragment` após ele ser adicionado a um nó do DOM com `appendChild(fragmento)`?
- **Ponto**: Como remover um elemento do DOM utilizando a API moderna?
### Elemento Template e Clonagem
- **Ideia**: As questões a seguir avaliam a reutilização de esqueletos HTML inertes: Por que o conteúdo dentro de uma tag `` não é exibido nem executa scripts durante o carregamento inicial da página?
- **Ponto**: Por que o conteúdo dentro de uma tag `` não é exibido nem executa scripts durante o carregamento inicial da página?
- **Ponto**: Qual é o papel do argumento `true` no método `template.content.cloneNode(true)`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
