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
title: "Web APIs: Fullscreen API"
description: "Slides completos do tópico Web APIs: Fullscreen API."
---

<!-- _class: lead -->

# Web APIs: Fullscreen API

Tela cheia é um modo, não uma janela · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Entrar e sair da tela cheia com `requestFullscreen()` e `document.exitFullscreen()`.
- Consultar `document.fullscreenElement` para descobrir o estado atual em vez de guardá-lo à parte.
- Explicar por que a solicitação precisa nascer de um gesto do usuário e falha fora dele.
- Sincronizar a interface com os eventos `fullscreenchange` e `fullscreenerror`.
- Reconhecer quando a tela cheia ajuda (mídia, mapa, apresentação) e quando ela só atrapalha a navegação.

---

## Mapa do Tópico

- **Tela cheia é um modo, não uma janela**.
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

## Tela cheia é um modo, não uma janela

A Fullscreen API não abre nada.

- **Entrar em tela cheia**: A chamada fora de um gesto é rejeitada.
- **Sair da tela cheia**: `Esc` e o sistema operacional sempre funcionam.
- **Saber o estado atual**: `document.fullscreenElement` é a fonte da verdade.

---

## Tela cheia é um modo, não uma janela: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
button.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    player.requestFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  button.textContent = document.fullscreenElement ? 'Sair' : 'Tela cheia';
});
```

---

## Modelo da API

A API não cria uma nova janela.

- **`element.requestFullscreen()`**: Solicita tela cheia para um elemento.
- **`document.exitFullscreen()`**: Solicita saída da tela cheia.
- **`document.fullscreenElement`**: Indica qual elemento está em tela cheia.
- **`document.fullscreenEnabled`**: Indica se a funcionalidade está disponível.
- **`fullscreenchange`**: Evento disparado na entrada ou saída.

---

## Exemplo com preview e código

O exemplo importado mostra um elemento entrando e saindo de tela cheia a partir de um botão.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/fullscreen.
- html" height="20rem" label="fullscreen.
- <SourceCode path="examples/courses/web-api/browser-web-apis/fullscreen.

---

## Cuidados práticos

Fullscreen pode ser bloqueado por política de iframe ou por ausência de gesto do usuário.

- **Preview em iframe**: Abra em aba própria se o navegador bloquear.
- **Botão de alternância**: Leia `document.fullscreenElement` antes de decidir.
- **Erro de solicitação**: Trate a Promise rejeitada por `requestFullscreen()`.
- **Layout em tela cheia**: Use CSS para adaptar controles e tamanhos.

---

## Quando usar, e quando não usar?

Tela cheia remove os pontos de referência do navegador, inclusive o botão de voltar.

- **Vídeo, mapa ou visualização de imagem**: O conteúdo se beneficia de cada pixel disponível.
- **Apresentação de slides ou modo de leitura**: O usuário pediu explicitamente para se concentrar.
- **Jogo em canvas**: O gesto do mouse passa a ser do jogo.
- **Formulário ou fluxo de compra**: O usuário precisa da barra de endereços e do botão voltar.
- **Chamar ao carregar a página**: A solicitação é rejeitada e passa a impressão de tentativa de sequestro da tela.

---

## Executando

1. Abra o exemplo `fullscreen.html`.
2. Clique no botão de tela cheia.
3. Saia com o botão da página ou com <kbd>Esc</kbd>.
4. Observe como o código usa `fullscreenElement` para saber o estado atual.

---

## Exercício Prático

1. Adicione um contador visual que indique se a página está em tela cheia.
2. Registre `fullscreenchange` no console.
3. Mostre uma mensagem quando `fullscreenEnabled` for falso.

---

## Perguntas de revisão

1. Por que a entrada em tela cheia precisa partir de um gesto do usuário?
2. Qual a fonte da verdade sobre o estado atual?
3. Por que guardar o estado em uma variável própria costuma dar errado?
4. Qual a diferença entre `fullscreenchange` e `fullscreenerror`?
5. O que `document.fullscreenEnabled` informa?

---

## Resumo do Tópico

- **Tela cheia é um modo, não uma janela**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
