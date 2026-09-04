---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
    padding-bottom: 0;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Guia de ECMAScript"
description: "Guia de referência completo do JavaScript e ECMAScript: da sintaxe aos módulos, assincronismo, arrays, objetos, protótipos e processo TC39."
---

<!-- _class: lead -->

# Guia de ECMAScript

Guia de referência completo do JavaScript moderno: da sintaxe aos módulos, assincronismo, coleções e especificação ECMA-262.

---

## Objetivo

Apresentar a arquitetura completa do Guia de ECMAScript e sua metodologia de aprendizado:

- Diferenciar a especificação internacional (**ECMA-262**) de seus ambientes de execução (*host environments*).
- Navegar pelas 5 trilhas estruturais: **Fundamentos**, **Organização**, **Estruturas de Dados**, **Assincronismo** e **Referência Rápida**.
- Compreender a progressão sequencial recomendada de estudos.
- Identificar as ferramentas essenciais para execução e experimentação de código moderno.

---

## Mapa do Guia

- O que é ECMAScript?
- ECMAScript vs Ambientes de Execução
- Trilha 1: Fundamentos da Linguagem
- Trilha 2: Organização de Código
- Trilha 3: Estruturas de Dados
- Trilha 4: Assincronismo
- Trilha 5: Referência Rápida e TC39
- Roteiro Recomendado de Estudos
- Ferramentas de Prática
- Perguntas de Revisão

---

## O que é ECMAScript?

- **Norma Internacional (ECMA-262)**: padronização técnica mantida pelo comitê TC39.
- **Núcleo da Linguagem**: define gramática, tipos, operadores, estruturas de controle e objetos embutidos.
- **Evolução Contínua**: ciclo anual de lançamento com propostas em quatro estágios (*stages*).
- **Independência de Plataforma**: o código puro funciona em qualquer motor compatível (V8, SpiderMonkey, JSC).

---

## ECMAScript vs Ambientes de Execução

Compare as responsabilidades do núcleo da linguagem e de seus ambientes hospedeiros:

| Dimensão | ECMAScript (ECMA-262) | Navegador Web | Node.js / Servidor |
| :--- | :--- | :--- | :--- |
| **Escopo Global** | `globalThis` | `window`, `document` | `global`, `process` |
| **Entrada e Saída** | Não especificado | Árvore DOM, Eventos | Sistema de arquivos (`node:fs`) |
| **Comunicação** | Não especificado | `fetch`, WebSocket | `node:http`, `node:net` |
| **Módulos** | Sintaxe `import` / `export` | `<script type="module">` | ES Modules e CommonJS |

- O guia foca no núcleo padronizado, compartilhado por todas as plataformas.

---

## Trilha 1: Fundamentos da Linguagem

- **Introdução e Ecossistema**: histórico, motores de execução e criação do primeiro script.
- **Tipos de Dados e Coerção**: primitivos, referências, igualdade estrita e conversões automáticas.
- **Variáveis e Escopo**: `const`, `let`, `var`, escopo léxico, hoisting e Temporal Dead Zone.
- **Expressões e Operadores**: aritmética, lógica, comparações e regras de precedência.
- **Estruturas de Controle**: condicionais com `if`/`switch` e laços de repetição com `for`/`while`.

---

## Trilha 2: Organização de Código

- **Funções e Closures**:
  - Funções de primeira classe e funções de alta ordem.
  - Arrow functions, parâmetros padrão e escopo léxico preservado por closures.
- **Módulos ES (ESM)**:
  - Exportações nomeadas e padrão (*default*).
  - Importação estática e dinâmica via `import()`.
- **Tratamento de Erros**:
  - Captura controlada com `try`, `catch` e `finally`.
  - Instanciação de classes derivadas de `Error`.

---

## Trilha 3: Estruturas de Dados

- **Texto e Números**: template literals, interpolação, formato IEEE 754, `BigInt` e biblioteca `Math`.
- **Arrays e Métodos Funcionais**: operações imutáveis com `map()`, `filter()`, `reduce()` e `toSorted()`.
- **Objetos e Classes**: objetos literais, métodos, classes ES6 e herança via protótipos.
- **Datas e Coleções Modernas**: objeto `Date`, conjuntos únicos (`Set`) e dicionários chave-valor (`Map`).
- **Expressões Regulares**: padrões textuais para busca, validação, extração e substituição.

---

## Trilha 4: Assincronismo

- **Event Loop e Concorrência**:
  - Modelo de execução baseado em thread única com I/O não bloqueante.
  - Separação entre Call Stack, Task Queue e Microtask Queue.
- **Promises**:
  - Estados fundamentais: `pending`, `fulfilled` e `rejected`.
  - Encadeamento com `.then()`, `.catch()` e combinadores como `Promise.all()`.
- **Async/Await**:
  - Escrita de fluxos assíncronos com legibilidade sequencial.
  - Tratamento de exceções com blocos `try/catch` convencionais.

---

## Trilha 5: Referência Rápida e Evolução

- **Evolução e TC39**:
  - Compreensão do processo de padronização da linguagem.
  - Como propostas evoluem do estágio 0 (*strawman*) ao estágio 4 (*finished*).
- **Guia de Referência**:
  - Consulta compacta às assinaturas e métodos dos objetos embutidos.
- **JavaScript vs Python**:
  - Mapeamento comparativo de sintaxe para desenvolvedores de outras linguagens.
- **Casos Peculiares**:
  - Análise didática de armadilhas históricas e comportamentos singulares de coerção.

---

## Roteiro Recomendado de Estudos

1. **Bases da Sintaxe**: compreenda o ecossistema, os tipos de dados e a declaração com `const`/`let`.
2. **Controle de Fluxo**: pratique operadores relacionais e laços de repetição.
3. **Modularização**: escreva funções reutilizáveis e separe arquivos com ES Modules.
4. **Coleções de Dados**: domine métodos funcionais de array e modelagem com classes.
5. **Programação Concorrente**: gerencie operações assíncronas com Promises e Async/Await.
6. **Aprofundamento**: consulte o guia de referência e entenda os estágios do TC39.

---

## Ferramentas de Prática

- **Node.js no Terminal**:
  - Execução direta com `$ node script.js`.
  - Sessão interativa imediata no terminal com o comando `$ node`.
- **DevTools do Navegador**:
  - Console interativo acessível em qualquer página via tecla <kbd>F12</kbd>.
- **VS Code**:
  - Realce de sintaxe, IntelliSense para JavaScript e terminal integrado.
- **Playgrounds Online**:
  - Testes rápidos sem instalação local via TypeScript Playground ou MDN Web Docs.

---

## Perguntas de Revisão

- O que diferencia o padrão ECMAScript do ambiente hospedeiro onde ele executa?
- Por que a declaração `const` é recomendada por padrão em código moderno?
- Qual é o benefício de usar métodos funcionais de array em vez de laços `for` clássicos?
- Como o Event Loop permite que JavaScript trate requisições sem travar a execução?
- Qual é o papel do comitê TC39 na evolução da linguagem?
- Como a introdução de `async` e `await` simplificou o consumo de Promises?

---

## Resumo do Guia

- **Base Normativa**: fundamentado estritamente na especificação oficial ECMA-262.
- **Modernidade e Clareza**: focado em práticas idiomáticas contemporâneas sem código legado.
- **Independência de Ambiente**: lógica pura aproveitável no navegador, em servidores ou em dispositivos embarcados.
- **Estrutura Progressiva**: do primeiro valor primitivo até a orquestração assíncrona de alto nível.
