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
title: "MonitorApp: Tempo real"
description: "Décima primeira etapa do MonitorApp: painel que se atualiza sozinho com Server-Sent Events, barramento de eventos no servidor e consumo do fluxo com fetch e ReadableStream."
---

<!-- _class: lead -->

# MonitorApp: Tempo real

Décima primeira etapa do MonitorApp: painel que se atualiza sozinho com Server-Sent Events, barramento de eventos no servidor e consumo do fluxo com fetch e ReadableStream.

---

## Objetivo

- Entender o papel de **MonitorApp: Tempo real** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-realtime`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US12 — Ver a rede mudando ao vivo · RF08, Tasks da etapa
- **Estrutura da aplicação**: Por que Server-Sent Events
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK11.1 · Criar `src/services/events.ts` (O barramento), TK11.2 · Criar `src/routes/events.routes.ts` (A rota que não termina), TK11.3 · Emitir o evento em `Ping.check`
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 11 de 13 · Nível Avançado · Server-Sent Events · `ReadableStream`
- Desde a etapa 8 o servidor mede os hosts sozinho, a cada minuto.
- Mas o painel continua uma fotografia: para ver a medição nova é preciso recarregar a página.
- Esta etapa fecha essa lacuna e transforma a tela em um monitor de parede.
- A pergunta técnica é como o servidor avisa o navegador de algo que ele decidiu fazer.

---

## Requisitos, histórias e critérios

- Épico EP02 · Coleta e Tempo Real › Feature FT05 · Painel ao vivo

---

## Requisitos, histórias e critérios: Tabela

- RF08 Painel em Tempo Real: fluxo SSE e atualização do cartão sem reload | atendido
- RF07 Isolamento por Dono: o filtro por dono também no fluxo de eventos | reforçado

---

## US12 — Ver a rede mudando ao vivo · RF08

- Como responsável pela rede,
- quero que o painel mude sozinho quando uma medição acontece,
- para deixar a tela aberta como um monitor de parede.

---

## US12 — Ver a rede mudando ao vivo · RF08: Exemplo

```txt
Cenário: CA12.1 - O fluxo abre e permanece
  Quando envio GET /api/events com um token válido
  Então recebo Content-Type text/event-stream
  E a conexão permanece aberta
Cenário: CA12.2 - O formato do evento
  Dado o fluxo aberto
  Quando uma medição é gravada
  Então recebo um bloco event: ping
  E o data traz hostId, success, latency e createdAt
Cenário: CA12.3 - A tela muda sozinha
  Dado o painel aberto no navegador
  Quando o agendador mede um host
