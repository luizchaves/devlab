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
title: "Web APIs: Notification API"
description: "Slides completos do tópico Web APIs: Notification API."
---

<!-- _class: lead -->

# Web APIs: Notification API

O contrato de permissão · Modelo da API · Exemplo com preview e código · Cuidados práticos

---

## Objetivo

- Consultar `Notification.permission` e solicitar autorização com `requestPermission()`.
- Criar uma notificação simples com `new Notification()` e reagir ao clique do usuário.
- Explicar por que pedir permissão no carregamento da página costuma resultar em bloqueio definitivo.
- Reconhecer quando a notificação precisa de um *service worker* para sobreviver ao fechamento da aba.
- Escolher entre notificação do sistema e aviso na própria página conforme a urgência da mensagem.

---

## Mapa do Tópico

- **O contrato de permissão**.
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

## O contrato de permissão

A notificação é a única API deste catálogo capaz de alcançar o usuário quando ele não está olhando para a página.

- Esse alcance é exatamente o que a torna sensível, e o navegador o condiciona a uma permissão de três estados, guardada por origem.
- A seta tracejada é a parte que importa.
- De `denied` não se volta por código: nenhum novo `requestPermission()` exibe o diálogo outra vez.

---

## O contrato de permissão: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
async function notifyOnFinish(message) {
  if (Notification.permission === 'denied') return;

  if (Notification.permission === 'default') {
    const result = await Notification.requestPermission();
    if (result !== 'granted') return;
  }

  new Notification('Processamento concluído', { body: message });
}
```

---

## Modelo da API

Notificação é um recurso sensível porque disputa atenção do usuário mesmo quando ele não está olhando para a aba.

- **`Notification.permission`**: Estado atual: `default`, `granted` ou `denied`.
- **`Notification.requestPermission()`**: Solicita autorização ao usuário.
- **`new Notification(titulo, opcoes)`**: Cria uma notificação não persistente.
- **`notification.onclick`**: Reage a clique na notificação.
- **`ServiceWorkerRegistration.showNotification()`**: Exibe notificação persistente via service worker.

---

## Exemplo com preview e código

O exemplo importado mostra o pedido de permissão e a criação de uma notificação simples.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/notification.
- html" height="18rem" label="notification.
- <SourceCode path="examples/courses/web-api/browser-web-apis/notification.

---

## Cuidados práticos

Em muitos navegadores, o construtor `Notification()` funciona apenas em desktop.

- **Página comum aberta**: `new Notification()` pode bastar em desktop.
- **App instalado ou PWA**: Use service worker para notificações persistentes.
- **Usuário negou permissão**: Não peça repetidamente.
- **Conteúdo sensível**: Evite expor dados privados no texto da notificação.

---

## Quando usar, e quando não usar?

Uma notificação do sistema interrompe o usuário fora do navegador.

- **Processamento longo que terminou com a aba em se**: Mensagem na página, que o usuário não está vendo.
- **Mensagem nova em um chat aberto em outra aba**: Apenas o contador no título da aba.
- **Erro de validação de formulário**: Notificação, que tira o usuário do contexto do erro.
- **Confirmação de uma ação que ele acabou de fazer**: Notificação, redundante com o que está na tela.
- **Aviso que precisa chegar com o site fechado**: `new Notification()`, que morre junto com a página.

---

## Executando

1. Abra o exemplo `notification.html` em uma aba própria.
2. Clique no botão que solicita permissão.
3. Permita ou bloqueie para observar os dois fluxos.
4. Recarregue a página e veja que a escolha pode persistir no navegador.

---

## Exercício Prático

1. Mostre na tela o valor de `Notification.permission`.
2. Desabilite o botão quando a permissão for `denied`.
3. Adicione um corpo de notificação com uma mensagem curta e não sensível.

---

## Perguntas de revisão

1. Quais são os três valores possíveis de `Notification.permission`?
2. O que acontece ao chamar `requestPermission()` quando o estado já é `denied`?
3. Por que consultar `Notification.permission` antes de pedir?
4. Por que pedir permissão no carregamento da página costuma resultar em bloqueio?
5. Qual a diferença entre `new Notification()` e `showNotification()` do *service worker*?

---

## Resumo do Tópico

- **O contrato de permissão**: revise o papel desse eixo no uso da API.
- **Modelo da API**: revise o papel desse eixo no uso da API.
- **Exemplo com preview e código**: revise o papel desse eixo no uso da API.
- **Cuidados práticos**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
