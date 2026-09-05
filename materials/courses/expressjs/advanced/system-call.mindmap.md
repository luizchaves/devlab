---
title: 'Express.js: Chamada de Sistema'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express.js: Chamada de Sistema

## Ideia Central

- **Conceito**: Execução de comandos do sistema operacional a partir de uma rota Express: exec, execFile e spawn, injeção de comando, tempo limite, extração da saída com expressões regulares e quando usar uma biblioteca.
- **Ecossistema**: Node.js, Express.js e TypeScript

## Principais Pontos

### O módulo `node:child_process`
- Estruturas e convenções de **O módulo `node:child_process`**
### Injeção de comando
- Estruturas e convenções de **Injeção de comando**
### Tempo limite e limite de saída
- Estruturas e convenções de **Tempo limite e limite de saída**
### Extraindo dados da saída
- Estruturas e convenções de **Extraindo dados da saída**
### Saída longa: `spawn`
- Estruturas e convenções de **Saída longa: `spawn`**
### Quando usar uma biblioteca?
- Subtópico: Execução
- Subtópico: Segurança e robustez
- [Node.js — childprocess](https://nodejs.org/api/childprocess.html)

## Boas Práticas

- Manter responsabilidades separadas por módulo
- Tratar erros de forma centralizada e previsível
- Documentar rotas e contratos de entrada/saída
