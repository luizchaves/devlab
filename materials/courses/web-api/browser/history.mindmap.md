---
title: 'Web APIs: History API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: History API

## Ideia Central
- **Papel**: Navegação sem recarregamento de página em Single Page Applications (SPAs) com history.pushState, replaceState e o evento popstate
- **Contexto**: A History API permite interagir diretamente com o histórico de navegação da aba do navegador. Ela é a base fundamental para a criação de Single Page Applications (SPAs), permitindo alterar a URL exibida na barra de endereço e navegar entre estados sem precisar recarregar a página do servidor
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O Objeto `window.history`
- **Ideia**: O objeto `history` expõe métodos para navegar no histórico da sessão (avançar, voltar) e manipular a pilha de URLs registradas sem causar uma requisição HTTP tradicional
- **Detalhe**: O diagrama de sequência a seguir ilustra as duas dinâmicas fundamentais de uma Single Page Application: a troca interna de tela ao interceptar cliques e a restauração de estado disparada quando o usuário clica nos botões Voltar e Avançar do navegador: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Manipulando o Histórico: `pushState` vs `replaceState`
- **Ideia**: A History API expõe dois métodos principais para gerenciar entradas na sessão do navegador sem disparar recarregamentos completos da página
- **Ponto**: `state`: Um objeto JavaScript associado à nova entrada do histórico (armazenado nativamente no navegador)
- **Ponto**: `unused`: Parâmetro reservado por razões históricas (deve ser passado como string vazia `''`)
- **Ponto**: `url`: A nova URL que será exibida na barra de endereço (deve ser da mesma origem)
### Adicionando Histórico com `pushState`
- **Ideia**: O método `pushState(state, unused, url)` aceita três parâmetros: `state`: Um objeto JavaScript associado à nova entrada do histórico (armazenado nativamente no navegador)
- **Ponto**: `state`: Um objeto JavaScript associado à nova entrada do histórico (armazenado nativamente no navegador)
- **Ponto**: `unused`: Parâmetro reservado por razões históricas (deve ser passado como string vazia `''`)
### Substituindo a Entrada Atual com `replaceState`
- **Ideia**: O `replaceState()` possui a mesma assinatura do `pushState()`, mas em vez de criar um novo registro no botão voltar, ele modifica a entrada atual

## O Evento `popstate`
- **Ideia**: Quando o usuário clica nos botões Voltar ou Avançar do navegador, a History API dispara o evento `popstate` na janela (`window`)
- **Detalhe**: O evento `popstate` é disparado apenas quando o usuário clica nos botões Voltar/Avançar do navegador ou executa `history

## Quando usar, e quando não usar?
- **Ideia**: A History API só se justifica quando a aplicação assume o papel que era do servidor: decidir o que mostrar para cada URL
- **Detalhe**: Fora disso, um link comum entrega a mesma navegação com menos código e sem risco de estado dessincronizado

## Executando
- **Ideia**: Siga os passos no console do navegador para testar a History API em tempo real: Abra o console das ferramentas do desenvolvedor (F12)
- **Detalhe**: Execute: `history
- **Ponto**: Abra o console das ferramentas do desenvolvedor (F12)
- **Ponto**: Execute: `history.pushState({ passo: 1 }, '', '?passo=1');` e observe a barra de endereço mudar instantaneamente sem recarregar a página
- **Ponto**: Execute: `history.pushState({ passo: 2 }, '', '?passo=2');`
- **Ponto**: Clique no botão Voltar do navegador e verifique como a URL retorna para `?passo=1`

## Exercício
- **Ideia**: Os itens abaixo partem do exemplo da seção anterior e exercitam a diferença entre as duas formas de alterar a pilha de histórico: Qual a diferença fundamental entre `history
- **Detalhe**: pushState()` e `history
- **Ponto**: Qual a diferença fundamental entre `history.pushState()` e `history.replaceState()`?
- **Ponto**: Por que a chamada `history.pushState()` não dispara o evento `popstate`?
- **Ponto**: O que acontece se tentarmos passar uma URL de outro domínio (ex: `https://google.com`) no terceiro parâmetro de `pushState()`?
- **Ponto**: O `pushState()` adiciona uma nova entrada na pilha do histórico (permitindo voltar para a URL anterior pelo botão do navegador), enquanto o `replaceState()` substitui a entrada atual no histórico sem adicionar um novo passo

## Desafio
- **Ideia**: Crie um pequeno roteador Vanilla JS que escute os cliques em todos os links `` de uma página, previna o comportamento padrão de navegação com `e
- **Detalhe**: preventDefault()`, chame `history

## Perguntas de revisão
- **Ideia**: Responda às questões abaixo para fixar os conceitos de manipulação de histórico e eventos de navegação
- **Ponto**: Qual propriedade do objeto `event` no handler de `popstate` traz os dados salvos durante o `pushState`?
- **Ponto**: Por que bibliotecas como React Router ou Vue Router utilizam a History API em vez de fragmentos de hash (``) na URL?
### Manipulação e Estado
- **Ideia**: Questões sobre a alteração ativa da pilha de navegação: Qual propriedade do objeto `event` no handler de `popstate` traz os dados salvos durante o `pushState`?
- **Ponto**: Qual propriedade do objeto `event` no handler de `popstate` traz os dados salvos durante o `pushState`?
### Roteamento e Arquitetura
- **Ideia**: Questões sobre o comportamento de SPAs e integração com o servidor: Por que bibliotecas como React Router ou Vue Router utilizam a History API em vez de fragmentos de hash (``) na URL?
- **Ponto**: Por que bibliotecas como React Router ou Vue Router utilizam a History API em vez de fragmentos de hash (``) na URL?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
