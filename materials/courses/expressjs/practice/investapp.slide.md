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
title: "Projeto: InvestApp"
description: "Visão geral enxuta do InvestApp, com requisitos, documentos prévios, arquitetura e trilha incremental."
---

<!-- _class: lead -->

# Projeto: InvestApp

Controle de investimentos em treze etapas cumulativas, do front estático ao Docker.

---

## Papel da visão geral

- Apresentar o domínio, a stack e a arquitetura do projeto.
- Apontar para os documentos que detalham produto e contrato.
- Orientar a ordem de leitura antes das páginas de etapa.

---

## Leia antes das etapas

1. **Backlog do produto**: épicos, features, histórias, critérios e tasks.
2. **Especificação da API**: endpoints, corpos, status codes, erros e upload.
3. **Front estático**: primeira etapa prática, com as telas do produto.

---

## Escopo funcional

- CRUD de investimentos por carteira.
- Cadastro, autenticação e isolamento por dono.
- Notificação de boas-vindas e upload de avatar.
- API documentada em OpenAPI 3.

---

## Stack em camadas

- Front-end: HTML, Tailwind CSS, JavaScript vanilla e Vite.
- Back-end: Node.js, Express 5, TypeScript e Zod.
- Persistência: SQLite nativo e Prisma ORM.
- Qualidade e entrega: Vitest, Playwright, Docker e Compose.

---

## Arquitetura

- O Express serve o front na mesma origem com `express.static`.
- O front chama `/api` sem precisar de CORS.
- Controllers coordenam models, Prisma, upload e e-mail.
- SQLite guarda usuários, investimentos, categorias e corretoras.

---

## Domínio em alto nível

- `User`: investidor autenticado e dono da carteira.
- `Investment`: ativo financeiro acompanhado pelo usuário.
- `Category`: classificação visual do investimento.
- `Broker`: instituição onde o ativo está custodiado.

---

## Trilha incremental

- Etapas 1 a 5: front, API, TypeScript, validação e OpenAPI.
- Etapas 6 a 9: SQLite, Prisma, usuário e autenticação.
- Etapas 10 a 13: e-mail, upload, testes e Docker.
- Cada etapa herda a anterior e acrescenta uma decisão técnica.

---

## Onde aprofundar

- Use o backlog para entender por que cada task existe.
- Use a especificação da API para conferir contrato e erros.
- Use as páginas de etapa para estudar o delta de implementação.
- Use próximos passos para continuar depois da etapa 13.
