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
title: "Guia de Web APIs"
description: "Slides completos do tópico Guia de Web APIs."
---

<!-- _class: lead -->

# Guia de Web APIs

Ambiente do navegador · camadas de API · trilhas de estudo · roteiro

---

## Objetivo

- Diferenciar **ECMAScript**, **Web APIs** e **APIs HTTP**.
- Entender o navegador como **ambiente de execução** do JavaScript.
- Localizar cada trilha do guia a partir do problema de interface.
- Escolher a próxima página conforme DOM, rede, storage ou dispositivo.

---

## Mapa do Tópico

- **Ambiente**: o navegador injeta objetos como `window` e `document`.
- **Trilhas**: famílias de recursos da plataforma web.
- **Três APIs**: linguagem, navegador e serviço remoto.
- **Roteiro**: ordem sugerida para estudar o guia.

---

## ECMAScript vs Navegador

A linguagem define a lógica; o navegador define o que essa lógica pode tocar.

| Camada | Exemplos | Papel |
| --- | --- | --- |
| ECMAScript | `Promise`, `Array`, `JSON` | Dados e controle |
| Web APIs | `document`, `fetch`, `localStorage` | Página, rede e recursos |
| API HTTP | REST, GraphQL | Contrato com servidor |

---

## Ambiente de Execução

O mesmo JavaScript muda de alcance conforme o *host environment*.

```txt
┌───────────────┐       ┌──────────────────────┐
│ ECMAScript    │       │ Navegador            │
│ syntax        │──────>│ window, document     │
│ objetos       │       │ fetch, storage, DOM   │
│ promises      │       │ eventos, permissões   │
└───────────────┘       └──────────────────────┘
          │                         │
          └──────── roda no mesmo código ────────┘
```

---

## Trilhas do Guia

As páginas estão agrupadas pelo recurso que a aplicação precisa controlar.

| Trilha | Problema típico |
| --- | --- |
| Ambiente e Navegador | ciclo de vida, BOM, History API |
| DOM e Estrutura | selecionar, criar e reagir a elementos |
| Armazenamento | preferências, sessão e persistência local |
| Rede | `fetch`, SSE, WebSockets, REST e GraphQL |
| Dispositivo | localização, notificações, workers e Wasm |

---

## Interface, Mídia e Entrada

Algumas trilhas resolvem interação direta com o usuário.

- **Interface**: Dialog API e Fullscreen API.
- **Mídia**: Canvas 2D e Web Speech API.
- **Entrada**: Clipboard API e Drag and Drop.
- **Segurança**: CORS, OWASP, CSP e políticas do navegador.

---

## Três Sentidos de API

A palavra API aparece em três níveis diferentes no desenvolvimento web.

| Nome no guia | O que você usa | Onde roda |
| --- | --- | --- |
| API da linguagem | métodos e objetos do JS | qualquer ambiente |
| Web API | interface nativa do navegador | aba do usuário |
| API Web | serviço remoto HTTP | back-end |

---

## Uma Requisição em Camadas

`fetch()` fica no meio entre código JavaScript e serviço remoto.

```txt
Dados JS ──> Promise ──> fetch() ──> HTTP/CORS ──> REST ou GraphQL
   ▲                         │                         │
   └──────── Response <──────┴──────── JSON <──────────┘
```

*CORS é aplicado pelo navegador, mas autorizado por cabeçalhos do servidor.*

---

## Critério Prático

Use a pergunta certa para classificar a API antes de escrever código.

- Manipula memória sem navegador? **API da linguagem**.
- Toca tela, aba, storage, sensores ou rede do dispositivo? **Web API**.
- Conversa com regras de negócio em outro processo? **API Web HTTP**.
- Depende de política de origem ou permissão? O navegador participa da decisão.

---

## Roteiro Sugerido

A ordem começa no ambiente e avança para recursos mais especializados.

1. Fundamentos: ciclo de vida da página e objetos do navegador.
2. DOM: manipulação, eventos, elementos, formulários e rolagem.
3. Armazenamento: Web Storage e cookies.
4. Rede: Fetch, SSE, WebSockets, CORS, REST, GraphQL e SSR.
5. Segurança, dispositivo, observadores, workers e WebAssembly.

---

## Como Usar o Guia

Comece pelo problema de produto, depois escolha a interface nativa.

- Quer reagir a clique ou teclado? Vá para eventos e DOM.
- Precisa manter preferência local? Compare storage e cookies.
- Precisa buscar dados? Estude Fetch antes de REST e GraphQL.
- Precisa não travar a UI? Compare observers, workers e WebAssembly.

---

## Perguntas de revisão

1. O que diferencia uma Web API de uma API da linguagem?
2. Por que `fetch()` não é a API HTTP remota em si?
3. Qual trilha do guia resolve persistência no navegador?
4. Quando uma política do navegador pode bloquear uma chamada correta?

---

## Resumo do Tópico

- **Linguagem**: ECMAScript define sintaxe, objetos e Promises.
- **Navegador**: Web APIs expõem página, rede, storage e dispositivo.
- **Servidor**: APIs HTTP entregam contratos remotos de negócio.
- **Trilhas**: escolha o bloco do guia pelo problema real.
- **Roteiro**: ambiente e DOM vêm antes de rede e recursos avançados.
