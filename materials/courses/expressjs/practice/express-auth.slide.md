---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Express Auth"
description: "Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id — tudo usando apenas node:crypto."
---

<!-- _class: lead -->

# Projeto: Express Auth

Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id — tudo usando apenas node:crypto.

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

- **Projeto: Express Auth**: Cadastro, autenticação por JWT e autorização por posse e papel, com hash Argon2id — tudo usando apenas node:crypto.
- Prática guiada e evolutiva da trilha Express.js
