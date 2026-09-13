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
title: "Projeto: MonitorApp"
description: "Visão geral enxuta do MonitorApp, com requisitos, documentos prévios, arquitetura e trilha incremental."
---

<!-- _class: lead -->

# Projeto: MonitorApp

Monitoramento de hosts em treze etapas cumulativas, do front estático ao Docker.

---

## Papel da visão geral

- Apresentar o domínio, a stack e a arquitetura do projeto.
- Apontar para os documentos que detalham produto e contrato.
- Orientar a ordem de leitura antes das páginas de etapa.

---

## Leia antes das etapas

1. **Backlog do produto**: épicos, features, histórias, critérios e tasks.
2. **Especificação da API**: endpoints, corpos, status codes, ping e eventos.
3. **Front estático**: primeira etapa prática, com as telas do painel.

---

## Escopo funcional

- CRUD de hosts monitorados.
- Tags, histórico de medições e ping sob demanda.
- Cadastro, autenticação e isolamento por dono.
- Painel atualizado por eventos em tempo real.

---

## Stack em camadas

- Front-end: HTML, Tailwind CSS, JavaScript vanilla e Vite.
- Back-end: Node.js, Express 5, TypeScript e Zod.
- Persistência e coleta: SQLite, Prisma e `node:child_process`.
- Qualidade e entrega: `node:test`, Vitest, Playwright, Docker e Compose.

---

## Arquitetura

- Front e API rodam em origens separadas.
- O Vite usa proxy em desenvolvimento.
- O Express autoriza chamadas com CORS quando necessário.
- O serviço de monitoramento executa `ping` sem shell e publica eventos SSE.

---

## Domínio em alto nível

- `User`: conta autenticada e dona dos hosts.
- `Host`: endereço monitorado.
- `Ping`: medição de disponibilidade e latência.
- `Tag`: classificação muitos-para-muitos dos hosts.

---

## Trilha incremental

- Etapas 1 a 5: front, API, TypeScript, validação e OpenAPI.
- Etapas 6 a 8: SQLite, Prisma, relações e ping real.
- Etapas 9 a 13: usuário, autenticação, tempo real, testes e Docker.
- Cada etapa herda a anterior e acrescenta uma decisão técnica.

---

## Onde aprofundar

- Use o backlog para entender por que cada task existe.
- Use a especificação da API para conferir contrato, erros e eventos.
- Use as páginas de etapa para estudar o delta de implementação.
- Use próximos passos para continuar depois da etapa 13.
