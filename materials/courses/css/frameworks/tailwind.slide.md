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
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "CSS: Tailwind CSS (Utility-First)"
description: "Introdução ao Tailwind CSS, conceito Utility-First, classes de flexbox, grid, espaçamentos, variantes de estado e dark mode."
---

<!-- _class: lead -->

# Tailwind CSS (Utility-First)

Desenvolvimento ágil com classes utilitárias atômicas: conceito Utility-First, nomenclatura intuitiva, variantes de estado e modo escuro.

---

## Objetivos

Compreender o paradigma Utility-First com Tailwind CSS:

- Entender a filosofia **Utility-First** em comparação com frameworks tradicionais baseados em componentes.
- Aplicar classes de **Flexbox, Grid, Espaçamentos e Tipografia**.
- Utilizar **variantes de estado** (`hover:`, `focus:`, `disabled:`).
- Aplicar variantes responsivas (`sm:`, `md:`, `lg:`) e modo escuro (`dark:`).

---

## Filosofia Utility-First

Em vez de escrever classes semânticas personalizadas (`.btn-card`), você combina pequenas classes utilitárias de propósito único direto no HTML:

```html
<!-- Botão estilizado com Tailwind CSS -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
  Salvar Alterações
</button>
```

- **`bg-blue-600`**: Cor de fundo azul.
- **`hover:bg-blue-700`**: Muda a cor de fundo ao passar o mouse.
- **`py-2 px-4`**: Padding vertical de 0.5rem e horizontal de 1rem.

---

## Variantes Responsivas e de Estado

Tailwind usa prefixos para aplicar utilitários condicionalmente:

- **Modo Escuro**: `dark:bg-slate-900 dark:text-white`.
- **Breakpoints Responsivos**: `sm:`, `md:`, `lg:`, `xl:`.

```html
<!-- Grid responsivo: 1 coluna no mobile, 3 colunas em desktop (≥768px) -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
  <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">Card 1</div>
  <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">Card 2</div>
  <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">Card 3</div>
</div>
```

---

## Exercício Prático & Desafio

- **Exercício**: Crie um cartão de perfil estilizado com Tailwind contendo foto (`rounded-full`), nome (`font-bold text-xl`) e um botão (`bg-emerald-600`).
- **Desafio Extra**: Adicione suporte a tema escuro usando as variantes `dark:bg-gray-900` e `dark:text-gray-100`.

---

## Resumo & Revisão

- **Utility-First** elimina a necessidade de inventar nomes de classe arbitrários.
- As variantes de estado (`hover:`, `focus:`, `dark:`, `md:`) funcionam de forma combinável e previsível.
- Em projetos de produção, o compilador do Tailwind remove todas as classes não utilizadas (*PurgeCSS / JIT*).

---

## Referências & Links Úteis

- **Tailwind CSS Official Docs**: [tailwindcss.com](https://tailwindcss.com/docs/installation)
- **Tailwind Cheat Sheet**: [nerdcave.com/tailwind-cheat-sheet](https://nerdcave.com/tailwind-cheat-sheet)
