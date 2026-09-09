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

O Ciclo de Propagação de Eventos (*Event Flow*) · Registrando Ouvintes de Evento · O Objeto Event · Delegação de Eventos (*Event Delegation*)

---

## Objetivo

- Descrever as três fases do fluxo de eventos: captura, alvo e borbulhamento.
- Registrar e remover ouvintes com `addEventListener()` e `removeEventListener()`, incluindo as opções `once`, `capture` e `passive`.
- Diferenciar `event.target` de `event.currentTarget` em um ouvinte compartilhado.
- Distinguir `preventDefault()` de `stopPropagation()` pelo que cada um cancela.
- Aplicar delegação de eventos para atender elementos que ainda não existem no momento do registro.

---

## Mapa do Tópico

- **O Ciclo de Propagação de Eventos (*Event Flow*)**.
- **Registrando Ouvintes de Evento**.
- **O Objeto Event**.
- **Delegação de Eventos (*Event Delegation*)**.
- **Principais Eventos do Navegador**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Ciclo de Propagação de Eventos (*Event Flow*)

Quando o usuário clica em um elemento filho (por exemplo, um botão `<button>` dentro de um `<div>`).

- Fase de Captura (*Capturing Phase*): O evento desce desde a raiz.
- Fase de Alvo (*Target Phase*): O evento atinge o elemento específico onde a interação ocorreu (`event.target`).
- Fase de Borbulhamento (*Bubbling Phase*): O evento "subirá" de volta pela árvore DOM.

---

## Registrando Ouvintes de Evento

Existem três formas de vincular código JavaScript a interações do usuário.

- **Atributos HTML Inline (Legado - Evitar)**: A forma mais antiga escreve o código dentro do próprio HTML.
- **Propriedades On-Event (Limitado)**: A segunda forma tira o código do HTML, mas mantém a limitação principal.
- **O Método `addEventListener` (Padrão Moderno)**: O método `addEventListener` é a forma padrão e recomendada.

---

## Registrando Ouvintes de Evento: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```html
<button onclick="alert('Clicado!')">Enviar</button>
```

---

## Registrando Ouvintes de Evento: Casos

- **Atributos HTML Inline (Legado - Evitar)**: A forma mais antiga escreve o código dentro do próprio HTML.
- **Propriedades On-Event (Limitado)**: A segunda forma tira o código do HTML, mas mantém a limitação principal.
- **O Método `addEventListener` (Padrão Moderno)**: O método `addEventListener` é a forma padrão e recomendada.

---

## O Objeto Event

Quando uma função ouvinte é disparada, ela recebe automaticamente como primeiro argumento um objeto `Event` com metadados sobre a interatividade.

- `event.target`: O elemento exato que originou o evento (onde o usuário clicou).
- `event.currentTarget`: O elemento onde o `addEventListener` foi registrado.

---

## O Objeto Event: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const container = document.querySelector('#container');

container.addEventListener('click', (event) => {
  console.log('Elemento clicado (target):', event.target);
  console.log('Elemento escutando (currentTarget):', event.currentTarget);
});
```

---

## Delegação de Eventos (*Event Delegation*)

A Delegação de Eventos é um padrão de otimização de performance onde.

- Economia de memória: Reduz drasticamente o número de objetos `EventListener` criados no navegador.
- Suporte a elementos dinâmicos: Elementos adicionados ao DOM posteriormente funcionarão automaticamente sem precisar registrar novos ouvintes.

---

## Delegação de Eventos (*Event Delegation*): Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const listaTarefas = document.querySelector('#lista-tarefas');

// Registro de um ÚNICO listener no elemento pai (ul)
listaTarefas.addEventListener('click', (event) => {
  // Verifica se o elemento clicado possui a classe .btn-excluir
  if (event.target.matches('.btn-excluir')) {
    const item = event.target.closest('li'); // Encontra o item <li> ancestral
    item.remove();                           // Remove o item da lista
    console.log('Item removido via delegação de eventos!');
  }
});
```

---

## Principais Eventos do Navegador

Os eventos do navegador se agrupam por origem: mouse, teclado, formulário, janela e recurso.

- **Mouse**: Interações com o cursor do mouse.
- **Teclado**: Pressionamento e soltura de teclas (`event.key`).
- **Formulário**: Digitação, alteração e envio de dados.
- **Documento**: Disparado quando o HTML foi completamente lido e parseado.

---

## Principais Eventos do Navegador: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
document.addEventListener('DOMContentLoaded', () => {
  console.log('A árvore DOM está pronta para ser manipulada!');
});
```

---

## Quando usar, e quando não usar?

Delegação de eventos é a técnica mais útil deste tópico e também a mais aplicada fora de hora.

- **Lista que recebe itens depois do carregamento**: Um ouvinte por item, que não alcança o que ainda não existe.
- **Um botão único e permanente na página**: Delegação, que obriga a testar `event.target` sem necessidade.
- **Ouvinte que deve rodar uma vez só**: `removeEventListener()` manual dentro do próprio callback.
- **Rolagem, toque e gestos contínuos**: Ouvinte padrão, que pode travar a rolagem enquanto executa.
- **Impedir o envio padrão de um formulário**: `stopPropagation()`, que não cancela a ação, só interrompe o percurso.

---

## Executando

1. Abra as ferramentas do desenvolvedor com <kbd>F12</kbd> e selecione a aba Console.
2. Cole o código: `document.addEventListener('click', e => console.log('Clicado em:', e.target));`.
3. Clique em diferentes elementos da página (botões, parágrafos, imagens) e observe o objeto.

---

## Exercício Prático

1. Por que o método `event.preventDefault()` é frequentemente utilizado no evento de `submit` de um formulário em aplicações modernas?
2. Explique a diferença entre `event.target` e `event.currentTarget`.
3. Escreva um exemplo de código que escute o evento `keyup` em um campo de texto e exiba uma mensagem apenas.
4. Em formulários HTML normais, a submissão faz o navegador realizar um POST/GET recarregando a página inteira.
5. `event.target` é o elemento exato que recebeu o clique/interação original (o alvo).

---

## Desafio

Implemente a delegação de eventos para uma tabela com ID `tabela-produtos`.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Em qual fase do evento os ouvintes registrados com `addEventListener` executam por padrão?
2. O que acontece quando chamamos `event.stopPropagation()` em um handler de clique?
3. Qual é a vantagem de utilizar a técnica de delegação de eventos em listas dinâmicas com muitos itens?
4. Como identificar qual elemento filho disparou o clique dentro de um ouvinte delegado no elemento pai?

---

## Resumo do Tópico

- **O Ciclo de Propagação de Eventos (*Event Flow*)**: revise o papel desse eixo no uso da API.
- **Registrando Ouvintes de Evento**: revise o papel desse eixo no uso da API.
- **O Objeto Event**: revise o papel desse eixo no uso da API.
- **Delegação de Eventos (*Event Delegation*)**: revise o papel desse eixo no uso da API.
- **Principais Eventos do Navegador**: revise o papel desse eixo no uso da API.
