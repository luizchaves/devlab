---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: MonitorApp"
description: "Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma com relações, ping real, usuário, autenticação, tempo real, testes e Docker."
---

<!-- _class: lead -->

# Projeto: MonitorApp

Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma com relações, ping real, usuário, autenticação, tempo real, testes e Docker.

---

## Objetivo do Projeto

- Construir e validar o projeto de acordo com as especificações da aula
- Compreender a organização do repositório em `examples/courses/express/projects/`
- Executar os testes e requisições HTTP para validar os endpoints esperados

---

## Estrutura e Execução

- **Código-fonte**: Projeto completo executável no repositório DevLab
- **Ambiente**: Node.js com scripts `dev` e `start` configurados
- **Testes HTTP**: Arquivo `requests.http` ou requisições via `curl`

---

## Resumo

- **Projeto: MonitorApp**: Aplicação de monitoramento de hosts de rede construída em treze etapas: front estático no Vite, API em memória, TypeScript, validação, SQLite, Prisma com relações, ping real, usuário, autenticação, tempo real, testes e Docker.
- Prática guiada e evolutiva da trilha Express.js
