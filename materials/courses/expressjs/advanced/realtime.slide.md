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
title: "Express.js: Tempo Real"
description: "Atualização em tempo real a partir de uma API Express: polling, Server-Sent Events nativos, WebSocket, comparação entre as três abordagens e o que muda com várias instâncias."
---

<!-- _class: lead -->

# Express.js: Tempo Real

Atualização em tempo real a partir de uma API Express: polling, Server-Sent Events nativos, WebSocket, comparação entre as três abordagens e o que muda com várias instâncias.

---

## Objetivo

- Ao final você saberá escolher entre polling, Server-Sent Events e WebSocket, implementar SSE com o Express sem nenhuma dependência, e reconhecer o que...

---

## Mapa da Aula

- **Objetivo**
- **Três formas de atualizar o cliente**
- **Polling**
- **Server-Sent Events**
- **WebSocket**
- **O problema das várias instâncias**
- **Exercício**
- **Desafio**

---

## Contexto da Aula

- HTTP foi desenhado para o cliente perguntar e o servidor responder.
- Quando o servidor precisa avisar primeiro: um ping que falhou, uma notificação, um valor que mudou: é preciso outra estratégia.

---

## Três formas de atualizar o cliente

- Um painel que atualiza a cada 30 segundos não precisa de WebSocket.
- Polling custa algumas requisições e não acrescenta nenhuma peça à arquitetura: e é reversível.

---

## Três formas de atualizar o cliente: Tabela

- Direção: cliente pergunta | servidor → cliente | bidirecional
- Protocolo: HTTP comum | HTTP comum | `ws://` após upgrade
- Dependência no servidor: nenhuma | nenhuma | pacote (`ws`, Socket.IO)
- Reconexão automática: trivial | nativa no navegador | manual
- Passa por proxy e CDN: sempre | quase sempre | exige configuração
- Custo por cliente ocioso: requisições vazias | uma conexão aberta | uma conexão aberta

---

## Polling

- A abordagem mais simples é o cliente perguntar de novo. O cabeçalho `ETag`, que o Express já envia, torna a resposta repetida barata:
- Cem clientes com intervalo de um segundo geram cem requisições por segundo, quase todas desnecessárias.
- Ajuste o intervalo à velocidade real da mudança e pare o `setInterval` quando a aba não estiver visível (`document.visibilityState`).

---

## Polling: Exemplo

```js
setInterval(async () => {
  // 304 Not Modified quando nada mudou: sem corpo trafegado.
  const hosts = await api.list();
  render(hosts);
}, 5000);
```

---

## Server-Sent Events

- SSE é um fluxo HTTP que nunca termina: o servidor mantém a resposta aberta e escreve eventos à medida que eles acontecem.
- Não há pacote envolvido: é `text/event-stream`.
- O formato é texto simples, com uma linha em branco separando os eventos:
- No navegador, `EventSource` cuida da conexão e da reconexão automática:
- Não dá para mandar `Authorization: Bearer …`: a API só aceita a URL.

---

## Server-Sent Events: Exemplo 1

```ts
const clientes = new Set<Response>();
router.get('/events', authenticate, (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });
  res.flushHeaders();
  // Comentário inicial: abre o fluxo e evita buffer de proxy.
  res.write(': conectado\n\n');
  clientes.add(res);
```

---

## Server-Sent Events: Exemplo 2

```txt
: conectado
event: investment.created
data: {"id":"b1c2","name":"CDB Inter","amount":15000}
event: investment.removed
data: {"id":"a9d2"}
```

---

## WebSocket

- Quando o cliente também precisa enviar mensagens pelo canal: chat, edição colaborativa, jogo: o SSE não basta.
- O WebSocket abre um canal bidirecional a partir de um upgrade da conexão HTTP:
- A conexão é estabelecida antes de qualquer rota: `authenticate`, `cors` e `errorHandler` não são executados.
- Autenticação, autorização e tratamento de erro precisam ser refeitos dentro do handler de `connection`.

---

## WebSocket: Exemplo 1

```ts
    import { createServer } from 'node:http';
    import { WebSocketServer } from 'ws';
    // O Express deixa de chamar listen: quem escuta é o servidor HTTP.
    const server = createServer(app);
    const wss = new WebSocketServer({ server });
    wss.on('connection', (socket) => {
      socket.on('message', (dados) => {
        // Repassa a mensagem para todos os outros conectados.
        for (const cliente of wss.clients) {
          if (cliente !== socket) cliente.send(dados.toString());
        }
      });
```

---

## WebSocket: Exemplo 2

```js
    const socket = new WebSocket('ws://localhost:3000');
    socket.addEventListener('message', (event) => {
      mostrarMensagem(event.data);
    });
    form.onsubmit = (event) => {
      event.preventDefault();
      socket.send(input.value);
    };
```

---

## O problema das várias instâncias

- Tanto SSE quanto WebSocket guardam as conexões na memória do processo.
- Com duas instâncias atrás de um balanceador, o evento publicado em uma não alcança os clientes conectados na outra:
- A solução é um canal de publicação compartilhado: cada instância assina o canal e repassa aos seus próprios clientes.
- É o que o adaptador de Redis do Socket.IO faz.

---

## O problema das várias instâncias: Tabela

- Uma instância: sim
- Várias instâncias, mesmo evento: não: precisa de pub/sub
- Várias instâncias, sessão presa à instância: sim, com sessão aderente (frágil)

---

## Exercício

- No projeto `express-auth`:
- Crie `GET /api/events` como SSE, mantendo os clientes conectados em um `Set`.
- Publique `investment.created` no `store` e `investment.removed` no `destroy`.
- Consuma com `EventSource` em uma página simples e veja a lista atualizar sem recarregar.
- Feche a aba e confirme no log que o cliente saiu do `Set`.

---

## Exercício: Exemplo

```ts
  // Proxies costumam encerrar conexões ociosas: o ping mantém o fluxo vivo.
  const keepAlive = setInterval(() => res.write(': ping\n\n'), 30_000);
  clientes.add(res);
  req.on('close', () => {
    clearInterval(keepAlive);
    clientes.delete(res);
  });
```

---

## Desafio

- Implemente a filtragem por usuário: cada cliente SSE só deve receber eventos dos próprios investimentos.
- Guarde o `userId` junto da resposta no `Set` e filtre em `publicar`.
- Depois, descreva o que precisaria mudar para isso continuar funcionando com duas instâncias.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Atualização em tempo real a partir de uma API Express: polling, Server-Sent Events nativos, WebSocket, comparação entre as três abordagens e o que muda...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Escolha

- Quando SSE é suficiente e quando o WebSocket é necessário?
- SSE basta quando só o servidor precisa falar: notificações, painéis, atualizações de lista.
- O WebSocket é necessário quando o cliente também envia pelo mesmo canal: chat, colaboração, jogos.
- Qual a vantagem do polling apesar de parecer primitivo?
- Não acrescenta nenhuma peça à arquitetura: é HTTP comum, passa por qualquer proxy, funciona com os middlewares existentes e é trivial de reverter.

---

## Implementação

- Por que remover a conexão no evento `close`?
- Porque a resposta permanece no `Set` depois de o cliente sair, e escrever nela vaza memória e acumula erros.
- Cada aba fechada deixaria um registro morto.
- Por que `EventSource` não envia `Authorization`?
- A API não permite cabeçalhos personalizados.

---

## Próxima aula

- Chamada de Sistema: executar comandos do sistema operacional a partir de uma rota.

---

## Resumo da Aula

- **Express.js: Tempo Real** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
