---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: Hello Express"
description: "Primeiro servidor HTTP com Express, com rotas, parâmetros e JSON."
---

<!-- _class: lead -->

# Projeto: Hello Express

Primeiro servidor HTTP com Express, com rotas, parâmetros e JSON.

---

## Objetivo

- Entender o papel de **Projeto: Hello Express** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/hello`
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
- Um único arquivo, três rotas e o ciclo requisição/resposta completo.

---

## Estrutura

- Estrutura aparece como ponto central da aula, não apenas como item de índice.
- Primeiro servidor HTTP com Express, com rotas, parâmetros e JSON.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Código

- Código aparece como ponto central da aula, não apenas como item de índice.
- Primeiro servidor HTTP com Express, com rotas, parâmetros e JSON.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- cd examples/courses/expressjs/projects/hello

---

## Rotas

- Rotas aparece como ponto central da aula, não apenas como item de índice.
- Primeiro servidor HTTP com Express, com rotas, parâmetros e JSON.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Rotas: Tabela

- GET: `/` | `{ "message": "Hello World" }`
- GET: `/hello/:name` | Saudação com o parâmetro
- POST: `/echo` | Devolve o corpo recebido

---

## Conceitos abordados

- Criação do servidor com `express()`
- Rotas e métodos HTTP
- Parâmetros de rota (`req.params`)
- Corpo JSON (`express.json()` e `req.body`)
- Status codes com `res.status()`

---

## Próximo projeto

- Express Router: separando as rotas em módulos.

---

## Resumo da Aula

- **Projeto: Hello Express** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