```

---

## Tasks da etapa

- TK11.1 · Criar `src/services/events.ts`: o barramento em memória e o tipo do evento.
- TK11.2 · Criar `src/routes/events.routes.ts`: a rota SSE, com heartbeat e limpeza.
- TK11.3 · Emitir o evento em `Ping.check`: logo depois de gravar.
- TK11.4 · Criar `front/js/lib/events.js`: consumir o fluxo e aplicar no cartão.

---

## Estrutura da aplicação

- São quatro arquivos tocados, e o desenho deles evita um acoplamento.
- Quem produz a medição é o model, dentro de `services/monitor.ts`; quem a consome são as conexões abertas em `routes/events.routes.ts`.
- O `services/events.ts` fica no meio, para que o model nunca precise conhecer uma resposta HTTP: exatamente a separação que a etapa 3 estabeleceu.

---

## Por que Server-Sent Events

- O MonitorApp não tem nada para o cliente enviar por um canal aberto: o cadastro de host e a medição sob demanda continuam sendo requisições HTTP normais.
- SSE entrega exatamente o que falta, sobre HTTP puro, com reconexão automática do lado do navegador.
- A sequência abaixo acompanha uma medição do agendador até o cartão na tela, e vale ler pelos dois extremos: a conexão é aberta uma vez, no começo, e o...

---

## Por que Server-Sent Events: Tabela

- *Polling* (`setInterval` + `fetch`): cliente pergunta | uma requisição por intervalo, quase sempre sem novidade | funciona, mas desperdiça e atrasa
- Server-Sent Events: servidor → cliente | uma conexão HTTP aberta | é a forma do problema: só o servidor tem o que dizer
- WebSocket: ambos os sentidos | protocolo próprio, `upgrade`, mais infraestrutura | poder que não é usado: o cliente nunca empurra nada

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Décima primeira etapa do MonitorApp: painel que se atualiza sozinho com Server-Sent Events, barramento de eventos no servidor e consumo do fluxo com...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- toda resposta HTTP termina: `GET /api/events` fica aberta
- a tela é uma fotografia do carregamento: o cartão muda a cada medição
- o front só faz requisição e resposta: também consome um fluxo contínuo

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Décima primeira etapa do MonitorApp: painel que se atualiza sozinho com Server-Sent Events, barramento de eventos no servidor e consumo do fluxo com...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK11.1 · Criar `src/services/events.ts` (O barramento)

- Nenhuma dependência: `node:events` é nativo.
- O arquivo tem 24 linhas e resolve um problema de acoplamento.
- Quem produz a medição é o agendador, dentro do model; quem consome são as conexões SSE abertas, dentro de um roteador.
- Ligar os dois diretamente faria o model conhecer respostas HTTP: exatamente o que a etapa 3 separou.
- O `EventEmitter` da linha 17 fica no meio. O model publica, o roteador assina, e nenhum dos dois conhece o outro.

---

## TK11.2 · Criar `src/routes/events.routes.ts` (A rota que não termina)

- Esta é a única rota do projeto que não chama `res.json()` nem `res.send()`. Ela abre o corpo da resposta e o mantém aberto.
- Os cabeçalhos das linhas 19 a 25 são o contrato do protocolo.
- O `Content-Type: text/event-stream` é o que faz o navegador tratar a resposta como fluxo; o `Cache-Control: no-cache` impede que um intermediário...
- Essa linha só passa a importar na etapa 13, quando o Nginx entra em cena, e está aqui desde já por isso.
- A linha 28 escreve um comentário do protocolo: uma linha iniciada por `:` não é evento, mas faz os cabeçalhos serem enviados e o cliente saber que a...

---

## TK11.3 · Emitir o evento em `Ping.check`

- Três linhas de mudança no model.
- A gravação da linha 28 passa a guardar o resultado em `created`, e o bloco das linhas 31 a 37 publica o evento com o `userId` lido do host.
- A ordem é deliberada: grava primeiro, publica depois.
- Publicar antes de persistir criaria uma janela em que a tela mostra uma medição que não está no banco: e um `F5` a faria desaparecer.

---

## TK11.4 · Criar `front/js/lib/events.js` (Consumir o fluxo)

- O navegador tem uma API pronta para SSE: `EventSource`. Ela é mais curta que este arquivo, e o projeto não a usa.
- O motivo está no comentário das linhas 6 a 9: `EventSource` não aceita cabeçalhos.
- O token teria que viajar como `?token=…` na URL: onde fica registrado no log de acesso do servidor, no histórico do navegador e em qualquer proxy do...
- A alternativa das linhas 12 a 14 é um `fetch` comum, com o `Authorization` no lugar certo.
- O preço é ler o fluxo à mão, e é o que as linhas 22 a 47 fazem:

---

## TK11.4 · Criar `front/js/lib/events.js` (Consumir o fluxo): Tabela

- 22: `res.body` é um `ReadableStream` de bytes; `TextDecoderStream` o converte em texto
- 26 a 31: laço que acumula o que chegou em um buffer
- 34: um bloco do protocolo SSE termina em linha em branco
- 36: o último pedaço volta ao buffer: pode ser um bloco incompleto, cortado no meio da rede
- 39 a 45: dentro do bloco, a linha `data:` é extraída e convertida em objeto

---

## Executando

- Suba a API com um intervalo curto, para não esperar um minuto por evento:
- Suba o front:
- Entre com `ana@exemplo.com` / `senha-secreta` e deixe a aba parada. A cada dez segundos os
- cartões mudam sozinhos.
- Veja o fluxo cru no terminal: o `-N` desliga o buffer do `curl`:

---

## Executando: Exemplo 1

```bash
   MONITOR_INTERVAL=10
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/expressjs/projects/monitor-app-realtime/back
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
```

---

## Conceitos abordados

- SSE, polling e WebSocket: escolher pela forma do problema
- Cabeçalhos de um fluxo `text/event-stream` e o comentário `:`
- Heartbeat contra fechamento por inatividade
- Remover ouvintes e timers no `close` da requisição
- Blocos parciais e o buffer entre leituras

---

## Próxima etapa

- MonitorApp: Testes de software: unidade, rotas, front e navegador.

---

## Arquivos-Chave da Aula

- **back/src/services/events.ts**: `examples/courses/expressjs/projects/monitor-app-realtime/back/src/services/events.ts` (linhas marcadas `3-10,17-20`)
- **back/src/routes/events.routes.ts**: `examples/courses/expressjs/projects/monitor-app-realtime/back/src/routes/events.routes.ts` (linhas marcadas `19-28,32-36,43-46`)
- **back/src/models/Ping.ts**: `examples/courses/expressjs/projects/monitor-app-realtime/back/src/models/Ping.ts` (linhas marcadas `28-37`)
- **front/js/lib/events.js**: `examples/courses/expressjs/projects/monitor-app-realtime/front/js/lib/events.js` (linhas marcadas `11-14,34-36`)
- **front/js/index.js**: `examples/courses/expressjs/projects/monitor-app-realtime/front/js/index.js` (linhas marcadas `127-143`)
- **front/js/host.js**: `examples/courses/expressjs/projects/monitor-app-realtime/front/js/host.js`

---

## Resumo da Aula

- **MonitorApp: Tempo real** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
