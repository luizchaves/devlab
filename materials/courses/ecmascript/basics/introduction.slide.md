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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Introdução e Ecossistema"
description: "Origem do JavaScript, especificação ECMA-262, comitê TC39, motores de execução V8 e ambientes."
---

<!-- _class: lead -->

# JavaScript: Introdução e Ecossistema

Origem da linguagem, especificação ECMA-262, comitê TC39, motores JIT e ambientes de execução.

---

## Objetivos da Aula

- **Histórico & Origem**: Compreender a criação do JavaScript e a evolução dos nomes comerciais.
- **Padronização**: Diferenciar JavaScript (implementação) de ECMAScript (especificação ECMA-262).
- **Processo TC39**: Identificar o ciclo de vida de propostas (Stage 0 a Stage 4).
- **Motores & Ambientes**: Analisar a arquitetura do motor V8 e separar ECMAScript de Web/Node APIs.

---

## Por Que JavaScript Importa?

- **Linguagem Nativa da Web**: Única linguagem de programação executada nativamente por todos os navegadores.
- **Ecossistema Unificado**: Permite construir front-end (DOM/React), back-end (Node.js/Express) e ferramentas CLI.
- **Desempenho Moderno**: Motores com compilação JIT (Just-In-Time) transformam código dinâmico em código de máquina.

> **Regra Fundamental**: HTML estrutura, CSS estiliza, JavaScript adiciona comportamento.

---

## Origem e Evolução dos Nomes

Criada em **maio de 1995** por Brendan Eich na Netscape em apenas 10 dias para o Netscape Navigator.

| Nome | Ano | Contexto e Motivação |
| :--- | :--- | :--- |
| **Mocha** | Maio / 1995 | Nome de código interno do protótipo desenvolvido por Brendan Eich. |
| **LiveScript** | Set/ 1995 | Primeiro nome comercial no lançamento beta do Netscape 2.0. |
| **JavaScript** | Dez / 1995 | Parceria de marketing com a Sun Microsystems para aproveitar o hype do Java. |
| **ECMAScript** | 1996 - Hoje | Nome oficial do padrão internacional mantido pela Ecma (**ECMA-262**). |

---

## JavaScript vs Java

Apesar do nome similar por razões históricas de marketing, são linguagens totalmente distintas:

```javascript
// JavaScript: Dinâmica, multiparadigma, prototipada
const user = { name: "DevLab", active: true };
console.log(typeof user); // "object"
```

- **Paradigma**: Java é estaticamente tipada e baseada em classes; JS é dinamicamente tipada e baseada em protótipos.
- **Execução**: Java compila para Bytecode em JVM; JS é interpretada/compilada em tempo de execução via JIT.
- **Analogia**: *"Java está para JavaScript assim como Carro está para Carpinteiro"*.

---

## Padronização: ECMAScript e o TC39

- **ECMAScript (ECMA-262)**: A especificação técnica formal da linguagem.
- **TC39 (Technical Committee 39)**: Comitê formado por empresas (Google, Mozilla, Apple, Microsoft) e especialistas que mantém o padrão.
- **Lançamentos Anuais**: Desde a revolução do ES6 (ES2015), o padrão é atualizado anualmente (ES2016, ES2017... ES2026).

---

## O Processo de Propostas do TC39 (5 Estágios)

<div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85em; margin-top: 10px;">
  <div style="border: 1px solid #94a3b8; border-radius: 6px; padding: 8px 12px; background: #f8fafc;">
    <strong>Stage 0 (Strawman)</strong>: Ideia inicial submetida por um membro do TC39.
  </div>
  <div style="border: 1px solid #38bdf8; border-radius: 6px; padding: 8px 12px; background: #f0f9ff;">
    <strong>Stage 1 (Proposal)</strong>: Casos de uso e sintaxe preliminar definidos; campeão (champion) nomeado.
  </div>
  <div style="border: 1px solid #facc15; border-radius: 6px; padding: 8px 12px; background: #fefce8;">
    <strong>Stage 2 (Draft)</strong>: Primeira especificação formal; tipos e semântica estruturados.
  </div>
  <div style="border: 1px solid #fb923c; border-radius: 6px; padding: 8px 12px; background: #fff7ed;">
    <strong>Stage 3 (Candidate)</strong>: Especificação pronta; implementada experimentalmente em navegadores.
  </div>
  <div style="border: 1px solid #4ade80; border-radius: 6px; padding: 8px 12px; background: #f0fdf4;">
    <strong>Stage 4 (Finished)</strong>: Aprovada com testes de conformidade; entra na próxima edição da ECMA-262.
  </div>
