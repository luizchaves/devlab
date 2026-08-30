---
title: 'Express.js: Tratamento de Erros'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express.js: Tratamento de Erros

## Ideia Central

- **Conceito**: Centralização do tratamento de erros em uma API Express: classe HttpError, erros operacionais e de programação, tradução de erros do banco, formato de resposta e falhas fora do ciclo de requisição.
- **Ecossistema**: Node.js, Express.js e TypeScript

## Principais Pontos

### Duas naturezas de erro
- Estruturas e convenções de **Duas naturezas de erro**
### O caminho de um erro
- Estruturas e convenções de **O caminho de um erro**
### A classe `HttpError`
- Estruturas e convenções de **A classe `HttpError`**
### O middleware de erro
- Estruturas e convenções de **O middleware de erro**
### Erros `async` no Express 5
- Estruturas e convenções de **Erros `async` no Express 5**
### Traduzindo erros de bibliotecas
- Estruturas e convenções de **Traduzindo erros de bibliotecas**

## Boas Práticas

- Manter responsabilidades separadas por módulo
- Tratar erros de forma centralizada e previsível
- Documentar rotas e contratos de entrada/saída
