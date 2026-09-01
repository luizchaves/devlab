---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Express Router"
description: "Rotas separadas em módulos com express.Router()."
---

<!-- _class: lead -->

# Projeto: Express Router

Rotas separadas em módulos com express.Router().

---

## Objetivo

- Entender o papel de **Projeto: Express Router** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/router`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Estrutura**
- **Código**
- **Executando**
- **Rotas**
- **Conceitos abordados**
- **Próximo projeto**

---

## Contexto da Aula

- Nível Iniciante · Node.js · Express.js
- O mesmo servidor do projeto anterior, agora com as rotas em um módulo próprio e a aplicação separada do servidor.

---

## Estrutura

- Estrutura aparece como ponto central da aula, não apenas como item de índice.
- Rotas separadas em módulos com express.Router().
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Código

- Código aparece como ponto central da aula, não apenas como item de índice.
- Rotas separadas em módulos com express.Router().
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- cd examples/courses/expressjs/projects/router

---

## Rotas

- Rotas aparece como ponto central da aula, não apenas como item de índice.
- Rotas separadas em módulos com express.Router().
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Rotas: Tabela

- GET: `/users` | Lista de usuários
- GET: `/users/:id` | Um usuário, ou `404`

---

## Conceitos abordados

- Separação entre `app.js` e `server.js`
- Conversão de `req.params` para número
- Resposta `404` para recurso inexistente
- A aula correspondente é Express.js → Routes.

---

## Próximo projeto

- Express MVC: controllers, models e middlewares.

---

## Resumo da Aula

- **Projeto: Express Router** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
