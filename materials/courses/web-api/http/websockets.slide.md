---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Web APIs: WebSockets API"
description: "Slides completos do tópico Web APIs: WebSockets API."
---

<!-- _class: lead -->

# Web APIs: WebSockets API

HTTP vs WebSockets · Usando a Classe Nativa `WebSocket` · Padrão de Reconexão Automática · Quando usar, e quando não usar?

---

## Objetivo

- Contrastar o ciclo requisição/resposta do HTTP com o canal *full-duplex* do WebSocket.
- Abrir uma conexão com `new WebSocket()` e tratar `onopen`, `onmessage`, `onerror` e `onclose`.
- Enviar e receber mensagens JSON pelo mesmo canal.
- Implementar reconexão automática com espera crescente entre as tentativas.
- Escolher entre WebSocket, *polling* e *Server-Sent Events* conforme a direção e a frequência das mensagens.

---

## Mapa do Tópico

- **HTTP vs WebSockets**.
- **Usando a Classe Nativa `WebSocket`**.
- **Padrão de Reconexão Automática**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## HTTP vs WebSockets

Enquanto o HTTP é baseado em requisição e resposta (unidirecional por chamada).

- **Comunicação**: Bidirecional em tempo real (Full-Duplex).
- **Conexão**: Conexão TCP persistente.
- **Sobretaxa (Overhead)**: Muito baixa (frames leves após handshake).
- **Casos de uso**: Chats, jogos multiplayer, cotações em tempo real.

---

## Usando a Classe Nativa `WebSocket`

A WebSockets API é nativa do navegador e não exige nenhuma biblioteca de terceiros.

- A conexão é iniciada instanciando o construtor com uma URL no protocolo `ws://` (não seguro) ou `wss://` (seguro/criptografado).
- A classe nativa cobre todo o ciclo da conexão em quatro tratadores de evento.
- <Aside type="caution" title="Requisito de Criptografia (WSS)"> Em ambientes de produção com suporte a HTTPS (`https://`).

---

## Padrão de Reconexão Automática

Se a conexão de rede oscilar ou o servidor for reiniciado, o evento `close` é disparado.

- ---.
- Trate estados de sucesso, erro e ausência de suporte.

---

## Quando usar, e quando não usar?

Um canal aberto tem custo: conexão mantida por usuário, estado no servidor, reconexão a tratar e comportamento próprio atrás de *proxies*.

- **Chat, edição colaborativa, jogo em tempo real**: As mensagens vão nos dois sentidos, várias por segundo.
- **Painel que recebe atualizações do servidor, sem**: Fluxo em um sentido só, sobre HTTP comum, com reconexão nativa.
- **Dado que muda a cada poucos minutos**: Mais simples, sem conexão presa nem estado no servidor.
- **Notificação com a aba fechada**: O WebSocket morre junto com a página.
- **Envio de arquivo ou requisição pontual**: Não há nada a manter aberto.

---

## Executando

1. Abra as ferramentas do desenvolvedor com <kbd>F12</kbd> e selecione a aba Console.
2. Cole o código a seguir e pressione <kbd>Enter</kbd>.
3. Observe no console a mensagem de eco retornada instantaneamente pelo servidor.

---

## Executando: Comando

```js
const ws = new WebSocket('wss://echo.websocket.org');
   ws.onmessage = e => console.log('Eco recebido do servidor:', e.data);
   ws.onopen = () => ws.send('DevLab WebSockets em tempo real!');
```

---

## Exercício Prático

1. Qual a diferença fundamental entre o modelo de requisição HTTP e uma conexão WebSocket?
2. Por que devemos enviar objetos JavaScript serializados com `JSON.stringify()` através do método `socket.send()`?
3. O que representa o protocolo `wss://` em comparação a `ws://`?
4. No modelo HTTP, a comunicação é unidirecional por chamada (o cliente precisa pedir para o servidor responder e a conexão é fechada).
5. Porque o método.

---

## Desafio

Crie uma classe `ChatSocket` que mantenha uma conexão com uma URL de WebSocket, possua um método.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Quais são os 4 estados possíveis da propriedade `socket.readyState`?
2. `0 (CONNECTING)`: A conexão está sendo estabelecida?
3. `1 (OPEN)`: A conexão está aberta e pronta para comunicação?
4. `2 (CLOSING)`: A conexão está em processo de encerramento?
5. `3 (CLOSED)`: A conexão foi fechada ou não pôde ser aberta?

---

## Resumo do Tópico

- **HTTP vs WebSockets**: revise o papel desse eixo no uso da API.
- **Usando a Classe Nativa `WebSocket`**: revise o papel desse eixo no uso da API.
- **Padrão de Reconexão Automática**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
