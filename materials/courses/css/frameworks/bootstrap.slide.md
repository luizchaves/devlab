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
title: "CSS: Framework Bootstrap 5"
description: "Introdução ao Bootstrap 5, CDN, sistema de Grid de 12 colunas, componentes pré-estilizados e classes utilitárias."
---

<!-- _class: lead -->

# Framework Bootstrap 5

Prototipagem rápida de interfaces responsivas: CDN, sistema de Grid de 12 colunas (`container`, `row`, `col`), componentes e utilitários.

---

## Objetivos

Aprender a acelerar o desenvolvimento de UI com Bootstrap 5:

- Carregar o Bootstrap via **CDN**.
- Dominar o sistema de **Grid de 12 colunas** (`.container`, `.row`, `.col-*`).
- Utilizar componentes prontos como botões (`.btn`), cartões (`.card`) e alertas (`.alert`).
- Aplicar **classes utilitárias** de espaçamento, cores e alinhamento.

---

## O Sistema de Grid (12 Colunas)

O Bootstrap divide a largura da página em um grid flexível de **12 colunas**:

```html
<div class="container">
  <div class="row">
    <!-- Ocupa 8 de 12 colunas no desktop (≥768px) -->
    <main class="col-12 col-md-8">Conteúdo Principal</main>
    <!-- Ocupa 4 de 12 colunas no desktop -->
    <aside class="col-12 col-md-4">Barra Lateral</aside>
  </div>
</div>
```

- Breakpoints do Bootstrap: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1200px).

---

## Componentes Prontos

```html
<!-- Botão Primário -->
<button type="button" class="btn btn-primary">Salvar Alterações</button>

<!-- Alerta de Sucesso -->
<div class="alert alert-success" role="alert">
  Operação realizada com sucesso!
</div>

<!-- Card do Bootstrap -->
<div class="card p-3 shadow-sm">
  <h5 class="card-title">Título do Card</h5>
  <p class="card-text">Conteúdo estilizado com Bootstrap.</p>
</div>
```

---

## Classes Utilitárias de Espaçamento e Cores

- **Espaçamento**: `m-*` (margin), `p-*` (padding) de 0 a 5.
  - Ex: `mb-3` (margin-bottom 3), `px-4` (padding horizontal 4).
- **Cores de Texto e Fundo**: `.text-primary`, `.text-danger`, `.bg-light`, `.bg-dark`.
- **Flexbox Utilitário**: `.d-flex`, `.justify-content-center`, `.align-items-center`.

---

## Exercício Prático & Desafio

- **Exercício**: Crie um layout com 3 colunas iguais (`col-md-4`) contendo cartões (`.card`) com títulos e botões `.btn-outline-primary`.
- **Desafio Extra**: Monte uma barra de navegação responsiva usando o componente `navbar` do Bootstrap 5.

---

## Resumo & Revisão

- O sistema de grid do Bootstrap é baseado em **12 colunas** e Flexbox.
- Sempre envolva `.col` dentro de uma `.row` e uma `.row` dentro de um `.container`.
- Use utilitários (`mb-3`, `d-flex`, `text-center`) para micro-ajustes sem escrever CSS customizado.

---

## Referências & Links Úteis

- **Bootstrap 5 Official Docs**: [getbootstrap.com](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- **Bootstrap Grid System**: [Grid Layout Guide](https://getbootstrap.com/docs/5.3/layout/grid/)
