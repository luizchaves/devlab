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
title: "Web APIs: Eventos e Interatividade"
description: "Slides completos do tópico Web APIs: Eventos e Interatividade."
---

<!-- _class: lead -->

# Web APIs: Eventos e Interatividade

O Ciclo de Propagação de Eventos · Fases de Captura e Borbulhamento · O Objeto Event · Delegação de Eventos

---

## Objetivo

- Descrever a arquitetura de eventos baseada em `EventTarget`, `GlobalEventHandlers` e propriedades on-event.
- Descrever as três fases do fluxo de eventos: captura, alvo e borbulhamento (*bubbling*).
- Identificar eventos que borbulham e eventos que não propagam via `event.bubbles`.
- Registrar ouvintes nas fases de borbulhamento ou de captura com `addEventListener()`.
- Diferenciar `event.target` de `event.currentTarget` durante a propagação.
- Distinguir `preventDefault()` de `stopPropagation()` e `stopImmediatePropagation()`.
- Aplicar o padrão de delegação de eventos centralizando ouvintes em ancestrais.

---

## Mapa do Tópico

- **Arquitetura de Eventos: `EventTarget` e `GlobalEventHandlers`**.
- **Registrando Ouvintes de Evento**.
- **Principais Eventos do Navegador**.
- **O Ciclo de Propagação de Eventos (*Event Flow*)**.
- **O Borbulhamento na Prática e a Viagem Completa**.
- **Eventos que Borbulham e que Não Borbulham**.
- **O Objeto Event e Métodos de Controle**.
- **Delegação de Eventos (*Event Delegation*)**.
- **Quando usar, e quando não usar?**.

---

## Arquitetura de Eventos: `EventTarget`

A classe base fundamental do navegador para recepção e envio de eventos:

```txt
               ┌───────────────────────┐
               │      EventTarget      │
               │  +addEventListener()  │
               │  +removeEventListener │
               │  +dispatchEvent()     │
               └───────────┬───────────┘
                    ▲             ▲
                    │             │
              ┌─────┴─────┐ ┌─────┴─────┐
              │   Window  │ │    Node   │
              └───────────┘ └─────┬─────┘
                                  │
                            ┌─────┴─────┐
                            │  Element  │
                            └─────┬─────┘
                                  │
                            ┌─────┴─────┐
                            │HTMLElement│
                            └───────────┘
```

---

## Mixin `GlobalEventHandlers` e Propriedades On-Event

Mixin que define propriedades de conveniência em `HTMLElement`, `Document` e `Window`:

- **Propriedades On-Event**: `onclick`, `onkeydown`, `oninput`, `onsubmit`, `onload`.
- **Comportamento**: aceitam uma única função (`elem.onclick = fn`), sobrescrevendo tratadores anteriores.
- **`EventTarget` vs On-Event**: prefira `addEventListener()` para múltiplos ouvintes desacoplados.

---

## Registrando Ouvintes de Evento

- **Atributos HTML Inline**: `<button onclick="...">` (legado, mistura marcação e lógica).
- **Propriedades On-Event**: `botao.onclick = fn` (sobrescreve tratadores anteriores).
- **Método `addEventListener()`**: padrão moderno, permite múltiplos ouvintes independentes.

```js
const botao = document.querySelector('#btn-salvar');

botao.addEventListener('click', dispararSalvamento);
botao.addEventListener('click', notificarUsuario);
```

---

## Ouvintes na Fase de Captura

Para interceptar eventos durante a **descida** (antes de chegarem ao alvo), use `{ capture: true }`:

```js
const container = document.querySelector('#container');

// Executa na descida, antes do botão filho receber o clique
container.addEventListener('click', (event) => {
  console.log('Container interceptou na captura!');
}, { capture: true });
```

---

## Inspeção de Event Listeners no DevTools

Como auditar ouvintes de eventos diretamente nas ferramentas do desenvolvedor:

- **Aba Elements > Event Listeners**:
  - **Com Ancestors**: exibe ouvintes próprios e herdados de pais (`body`, `document`, `window`).
  - **Sem Ancestors**: filtra apenas os ouvintes registrados diretamente no nó selecionado.
- **Console com `getEventListeners($0)`**: retorna objeto com os tratadores do elemento selecionado.

---

## Principais Eventos do Navegador

Os eventos do navegador se agrupam por origem:

- **Mouse**: `click`, `dblclick`, `contextmenu`.
- **Teclado**: `keydown`, `keyup` (`event.key`).
- **Formulário**: `submit`, `change`, `input`.
- **Foco**: `focusin`, `focusout` (com suporte a borbulhamento).
- **Documento**: `DOMContentLoaded` (árvore DOM pronta).

