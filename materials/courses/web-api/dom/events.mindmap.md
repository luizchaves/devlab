---
title: 'Web APIs: Eventos e Interatividade'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Eventos e Interatividade

## Ideia Central
- **Papel**: Ouvintes de eventos, fases de captura e borbulhamento, preventDefault, stopPropagation e delegação de eventos
- **Contexto**: Aplicações Web modernas reagem continuamente às interações do usuário (cliques, digitação, movimentação do mouse e submissão de formulários), bem como a eventos do próprio navegador, como o término do carregamento da página. Essas ações geram eventos que podem ser capturados e manipulados pelo JavaScript
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Ciclo de Propagação de Eventos (*Event Flow*)
- **Ideia**: Quando o usuário clica em um elemento filho (por exemplo, um botão `` dentro de um ``), o evento não é disparado apenas naquele botão isolado
- **Detalhe**: O navegador processa o evento através de três fases consecutivas: Fase de Captura (*Capturing Phase*): O evento desce desde a raiz (`window` e `document`) percorrendo todos os elementos ancestrais até chegar ao pai do elemento alvo
- **Ponto**: Fase de Captura (*Capturing Phase*): O evento desce desde a raiz (`window` e `document`) percorrendo todos os elementos ancestrais até chegar ao pai do elemento alvo
- **Ponto**: Fase de Alvo (*Target Phase*): O evento atinge o elemento específico onde a interação ocorreu (`event.target`)
- **Ponto**: Fase de Borbulhamento (*Bubbling Phase*): O evento "subirá" de volta pela árvore DOM, disparando os ouvintes registrados em cada um dos elementos ancestrais até atingir a raiz `window`

## Registrando Ouvintes de Evento
- **Ideia**: Existem três formas de vincular código JavaScript a interações do usuário
### Atributos HTML Inline (Legado - Evitar)
- **Ideia**: A forma mais antiga escreve o código dentro do próprio HTML
### Propriedades On-Event (Limitado)
- **Ideia**: A segunda forma tira o código do HTML, mas mantém a limitação principal: cada nova atribuição substitui a anterior, em silêncio:
### O Método `addEventListener` (Padrão Moderno)
- **Ideia**: O método `addEventListener` é a forma padrão e recomendada

## O Objeto Event
- **Ideia**: Quando uma função ouvinte é disparada, ela recebe automaticamente como primeiro argumento um objeto `Event` com metadados sobre a interatividade
- **Ponto**: `event.target`: O elemento exato que originou o evento (onde o usuário clicou)
- **Ponto**: `event.currentTarget`: O elemento onde o `addEventListener` foi registrado
### Propriedades `target` vs `currentTarget`
- **Ideia**: As duas propriedades apontam para elementos diferentes, e confundi-las é o defeito mais comum em delegação de eventos: `event
- **Ponto**: `event.target`: O elemento exato que originou o evento (onde o usuário clicou)
- **Ponto**: `event.currentTarget`: O elemento onde o `addEventListener` foi registrado
### Métodos de Controle: `preventDefault` e `stopPropagation`
- **Ideia**: Os dois métodos são frequentemente trocados um pelo outro, e cancelam coisas distintas

## Delegação de Eventos (*Event Delegation*)
- **Ideia**: A Delegação de Eventos é um padrão de otimização de performance onde, em vez de registrar um ouvinte para cada elemento filho individual (como uma lista com 100 itens), registra-se um único ouvinte no elemento pai
- **Detalhe**: Devido à fase de borbulhamento (*bubbling*), cliques nos elementos filhos sobem até o pai, onde podem ser identificados via `event
- **Ponto**: Economia de memória: Reduz drasticamente o número de objetos `EventListener` criados no navegador
- **Ponto**: Suporte a elementos dinâmicos: Elementos adicionados ao DOM posteriormente funcionarão automaticamente sem precisar registrar novos ouvintes

## Principais Eventos do Navegador
- **Ideia**: Os eventos do navegador se agrupam por origem: mouse, teclado, formulário, janela e recurso

## Quando usar, e quando não usar?
- **Ideia**: Delegação de eventos é a técnica mais útil deste tópico e também a mais aplicada fora de hora
- **Detalhe**: Ela compensa quando os elementos são muitos ou ainda não existem; quando são poucos e fixos, um ouvinte direto é mais legível e mais fácil de remover

## Executando
- **Ideia**: Siga os passos para inspecionar eventos no navegador: Abra as ferramentas do desenvolvedor com F12 e selecione a aba Console
- **Detalhe**: Cole o código: `document
- **Ponto**: Abra as ferramentas do desenvolvedor com F12 e selecione a aba Console
- **Ponto**: Cole o código: `document.addEventListener('click', e => console.log('Clicado em:', e.target));`
- **Ponto**: Clique em diferentes elementos da página (botões, parágrafos, imagens) e observe o objeto e a tag de cada elemento clicado sendo exibidos no console

## Exercício
- **Ideia**: Os itens exercitam propagação, cancelamento e delegação sobre o mesmo documento: Por que o método `event
- **Detalhe**: preventDefault()` é frequentemente utilizado no evento de `submit` de um formulário em aplicações modernas?
- **Ponto**: Por que o método `event.preventDefault()` é frequentemente utilizado no evento de `submit` de um formulário em aplicações modernas?
- **Ponto**: Explique a diferença entre `event.target` e `event.currentTarget`
- **Ponto**: Escreva um exemplo de código que escute o evento `keyup` em um campo de texto e exiba uma mensagem apenas quando o usuário pressionar a tecla Enter
- **Ponto**: Em formulários HTML normais, a submissão faz o navegador realizar um POST/GET recarregando a página inteira. O `event.preventDefault()` evita esse recarregamento nativo, permitindo capturar os dados, validá-los e enviá-los assincronamente via `fetch`

## Desafio
- **Ideia**: Implemente a delegação de eventos para uma tabela com ID `tabela-produtos`
- **Detalhe**: Quando o usuário clicar em qualquer célula `` da tabela, altere a cor de fundo daquela linha `` específica para amarelo (`fef08a`), garantindo que apenas uma linha fique destacada por vez

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o modelo de eventos do navegador, fases de propagação e delegação:
- **Ponto**: Em qual fase do evento os ouvintes registrados com `addEventListener` executam por padrão?
- **Ponto**: O que acontece quando chamamos `event.stopPropagation()` em um handler de clique?
- **Ponto**: Qual é a vantagem de utilizar a técnica de delegação de eventos em listas dinâmicas com muitos itens?
- **Ponto**: Como identificar qual elemento filho disparou o clique dentro de um ouvinte delegado no elemento pai?
### Propagação e Fluxo de Eventos
- **Ideia**: As questões a seguir avaliam as fases de captura, alvo e borbulhamento: Em qual fase do evento os ouvintes registrados com `addEventListener` executam por padrão?
- **Ponto**: Em qual fase do evento os ouvintes registrados com `addEventListener` executam por padrão?
- **Ponto**: O que acontece quando chamamos `event.stopPropagation()` em um handler de clique?
### Delegação de Eventos
- **Ideia**: As questões a seguir avaliam o uso de ouvintes centralizados em elementos pais: Qual é a vantagem de utilizar a técnica de delegação de eventos em listas dinâmicas com muitos itens?
- **Ponto**: Qual é a vantagem de utilizar a técnica de delegação de eventos em listas dinâmicas com muitos itens?
- **Ponto**: Como identificar qual elemento filho disparou o clique dentro de um ouvinte delegado no elemento pai?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
