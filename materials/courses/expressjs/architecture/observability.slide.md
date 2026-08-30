---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Observabilidade e OpenTelemetry"
description: "Os três sinais da observabilidade em uma API Express — logs, métricas e rastros —, instrumentação com OpenTelemetry, spans e atributos, exportação por OTLP, correlação entre trace e log e métricas RED."
---

<!-- _class: lead -->

# Express.js: Observabilidade e OpenTelemetry

Os três sinais da observabilidade em uma API Express — logs, métricas e rastros —, instrumentação com OpenTelemetry, spans e atributos, exportação por OTLP, correlação entre trace e log e métricas RED.

---

## Objetivo

- Compreender a arquitetura e motivação de **Express.js: Observabilidade e OpenTelemetry** no Express.js
- Identificar as principais abstrações e métodos envolvidos no tópico
- Aplicar boas práticas de organização e padrão de código em Node.js
- Executar os exemplos práticos e reconhecer o fluxo de execução completo

---

## Monitoramento e observabilidade

- Conceitos fundamentais de **Monitoramento e observabilidade** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Os três sinais

- Conceitos fundamentais de **Os três sinais** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## O que é o OpenTelemetry

- Conceitos fundamentais de **O que é o OpenTelemetry** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Instrumentação automática

- Conceitos fundamentais de **Instrumentação automática** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Spans manuais

- Conceitos fundamentais de **Spans manuais** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Correlacionando rastro e log

- Conceitos fundamentais de **Correlacionando rastro e log** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Métricas

- Conceitos fundamentais de **Métricas** no ecossistema Express.js
- Estrutura de código e padrão recomendado
- Cuidados com escopo e tratamento de erros

---

## Amostragem

- Subtópico: Sinais
- Subtópico: OpenTelemetry
- [OpenTelemetry — JavaScript](https://opentelemetry.io/docs/languages/js/)
- [OpenTelemetry — Semantic conventions for HTTP](https://opentelemetry.io/docs/specs/semconv/http/)
- [W3C — Trace Context](https://www.w3.org/TR/trace-context/)

---

## Exercício Prático

1. Acesse o projeto de exemplo correspondente em `examples/courses/express/projects/`
2. Implemente ou ajuste as rotas para exercitar **Express.js: Observabilidade e OpenTelemetry**
3. Valide o comportamento realizando requisições HTTP e verificando os status retornados

---

## Resumo da Aula

- **Express.js: Observabilidade e OpenTelemetry**: Os três sinais da observabilidade em uma API Express — logs, métricas e rastros —, instrumentação com OpenTelemetry, spans e atributos, exportação por OTLP, correlação entre trace e log e métricas RED.
- Estrutura limpa, previsível e sem acoplamento excessivo
- Validação contínua e padrões mantidos em produção