```js
document.addEventListener('DOMContentLoaded', () => {
  console.log('A árvore DOM está pronta para ser manipulada!');
});
```

---

## Eventos de Interação vs. Eventos de Estado

Nem todo evento decorre de um clique ou gesto físico direto:

- **Interação direta (triviais)**: `click`, `keydown`, `input`, `submit`.
  - Disparados em resposta a ações conscientes do usuário no elemento.
- **Estado e ciclo de vida (não triviais)**: `load`, `DOMContentLoaded`, `visibilitychange`, `online`.
  - Disparados por transições de fase do runtime, rede ou do próprio navegador.
- **Unificação**: todos operam sob o mesmo contrato da interface `EventTarget`.

---

## O Ciclo de Propagação de Eventos (*Event Flow*)

Quando ocorre uma interação em um nó aninhado, o evento viaja pela árvore DOM em três fases:

1. **Fase de Captura (*Capturing*)**: o evento desce da raiz (`window` -> `document` -> `html` -> `body`) até o pai do alvo.
2. **Fase de Alvo (*Target*)**: o evento atinge o elemento exato onde a ação se originou (`event.target`).
3. **Fase de Borbulhamento (*Bubbling*)**: o evento sobe de volta pela hierarquia (alvo -> pai -> avô -> raiz).

*Analogia: como bolhas de ar subindo do fundo até a superfície da água.*

---

## O Fluxo de Eventos no DOM

Esquema da viagem de ida e volta `Capturing → Target → Bubbling`:

```txt
Fase 1: Captura (Descida)        Fase 3: Borbulhamento (Subida)
   window / document                     window / document  ^
           │                                     │          │
           ▼                                     │          │
         <body>                                <body>       │
           │                                     │          │
           ▼                                     │          │
        <form>                                <form>        │
           │                                     │          │
           ▼                                     │          │
         <div>                                 <div>        │
           │                                     ▲          │
           ▼                                     │          │
  ┌─────────────────────────────────────────────────────────┴┐
  │ Fase 2: Alvo (Target) -> <button>                        │
  └──────────────────────────────────────────────────────────┘
```

---

## O Borbulhamento na Prática: Exemplo

Ouvintes configurados em elementos aninhados escutam por padrão na subida:

```js
const form = document.querySelector('#formulario');
const container = document.querySelector('#container');
const botao = document.querySelector('#botao');

form.addEventListener('click', () => console.log('3. Form (Borbulhamento)'));
container.addEventListener('click', () => console.log('2. Div (Borbulhamento)'));
botao.addEventListener('click', () => console.log('1. Botão (Alvo)'));
```

Clique no botão:
1. `1. Botão (Alvo)` (fase de alvo)
2. `2. Div (Borbulhamento)` (borbulha para o pai)
3. `3. Form (Borbulhamento)` (borbulha para o avô)

---

## A Viagem Completa: Captura e Borbulhamento

Registrando ouvintes com `{ capture: true }` para rastrear o ciclo completo:

```js
// Descida (Fase 1: Captura)
form.addEventListener('click', () => console.log('1. Form (Captura)'), { capture: true });
div.addEventListener('click', () => console.log('2. Div (Captura)'), { capture: true });

// Alvo e Subida (Fase 2 e 3: Borbulhamento)
botao.addEventListener('click', () => console.log('3. Botão (Alvo)'));
div.addEventListener('click', () => console.log('4. Div (Borbulhamento)'));
form.addEventListener('click', () => console.log('5. Form (Borbulhamento)'));
```

Saída: `Form (Captura)` $\rightarrow$ `Div (Captura)` $\rightarrow$ `Botão (Alvo)` $\rightarrow$ `Div (Borbulhamento)` $\rightarrow$ `Form (Borbulhamento)`.

---

## Eventos: Borbulhamento e a Propriedade `bubbles`

A propriedade booleana `event.bubbles` indica se o evento propaga para os nós ancestrais:

