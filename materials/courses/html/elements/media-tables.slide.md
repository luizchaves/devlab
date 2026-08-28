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
title: "HTML: Imagens e Tabelas"
description: "Inserção acessível de imagens, elementos figure/figcaption e construção de tabelas com a tag table."
---

<!-- _class: lead -->

# Imagens e Tabelas

Mídia visual acessível (`<img>`, `<figure>`, `<figcaption>`) e exibição de dados tabulares (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`).

---

## Objetivos

Dominar a exibição de imagens e dados tabulares:

- Inserir imagens acessíveis com o atributo **`alt`** obrigatório.
- Agrupar mídias e legendas semânticas com **`<figure>`** e **`<figcaption>`**.
- Estruturar tabelas de dados completas utilizando **`<table>`**, **`<thead>`**, **`<tbody>`**, **`<tr>`**, **`<th>`** e **`<td>`**.

---

## Por Que Isso Importa?

- **Acessibilidade de Imagens**: Usuários visuais e leitores de tela precisam compreender o conteúdo de mídias.
- **Prevenção de CLS**: Declarar `width` e `height` evita que o layout "pule" durante o carregamento.
- **Dados Tabulares**: Tabelas são o formato nativo para comparar e apresentar dados bidimensionais.

---

## Imagens em HTML (`<img>`)

- Elemento vazio (*void element*) sem tag de fechamento.
- **`src`**: Caminho relativo ou URL da imagem (`.png`, `.jpg`, `.svg`, `.webp`).
- **`alt`**: Descrição textual obrigatória para leitores de tela e SEO.

```html
<img src="logo.png" 
     alt="Logotipo oficial do DevLab em azul" 
     width="300" 
     height="100">
```

*Nota: Se a imagem for puramente decorativa, use `alt=""` vazio.*

---

## Agrupando Mídia com Legendas (`<figure>`)

Associa imagens, gráficos ou diagramas a uma legenda descritiva:

```html
<figure>
  <img src="arquitetura.png" 
       alt="Diagrama da arquitetura cliente/servidor HTTP">
  <figcaption>Figura 1: Fluxo de requisição e resposta na Web.</figcaption>
</figure>
```

- **`<figure>`**: Contêiner semântico da mídia.
- **`<figcaption>`**: Legenda vinculada à figura.

---

## Estrutura de Tabelas (`<table>`)

- **`<table>`**: Bloco contêiner da tabela.
- **`<thead>` / `<tbody>`**: Cabeçalho e corpo de dados.
- **`<tr>` (Table Row)**: Linha da tabela.
- **`<th>` (Table Header)**: Célula de cabeçalho (em negrito e centralizada).
- **`<td>` (Table Data)**: Célula de dados comuns.

---

## Exemplo de Tabela Estruturada

```html
<table>
  <thead>
    <tr>
      <th>Linguagem</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML</td>
      <td>Marcação</td>
    </tr>
    <tr>
      <td>JavaScript</td>
      <td>Programação</td>
    </tr>
  </tbody>
</table>
```

---

## Exercício Prático & Desafio

- **Exercício**: Crie uma figura (`<figure>`) contendo uma imagem e uma legenda explicativa (`<figcaption>`).
- **Desafio Extra**: Monte uma tabela de 3 colunas (Curso, Carga Horária, Nível) com `<thead>`, `<tbody>` e bordas estruturadas.

---

## Resumo & Revisão

- Sempre inclua o atributo **`alt`** em todas as tags `<img>`.
- Defina **`width` e `height`** para otimizar a performance de carregamento (CLS).
- Use **`<figure>`** e **`<figcaption>`** para associar legendas a imagens.
- Use tabelas **apenas para dados tabulares**, nunca para criar layout de páginas.

---

## Referências & Links Úteis

- **MDN Web Docs**: [Images in HTML](https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Howto/Add_an_image_to_a_web_page)
- **MDN Web Docs**: [HTML Table Basics](https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Tables/Basics)
