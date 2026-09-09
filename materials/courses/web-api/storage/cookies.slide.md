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
title: "Web APIs: Cookies e Sessão"
description: "Slides completos do tópico Web APIs: Cookies e Sessão."
---

<!-- _class: lead -->

# Web APIs: Cookies e Sessão

Cookies vs Web Storage · Como um Cookie Circula? · Atributos Importantes · Criando Cookies com JavaScript

---

## Objetivo

- Contrastar cookies e Web Storage quanto a envio automático, tamanho e acesso por JavaScript.
- Descrever o percurso de um cookie entre `Set-Cookie` e o cabeçalho `Cookie`.
- Configurar `Secure`, `HttpOnly`, `SameSite`, `Path`, `Domain` e expiração, e dizer o que cada um previne.
- Criar e remover cookies por `document.cookie`, reconhecendo os limites dessa interface.
- Enviar cookies em uma chamada `fetch()` com a opção `credentials` e justificar quando isso é necessário.

---

## Mapa do Tópico

- **Cookies vs Web Storage**.
- **Como um Cookie Circula?**.
- **Atributos Importantes**.
- **Criando Cookies com JavaScript**.
- **Cookies em Requisições `fetch`**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Cookies vs Web Storage

A diferença que decide entre os dois não é a capacidade, e sim o envio automático.

- **Enviado automaticamente em HTTP**: Não.
- **Acessível por JavaScript**: Sim.
- **Capacidade típica**: Cerca de 5 MB por origem.
- **Expiração**: Ao fechar a aba.
- **Uso comum**: Estado temporário por aba.

---

## Como um Cookie Circula?

O servidor pode criar um cookie com o cabeçalho `Set-Cookie`.

- Depois disso, o navegador decide em quais requisições futuras deve enviar esse valor.
- Exemplo de resposta HTTP criando cookie.
- ---.

---

## Atributos Importantes

Os atributos anexados ao cabeçalho `Set-Cookie` definem o ciclo de vida.

- **`Strict`**: Envia apenas em navegação originada do mesmo site.
- **`Lax`**: Envia em navegações principais seguras, mas reduz envio cross-site.
- **`None`**: Permite envio cross-site, mas exige `Secure`.

---

## Criando Cookies com JavaScript

Cookies simples podem ser criados.

- cookie.
- Para ler cookies acessíveis por JavaScript.
- Para remover, sobrescreva o cookie com expiração no passado ou `Max-Age=0`.

---

## Criando Cookies com JavaScript: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
document.cookie = 'tema=dark; Path=/; Max-Age=86400; SameSite=Lax';
```

---

## Cookies em Requisições `fetch`

Em chamadas para a mesma origem, o navegador pode enviar cookies automaticamente.

- Em chamadas para outra origem, normalmente será necessário configurar `credentials`.
- Também é necessário que a API configure CORS corretamente.
- ---.

---

## Cookies em Requisições `fetch`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const resposta = await fetch('https://api.exemplo.com/perfil', {
  credentials: 'include'
});

const perfil = await resposta.json();
```

---

## Quando usar, e quando não usar?

A propriedade que distingue o cookie de todo o resto é o envio automático em cada requisição para o domínio.

- **Sessão autenticada**: O JavaScript não alcança o valor, o que limita o estrago de um XSS.
- **Preferência de interface**: Não precisa ir ao servidor a cada requisição.
- **Estado válido só até fechar a aba**: Expira sozinho, sem data a controlar.
- **Token de acesso que o front-end precisa ler**: Em `localStorage`, qualquer script injetado o lê.
- **Consentimento de cookies e faixas de aviso**: O servidor precisa da decisão já na primeira resposta.

---

## Boas Práticas

As recomendações do tópico derivam dos atributos vistos até aqui.

- **Sessão autenticada**: Cookie `HttpOnly`, `Secure`, `SameSite=Lax` ou `SameSite=None` conforme arquitetura.
- **Preferência visual simples**: `localStorage` ou cookie não sensível.
- **Dados grandes ou listas**: Evite cookies; use `localStorage` ou IndexedDB.
- **Token lido manualmente pelo front-end**: Avalie risco de XSS antes de usar storage acessível por JS.
- **Aplicação em HTTPS**: Use `Secure` em cookies de autenticação.

---

## Executando

1. Abra uma página local ou qualquer site de teste no navegador.
2. No console, execute `document.cookie = 'aula=webapi; Path=/; Max-Age=300; SameSite=Lax';`.
3. Abra a aba Application ou Storage das ferramentas do desenvolvedor.
4. Localize a seção Cookies e confirme que o cookie foi criado.

---

## Exercício Prático

1. Por que cookies são usados em autenticação com mais frequência que `localStorage`?
2. Qual atributo impede JavaScript de ler um cookie?
3. O que muda quando uma requisição `fetch()` usa `credentials: 'include'`?
4. Porque cookies podem ser enviados automaticamente pelo navegador ao servidor e podem ser.
5. `HttpOnly`.

---

## Desafio

Explique qual configuração de cookie é mais adequada para uma sessão de login em produção e por quê.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Qual mecanismo é melhor para guardar um array grande de itens: cookie ou Web Storage?
2. Por que `SameSite=None` exige `Secure`?
3. Um cookie `HttpOnly` aparece em `document.cookie`?

---

## Resumo do Tópico

- **Cookies vs Web Storage**: revise o papel desse eixo no uso da API.
- **Como um Cookie Circula?**: revise o papel desse eixo no uso da API.
- **Atributos Importantes**: revise o papel desse eixo no uso da API.
- **Criando Cookies com JavaScript**: revise o papel desse eixo no uso da API.
- **Cookies em Requisições `fetch`**: revise o papel desse eixo no uso da API.
