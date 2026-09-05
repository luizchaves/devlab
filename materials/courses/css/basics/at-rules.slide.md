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
title: "CSS: At-Rules (@rules) e Diretivas"
description: "Estrutura de at-rules no CSS: @import, @font-face, @keyframes, @supports, @layer e variáveis CSS."
---

<!-- _class: lead -->

# At-Rules (@rules) e Diretivas

Instruções especiais do CSS iniciadas com `@`: `@import`, `@font-face`, `@keyframes`, `@supports`, `@layer` e custom properties.

---

## Objetivos

Compreender e aplicar as diretivas avançadas do CSS:

- Entender a sintaxe e escopo das **At-Rules** (`@`).
- Carregar fontes personalizadas com **`@font-face`**.
- Criar animações de keyframe com **`@keyframes`**.
- Testar suporte do navegador com **`@supports`**.
- Usar variáveis CSS nativas (**Custom Properties**).

---

## Por Que Isso Importa?

- **Modularidade**: `@import` e `@layer` organizam arquiteturas de arquivos CSS grandes.
- **Tipografia**: `@font-face` permite incorporar fontes web (.woff2) exclusivas.
- **Resiliência**: `@supports` garante *progressive enhancement* para recursos CSS modernos.

---

## `@font-face`: Fontes Personalizadas

Permite carregar arquivos de fonte externos no projeto:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'Inter', sans-serif;
}
```

---

## `@keyframes` e `@supports`

```css
/* Animação CSS */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal {
  animation: fadeIn 0.3s ease-out;
}

/* Feature Query */
@supports (display: grid) {
  .container { display: grid; }
}
```

---

## Variáveis CSS (Custom Properties)

Variáveis nativas declaradas com `--` e lidas com `var()`:

```css
:root {
  --primary-color: #2563eb;
  --spacing-base: 1rem;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing-base);
}
```

*Vantagem: Variáveis CSS respondem a media queries e escopo local.*

---

## Exercício Prático & Desafio

- **Exercício**: Declare uma variável `--main-bg` em `:root` e aplique-a ao fundo do documento `body`.
- **Desafio Extra**: Crie uma animação `@keyframes pulse` que altera a escala de um botão ao passar o mouse.

---

## Resumo & Revisão

- Declare **variáveis CSS** em `:root` para valores globais (cores, fontes).
- `@font-face` exige `font-display: swap` para otimizar carregamento.
- Use `@supports` para testar recursos experimentais sem quebrar navegadores antigos.

---

## Referências & Links Úteis

- **MDN Web Docs**: [CSS At-rules](https://developer.mozilla.org/pt-BR/docs/Web/CSS/At-rule)
- **MDN Web Docs**: [Using CSS Custom Properties](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Using_CSS_custom_properties)
