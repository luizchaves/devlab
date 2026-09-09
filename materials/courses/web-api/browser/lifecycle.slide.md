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
title: "Web APIs: Ciclo de Vida da Página"
description: "Slides completos do tópico Web APIs: Ciclo de Vida da Página."
---

<!-- _class: lead -->

# Web APIs: Ciclo de Vida da Página

O Caminho do HTML até a Página Interativa · Formas de Integrar JavaScript ao HTML · Modos de Execução: Síncrono, `defer`, `async` e Módulos · `DOMContentLoaded` vs `load`

---

## Objetivo

- Descrever as etapas entre a chegada do HTML e a construção completa do DOM.
- Comparar as diferentes formas de integrar JavaScript ao HTML.
- Escolher entre `defer`, `async` e `type="module"` conforme o script precise ou não do DOM pronto.
- Diferenciar `DOMContentLoaded` de `load` pelo que já está disponível em cada um.
- Consultar `document.readyState` para decidir se o código deve esperar por um evento.
- Reagir a `visibilitychange`, `pagehide` e `beforeunload` para salvar estado antes que a aba seja ocultada ou descartada.

---

## Mapa do Tópico

- **O Caminho do HTML até a Página Interativa**.
- **Formas de Integrar JavaScript ao HTML**.
- **Modos de Execução: Síncrono, `defer`, `async` e Módulos**.
- **`DOMContentLoaded` vs `load`**.
- **`document.readyState`**.
- **Página Visível, Oculta ou Descartada**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Caminho do HTML até a Página Interativa

Quando o navegador requisita um endereço na web, a página não surge instantaneamente pronta.

- Recepção do Stream e Parsing Incremental: O navegador não aguarda o arquivo.
- Preload Scanner e Downloads em Paralelo: Enquanto o parser principal analisa o documento sequencialmente.
- Ponto Crítico de Bloqueio do Parser: Ao encontrar uma tag `<script>` síncrona tradicional (sem `defer`, `async` ou `type="module"`).
- Disparo do Evento `DOMContentLoaded`: Assim que o parser atinge a tag de fechamento `</html>` e todos os scripts.

---

## Formas de Integrar JavaScript ao HTML

No desenvolvimento web, o código JavaScript pode ser conectado ao HTML de múltiplas maneiras.

- **Módulo JavaScript**: Padrão recomendado para aplicações modernas.
- **Script Externo com `defer`**: Padrão seguro para scripts clássicos sem bundler.
- **Script no Fim do `<script>`**: Prática clássica para evitar elementos `null`.
- **Script Externo no `<script>`**: Evitar (bloqueia tela e gera `null` no DOM).
- **Script Embutido (Inline)**: Apenas para configurações iniciais críticas.

---

## Formas de Integrar JavaScript ao HTML: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```html
<!-- 1. Script Embutido (Inline): o código mora dentro do arquivo HTML -->
<script>
  console.log('Executando script embutido no HTML');
</script>

<!-- 2. Script Externo: o código mora em um arquivo .js separado -->
<script src="/js/app.js"></script>
```

---

## Modos de Execução: Síncrono, `defer`, `async` e Módulos

Ao utilizar arquivos JavaScript externos com a tag `<script>`.

- **`<script>`**: Evitar em páginas modernas.
- **`<script>`**: Padrão seguro para scripts clássicos.
- **`<script>`**: Scripts independentes, como analytics.
- **`<script>`**: Padrão moderno para aplicações.

---

## Modos de Execução: Síncrono, `defer`, `async` e Módulos: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```html
<head>
  <script type="module" src="/src/main.js"></script>
</head>
<body>
  <button id="btn-salvar">Salvar</button>
</body>
```

---

## `DOMContentLoaded` vs `load`

Dois eventos aparecem muito no ciclo de carregamento.

- `DOMContentLoaded`: dispara quando o HTML foi lido e o DOM está montado.
- `load`: dispara depois que imagens, CSS, iframes e outros recursos externos terminaram de carregar.

---

## `DOMContentLoaded` vs `load`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
document.addEventListener('DOMContentLoaded', () => {
  const titulo = document.querySelector('h1');
  console.log('DOM pronto:', titulo.textContent);
});

window.addEventListener('load', () => {
  console.log('Pagina e recursos externos carregados');
});
```

