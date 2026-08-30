---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Upload de Arquivo"
description: "Recebimento de arquivos em uma API Express: multipart/form-data, multer, estratégias de armazenamento, validação de tipo e tamanho, nomes seguros e travessia de diretório."
---

<!-- _class: lead -->

# Express.js: Upload de Arquivo

Recebimento de arquivos em uma API Express: multipart/form-data, multer, estratégias de armazenamento, validação de tipo e tamanho, nomes seguros e travessia de diretório.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Upload de Arquivo** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Por que `req.body` chega vazio

- Conceitos fundamentais de **Por que `req.body` chega vazio** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Recebendo com `multer`

- Conceitos fundamentais de **Recebendo com `multer`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Onde os bytes ficam

- Conceitos fundamentais de **Onde os bytes ficam** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O que guardar no banco

- Conceitos fundamentais de **O que guardar no banco** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O fluxo completo

- Conceitos fundamentais de **O fluxo completo** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Validação de verdade

- Conceitos fundamentais de **Validação de verdade** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Servindo o arquivo

- Subtópico: Formato
- Subtópico: Segurança
- [multer](https://www.npmjs.com/package/multer)
- [FormData | MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [OWASP — File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/FileUploadCheatSheet.html)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Upload de Arquivo**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Upload de Arquivo**: Recebimento de arquivos em uma API Express: multipart/form-data, multer, estratégias de armazenamento, validação de tipo e tamanho, nomes seguros e travessia de diretório.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
