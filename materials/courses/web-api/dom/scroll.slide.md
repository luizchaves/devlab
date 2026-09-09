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
title: "Web APIs: Rolagem e Posicionamento"
description: "Slides completos do tópico Web APIs: Rolagem e Posicionamento."
---

<!-- _class: lead -->

# Web APIs: Rolagem e Posicionamento

O que se mede em uma rolagem? · Rolar por código · O que o CSS resolve sozinho? · Saber onde o usuário

---

## Objetivo

- Diferenciar `scrollY`, `scrollTop`, `scrollHeight` e `clientHeight` pelo que cada um mede.
- Rolar por código com `scrollIntoView()`, `scrollTo()` e `scrollBy()`.
- Obter rolagem suave e recuo de cabeçalho fixo apenas com CSS.
- Criar pontos de parada em uma galeria com `scroll-snap-type`.
- Destacar a seção ativa com `IntersectionObserver` em vez de um ouvinte de `scroll`.
- Respeitar `prefers-reduced-motion` em qualquer animação de rolagem.

---

## Mapa do Tópico

- **O que se mede em uma rolagem?**.
- **Rolar por código**.
- **O que o CSS resolve sozinho?**.
- **Saber onde o usuário**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O que se mede em uma rolagem?

Antes de mover a página, é preciso saber ler a posição dela.

- **`window.scrollY`**: Vale para a página; um elemento usa `scrollTop`.
- **`elemento.scrollTop`**: Só existe se o elemento tiver rolagem própria.
- **`elemento.scrollHeight`**: Inclui o que está fora da vista.
- **`elemento.clientHeight`**: Exclui barra de rolagem e margens.
- **`window.innerHeight`**: O equivalente ao `clientHeight` da página.

---

## Rolar por código

Quando o movimento parte de uma ação da interface, e não de um link, três métodos cobrem os casos.

- **`elemento.scrollIntoView(opções)`**: Levar o usuário a uma seção ou ao item recém-criado.
- **`window.scrollTo({ top, behavior })`**: Voltar ao topo.
- **`window.scrollBy({ top, behavior })`**: Avançar uma tela.

---

## O que o CSS resolve sozinho?

Boa parte do comportamento de rolagem não precisa de JavaScript.

- As três declarações do exemplo cobrem os efeitos mais pedidos em links de âncora.
- Código real recortado do projeto de exemplo.
- Três pontos merecem atenção nesse trecho.

---

## Saber onde o usuário

O índice que destaca a seção em leitura é o caso mais comum de código de rolagem.

- O `IntersectionObserver` faz o mesmo trabalho sendo avisado apenas quando uma seção entra ou sai de uma faixa da tela.
- Código real recortado do projeto de exemplo.
- O `rootMargin` da linha 18 é o que define "estar em leitura".

---

## Quando usar, e quando não usar?

Rolagem é a área em que a diferença entre a solução antiga e a atual mais aparece.

- **Ir a uma seção ao clicar em um link**: `preventDefault()` mais animação escrita à mão.
- **Levar o usuário a um elemento recém-criado**: `scrollTo()` com posição calculada.
- **Compensar cabeçalho fixo no destino**: Subtrair a altura do cabeçalho no JavaScript.
- **Destacar a seção em leitura**: Ouvinte de `scroll` percorrendo todas as seções.
- **Carregar mais itens ao chegar ao fim**: Comparar `scrollY` com `scrollHeight` a cada disparo.

---

## Executando

1. Entre na pasta do exemplo, em `examples/courses/web-api/scroll/`, e sirva-a por HTTP.
2. Clique nos links do índice. A animação vem do CSS, e nenhum deles passa por JavaScript.
3. Role a página devagar e observe a barra de progresso no topo acompanhando o percentual rolado.
4. Continue rolando e veja o item do índice mudar de destaque ao cruzar o meio da tela.

---

## Executando: Comando

```bash
npx serve .
```

---

## Exercício Prático

1. Acrescente um botão "voltar ao topo" que apareça só depois de 400 pixels rolados.
2. Faça a galeria parar alinhada pela esquerda, e não pelo centro.
3. Acrescente uma quinta seção e confirme que o índice a reconhece sem alterar o JavaScript.
4. Exiba, ao lado da barra, o percentual lido em número inteiro.
5. Troque `block: 'start'` por `block: 'nearest'` no botão e descreva a diferença de comportamento.

---

## Perguntas de revisão

1. Qual a diferença entre `window.scrollY` e `elemento.scrollTop`?
2. Como calcular o progresso de leitura de uma página?
3. Por que não se deve guardar o resultado de `getBoundingClientRect()`?
4. O que a opção `block: 'nearest'` de `scrollIntoView()` faz de diferente?
5. Como compensar um cabeçalho fixo que cobre o título de destino?

---

## Resumo do Tópico

- **O que se mede em uma rolagem?**: revise o papel desse eixo no uso da API.
- **Rolar por código**: revise o papel desse eixo no uso da API.
- **O que o CSS resolve sozinho?**: revise o papel desse eixo no uso da API.
- **Saber onde o usuário**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
