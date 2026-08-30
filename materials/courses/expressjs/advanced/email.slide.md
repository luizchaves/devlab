---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Envio de E-mail"
description: "Envio de e-mail a partir de uma API Express: SMTP, nodemailer, serviços transacionais, confirmação de cadastro e redefinição de senha com token de uso único, e envio fora do ciclo da requisição."
---

<!-- _class: lead -->

# Express.js: Envio de E-mail

Envio de e-mail a partir de uma API Express: SMTP, nodemailer, serviços transacionais, confirmação de cadastro e redefinição de senha com token de uso único, e envio fora do ciclo da requisição.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Envio de E-mail** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## SMTP e serviços transacionais

- Conceitos fundamentais de **SMTP e serviços transacionais** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Enviando com `nodemailer`

- Conceitos fundamentais de **Enviando com `nodemailer`** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Testando sem enviar

- Conceitos fundamentais de **Testando sem enviar** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Confirmação de cadastro

- Conceitos fundamentais de **Confirmação de cadastro** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Redefinição de senha

- Conceitos fundamentais de **Redefinição de senha** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Envio fora do caminho da requisição

- Subtópico: Envio
- Subtópico: Redefinição de senha
- [Nodemailer](https://nodemailer.com/)
- [Ethereal Email](https://ethereal.email/)
- [OWASP — Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/ForgotPasswordCheatSheet.html)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Envio de E-mail**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Envio de E-mail**: Envio de e-mail a partir de uma API Express: SMTP, nodemailer, serviços transacionais, confirmação de cadastro e redefinição de senha com token de uso único, e envio fora do ciclo da requisição.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
