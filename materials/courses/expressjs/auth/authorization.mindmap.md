---
title: 'Express.js: Autorização'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express.js: Autorização

## Ideia Central

- **Conceito**: Controle de acesso em uma API Express: 401 versus 403, autorização por posse do recurso, papéis (RBAC), middlewares de autorização, referência direta insegura a objeto e filtro por dono no model.
- **Ecossistema**: Node.js, Express.js e TypeScript

## Principais Pontos

### A falha número um em APIs
- Estruturas e convenções de **A falha número um em APIs**
### `401` ou `403`?
- Estruturas e convenções de **`401` ou `403`?**
### Os dois modelos de autorização
- Estruturas e convenções de **Os dois modelos de autorização**
### Autorização por posse
- Estruturas e convenções de **Autorização por posse**
### Autorização por papel
- Estruturas e convenções de **Autorização por papel**
### Onde a verificação deve ficar
- Subtópico: Status e semântica
- Subtópico: Implementação
- [OWASP — Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AuthorizationCheatSheet.html)

## Boas Práticas

- Manter responsabilidades separadas por módulo
- Tratar erros de forma centralizada e previsível
- Documentar rotas e contratos de entrada/saída