- **Borbulham (`bubbles: true`)**: `click`, `keydown`, `keyup`, `input`, `change`, `submit`, `focusin`, `focusout`, `mouseover`.
- **Não borbulham (`bubbles: false`)**: `focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `unload`, `resize`, `scroll`.

*Dica: use `focusin`/`focusout` em vez de `focus`/`blur` quando precisar delegar foco no elemento pai.*

---

## O Objeto Event: `target` vs `currentTarget`

Na propagação por múltiplos elementos, as duas propriedades se diferenciam:

- **`event.target`**: o nó mais interno onde a interação física ocorreu (o elemento clicado).
- **`event.currentTarget`**: o elemento onde o `addEventListener` em execução foi registrado.

```js
container.addEventListener('click', (event) => {
  console.log('Origem da ação (target):', event.target.tagName);
  console.log('Elemento escutando (currentTarget):', event.currentTarget.tagName);
});
```

---

## Controle de Propagação e Ação Padrão

- **`event.stopPropagation()`**: interrompe a subida do evento para os elementos pai.
- **`event.stopImmediatePropagation()`**: interrompe a subida e cancela outros ouvintes no mesmo nó.
- **`event.preventDefault()`**: cancela a ação nativa do navegador (ex: envio de form ou link), mas **não** interrompe a propagação no DOM.

```js
formulario.addEventListener('submit', (event) => {
  event.preventDefault(); // Impede o recarregamento da página
});
```

---

## Detalhes de Teclado e Atalhos (`KeyboardEvent`)

- **`event.key`**: valor semântico da tecla (`'Enter'`, `'Escape'`, `'k'`).
- **`event.code`**: posição física da tecla no teclado (`'KeyK'`, `'Digit1'`).
- **Modificadores**: `event.ctrlKey`, `event.metaKey` (Cmd/Win), `event.shiftKey`, `event.altKey`.
- **Obsolescência**: `event.keyCode` e `event.which` estão descontinuados.

```js
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    console.log('Atalho de busca acionado!');
  }
});
```

---

## Eventos Customizados com `CustomEvent`

Permite comunicação desacoplada entre componentes com payload via `detail`:

```js
// 1. Escutando evento customizado no ancestral via borbulhamento
container.addEventListener('usuario-selecionado', (event) => {
  console.log('Payload recebido:', event.detail);
});

// 2. Disparando evento com dados e borbulhamento ativo
const evento = new CustomEvent('usuario-selecionado', {
  detail: { id: 42, nome: 'Ana Maria' },
  bubbles: true,
});
botao.dispatchEvent(evento);
```

---

## Delegação de Eventos (*Event Delegation*)

Padrão arquitetural centralizado que depende do borbulhamento: anexa-se um **único ouvinte no elemento pai** em vez de um para cada elemento filho.

```js
const lista = document.querySelector('#lista-tarefas');

lista.addEventListener('click', (event) => {
  const btnExcluir = event.target.closest('.btn-excluir');
  if (btnExcluir && lista.contains(btnExcluir)) {
    btnExcluir.closest('li')?.remove();
  }
});
```

Vantagens: **economia drástica de memória** e **suporte automático a nós inseridos dinamicamente**.

---

## Quando usar, e quando não usar?

- **Coleção dinâmica de itens**: delegação no ancestral (em vez de um ouvinte por item).
- **Botão estático único**: ouvinte direto no botão (sem filtro desnecessário de `target`).
- **Ouvinte de disparo único**: opção `{ once: true }` (em vez de `removeEventListener` manual).
- **Escutar foco via delegação**: eventos `focusin`/`focusout` (pois `focus`/`blur` não borbulham).
- **Cancelar envio padrão de form**: `preventDefault()` (e não `stopPropagation()`).

---

## Executando

1. Abra o DevTools com <kbd>F12</kbd> e selecione a aba **Console**.
2. Cole o ouvinte global para inspecionar o borbulhamento:
   ```js
   document.addEventListener('click', e => console.log('Borbulhou até document:', e.target));
   ```
3. Clique em botões, links e títulos da página para observar o fluxo.

---

## Exercício Prático

1. Por que o clique em um botão dispara também o ouvinte configurado na `<div>` pai?
2. Qual a diferença entre `event.target` e `event.currentTarget` na subida?
3. Por que `focus` não serve para delegação comum de formulário no pai?
4. Como evitar o recarregamento de página ao submeter um formulário?

---

## Desafio

Implemente delegação de eventos em `#tabela-produtos`:
- Ao clicar em uma célula `<td>`, destaca a linha `<tr>` com fundo `#fef08a`.
- Ao clicar no botão `.btn-detalhes` interno, exibe os dados do produto sem acionar a seleção visual da linha.

---

## Perguntas de revisão

1. Quais são as três fases consecutivas do fluxo de eventos do DOM?
2. Como escutar um evento na fase de captura com `addEventListener`?
3. Qual é a diferença entre `stopPropagation()` e `stopImmediatePropagation()`?
4. Qual é a finalidade da propriedade `event.bubbles`?
5. Por que a delegação de eventos depende do borbulhamento?

---

## Resumo do Tópico

- **Fluxo de Eventos**: Captura (desce) -> Alvo -> Borbulhamento (sobe).
- **Borbulhamento**: mecanismo padrão onde eventos sobem notificando ancestrais.
- **`event.bubbles`**: consulta se o evento propaga para cima na árvore.
- **`target` vs `currentTarget`**: elemento que disparou vs elemento que escuta.
- **Delegação**: aproveita o borbulhamento para gerenciar eventos em massa com alta performance.
