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
title: "A Importância da Web"
description: "Slides completos da aula de introdução à história, arquitetura e tripé da Web."

---


<!-- _class: lead -->

# A Importância da Web

Origem, tripé fundamental (URL, HTTP, HTML), modelo cliente/servidor, arquitetura *stateless*, cache e padrões abertos.


---

## Objetivo (Parte 1)

Compreender a arquitetura e os fundamentos da Web:

- Entender a origem da Web no CERN (Tim Berners-Lee, 1989/1990).
- Diferenciar a **Internet** (infraestrutura de rede) da **Web** (serviço de hipertexto).
- Dominar o **Tripé da Web**: URL (endereçamento), HTTP (comunicação) e HTML (estruturação).

---

## Objetivo (Parte 2)

- Reconhecer os papéis de **Clientes** e **Servidores HTTP**.
- Explicar como a natureza *stateless* do HTTP, caches e CDNs permitem a escala da Web.
- Compreender a relevância dos **Padrões Abertos** (W3C).

---


## Por Que a Web Importa?

- **Acessibilidade Universal**: Qualquer máquina com um navegador pode acessar o conteúdo sem instalar softwares proprietários adicionais.
- **Conectividade por Links**: Permite interligar documentos mantidos por pessoas e organizações diferentes em todo o mundo.
- **Padrões Abertos**: Garantem a interoperabilidade entre navegadores, servidores e sistemas operacionais.


---


## Web vs. Internet

> **Internet** != **Web**

- **Internet**: A infraestrutura global de computadores e redes interconectados (cabos, roteadores, protocolos IP e TCP).
- **Web**: Um dos serviços que roda **sobre** a Internet, focado na navegação por documentos interligados via hipertexto.

*Outros serviços que usam a Internet (mas não são Web): E-mail (SMTP/IMAP), chamadas de voz/vídeo, jogos online, conexões SSH, sistemas de mensageria.*


---


## Origem no CERN (1989-1990)

- **1989**: Tim Berners-Lee propõe um sistema de hipertexto no CERN (laboratório europeu de física de partículas) para resolver o problema da informação fragmentada entre cientistas.
- **1990**: Projeto **WorldWideWeb** ganha forma com colaboração de Robert Cailliau.
- **Primeiro Servidor e Site**: Hospedado em [`info.cern.ch`](https://info.cern.ch/), explicando como navegar e criar servidores Web.


---

## Origem no CERN: Do Problema à Solução

<div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 20px; font-size: 0.9em;">

<div style="border: 2px solid #0284c7; border-radius: 8px; padding: 14px 20px; text-align: center; background: #f0f9ff; width: 92%;">
  <strong style="color: #0369a1; font-size: 1.1em;">Problema no CERN (1989)</strong><br>
  Pesquisadores, documentos e sistemas fragmentados sem um padrão simples para interconexão.
</div>

<div style="font-weight: bold; color: #0284c7; font-size: 1.2em;">↓ Solução (1990)</div>

<div style="border: 2px solid #16a34a; border-radius: 8px; padding: 14px 20px; text-align: center; background: #f0fdf4; width: 92%;">
  <strong style="color: #15803d; font-size: 1.1em;">WorldWideWeb (Hypertext Project)</strong><br>
  Navegador + Servidor + URL + HTTP + HTML
</div>

</div>

---


## O Tripé da Web

Para carregar uma página na Web, três elementos trabalham em conjunto:

| Componente | Função | Exemplo |
| --- | --- | --- |
| **URL** (*Uniform Resource Locator*) | Identifica a **localização** do recurso na rede | `https://example.com/artigos/web` |
| **HTTP** (*Hypertext Transfer Protocol*) | Define o protocolo de **comunicação** cliente/servidor | Requests (`GET`) e Responses (`200 OK`) |
| **HTML** (*Hypertext Markup Language*) | Define a **estrutura** e conteúdo do documento | `<h1>Título</h1>`, `<a href="...">` |


---


## Modelo Cliente / Servidor

A Web opera no modelo de requisição e resposta (*request-response*):

- **Cliente HTTP**: Envia uma requisição solicitando um recurso (ex: Navegadores, `curl`, Postman, Insomnia).
- **Servidor HTTP**: Recebe a requisição, processa o pedido e responde enviando o recurso, um erro ou um redirecionamento (ex: Apache, Nginx, Node.js/Express, Python `http.server`).

```txt
┌──────────────┐         1. HTTP Request (GET /index.html)        ┌──────────────┐
│   Cliente    │ ───────────────────────────────────────────────> │   Servidor   │
│ (Navegador)  │ <─────────────────────────────────────────────── │    HTTP      │
└──────────────┘         2. HTTP Response (200 OK + HTML)         └──────────────┘
```


---


## HTTP: Um Protocolo Stateless

- O HTTP é **stateless** (sem estado): cada requisição é tratada de forma independente, sem guardar memória automática de requisições anteriores.
- **Como manter estado na Web?**
  Aplicações usam mecanismos sobre o HTTP, como **Cookies**, **Tokens JWT**, **Sessões** e **LocalStorage**.

### Vantagens do Modelo Stateless
- **Escalabilidade**: Vários servidores independentes podem responder pelo mesmo site atrás de um balanceador de carga (*load balancer*).
- **Facilidade de Cache**: CDNs e proxies podem armazenar e reutilizar respostas para milhares de usuários simultâneos.


---


## O Poder do Hipertexto e dos Links

- O diferencial da Web é o **Hipertexto**: documentos que possuem elementos (links `<a>`) que apontam para outros recursos.
- Um link pode apontar para recursos no **mesmo servidor** ou em **servidores de domínios externos** (`ifpb.edu.br` ➔ `w3.org`).
- O navegador resolve o novo endereço IP via DNS, realiza a requisição HTTP para o novo servidor e apresenta a nova página transparente para o usuário.


---


## Padrões Abertos e o W3C

- **1994**: Tim Berners-Lee funda o **W3C** (*World Wide Web Consortium*) no MIT para padronizar as tecnologias da Web.
- **Benefícios dos Padrões Abertos**:
  - **Interoperabilidade**: Qualquer navegador ou servidor pode interpretar páginas Web da mesma forma.
  - **Acessibilidade**: Permite que leitores de tela e tecnologias assistivas entendam o conteúdo.
  - **Longevidade**: Documentos criados há décadas continuam acessíveis hoje.


---


## Resumo da Aula

- A **Web** é um sistema de hipertexto distribuído que roda sobre a **Internet**.
- O **Tripé da Web** reúne **URL** (endereço), **HTTP** (comunicação) e **HTML** (estrutura).
- A relação entre **Cliente** e **Servidor** baseia-se em requisições e respostas HTTP.
- A natureza **stateless** do HTTP permite escalar aplicações com caches, proxies e CDNs.
- **Padrões Abertos** mantidos pelo W3C garantem a descentralização e evolução contínua da Web.
