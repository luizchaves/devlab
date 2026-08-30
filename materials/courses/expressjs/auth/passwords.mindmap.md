---
title: 'Express.js: Senhas e Hash'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Express.js: Senhas e Hash

## Ideia Central

- **Conceito**: Como guardar senhas com segurança: função de hash, sal, funções de derivação de chave, bcrypt e Argon2, implementação nativa com node:crypto e comparação em tempo constante.
- **Ecossistema**: Node.js, Express.js e TypeScript

## Principais Pontos

### O que nunca fazer
- Estruturas e convenções de **O que nunca fazer**
### Hash de mão única
- Estruturas e convenções de **Hash de mão única**
### Por que `SHA-256` não basta
- Estruturas e convenções de **Por que `SHA-256` não basta**
### O sal
- Estruturas e convenções de **O sal**
### O custo de computação
- Estruturas e convenções de **O custo de computação**
### As três KDFs usadas na prática
- Estruturas e convenções de **As três KDFs usadas na prática**

## Boas Práticas

- Manter responsabilidades separadas por módulo
- Tratar erros de forma centralizada e previsível
- Documentar rotas e contratos de entrada/saída
