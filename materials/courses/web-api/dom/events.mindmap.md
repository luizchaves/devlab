---
title: 'Web APIs: Eventos e Interatividade'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Web APIs: Eventos e Interatividade

## Ideia Central
- **Papel**: Ciclo de propagação, borbulhamento (*bubbling*), captura, controle de eventos e delegação
- **Contexto**: Navegadores disparam eventos em resposta a ações do usuário ou ciclo da página, percorrendo a árvore DOM
- **Ambiente**: DOM, EventTarget, JavaScript no navegador

## Arquitetura de Eventos
- **`EventTarget`**: Interface base (`addEventListener`, `removeEventListener`, `dispatchEvent`)
  - Implementada por `Window`, `Document`, `HTMLElement`, `WebSocket`, `Worker`
- **`GlobalEventHandlers`**: Mixin de propriedades on-event (`onclick`, `onkeydown`, `oninput`, `onsubmit`)
- **Propriedades On-Event**: Atribuição direta de função única, sobrescreve tratador anterior

## Registrando Ouvintes
- **Atributos Inline**: Legado (`onclick="..."`), mistura lógica e HTML
- **Propriedades On-Event**: Limitado (`elem.onclick = fn`), sobrescreve tratador anterior
- **Método `addEventListener()`**: Padrão moderno, múltiplos ouvintes independentes
- **Opção `capture: true`**: Intercepta o evento na fase de descida antes de atingir o alvo
- **Inspeção no DevTools**: Aba Elements > Event Listeners (com/sem *Ancestors*) e `getEventListeners($0)`

## Principais Eventos do Navegador
- **Mouse**: `click`, `dblclick`, `contextmenu`
- **Teclado**: `keydown`, `keyup` (`event.key`)
- **Formulário**: `submit`, `change`, `input`
- **Foco**: `focusin`, `focusout` (com borbulhamento)
- **Documento**: `DOMContentLoaded` (DOM montado e pronto)

## Ciclo de Propagação (*Event Flow*)
- **1. Fase de Captura (*Trickling*)**: Desce da raiz (`window` -> `document` -> `html` -> `body`) até o pai do alvo
- **2. Fase de Alvo (*Target*)**: Dispara no elemento físico que originou a ação (`event.target`)
- **3. Fase de Borbulhamento (*Bubbling*)**: Sobe do elemento alvo notificando todos os ancestrais até `window`
- **Metáfora**: Bolha de ar que nasce no fundo e sobe naturalmente até a superfície da água

## Borbulhamento e Propagação
- **Comportamento Padrão**: Ouvintes escutam na subida (`capture: false`)
- **Propriedade `event.bubbles`**: Booleano indicando se o evento propaga para cima na hierarquia
  - **Borbulham**: `click`, `keydown`, `input`, `change`, `submit`, `focusin`, `focusout`, `mouseover`
  - **Não borbulham**: `focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `unload`, `resize`, `scroll`

## O Objeto Event
- **`event.target`**: Nó exato onde a ação física ocorreu (alvo da interação)
- **`event.currentTarget`**: Nó que está executando o ouvinte no momento da propagação
- **`event.stopPropagation()`**: Interrompe a subida da bolha para os elementos pai
- **`event.stopImmediatePropagation()`**: Interrompe a subida e cancela outros ouvintes no mesmo nó
- **`event.preventDefault()`**: Cancela comportamento nativo do navegador sem parar a propagação no DOM
- **`KeyboardEvent` (Teclado e Atalhos)**:
  - `event.key`: Valor semântico da tecla (`'Enter'`, `'Escape'`, `'k'`)
  - `event.code`: Posição física da tecla (`'KeyK'`, `'Digit1'`)
  - Modificadores: `ctrlKey`, `metaKey`, `shiftKey`, `altKey`
  - Obsolescência: `keyCode` e `which` descontinuados
- **`CustomEvent` (Eventos Customizados)**:
  - Criação com `new CustomEvent('nome', { detail, bubbles })`
  - Propriedade `event.detail`: Payload de dados personalizados
  - Despacho com `element.dispatchEvent()`

## Delegação de Eventos (*Event Delegation*)
- **Conceito**: Único ouvinte no ancestral gerenciando múltiplos nós filhos via borbulhamento
- **Identificação**: Filtro do nó clicado com `event.target.closest('seletor')`
- **Vantagens**:
  - Economia de memória (poucos tratadores criados)
  - Suporte automático a elementos adicionados dinamicamente

## Boas Práticas e Decisões
- **Massa dinâmica de itens**: Usar delegação no contêiner
- **Foco centralizado**: Usar `focusin`/`focusout` em vez de `focus`/`blur`
- **Prevenir recarga de formulário**: Usar `preventDefault()`, nunca `stopPropagation()`
- **Cuidado com `stopPropagation()`**: Pode quebrar analytics, delegação externa e fechamento de modais
