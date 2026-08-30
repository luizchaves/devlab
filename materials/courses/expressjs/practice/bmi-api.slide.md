---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Projeto: BMI API"
description: "O mesmo cálculo de IMC exposto de três formas — query string, parâmetro de rota e corpo da requisição — para comparar as origens de dados de uma requisição."
---

<!-- _class: lead -->

# Projeto: BMI API

O mesmo cálculo de IMC exposto de três formas — query string, parâmetro de rota e corpo da requisição — para comparar as origens de dados de uma requisição.

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

- **Projeto: BMI API**: O mesmo cálculo de IMC exposto de três formas — query string, parâmetro de rota e corpo da requisição — para comparar as origens de dados de uma requisição.
- Prática guiada e evolutiva da trilha Express.js
