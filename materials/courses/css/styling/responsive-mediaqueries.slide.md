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
title: "CSS: Responsividade e Media Queries"
description: "Design responsivo Mobile-First, meta viewport, breakpoints, media queries e preferências do sistema."
---

<!-- _class: lead -->

# Responsividade e Media Queries

Princípios do Responsive Web Design (RWD), estratégia Mobile-First, meta tag `viewport`, breakpoints e `@media`.

---

## Objetivos

Dominar a adaptação de layouts para qualquer tamanho de tela:

- Entender os pilares do **Responsive Web Design (RWD)**.
- Configurar corretamente a meta tag **`viewport`**.
- Aplicar a estratégia **Mobile-First** com `min-width`.
- Utilizar **Media Queries** (`@media`) para adaptar estilos a telas, orientação e preferências do sistema (modo escuro).

---

## A Meta Tag Viewport

Obrigatória no `<head>` de todas as páginas Web para desabilitar o zoom de emulação mobile antigo:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- **`width=device-width`**: Faz a largura lógica do CSS corresponder à largura real da tela do dispositivo.
- **`initial-scale=1.0`**: Define a escala de zoom inicial como 100%.

---

## Estratégia Mobile-First

Consiste em escrever o CSS base pensando em dispositivos móveis (telas pequenas) e adicionar regras para telas maiores através de `min-width`:

```css
/* Estilo Base (Mobile First) */
.container {
  display: flex;
  flex-direction: column;
}

/* Breakpoint para Tablets e Desktops (≥ 768px) */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
```

*Vantagem: Carregamento mais rápido e CSS mais limpo.*

---

## Media Queries de Preferência do Usuário

O CSS moderno permite detectar preferências do sistema operacional do usuário:

```css
/* Detecção de Modo Escuro NATIVO */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0f172a;
    color: #f8fafc;
  }
}

/* Redução de Movimento (Acessibilidade) */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## Exercício Prático & Desafio

- **Exercício**: Crie uma media query `@media (min-width: 768px)` que altera uma lista de 1 coluna para 3 colunas em telas maiores.
- **Desafio Extra**: Implemente suporte ao tema escuro usando `@media (prefers-color-scheme: dark)` alternando as variáveis CSS de cor.

---

## Resumo & Revisão

- Sempre inclua a meta tag **`viewport`** no HTML.
- Adote **Mobile-First**: use `@media (min-width: ...)` progressivamente.
- Defina breakpoints com base no **conteúdo**, e não em marcas específicas de smartphones.
- Respeite preferências de **modo escuro** e **redução de movimento**.

---

## Referências & Links Úteis

- **MDN Web Docs**: [Responsive Design](https://developer.mozilla.org/pt-BR/docs/Learn/CSS/CSS_layout/Responsive_Design)
- **MDN Web Docs**: [Using Media Queries](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_media_queries/Using_media_queries)
