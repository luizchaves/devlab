---
title: 'Web APIs: WebSockets API'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: WebSockets API

## Ideia Central
- **Papel**: Comunicação em tempo real e bidirecional (Full-Duplex) entre cliente e servidor com a WebSockets API nativa
- **Contexto**: Diferente do modelo HTTP tradicional onde o cliente precisa disparar uma nova requisição para cada atualização de dados, a WebSockets API estabelece um canal de comunicação permanente, aberto e bidirecional (*Full-Duplex*) entre o navegador e o servidor sobre uma única conexão TCP
- **Ambiente**: navegador, JavaScript e políticas da plataforma

## HTTP vs WebSockets
- **Ideia**: Enquanto o HTTP é baseado em requisição e resposta (unidirecional por chamada), o WebSocket permite que tanto o cliente quanto o servidor enviem dados a qualquer momento com sobretaxa (*overhead*) de cabeçalhos mínima
- **Detalhe**: Diagrama conceitual da página com fluxo, responsabilidades e pontos de decisão

## Usando a Classe Nativa `WebSocket`
- **Ideia**: A WebSockets API é nativa do navegador e não exige nenhuma biblioteca de terceiros
- **Detalhe**: A conexão é iniciada instanciando o construtor com uma URL no protocolo `ws://` (não seguro) ou `wss://` (seguro/criptografado)

## Padrão de Reconexão Automática
- **Ideia**: Se a conexão de rede oscilar ou o servidor for reiniciado, o evento `close` é disparado

## Quando usar, e quando não usar?
- **Ideia**: Um canal aberto tem custo: conexão mantida por usuário, estado no servidor, reconexão a tratar e comportamento próprio atrás de *proxies*
- **Detalhe**: Ele compensa quando a atualização precisa partir do servidor, com frequência alta, e não compensa em quase todo o resto

## Executando
- **Ideia**: Siga os passos no console do navegador para testar uma conexão WebSocket real com um servidor de teste público: Abra as ferramentas do desenvolvedor com F12 e selecione a aba Console
- **Detalhe**: Cole o código a seguir e pressione Enter: Observe no console a mensagem de eco retornada instantaneamente pelo servidor
- **Ponto**: Abra as ferramentas do desenvolvedor com F12 e selecione a aba Console
- **Ponto**: Cole o código a seguir e pressione Enter:
- **Ponto**: Observe no console a mensagem de eco retornada instantaneamente pelo servidor

## Exercício
- **Ideia**: Os itens abaixo comparam o WebSocket com as alternativas e exercitam o tratamento de queda de conexão: Qual a diferença fundamental entre o modelo de requisição HTTP e uma conexão WebSocket?
- **Detalhe**: Por que devemos enviar objetos JavaScript serializados com `JSON
- **Ponto**: Qual a diferença fundamental entre o modelo de requisição HTTP e uma conexão WebSocket?
- **Ponto**: Por que devemos enviar objetos JavaScript serializados com `JSON.stringify()` através do método `socket.send()`?
- **Ponto**: O que representa o protocolo `wss://` em comparação a `ws://`?
- **Ponto**: No modelo HTTP, a comunicação é unidirecional por chamada (o cliente precisa pedir para o servidor responder e a conexão é fechada). No WebSocket, a conexão é permanente e bidirecional (*Full-Duplex*), permitindo que tanto o cliente quanto o servidor enviem dados a qualquer instante

## Desafio
- **Ideia**: Crie uma classe `ChatSocket` que mantenha uma conexão com uma URL de WebSocket, possua um método `enviarMensagem(usuario, texto)` que valide se o socket está no estado `WebSocket
- **Detalhe**: OPEN` antes de enviar e notifique no console caso a conexão não esteja pronta

## Perguntas de revisão
- **Ideia**: Teste seus conhecimentos sobre o protocolo WebSocket, o ciclo de vida da conexão e o tratamento de eventos:
- **Ponto**: Quais são os 4 estados possíveis da propriedade `socket.readyState`?
- **Ponto**: `0 (CONNECTING)`: A conexão está sendo estabelecida
- **Ponto**: `1 (OPEN)`: A conexão está aberta e pronta para comunicação
- **Ponto**: `2 (CLOSING)`: A conexão está em processo de encerramento
### Estados da Conexão
- **Ideia**: As questões a seguir avaliam o acompanhamento do ciclo de vida do socket no cliente: Quais são os 4 estados possíveis da propriedade `socket
- **Ponto**: Quais são os 4 estados possíveis da propriedade `socket.readyState`?
- **Ponto**: `0 (CONNECTING)`: A conexão está sendo estabelecida
### Troca de Mensagens e Segurança
- **Ideia**: As questões a seguir avaliam o tráfego de dados e os protocolos seguros: Por que dados estruturados em objetos JavaScript devem ser serializados antes do envio com `socket
- **Ponto**: Por que dados estruturados em objetos JavaScript devem ser serializados antes do envio com `socket.send()`?
- **Ponto**: Qual a importância de utilizar o protocolo `wss://` em produção em vez de `ws://`?

## Boas Práticas
- **Plataforma primeiro**: prefira recurso nativo quando ele resolve o caso
- **Estados explícitos**: trate sucesso, erro, permissão negada e ausência de suporte
- **Acessibilidade**: preserve semântica, foco, teclado e feedback visual
- **Segurança**: valide origem, dados e permissões antes de expor recursos
