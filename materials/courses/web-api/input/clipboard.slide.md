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
title: "Web APIs: Clipboard API"
description: "Slides completos do tópico Web APIs: Clipboard API."
---

<!-- _class: lead -->

# Web APIs: Clipboard API

Por que copiar exige permissão? · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Copiar e ler texto com `navigator.clipboard.writeText()` e `navigator.clipboard.readText()`.
- Explicar por que a leitura é mais restrita que a escrita do ponto de vista de privacidade.
- Listar os três requisitos de acesso: contexto seguro, foco da página e gesto do usuário.
- Tratar a rejeição da Promise com `try/catch` e dar retorno visível ao usuário.
- Decidir entre a Clipboard API e a seleção manual de texto quando a permissão não estiver disponível.

---

## Mapa do Tópico

- **Por que copiar exige permissão?**.
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

## Por que copiar exige permissão?

A área de transferência é um espaço compartilhado por todos os programas do sistema.

- **`writeText()`**: A página só entrega um dado que já era dela.
- **`readText()`**: A página passa a ver o que outro programa copiou.

---

## Por que copiar exige permissão?: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('texto copiado');
    status.textContent = 'Copiado.';
  } catch {
    status.textContent = 'Não foi possível copiar.';
  }
});
```

---

## Modelo da API

A interface principal fica.

- **`navigator.clipboard`**: Entrada para leitura e escrita no clipboard.
- **`writeText(texto)`**: Copia texto para a área de transferência.
- **`readText()`**: Lê texto da área de transferência quando permitido.
- **`try/catch`**: Trata bloqueio por permissão, contexto ou navegador.
- **Gesto do usuário**: Clique ou ação clara que justifica o acesso.

---

## Exemplo com preview e código

O exemplo importado mostra a escrita e a leitura do clipboard acionadas por botões.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/clipboard.
- html" height="18rem" label="clipboard.
- <SourceCode path="examples/courses/web-api/browser-web-apis/clipboard.

---

## Cuidados práticos

Em ambientes de aula, o preview em iframe pode bloquear operações que funcionam quando o arquivo é aberto em uma aba própria.

- **Copiar botão de convite**: Use `writeText()` após clique.
- **Colar conteúdo externo**: Explique a finalidade antes de chamar `readText()`.
- **Ambiente sem suporte**: Mostre uma mensagem alternativa.
- **Erro de permissão**: Capture a exceção e não trate como falha do usuário.

---

## Quando usar, e quando não usar?

A Clipboard API resolve um caso estreito, o de copiar um valor que o usuário não conseguiria selecionar com facilidade.

- **Botão "copiar" ao lado de um token ou chave de**: Pedir que o usuário selecione uma string longa à mão.
- **Copiar o link da página atual**: Instruir a copiar da barra de endereços.
- **Colar dados em um formulário**: `readText()`, que pede permissão para algo que o navegador já faz.
- **Ler o clipboard ao carregar a página**: Qualquer leitura sem gesto do usuário é bloqueada e soa invasiva.
- **Copiar imagem ou HTML formatado**: `writeText()`, que perde a formatação.

---

## Executando

1. Abra o exemplo `clipboard.html` pelo link do preview.
2. Clique no botão de copiar.
3. Cole em outro campo para confirmar o texto copiado.
4. Teste a leitura e observe se o navegador pede permissão ou bloqueia a chamada.

---

## Exercício Prático

1. Adicione um campo para o usuário escolher o texto copiado.
2. Mostre uma mensagem de sucesso apenas depois que `writeText()` resolver.
3. Crie uma mensagem específica para erro de permissão.

---

## Perguntas de revisão

1. Por que a leitura do clipboard é mais restrita que a escrita?
2. O que significa "contexto seguro" no contexto desta API?
3. Por que a cópia falha quando disparada por um `setTimeout()` longo após o clique?
4. O que acontece se a página não estiver em foco no momento da chamada?
5. Por que `writeText()` devolve uma Promise em vez de um valor imediato?

---

## Resumo do Tópico

- **Por que copiar exige permissão?**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
