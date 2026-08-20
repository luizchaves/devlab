---
title: 'CSS: Fundamentos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# CSS: Fundamentos

## Ideia central

- CSS é linguagem de apresentação (Cascading Style Sheets)
- Descreve a aparência e layout do HTML
- Separa estrutura (HTML) de apresentação (CSS)

## Objetivo

- Escrever CSS básico do zero
- Conectar folha de estilos externa
- Selecionar elementos com precisão
- Entender cascata, especificidade e herança
- Trabalhar com variáveis e media queries

## Sintaxe

- Regra CSS
  - Seletor
  - Bloco de declarações (`{ ... }`)
  - Declaração (`propriedade: valor;`)
- Comentários
  - `/* texto */`

## Aplicação do CSS

- Inline
  - Atributo `style="..."`
  - Uso em testes rápidos ou JS
- Interno
  - Tag `<style>` no `<head>`
  - Uso em páginas isoladas
- Externo
  - Tag `<link rel="stylesheet" href="css/style.css" />`
  - Recomendado para produção e reutilização

## Cascata e especificidade

- Fatores de decisão
  - Importância (`!important`)
  - Especificidade (ID > Classe > Elemento)
  - Ordem de leitura (última vence)
  - Herança (`color`, `font-family`)
- Contêineres genéricos
  - `<div>` (bloco)
  - `<span>` (inline)

## Propriedades e valores

- Grupos de propriedades
  - Texto (`color`, `font-size`, `font-family`)
  - Espaço (`margin`, `padding`, `gap`)
  - Caixa (`width`, `max-width`, `border`)
  - Fundo (`background-color`)
- Shorthand properties
  - `margin`, `padding`, `border`, `font`, `background`
  - Redefinem valores ocultos para o padrão
- Formatos de cor
  - Nominais (`red`, `blue`)
  - Hexadecimal (`#2563eb`)
  - `rgb()` / `rgba()`
  - `hsl()`
  - `oklch()` (brilho uniforme)

## Variáveis CSS

- Custom properties
  - Declaração com `--nome: valor` em `:root`
  - Uso com `var(--nome)`
- Casos de uso
  - Consistência de paleta e espaçamento
  - Temas claro e escuro (*Light / Dark mode*)

## Seletores

- Tipos principais
  - Elemento (`body`, `p`)
  - ID (`#principal`)
  - Classe (`.cartao`)
  - Descendente (`.cartao p`)
  - Irmão adjacente (`li + li`)
  - Pseudo-classe (`:hover`)
- Classes utilitárias
  - Responsabilidade única (ex.: `.text-center`)
  - Base de frameworks (Bootstrap, Tailwind CSS)

## At-rules

- Instruções com `@`
  - `@font-face` (fontes personalizadas)
  - `@import` (importação de folhas)
  - `@keyframes` (animações)
  - `@supports` (feature queries)
  - `@media` (media queries)
- Google Fonts
  - Gera regras `@font-face` automaticamente

## Media queries

- Estrutura
  - `@media media-type and (media-feature)`
- Exemplos comuns
  - Impressão (`@media print`)
  - Telas e pontos de interrupção (`min-width`)
  - Preferências do usuário (`prefers-color-scheme: dark`)
