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
title: "Web APIs: CORS e Segurança"
description: "Slides completos do tópico Web APIs: CORS e Segurança."
---

<!-- _class: lead -->

# Web APIs: CORS e Segurança

Origem: Protocolo + Domínio + Porta · Same-Origin Policy · O que é CORS? · Requisições Simples e Preflight

---

## Objetivo

- Definir origem como a tripla protocolo, domínio e porta.
- Explicar a *Same-Origin Policy* e o que ela protege.
- Diferenciar requisição simples de requisição com *preflight* `OPTIONS`.
- Configurar o envio de credenciais e justificar por que ele proíbe `Access-Control-Allow-Origin: *`.
- Ler uma mensagem de erro de CORS no console e identificar qual cabeçalho falta no servidor.

---

## Mapa do Tópico

- **Origem: Protocolo + Domínio + Porta**.
- **Same-Origin Policy**.
- **O que é CORS?**.
- **Requisições Simples e Preflight**.
- **Credenciais: Cookies e Autenticação**.
- **Cabeçalhos Mais Importantes**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Origem: Protocolo + Domínio + Porta

Para o navegador, uma origem é formada por três partes.

- **`https://app.exemplo.com/dashboard`**: `https://app.exemplo.com:443`.
- **`http://app.exemplo.com/dashboard`**: `http://app.exemplo.com:80`.
- **`https://api.exemplo.com/users`**: `https://api.exemplo.com:443`.
- **`http://localhost:5173`**: `http://localhost:5173`.
- **`http://localhost:3000`**: `http://localhost:3000`.

---

## Origem: Protocolo + Domínio + Porta: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```txt
origem = protocolo + dominio + porta
```

---

## Same-Origin Policy

A Same-Origin Policy é uma regra de segurança do navegador.

- Ela restringe como scripts de uma origem podem ler dados de outra origem.
- Sem essa regra, um site malicioso aberto no navegador poderia tentar ler dados de bancos, e-mails.

---

## O que é CORS?

CORS significa *Cross-Origin Resource Sharing*.

- É o mecanismo pelo qual um servidor informa ao navegador quais origens externas podem acessar suas respostas.
- Em uma requisição cross-origin, o navegador envia um cabeçalho `Origin`.
- O servidor precisa responder com um cabeçalho permitindo essa origem.

---

## Requisições Simples e Preflight

Algumas requisições são consideradas simples.

- **Requisição simples**: Geralmente ocorre com `GET`, `HEAD` ou `POST` usando cabeçalhos e tipos de conteúdo simples.
- **Requisição com preflight**: Ao enviar JSON com `Content-Type: application/json`, usar métodos como `PUT`/`DELETE` ou adicionar cabeçalhos.

---

## Requisições Simples e Preflight: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const resposta = await fetch('https://api.exemplo.com/produtos');
const produtos = await resposta.json();
```

---

## Credenciais: Cookies e Autenticação

Por padrão, `fetch()` não envia cookies em requisições para outra origem.

- Para incluir cookies, é preciso configurar `credentials`.
- O servidor também precisa autorizar credenciais.
- <Aside type="caution" title="Wildcard não combina com credenciais"> Quando `Access-Control-Allow-Credentials: true` é usado.

---

## Credenciais: Cookies e Autenticação: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const resposta = await fetch('https://api.exemplo.com/perfil', {
  credentials: 'include'
});
```

---

## Cabeçalhos Mais Importantes

Todo diagnóstico de CORS passa por saber quem envia cada cabeçalho.

- **`Origin`**: Informa a origem da página que fez a requisição.
- **`Access-Control-Allow-Origin`**: Define quais origens podem ler a resposta.
- **`Access-Control-Allow-Methods`**: Lista métodos permitidos no preflight.
- **`Access-Control-Allow-Headers`**: Lista cabeçalhos permitidos no preflight.
- **`Access-Control-Allow-Credentials`**: Permite uso de cookies/autenticação cross-origin.

---

## Erros Comuns e Diagnóstico

As mensagens de CORS no console são específicas o bastante para apontar a causa, desde que se saiba lê-las.

- **`No 'Access-Control-Allow-Origin' header`**: Back-end.
- ****: Back-end.
- ****: Back-end.
- **Funciona no Postman, falha no navegador**: Back-end ou proxy de desenvolvimento.
- **Cookies não chegam na API**: Front-end e back-end.

---

## Erros Comuns e Diagnóstico: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
try {
  const resposta = await fetch('https://api.exemplo.com/dados');

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  const dados = await resposta.json();
  console.log(dados);
} catch (erro) {
  console.error('Falha na requisicao:', erro);
}
```

---

## Desenvolvimento Local

Durante o desenvolvimento, há três soluções comuns.

- Configurar CORS corretamente no back-end para aceitar `http://localhost:5173`.
- Usar um proxy do servidor de desenvolvimento, como o proxy do Vite.
- Servir front-end e API pela mesma origem em ambiente integrado.

---

## Desenvolvimento Local: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};
```

---

## Quando usar, e quando não usar?

CORS não é uma escolha do front-end.

- **API própria, front-end em outro domínio**: O curinga `*`, que impede o envio de credenciais.
- **Desenvolvimento local em portas diferentes**: Extensão de navegador que desliga a política.
- **API pública de leitura, sem autenticação**: Lista de origens, que precisaria ser mantida à mão.
- **API de terceiros que não envia os cabeçalhos**: Serviço público de *proxy*, que passa a ver todo o tráfego.
- **Cookie de sessão entre subdomínios**: Enviar o token no corpo da requisição.

---

## Executando

1. Abra a aba Network das ferramentas do desenvolvedor.
2. Faça uma requisição `fetch()` para uma API em outra origem.
3. Clique na requisição e procure o cabeçalho `Origin` em Request Headers.
4. Verifique se a resposta contém `Access-Control-Allow-Origin`.

---

## Exercício Prático

1. Por que `http://localhost:5173` e `http://localhost:3000` são origens diferentes?
2. O que é uma requisição preflight?
3. Por que não basta adicionar um cabeçalho CORS no `fetch()`?
4. Porque a origem inclui protocolo, domínio e porta. Mesmo domínio com porta diferente forma.
5. É uma requisição `OPTIONS` enviada automaticamente pelo navegador antes de certas requisições.

---

## Desafio

Imagine uma aplicação em `http://localhost:5173` chamando uma API em `http://localhost:3000`.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. CORS é uma regra do JavaScript ou do navegador?
2. Por que `Access-Control-Allow-Origin: *` não serve para requisições com cookies?
3. Qual método HTTP é usado no preflight?

---

## Resumo do Tópico

- **Origem: Protocolo + Domínio + Porta**: revise o papel desse eixo no uso da API.
- **Same-Origin Policy**: revise o papel desse eixo no uso da API.
- **O que é CORS?**: revise o papel desse eixo no uso da API.
- **Requisições Simples e Preflight**: revise o papel desse eixo no uso da API.
- **Credenciais: Cookies e Autenticação**: revise o papel desse eixo no uso da API.
