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
title: "Web APIs: Observadores"
description: "Slides completos do tópico Web APIs: Observadores."
---

<!-- _class: lead -->

# Web APIs: Observadores

Modelo de observação · IntersectionObserver · ResizeObserver · MutationObserver

---

## Objetivo

- Descrever o par alvo/callback comum aos três observadores e o papel do método `disconnect()`.
- Reagir à entrada e à saída de um elemento na viewport com `IntersectionObserver`.
- Acompanhar mudanças de dimensão de um elemento com `ResizeObserver`.
- Detectar alterações na árvore DOM com `MutationObserver` e configurar o que observar.
- Escolher entre os três observadores e explicar por que eles superam `scroll`, `resize` e `setInterval`.

---

## Mapa do Tópico

- **Modelo de observação**.
- **IntersectionObserver**.
- **ResizeObserver**.
- **MutationObserver**.
- **Comparando os observadores**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Modelo de observação

Todo observador segue a mesma ideia: criar uma instância, informar uma função de callback.

- Defina a entrada da API.
- Defina o alvo observado com `observe()` e pare com `unobserve()` ou `disconnect()`.
- Use o callback para reagir a mudanças sem executar sondagens manuais.

---

## IntersectionObserver

O `IntersectionObserver` detecta quando um elemento entra, sai ou cruza um limite de visibilidade em relação à viewport ou a um container.

- Ele é indicado para *lazy loading*, rolagem infinita, animações sob demanda e leitura da seção atual.
- O exemplo a seguir observa cartões e registra quando pelo menos metade de um deles aparece.
- <Aside type="tip" title="Por que isso melhora desempenho?

---

## ResizeObserver

O `ResizeObserver` observa o tamanho de um elemento específico.

- Ele é diferente.
- resize.
- Este padrão ajuda a adaptar um componente ao seu próprio espaço disponível.

---

## ResizeObserver: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const painel = document.querySelector('.painel-dashboard');

const observadorDeTamanho = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width } = entry.contentRect;

    entry.target.classList.toggle('compacto', width < 400);
  }
});

observadorDeTamanho.observe(painel);
```

---

## MutationObserver

O `MutationObserver` observa alterações estruturais no DOM: nós adicionados, nós removidos, mudanças em atributos e alterações em texto.

- Ele é útil quando uma parte da página é modificada por componentes, bibliotecas, widgets externos ou renderização dinâmica.
- O exemplo reage quando novos itens entram em uma lista.
- <Aside type="caution" title="Não observe a página inteira sem necessidade"> `MutationObserver` pode gerar muitos registros em páginas.

---

## Comparando os observadores

A escolha correta depende do tipo de mudança que interessa ao código.

- **`IntersectionObserver`**: `unobserve()` ou `disconnect()`.
- **`ResizeObserver`**: `unobserve()` ou `disconnect()`.
- **`MutationObserver`**: `disconnect()`.

---

## Quando usar, e quando não usar?

Os três observadores resolvem o mesmo problema estrutural, reagir a uma mudança sem perguntar por ela o tempo todo.

- **Carregar imagem ou conteúdo ao chegar perto da v**: Ouvinte de `scroll` calculando `getBoundingClientRect()` a cada quadro.
- **Ajustar um gráfico ao espaço real do contêiner**: Evento `resize` da janela, que ignora mudanças de layout internas.
- **Reagir a nós inseridos por código de terceiros**: `setInterval()` verificando se o elemento apareceu.
- **Layout que depende só da largura da tela**: Qualquer observador em JavaScript.
- **Mudanças provocadas pelo próprio código da págin**: `MutationObserver`, que observa o efeito do que você mesmo causou.

---

## Executando

1. Abra uma página com várias seções e pressione <kbd>F12</kbd>.
2. Cole o exemplo de `IntersectionObserver` no console.
3. Role a página até o elemento observado entrar na viewport.
4. Troque `threshold` para `0`, `0.5` e `1` e compare quando o callback dispara.

---

## Exercício Prático

1. Crie um `IntersectionObserver` que adicione a classe `ativo` ao primeiro `<script>` visível.
2. Crie um `ResizeObserver` que troque um card para modo compacto quando sua largura for menor que `360px`.
3. Crie um `MutationObserver` que conte quantos `<script>` foram adicionados a uma lista.

---

## Perguntas de revisão

1. Por que `IntersectionObserver` costuma ser melhor que escutar `scroll` continuamente?
2. Qual a diferença entre `ResizeObserver` e `window.onresize`?
3. Quando `MutationObserver` deve ser desconectado?

---

## Resumo do Tópico

- **Modelo de observação**: revise o papel desse eixo no uso da API.
- **IntersectionObserver**: revise o papel desse eixo no uso da API.
- **ResizeObserver**: revise o papel desse eixo no uso da API.
- **MutationObserver**: revise o papel desse eixo no uso da API.
- **Comparando os observadores**: revise o papel desse eixo no uso da API.
