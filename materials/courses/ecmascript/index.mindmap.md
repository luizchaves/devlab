---
title: 'Guia de ECMAScript'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Guia de ECMAScript

## Filosofia e Padrão

- **Norma Internacional (ECMA-262)**: padronização rigorosa mantida pelo comitê TC39.
- **Moderno e Nativo**: código idiomático ES2015+ sem dependência de build para estudo.
- **Independência de Host**: núcleo da linguagem separado das APIs do navegador ou do servidor.

## Ambientes de Execução

- **Navegadores Web**:
  - Manipulação de interface via DOM e CSSOM.
  - Comunicação de rede com `fetch` e WebSocket.
  - Armazenamento com LocalStorage e IndexedDB.
- **Node.js e Servidores**:
  - Acesso ao sistema de arquivos com `node:fs`.
  - Servidores HTTP e sockets de rede nativos.
  - Variáveis de ambiente e processos com `process`.
- **Runtimes Alternativos**:
  - Deno e Bun com foco em padrões web modernos.
  - Suporte compartilhado ao padrão ES Modules.

## Trilhas de Aprendizado

- **Fundamentos da Linguagem**:
  - Introdução e ecossistema (motores V8, SpiderMonkey, JSC).
  - Tipos primitivos, objetos e coerção de tipos.
  - Declaração de variáveis com `const`, `let` e regras de escopo.
  - Operadores aritméticos, lógicos e precedência.
  - Estruturas de controle de decisão e repetição.
- **Organização de Código**:
  - Funções de primeira classe, closures e arrow functions.
  - Módulos ES com `import` e `export`.
  - Tratamento de exceções com `try/catch/finally` e classes de erro.
- **Estruturas de Dados**:
  - Manipulação de texto com Strings e template literals.
  - Operações numéricas com `Number`, `BigInt` e `Math`.
  - Arrays e métodos funcionais imutáveis.
  - Objetos, classes e cadeia de protótipos.
  - Datas com `Date`.
  - Coleções estruturadas com `Map`, `Set`, `WeakMap` e `WeakSet`.
  - Padrões textuais com Expressões Regulares (`RegExp`).
- **Assincronismo**:
  - Modelo de concorrência com Event Loop e microtasks.
  - Tratamento de promessas com `Promise` e métodos combinadores.
  - Sintaxe sequencial assíncrona com `async` e `await`.
- **Referência Rápida e Evolução**:
  - Processo de especificação e estágios do comitê TC39.
  - Guia de consulta rápida às APIs embutidas.
  - Comparativo prático entre JavaScript e Python.
  - Casos peculiares e coerções históricas da linguagem.

## Roteiro Recomendado

- 1. Compreender o ecossistema, o papel do TC39 e o primeiro script.
- 2. Diferenciar valores primitivos de referências e adotar `const`/`let`.
- 3. Dominar operadores e controle de fluxo com blocos limpos.
- 4. Modularizar código em funções puras e módulos padronizados.
- 5. Transformar coleções com métodos funcionais e objetos semânticos.
- 6. Controlar operações assíncronas sem bloqueio do fluxo principal.
- 7. Consultar a especificação e acompanhar novas propostas da linguagem.

## Ferramentas de Prática

- **Node.js**: execução direta de scripts com `$ node script.js`.
- **REPL Interativo**: experimentação imediata digitando `$ node` no terminal.
- **DevTools do Navegador**: console integrado no atalho <kbd>F12</kbd>.
- **VS Code**: suporte nativo a realce, autocompletar e diagnósticos.
