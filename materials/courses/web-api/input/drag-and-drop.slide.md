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
title: "Web APIs: Drag and Drop API"
description: "Slides completos do tópico Web APIs: Drag and Drop API."
---

<!-- _class: lead -->

# Web APIs: Drag and Drop API

O ciclo de um arrasto · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Habilitar uma origem de arrasto com `draggable="true"` e registrar o dado em `dragstart`.
- Explicar por que o destino só aceita o item quando `dragover` cancela o comportamento padrão.
- Ler o dado transportado no evento `drop` e concluir a ação de negócio.
- Limpar o estado visual em `dragend`, mesmo quando o gesto é abandonado.
- Escolher entre a API nativa, eventos de ponteiro e um `<input type="file">` conforme o gesto e o público.

---

## Mapa do Tópico

- **O ciclo de um arrasto**.
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

## O ciclo de um arrasto

Arrastar e soltar não é um evento, é uma sequência deles, disparados em dois elementos diferentes.

- A origem informa o que está sendo levado; o destino precisa declarar que aceita receber, e só então recebe.
- O ponto que quebra quase toda primeira implementação está no meio dessa sequência: por padrão.
- O destino só passa a aceitar quando o código cancela o comportamento padrão do evento `dragover`.

---

## O ciclo de um arrasto: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
source.addEventListener('dragstart', (event) => {
  event.dataTransfer.setData('text/plain', source.id);
});

target.addEventListener('dragover', (event) => {
  event.preventDefault();
});

target.addEventListener('drop', (event) => {
  event.preventDefault();
  const id = event.dataTransfer.getData('text/plain');
  target.append(document.getElementById(id));
});
```

---

## Modelo da API

O fluxo depende de eventos encadeados.

- **`draggable="true"`**: Habilita o elemento como origem de arrasto.
- **`dragstart`**: Define o que está sendo arrastado.
- **`dragover`**: Permite que uma área receba o item.
- **`drop`**: Executa a ação final quando o item é solto.
- **`DataTransfer`**: Transporta texto, IDs, arquivos ou outros dados.

---

## Exemplo com preview e código

O exemplo importado mostra a origem do arrasto, a área de destino e o uso dos eventos principais.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/dragdrop.
- html" height="26rem" label="dragdrop.
- <SourceCode path="examples/courses/web-api/browser-web-apis/dragdrop.

---

## Cuidados práticos

Drag and drop é útil, mas não deve ser a única forma de executar uma ação importante.

- **Reordenar lista**: Ofereça alternativa por teclado ou botões.
- **Upload de arquivos**: Valide tipo e tamanho também no servidor.
- **Mover item entre colunas**: Atualize o estado de dados, não só o DOM visual.
- **Interface mobile**: Teste suporte e considere Pointer Events.

---

## Quando usar, e quando não usar?

O arrastar e soltar nativo é um gesto de mouse.

- **Receber arquivos vindos da área de trabalho**: Apenas o seletor de arquivos, que ignora o gesto natural.
- **Reordenar itens de uma lista curta**: Só o arrasto, que exclui quem navega por teclado.
- **Mover cartões entre colunas em telas de toque**: A API nativa, cujo suporte em toque é irregular.
- **Ação crítica, como excluir ou enviar**: Arrasto para uma área de descarte, difícil de desfazer.
- **Upload simples de um arquivo**: Toda a sequência de eventos, para o mesmo resultado.

---

## Executando

1. Abra o exemplo `dragdrop.html`.
2. Arraste o item para a área de destino.
3. Observe no código os listeners de `dragstart`, `dragover` e `drop`.
4. Remova temporariamente o `preventDefault()` de `dragover` e teste a diferença.

---

## Exercício Prático

1. Adicione uma segunda área de destino.
2. Mostre uma classe visual enquanto o item estiver sobre uma área válida.
3. Guarde no `DataTransfer` o ID do elemento arrastado.

---

## Perguntas de revisão

1. Por que uma área da página não aceita um item solto sobre ela sem código adicional?
2. Em qual evento o dado transportado deve ser gravado?
3. Qual a função do atributo `draggable="true"`?
4. Para que serve o evento `dragend`, já que o `drop` conclui a ação?
5. Por que se costuma transportar o identificador do elemento e não o elemento em si?

---

## Resumo do Tópico

- **O ciclo de um arrasto**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
