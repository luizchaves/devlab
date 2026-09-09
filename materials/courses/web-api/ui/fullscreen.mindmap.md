---
title: 'Web APIs: Fullscreen API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Fullscreen API

## Ideia Central
- **Papel**: Entrada e saída de tela cheia com requestFullscreen, exitFullscreen, fullscreenElement, eventos e política de permissão
- **Contexto**: A Fullscreen API permite apresentar um elemento ocupando a tela inteira. Ela é comum em vídeos, jogos, apresentações e ferramentas visuais que precisam reduzir distrações da interface do navegador
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## Tela cheia é um modo, não uma janela
- **Ideia**: A Fullscreen API não abre nada
- **Detalhe**: Ela pede ao navegador que um elemento que já existe na página passe a ocupar a tela inteira, escondendo barra de endereços, abas e o restante do documento

## Modelo da API
- **Ideia**: A API não cria uma nova janela
- **Detalhe**: Ela muda o modo de apresentação de um elemento existente da página

## Exemplo com preview e código
- **Ideia**: O exemplo importado mostra um elemento entrando e saindo de tela cheia a partir de um botão
- **Detalhe**: Prévia HTML interativa disponível na página do tópico

## Cuidados práticos
- **Ideia**: Fullscreen pode ser bloqueado por política de iframe ou por ausência de gesto do usuário

## Quando usar, e quando não usar?
- **Ideia**: Tela cheia remove os pontos de referência do navegador, inclusive o botão de voltar
- **Detalhe**: Ela compensa quando o conteúdo é o único assunto naquele momento, e incomoda em qualquer situação onde o usuário ainda precisa navegar

## Executando
- **Ideia**: Percorra os passos alternando entre os botões da página e a tecla `Esc`, para ver o estado sendo alterado por fora do código: Abra o exemplo `fullscreen
- **Detalhe**: html`
- **Ponto**: Abra o exemplo `fullscreen.html`
- **Ponto**: Clique no botão de tela cheia
- **Ponto**: Saia com o botão da página ou com Esc
- **Ponto**: Observe como o código usa `fullscreenElement` para saber o estado atual

## Exercício
- **Ideia**: Os itens exercitam a sincronização entre a interface e o estado real do documento: Adicione um contador visual que indique se a página está em tela cheia
- **Detalhe**: Registre `fullscreenchange` no console
- **Ponto**: Adicione um contador visual que indique se a página está em tela cheia
- **Ponto**: Registre `fullscreenchange` no console
- **Ponto**: Mostre uma mensagem quando `fullscreenEnabled` for falso

## Perguntas de revisão
- **Ideia**: Responda às questões a seguir para avaliar a compreensão sobre ativação, restrições e eventos da Fullscreen API
- **Ponto**: Por que a entrada em tela cheia precisa partir de um gesto do usuário?
- **Ponto**: Qual a fonte da verdade sobre o estado atual?
- **Ponto**: Por que guardar o estado em uma variável própria costuma dar errado?
- **Ponto**: Qual a diferença entre `fullscreenchange` e `fullscreenerror`?
### Estado e controle
- **Ideia**: Questões sobre verificação de estado e eventos de transição de tela: Por que a entrada em tela cheia precisa partir de um gesto do usuário?
- **Ponto**: Por que a entrada em tela cheia precisa partir de um gesto do usuário?
- **Ponto**: Qual a fonte da verdade sobre o estado atual?
### Escolha e alternativas
- **Ideia**: Questões sobre suporte no ambiente e decisões de interface: O que `document
- **Ponto**: O que `document.fullscreenEnabled` informa?
- **Ponto**: Qual elemento deve receber `requestFullscreen()` em um player de vídeo com controles próprios?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
