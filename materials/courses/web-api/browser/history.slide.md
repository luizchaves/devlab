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
title: "Web APIs: History API"
description: "Slides completos do tópico Web APIs: History API."
---

<!-- _class: lead -->

# Web APIs: History API

O Objeto `window.history` · Manipulando o Histórico: `pushState` vs `replaceState` · O Evento `popstate` · Quando usar, e quando não usar?

---

## Objetivo

- Descrever a pilha de histórico da sessão e usar `history.back()`, `history.forward()` e `history.go()`.
- Diferenciar `pushState()` de `replaceState()` pelo efeito que cada um produz na pilha.
- Reagir à navegação pelo botão voltar com o evento `popstate` e restaurar o estado da tela.
- Explicar por que `pushState()` não dispara requisição HTTP e o que isso exige do servidor.
- Reconhecer as armadilhas de roteamento em *Single Page Applications* (SPA), como URLs que só funcionam a partir da página inicial.

---

## Mapa do Tópico

- **O Objeto `window.history`**.
- **Manipulando o Histórico: `pushState` vs `replaceState`**.
- **O Evento `popstate`**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Objeto `window.history`

O objeto `history` expõe métodos para navegar no histórico da sessão.

- **`history.length`**: `console.log(history.length)`.
- **`history.back()`**: `history.back()`.
- **`history.forward()`**: `history.forward()`.
- **`history.go(n)`**: `history.go(-2)`.
- **`history.pushState()`**: `history.pushState(state, '', '/produto/42')`.

---

## Manipulando o Histórico: `pushState` vs `replaceState`

A History API expõe dois métodos principais para gerenciar entradas na sessão do navegador sem disparar recarregamentos completos da página.

- `state`: Um objeto JavaScript associado à nova entrada do histórico (armazenado nativamente no navegador).
- `unused`: Parâmetro reservado por razões históricas (deve ser passado como string vazia `''`).
- `url`: A nova URL que será exibida na barra de endereço (deve ser da mesma origem).

---

## Manipulando o Histórico: `pushState` vs `replaceState`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
// Estado associado à rota
const estadoProduto = { produtoId: 42, categoria: 'eletronicos' };

// Atualiza a URL na barra de endereço para /produtos/42
history.pushState(estadoProduto, '', '/produtos/42');

// Atualiza a interface visual no DOM
document.querySelector('#app').textContent = 'Exibindo Produto 42';
```

---

## O Evento `popstate`

Quando o usuário clica nos botões Voltar ou Avançar do navegador, a History API dispara o evento `popstate` na janela (`window`).

- <Aside type="tip" title="Restrição do Evento popstate"> O evento `popstate` é disparado apenas.
- back()` / `history.
- forward().

---

## O Evento `popstate`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
window.addEventListener('popstate', (event) => {
  // event.state contém o objeto passado no pushState ou replaceState
  if (event.state) {
    console.log('Navegou para o estado:', event.state);

    // Re-renderiza a página de acordo com o estado recuperado
    carregarPaginaPorId(event.state.produtoId);
  } else {
    // Estado inicial da página (sem estado gravado)
    console.log('Navegou para a página inicial.');
  }
});
```

---

## Quando usar, e quando não usar?

A History API só se justifica quando a aplicação assume o papel que era do servidor: decidir o que mostrar para cada URL.

- **Troca de seção dentro de uma SPA, com estado**: Preserva o estado e mantém a URL compartilhável.
- **Correção da URL sem criar entrada nova**: Evita que o botão voltar percorra cada ajuste de filtro.
- **Navegação entre páginas realmente distintas**: O navegador cuida de histórico, cache, foco e acessibilidade.
- **Site estático sem controle do servidor**: URLs com `pushState()` retornam 404 em acesso direto.
- **Formulário que envia dados e muda de contexto**: O estado precisa sobreviver a um recarregamento.

---

## Executando

1. Abra o console das ferramentas do desenvolvedor (<kbd>F12</kbd>).
2. Execute: `history.pushState({ passo: 1 }, '', '?passo=1');` e observe a barra de endereço mudar instantaneamente sem recarregar a página.
3. Execute: `history.pushState({ passo: 2 }, '', '?passo=2');`.
4. Clique no botão Voltar do navegador e verifique como a URL retorna para `?passo=1`.

---

## Exercício Prático

1. Qual a diferença fundamental entre `history.pushState()` e `history.replaceState()`?
2. Por que a chamada `history.pushState()` não dispara o evento `popstate`?
3. O que acontece se tentarmos passar uma URL de outro domínio (ex: `https://google.com`) no terceiro parâmetro de `pushState()`?
4. O `pushState()` adiciona uma nova entrada na pilha do histórico (permitindo voltar para a URL anterior pelo botão do navegador).
5. Porque o `popstate` foi projetado para responder a ações de navegação do usuário.

---

## Desafio

Crie um pequeno roteador Vanilla JS que escute os cliques em todos os links `<script>` de uma página.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Qual propriedade do objeto `event` no handler de `popstate` traz os dados salvos durante o `pushState`?
2. Por que bibliotecas como React Router ou Vue Router utilizam a History API em vez de fragmentos de hash (`<script>`) na URL?

---

## Resumo do Tópico

- **O Objeto `window.history`**: revise o papel desse eixo no uso da API.
- **Manipulando o Histórico: `pushState` vs `replaceState`**: revise o papel desse eixo no uso da API.
- **O Evento `popstate`**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
