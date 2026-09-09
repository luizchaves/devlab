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
title: "Web APIs: Server-Side Rendering (SSR)"
description: "Slides completos do tópico Web APIs: Server-Side Rendering (SSR)."
---

<!-- _class: lead -->

# Web APIs: Server-Side Rendering (SSR)

O Ciclo de Vida do SSR e Hidratação (*Hydration*) · O Problema: `ReferenceError: window is not defined` · Estratégias para Acesso Seguro a Web APIs · Comparativo de Armazenamento: SSR vs Cliente

---

## Objetivo

- Descrever o ciclo de renderização no servidor e a hidratação (*hydration*) no cliente.
- Explicar a origem do erro `ReferenceError: window is not defined`.
- Adiar o acesso a Web APIs para o momento em que o componente já está montado no cliente.
- Proteger o acesso global com verificação de escopo e importação dinâmica.
- Decidir onde o dado deve ficar quando `localStorage` não existe durante a renderização no servidor.

---

## Mapa do Tópico

- **O Ciclo de Vida do SSR e Hidratação (*Hydration*)**.
- **O Problema: `ReferenceError: window is not defined`**.
- **Estratégias para Acesso Seguro a Web APIs**.
- **Comparativo de Armazenamento: SSR vs Cliente**.
- **Executando um Exemplo Seguro**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Ciclo de Vida do SSR e Hidratação (*Hydration*)

Em uma aplicação SSR, a requisição do usuário passa por dois estágios de execução.

- **Objeto Global**: `window`, `self`, `globalThis`.
- **Acesso ao DOM**: ✅ Disponível (`document.querySelector`).
- **Armazenamento**: ✅ Disponível (`localStorage`, `IndexedDB`).
- **Rede & Comunicação**: `fetch`, `XMLHttpRequest`, `WebSocket`.
- **Sensores & Hardware**: ✅ Disponível mediante permissão.

---

## O Problema: `ReferenceError: window is not defined`

Quando um componente tenta acessar um objeto do navegador diretamente no corpo da função de renderização, o Node.

- ---.
- Trate estados de sucesso, erro e ausência de suporte.

---

## O Problema: `ReferenceError: window is not defined`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
// ❌ ERRO no servidor: ReferenceError: window is not defined
function ComponentePerfil() {
  const larguraTela = window.innerWidth; // Falha na renderização do servidor!
  const tema = localStorage.getItem('tema'); // Falha na renderização do servidor!

  return <div>Largura: {larguraTela}px</div>;
}
```

---

## Estratégias para Acesso Seguro a Web APIs

Para evitar falhas de execução no servidor durante a renderização SSR.

- **Estratégia 1: Guard de Escopo Global (`typeof window`)**: A técnica mais simples para código isomórfico (que pode rodar tanto no cliente quanto no servidor) é verificar.
- **Estratégia 2: Hooks e Eventos de Hidratação (*Client Lifecycle*)**: Em frameworks reativos, o código inserido em manipuladores de montagem roda estritamente no cliente.
- **Estratégia 3: Arquitetura de Ilhas (*Astro Islands*)**: O Astro utiliza o conceito de Zero JavaScript por padrão.

---

## Estratégias para Acesso Seguro a Web APIs: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
function obterTemaSalvo() {
  // Verifica se o código está executando no navegador
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('tema') || 'light';
  }
  
  // Valor fallback padrão para a renderização inicial no servidor
  return 'light';
}
```

---

## Estratégias para Acesso Seguro a Web APIs: Casos

- **Estratégia 1: Guard de Escopo Global (`typeof window`)**: A técnica mais simples para código isomórfico (que pode rodar tanto no cliente quanto no servidor) é verificar.
- **Estratégia 2: Hooks e Eventos de Hidratação (*Client Lifecycle*)**: Em frameworks reativos, o código inserido em manipuladores de montagem roda estritamente no cliente.
- **Estratégia 3: Arquitetura de Ilhas (*Astro Islands*)**: O Astro utiliza o conceito de Zero JavaScript por padrão.

---

## Comparativo de Armazenamento: SSR vs Cliente

Em aplicações SSR, se você precisa identificar o usuário autenticado durante a renderização no servidor, o `localStorage` não funcionará.

- **Acessível no Servidor (SSR)?**: ✅ Sim (enviado no cabeçalho `Cookie` da requisição HTTP).
- **Leitura no Servidor**: Disponível em `req.headers.cookie` ou `Astro.cookies`.
- **Caso de Uso em SSR**: Tokens JWT de autenticação, idioma da sessão.

---

## Executando um Exemplo Seguro

Os passos do exercício reproduzem o erro no servidor e depois aplicam a guarda que o elimina.

- Abra o console do navegador com <kbd>F12</kbd>.
- Execute o código de checagem condicional.
- Observe que no navegador o resultado é `true`, enquanto em um script rodado via `node` o resultado seria `false`.

---

## Executando um Exemplo Seguro: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const estaNoNavegador = typeof window !== 'undefined';
   console.log('Executando no cliente?', estaNoNavegador);
```

---

## Exercício Prático

1. Por que o código.
2. Como podemos passar a informação de autenticação do usuário para o renderizador SSR do servidor se o `localStorage` não está disponível no Node.
3. Porque durante a renderização no servidor (SSR), o JavaScript é executado pelo Node.js, onde o objeto global `window` não existe.
4. Utilizando Cookies HTTP.

---

## Perguntas de revisão

1. Qual a função do hook `useEffect` (React) ou `onMounted` (Vue) no contexto de SSR?
2. O que acontece se alterarmos o DOM diretamente antes do processo de hidratação terminar em um framework SSR?

---

## Resumo do Tópico

- **O Ciclo de Vida do SSR e Hidratação (*Hydration*)**: revise o papel desse eixo no uso da API.
- **O Problema: `ReferenceError: window is not defined`**: revise o papel desse eixo no uso da API.
- **Estratégias para Acesso Seguro a Web APIs**: revise o papel desse eixo no uso da API.
- **Comparativo de Armazenamento: SSR vs Cliente**: revise o papel desse eixo no uso da API.
- **Executando um Exemplo Seguro**: revise o papel desse eixo no uso da API.
