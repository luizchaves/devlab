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
title: "JavaScript: Módulos ES (ESM)"
description: "Sistemas de módulos, CommonJS vs ES Modules, import/export nomeados, default e imports dinâmicos."
---

<!-- _class: lead -->

# JavaScript: Módulos ES (ESM)

Modularização de código, evolução histórica, CommonJS vs ES Modules, import/export estáticos e dynamic imports.

---

## Objetivos da Aula

- **Evolução**: Compreender a transição de scripts globais para módulos nativos (ESM).
- **Sintaxe**: Dominar exportações nomeadas (Named Exports) e exportação padrão (Default Export).
- **Ecossistema**: Comparar o sistema CommonJS (`require`) do Node com o padrão ES Modules (`import`).
- **Dynamic Import**: Aplicar `import()` assíncrono para carregamento sob demanda.

---

## Evolução da Modularização em JavaScript

<div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85em; margin-top: 10px;">
  <div style="border: 1px solid #94a3b8; border-radius: 6px; padding: 8px 12px; background: #f8fafc;">
    <strong>1. Global Scripts & IIFE</strong>: Conflitos de escopo global e dependência de ordem das tags <code>&lt;script&gt;</code>.
  </div>
  <div style="border: 1px solid #0284c7; border-radius: 6px; padding: 8px 12px; background: #f0f9ff;">
    <strong>2. CommonJS (CJS)</strong>: Adotado pelo Node.js inicial usando <code>require()</code> e <code>module.exports</code> (Síncrono).
  </div>
  <div style="border: 1px solid #16a34a; border-radius: 6px; padding: 8px 12px; background: #f0fdf4;">
    <strong>3. ES Modules (ESM)</strong>: Padrão oficial do ES6+ com <code>import</code> / <code>export</code> nativos, assíncrono e estaticamente analisável.
  </div>
</div>

---

## Exportações Nomeadas (Named Exports)

Permite exportar múltiplos valores de um mesmo arquivo. A importação deve usar **os mesmos nomes entre chaves `{}`**:

```javascript
// mathUtils.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

```javascript
// app.js
import { PI, add, multiply as mult } from "./mathUtils.js";

console.log(add(2, 3)); // 5
console.log(mult(4, 2)); // 8
```

---

## Exportação Padrão (Default Export)

Permite definir **uma única exportação principal** por arquivo. O importador pode escolher qualquer nome ao importar:

```javascript
// Logger.js
export default class Logger {
  log(message) {
    console.log(`[LOG]: ${message}`);
  }
}
```

```javascript
// app.js (sem chaves na importação!)
import CustomLogger from "./Logger.js";

const logger = new CustomLogger();
logger.log("Sistema inicializado");
```

---

## Comparativo: ESM vs CommonJS

| Característica | ES Modules (ESM) | CommonJS (CJS) |
| :--- | :--- | :--- |
| **Sintaxe** | `import` / `export` | `require()` / `module.exports` |
| **Análise** | Estática (em tempo de compilação) | Dinâmica (em tempo de execução) |
| **Tree Shaking** | Suportado por empacotadores (Vite/Rollup) | Dificultado por ser dinâmico |
| **Ambiente** | Navegadores nativos e Node.js moderno | Node.js clássico |
| **Configuração Node** | `"type": "module"` no `package.json` | Padrão sem `"type": "module"` |

---

## Imports Dinâmicos (`import()`)

Para carregamento de código sob demanda (*lazy loading*), a função `import()` retorna uma **Promise**:

```javascript
// O módulo só será baixado e executado quando o botão for clicado!
button.addEventListener("click", async () => {
  try {
    const { chartRender } = await import("./analytics.js");
    chartRender();
  } catch (error) {
    console.error("Erro ao carregar o módulo de gráficos", error);
  }
});
```

- **Vantagem**: Reduz o tamanho do pacote inicial (*bundle*) da aplicação web.

---

## Resumo & Revisão

- Use **Named Exports** (`export const foo`) para utilitários e múltiplos componentes.
- Use **Default Export** (`export default foo`) para o recurso principal do arquivo.
- **ESM** é o padrão moderno e oficial do JavaScript suportado em navegadores e Node.js.
- **Dynamic Imports** (`import()`) permitem divisão de código (*Code Splitting*) e carregamento assíncrono.

---

## Referências & Links Úteis

- **MDN**: [Módulos JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules)
- **MDN**: [export](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/export)
- **MDN**: [import](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/import)
