---
title: 'Web APIs: Notification API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Notification API

## Ideia Central
- **Papel**: Notificações do navegador com Notification, requestPermission, permissões, contexto seguro e relação com service workers
- **Contexto**: A Notification API permite que uma página solicite permissão para exibir notificações do sistema operacional. A mensagem aparece fora da área visual da página e precisa ser usada com cuidado
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## O contrato de permissão
- **Ideia**: A notificação é a única API deste catálogo capaz de alcançar o usuário quando ele não está olhando para a página
- **Detalhe**: Esse alcance é exatamente o que a torna sensível, e o navegador o condiciona a uma permissão de três estados, guardada por origem

## Modelo da API
- **Ideia**: Notificação é um recurso sensível porque disputa atenção do usuário mesmo quando ele não está olhando para a aba
- **Detalhe**: Não solicite permissão assim que a página carrega

## Exemplo com preview e código
- **Ideia**: O exemplo importado mostra o pedido de permissão e a criação de uma notificação simples
- **Detalhe**: Prévia HTML interativa disponível na página do tópico

## Cuidados práticos
- **Ideia**: Em muitos navegadores, o construtor `Notification()` funciona apenas em desktop
- **Detalhe**: Para mobile e notificações mais robustas, o caminho costuma envolver service worker

## Quando usar, e quando não usar?
- **Ideia**: Uma notificação do sistema interrompe o usuário fora do navegador
- **Detalhe**: Ela se justifica quando o assunto sobreviveu à saída da aba, e não quando a informação está visível na própria tela que ele está olhando

## Executando
- **Ideia**: Os passos percorrem os três estados da permissão, e o terceiro é o que não tem volta pelo código: Abra o exemplo `notification
- **Detalhe**: html` em uma aba própria
- **Ponto**: Abra o exemplo `notification.html` em uma aba própria
- **Ponto**: Clique no botão que solicita permissão
- **Ponto**: Permita ou bloqueie para observar os dois fluxos
- **Ponto**: Recarregue a página e veja que a escolha pode persistir no navegador

## Exercício
- **Ideia**: Os itens exercitam o pedido de permissão no momento certo da interação: Mostre na tela o valor de `Notification
- **Detalhe**: permission`
- **Ponto**: Mostre na tela o valor de `Notification.permission`
- **Ponto**: Desabilite o botão quando a permissão for `denied`
- **Ponto**: Adicione um corpo de notificação com uma mensagem curta e não sensível

## Perguntas de revisão
- **Ideia**: Responda às questões a seguir para avaliar a compreensão sobre o ciclo de permissão, exibição e boas práticas da Notifications API
- **Ponto**: Quais são os três valores possíveis de `Notification.permission`?
- **Ponto**: O que acontece ao chamar `requestPermission()` quando o estado já é `denied`?
- **Ponto**: Por que consultar `Notification.permission` antes de pedir?
- **Ponto**: Por que pedir permissão no carregamento da página costuma resultar em bloqueio?
### Permissão
- **Ideia**: Questões sobre o fluxo de autorização e estados de permissão: Quais são os três valores possíveis de `Notification
- **Ponto**: Quais são os três valores possíveis de `Notification.permission`?
- **Ponto**: O que acontece ao chamar `requestPermission()` quando o estado já é `denied`?
### Uso e alcance
- **Ideia**: Questões sobre limites do contexto de aba e decisões de produto: Qual a diferença entre `new Notification()` e `showNotification()` do *service worker*?
- **Ponto**: Qual a diferença entre `new Notification()` e `showNotification()` do *service worker*?
- **Ponto**: Como reagir ao clique do usuário em uma notificação?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
