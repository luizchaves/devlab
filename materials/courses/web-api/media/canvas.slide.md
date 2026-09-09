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
title: "Web APIs: Canvas API"
description: "Slides completos do tópico Web APIs: Canvas API."
---

<!-- _class: lead -->

# Web APIs: Canvas API

Pixels em vez de elementos · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Explicar a diferença entre desenho imperativo em bitmap e elementos HTML retidos no DOM.
- Obter o contexto 2D e desenhar formas, caminhos e texto com `fillRect()`, `arc()` e `fillText()`.
- Localizar um ponto no sistema de coordenadas do canvas, com origem no canto superior esquerdo.
- Redesenhar a cena a cada quadro com `requestAnimationFrame()`.
- Escolher entre canvas, SVG e elementos HTML conforme a necessidade de acessibilidade, interatividade e volume de elementos.

---

## Mapa do Tópico

- **Pixels em vez de elementos**.
- **Modelo da API**.
- **Exemplo com preview e código**.
- **Cuidados práticos**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Pixels em vez de elementos

Todo o resto deste guia trata de elementos: nós que o navegador guarda, redesenha quando mudam e entrega ao leitor de tela.

- O `<canvas>` funciona pelo princípio oposto.
- Ele é um retângulo de pixels, e cada comando de desenho pinta esses pixels de uma vez, sem deixar registro do que foi desenhado.
- A consequência prática aparece logo no primeiro exercício de animação: para mover um círculo, não existe "o círculo" para alterar.

---

## Pixels em vez de elementos: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const canvas = document.querySelector('#board');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#2563eb';
ctx.fillRect(10, 10, 120, 80);
```

---

## Modelo da API

Canvas não cria botões, parágrafos ou elementos clicáveis por desenho.

- **`<script>`**: Define a resolução interna do bitmap.
- **`canvas.getContext('2d')`**: Retorna a API de desenho 2D.
- **`fillRect()` e `strokeRect()`**: Desenham retângulos preenchidos ou contornados.
- **`beginPath()`, `moveTo()`, `lineTo()`**: Constroem caminhos e linhas.
- **`arc()`**: Desenha círculos e arcos.

---

## Exemplo com preview e código

O exemplo importado demonstra formas, linhas, cores e texto renderizados diretamente no canvas.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/canva.
- html" height="26rem" label="canva.
- <SourceCode path="examples/courses/web-api/browser-web-apis/canva.

---

## Cuidados práticos

O tamanho visual do canvas em CSS pode ser diferente da resolução do bitmap.

- **Canvas responsivo**: Ajuste `width` e `height` internos, não apenas CSS.
- **Tela de alta densidade**: Considere `devicePixelRatio` para evitar desenho borrado.
- **Animação**: Limpe e redesenhe a cena a cada quadro.
- **Acessibilidade**: Forneça texto alternativo fora do canvas quando houver informação importante.

---

## Quando usar, e quando não usar?

Canvas é a ferramenta certa para muitos elementos que mudam a cada quadro, e a errada para poucos elementos que precisam ser lidos.

- **Animação com centenas de partículas ou um jogo 2**: O DOM não sustenta centenas de nós mudando a cada quadro.
- **Gráfico estático que precisa de rótulo acessível**: Cada forma é um elemento, com texto selecionável e `aria-label`.
- **Ícone ou ilustração que escala com o zoom**: Vetor não perde definição; canvas é bitmap.
- **Filtro ou recorte de imagem no navegador**: Acesso direto aos pixels por `getImageData()`.
- **Interface com botões e campos**: Foco, teclado e leitor de tela vêm de graça.

---

## Executando

1. Abra o preview e observe que a imagem não é composta por elementos HTML separados.
2. Altere uma cor ou coordenada no arquivo `canva.html`.
3. Recarregue a página e veja como o desenho muda.
4. Inspecione o DOM e confirme que as formas não aparecem como nós individuais.

---

## Exercício Prático

1. Desenhe um retângulo adicional com cor diferente.
2. Adicione um texto no canto inferior do canvas.
3. Crie uma função `desenharCena()` que agrupe todos os comandos de desenho.

---

## Perguntas de revisão

1. Por que não é possível "mover" uma forma já desenhada no canvas?
2. O que `canvas.getContext('2d')` devolve, e o que acontece se o mesmo contexto for pedido duas vezes?
3. Qual a diferença entre os atributos `width`/`height` da tag e as dimensões definidas por CSS?
4. Onde fica a origem do sistema de coordenadas do canvas?
5. Por que `requestAnimationFrame()` é preferível a `setInterval()` para animar?

---

## Resumo do Tópico

- **Pixels em vez de elementos**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
