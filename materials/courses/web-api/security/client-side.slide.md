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
title: "Segurança no Navegador e OWASP Client-Side"
description: "Slides completos do tópico Segurança no Navegador e OWASP Client-Side."
---

<!-- _class: lead -->

# Segurança no Navegador e OWASP Client-Side

O Modelo de Segurança do Navegador · Principais Riscos OWASP no Front-End · Fluxo Comparativo: Ataque vs Defesa · Checklist de Segurança no Vanilla JS

---

## Objetivo

- Entenda as principais vulnerabilidades front-end da OWASP e aprenda a construir aplicações Vanilla JS seguras.
- Entender o papel da API no navegador.
- Aplicar o recurso em uma interface real.

---

## Mapa do Tópico

- **O Modelo de Segurança do Navegador**.
- **Principais Riscos OWASP no Front-End**.
- **Fluxo Comparativo: Ataque vs Defesa**.
- **Checklist de Segurança no Vanilla JS**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## O Modelo de Segurança do Navegador

O navegador executa código JavaScript em um ambiente de isolamento que utiliza a Política de Mesma Origem (*Same-Origin Policy* ou SOP) como.

- **Princípio da Mesma Origem (SOP)**: Duas páginas pertencem à mesma origem quando compartilham exatamente o mesmo protocolo, domínio (host) e porta.
- **A Fronteira do Cliente**: Apesar do isolamento garantido pela SOP, o código que roda no cliente está completamente sob controle.

---

## Principais Riscos OWASP no Front-End

A OWASP destaca vulnerabilidades recorrentes que afetam diretamente o código executado nos navegadores.

- **`localStorage`**: Preferências visuais e rascunhos não sensíveis.
- **`sessionStorage`**: Estado temporário de formulários.
- **Cookie comum**: Dados não confidenciais de navegação.
- **Cookie com `HttpOnly`**: Tokens de sessão e credenciais de login.

---

## Principais Riscos OWASP no Front-End: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
// VULNERÁVEL: interpreta tags <script> ou <img onerror="..."> injetadas
const inputUsuario = "<img src=x onerror='alert(document.cookie)'>";
document.querySelector('#saudacao').innerHTML = `Olá, ${inputUsuario}`;

// SEGURO: trata a entrada puramente como texto, sem interpretar HTML
document.querySelector('#saudacao').textContent = `Olá, ${inputUsuario}`;
```

---

## Fluxo Comparativo: Ataque vs Defesa

O diagrama do tópico compara um fluxo vulnerável a XSS com uma cadeia de defesa em camadas.

- subgraph Inseguro.

---

## Checklist de Segurança no Vanilla JS

Antes de publicar uma aplicação web em produção, confira os itens da lista de verificação de segurança client-side.

- **Manipulação do DOM**: Use `textContent` ou crie elementos com `createElement()`.
- **Execução de Código**: Passe sempre funções de callback legítimas em vez de strings.
- **Armazenamento**: Armazene credenciais em cookies com `HttpOnly`, `Secure` e `SameSite`.
- **Política de Conteúdo**: Configure `default-src 'self'` e restrinja as origens de scripts externos.
- **Links Dinâmicos**: Rejeite protocolos `javascript:` ou `data:` e adicione `rel` protetor.

---

## Executando

1. Crie um contêiner de teste no DOM executando `const div = document.createElement('div');`.
2. Insira uma string potencialmente perigosa usando `textContent`.
3. Inspecione o resultado.
4. Tente instanciar uma URL com pseudoprotocolo para testar o parser de validação.

---

## Exercício Prático

1. Por que um token JWT armazenado em `localStorage` fica vulnerável em caso de Cross-Site Scripting (XSS)?
2. Qual a função do atributo `rel="noopener noreferrer"` ao abrir links externos com `target="_blank"`?
3. O que acontece quando uma aplicação com CSP configurado como `script-src 'self'` tenta executar um bloco `alert(1)` embutido no HTML?
4. Porque o `localStorage` é compartilhado por todo script que roda na mesma origem.
5. Ele impede que a nova aba aberta acesse a propriedade.

---

## Desafio

Crie uma função Vanilla JS chamada.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Qual a diferença entre Stored XSS e DOM-based XSS?
2. Por que `textContent` é seguro contra XSS enquanto `innerHTML` é vulnerável?
3. Por que a flag `HttpOnly` é fundamental para cookies de sessão?
4. Como a Content Security Policy (CSP) ajuda a mitigar falhas de injeção de script?

---

## Resumo do Tópico

- **O Modelo de Segurança do Navegador**: revise o papel desse eixo no uso da API.
- **Principais Riscos OWASP no Front-End**: revise o papel desse eixo no uso da API.
- **Fluxo Comparativo: Ataque vs Defesa**: revise o papel desse eixo no uso da API.
- **Checklist de Segurança no Vanilla JS**: revise o papel desse eixo no uso da API.
