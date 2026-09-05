---
title: 'Express.js: Controllers'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express.js: Controllers

## Ideia Central

- **Conceito**: Separação da lógica das rotas em controllers: nomes convencionais, responsabilidades de cada camada, controllers magros e quando extrair uma camada de serviço.
- **Ecossistema**: Node.js, Express.js e TypeScript

## Principais Pontos

### O problema
- Estruturas e convenções de **O problema**
### A separação
- Estruturas e convenções de **A separação**
### Nomes convencionais
- Estruturas e convenções de **Nomes convencionais**
### Quem faz o quê?
- ler req.params, req.query e req.body;
- validar e converter a entrada (Number(req.params.id));
- chamar o model;
### Controllers magros
- Subtópico: Responsabilidades
- Subtópico: Organização
- [Express — Routing](https://expressjs.com/en/guide/routing.html)

## Boas Práticas

- Manter responsabilidades separadas por módulo
- Tratar erros de forma centralizada e previsível
- Documentar rotas e contratos de entrada/saída