</div>

---

## Arquitetura do Motor V8 (JIT Compiler)

O motor V8 (Google Chrome e Node.js) executa código JS combinando interpretação rápida com otimização:

<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 15px; font-size: 0.85em;">
  <div style="border: 2px solid #0284c7; border-radius: 6px; padding: 8px 16px; background: #f0f9ff; width: 90%; text-align: center;">
    <strong>1. Parsing & AST</strong>: Scanner gera tokens e constrói a Abstract Syntax Tree.
  </div>
  <div style="font-weight: bold; color: #0284c7;">↓</div>
  <div style="border: 2px solid #eab308; border-radius: 6px; padding: 8px 16px; background: #fefce8; width: 90%; text-align: center;">
    <strong>2. Ignition (Interpretador)</strong>: Gera e executa Bytecode rapidamente. Coleta dados de profiling.
  </div>
  <div style="font-weight: bold; color: #16a34a;">↓ (Hot Code)</div>
  <div style="border: 2px solid #16a34a; border-radius: 6px; padding: 8px 16px; background: #f0fdf4; width: 90%; text-align: center;">
    <strong>3. TurboFan (Compilador JIT)</strong>: Compila funções frequentes diretamente em Código de Máquina otimizado.
  </div>
</div>

---

## Desotimização (Deopt) no V8

Como JavaScript é dinâmico, se o tipo de um parâmetro mudar abruptamente em código otimizado, o V8 faz **deoptimization**:

```javascript
function add(a, b) {
  return a + b;
}

// O V8 otimiza add() assumindo que a e b são Inteiros
for (let i = 0; i < 10000; i++) add(i, i);

// Mudança de tipo: obriga o TurboFan a desotimizar (Deopt) de volta ao Ignition!
add("texto", 10);
```

- **Boas Práticas**: Manter funções monomórficas (passar sempre os mesmos tipos de dados).

---

## Separação: Linguagem vs Ambiente de Execução

JavaScript = **Núcleo ECMAScript** + **APIs do Hospedeiro (Host Environment)**.

<div style="display: flex; gap: 15px; margin-top: 15px; font-size: 0.85em;">
  <div style="flex: 1; border: 2px solid #0284c7; border-radius: 8px; padding: 12px; background: #f0f9ff;">
    <strong style="color: #0369a1;">Navegador (Browser)</strong><br>
    • ECMAScript (syntax, Array, Object)<br>
    • DOM API (document, element)<br>
    • Fetch API (network requests)<br>
    • Storage (localStorage, IndexedDB)
  </div>
  <div style="flex: 1; border: 2px solid #16a34a; border-radius: 8px; padding: 12px; background: #f0fdf4;">
    <strong style="color: #15803d;">Servidor (Node.js / Bun)</strong><br>
    • ECMAScript (syntax, Array, Object)<br>
    • Node APIs (fs, path, http, crypto)<br>
    • Global process & buffer<br>
    • Sem DOM ou document!
  </div>
</div>

---

## Resumo & Revisão

- **ECMAScript**: Padrão mantido pelo comitê TC39 sob a norma ECMA-262.
- **JavaScript**: Linguagem comercial que implementa o ECMAScript e adiciona APIs.
- **Motor V8**: Usa interpretador (Ignition) e compilador JIT (TurboFan) para alto desempenho.
- **Ambientes**: O código JS roda tanto no navegador (DOM/Web APIs) quanto no servidor (Node.js APIs).

---

## Referências & Links Úteis

- **MDN Web Docs**: [JavaScript - Guia e Referência](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- **Especificação Oficial**: [ECMA-262 Standard](https://tc39.es/ecma262/)
- **TC39**: [Propostas Ativas no GitHub](https://github.com/tc39/proposals)
