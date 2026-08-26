---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: ECMAScript"
description: "Slides completos da aula de introdução a JavaScript, ECMAScript, Web APIs e Runtimes."
---

<!-- _class: lead -->

# JavaScript: ECMAScript

Origem, padronização, ecossistema, Web APIs versus Runtimes (Node.js, Deno, Bun) e execução.

---

## Objetivo

Compreender o ecossistema e os fundamentos da linguagem JavaScript:

- Entender a origem do JavaScript e a padronização pelo **ECMAScript** (ECMA-262 / TC39).
- Diferenciar a linguagem base (ECMAScript) das **Web APIs** (Navegador) e **Node.js APIs** (Servidor).
- Conhecer onde o código executa (Navegadores, Runtimes de Servidor e Ferramentas).
- Reconhecer as características fundamentais da linguagem (alto nível, tipagem dinâmica, tipagem fraca, multiparadigma, protótipos, ASI).
- Configurar e rodar scripts no Node.js, Deno, Bun e no navegador.

---

## Por Que JavaScript Importa?

- **No Navegador**: Adiciona interatividade, valida formulários, manipula o DOM e consome APIs sem recarregar a página.
- **No Servidor**: Com o surgimento do Node.js (2009), permite construir APIs HTTP, manipular arquivos e integrar bancos de dados.
- **Nas Ferramentas**: Automatiza tarefas de build, testes, linting e empacotamento (Vite, npm, ESLint).

*JavaScript não substitui HTML nem CSS: HTML estrutura, CSS estiliza e JavaScript adiciona comportamento.*

---

## Origem e Padronização

- **1995**: Criado por Brendan Eich na Netscape para o navegador Netscape Navigator.
- **Padronização**: Para evitar incompatibilidade entre navegadores, a Ecma International criou o padrão **ECMA-262** (ECMAScript).
- **TC39**: Comitê que gerencia a evolução contínua da linguagem (Edição ECMAScript 2026).

---

## Origem e Padronização: Arquitetura

```txt
┌─────────────────────────────────────────────────────────────┐
│                        ECMAScript                           │
│     (Especificação técnica padrão mantida pelo TC39)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       JavaScript (Navegador)          Node.js / Deno / Bun
    (ECMAScript + Web APIs/DOM)     (ECMAScript + Native APIs)
```

---

## JavaScript, ECMAScript e APIs

| Termo | O que é / Papel | Exemplos |
| --- | --- | --- |
| **ECMAScript** | Especificação da linguagem base | Variáveis, Funções, Objects, Arrays, Promises, Módulos |
| **JavaScript** | Implementação prática do padrão | Código em arquivos `.js` ou `<script>` |
| **Web APIs** | Recursos fornecidos pelo Navegador | `document`, `fetch`, `localStorage`, `console`, timers |
| **Node.js APIs** | Recursos do ambiente de servidor | `node:fs`, `node:http`, `node:path`, `process` |
| **npm** | Gerenciador e ecossistema de pacotes | Express, Vite, Prisma, Chart.js |

---

## Onde o Código Executa?

- **Navegador**: Executa scripts em páginas Web com acesso ao DOM e contexto visual.
- **Runtimes no Servidor**:
  - **Node.js**: O runtime mais consagrado do ecossistema servidor.
  - **Deno**: Runtime moderno com TypeScript integrado e permissões de segurança.
  - **Bun**: Runtime ultrarrápido com bundler, test runner e gerenciador de pacotes nativos.
- **Ferramentas de Desenvolvimento**: Scripts de CLI, build e testes automatizados.

---

## Principais Características da Linguagem

- **Alto nível**: Gerenciamento de memória e alocação automáticos (Garbage Collector).
- **Tipagem dinâmica**: O tipo pertence ao **valor** e não à variável.
- **Tipagem fraca**: Realiza coerções automáticas em algumas operações (`'5' * 2` resulta em `10`).
- **Multiparadigma**: Suporta programação funcional, orientada a objetos e imperativa.
- **Baseada em Protótipos**: Objetos herdam propriedades diretamente de outros objetos.
- **ASI (Automatic Semicolon Insertion)**: Ponto e vírgula pode ser inserido automaticamente pelo motor.

---

## Executando JavaScript no Terminal: Runtimes

### Node.js
```bash
node main.js
```

### Deno
```bash
deno run main.js
```

### Bun
```bash
bun run main.js
```

---

## Executando JavaScript no Terminal: REPL

### Modo Interativo (REPL)
Basta digitar `node`, `deno` ou `bun` no terminal sem argumentos para abrir o prompt interativo e testar expressões ao vivo.

---

## Executando JavaScript no Navegador: Console

Abra o navegador (<kbd>F12</kbd> ou <kbd>Ctrl+Shift+I</kbd>), acesse a aba **Console** e digite expressões diretamente.

---

## Executando JavaScript no Navegador: Tag `<script>`

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Exemplo JS</title>
  </head>
  <body>
    <h1>JavaScript no Navegador</h1>
    <script src="main.js"></script>
  </body>
</html>
```

---

## Resumo da Aula

- **ECMAScript** é a especificação; **JavaScript** é a implementação.
- **Web APIs** (`document`, `fetch`) pertencem ao navegador; **Node APIs** (`node:fs`) pertencem ao servidor.
- JavaScript possui **tipagem dinâmica**, **alto nível** e **modelo multiparadigma**.
- Você pode rodar JavaScript tanto no navegador (DevTools/HTML) quanto no terminal via runtimes modernos (**Node.js**, **Deno**, **Bun**).