---

## `document.readyState`

A propriedade.

- **`loading`**: O HTML ainda está sendo processado.
- **`interactive`**: O DOM já foi construído, mas recursos externos podem estar carregando.
- **`complete`**: Página e recursos externos terminaram de carregar.

---

## Página Visível, Oculta ou Descartada

O usuário pode trocar de aba, bloquear o celular, minimizar a janela ou navegar para outra página.

- pausar animações ou polling.
- reduzir chamadas HTTP quando a aba está em segundo plano.
- salvar rascunhos antes de uma navegação.
- retomar sincronização quando a aba volta a ficar visível.

---

## Página Visível, Oculta ou Descartada: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Aba oculta: pausar atualizacoes pesadas.');
  } else {
    console.log('Aba visivel: retomar atualizacoes.');
  }
});
```

---

## Quando usar, e quando não usar?

Escolher o momento de execução é uma decisão de uma linha, tomada no atributo da tag ou no nome do evento.

- **Script que manipula elementos da página**: `<script>` no `<script>` sem atributo, que bloqueia o *parser*.
- **Script independente do DOM (métrica, telemetria)**: `defer`, que atrasa o disparo sem necessidade.
- **Código que precisa da árvore montada, mas não**: `load`, que espera cada imagem e cada iframe.
- **Medição de tempo total de carregamento**: `DOMContentLoaded`, que ignora os recursos externos.
- **Salvar rascunho antes de a aba sumir**: `beforeunload`, que não dispara de forma confiável no celular.

---

## Erros Comuns

Três sintomas concentram quase todo problema de sincronização entre script e DOM.

- **`querySelector(...)` retorna `null`**: Use `defer`, `type="module"` ou `DOMContentLoaded`.
- **Evento de clique não funciona**: Use delegação de eventos ou registre após renderizar.
- **Medida de imagem vem `0`**: Use `load` da imagem ou `window.load`.
- **Timer continua rodando em aba oculta**: Use `visibilitychange`.
- **Usuário perde formulário ao fechar aba**: Use autosave e, se necessário, `beforeunload`.

---

## Executando

1. Crie um arquivo `index.html` com um botão `Testar`.
2. Carregue um arquivo `main.js` no `<script>` com `<script>`.
3. No `main.js`, selecione o botão e registre um evento de clique.
4. Abra a página no navegador e confirme que o botão funciona mesmo com o script declarado no `<script>`.

---

## Exercício Prático

1. Qual a diferença entre `DOMContentLoaded` e `load`?
2. Por que `type="module"` costuma evitar o erro de acessar um elemento antes dele existir?
3. Quando faz sentido usar `visibilitychange`?
4. `DOMContentLoaded` dispara quando o DOM está pronto para manipulação. `load` dispara depois.
5. Scripts do tipo módulo são executados de forma adiada em relação ao parsing do HTML, de modo.

---

## Desafio

Crie uma função `inicializarQuandoPronto(callback)` que execute o `callback` imediatamente se o DOM já estiver pronto.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Qual atributo preserva a ordem dos scripts e evita bloquear o parser HTML?
2. Por que `async` pode ser perigoso para scripts que dependem uns dos outros?
3. Qual propriedade indica se a aba atual está oculta?

---

## Resumo do Tópico

- **O Caminho do HTML até a Página Interativa**: revise o papel desse eixo no uso da API.
- **Formas de Integrar JavaScript ao HTML**: revise o papel desse eixo no uso da API.
- **Modos de Execução: Síncrono, `defer`, `async` e Módulos**: revise o papel desse eixo no uso da API.
- **`DOMContentLoaded` vs `load`**: revise o papel desse eixo no uso da API.
- **`document.readyState`**: revise o papel desse eixo no uso da API.
