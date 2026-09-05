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
title: "Express.js: CORS"
description: "Compartilhamento de recursos entre origens em uma API Express: política de mesma origem, requisição simples e preflight, cabeçalhos Access-Control, implementação nativa e com o pacote cors, e credenciais."
---

<!-- _class: lead -->

# Express.js: CORS

Compartilhamento de recursos entre origens em uma API Express: política de mesma origem, requisição simples e preflight, cabeçalhos Access-Control, implementação nativa e com o pacote cors, e credenciais.

---

## Objetivo

- Ao final você entenderá a política de mesma origem, saberá distinguir uma requisição simples de uma com *preflight*, implementar os cabeçalhos de CORS...

---

## Mapa da Aula

- **Objetivo**
- **A política de mesma origem**
- **O que o CORS realmente faz**
- **Requisição simples e preflight**
- **Os cabeçalhos**
- **Implementando à mão**
- **Com o pacote `cors`**
- **`origin: '*'` e credenciais**

---

## Contexto da Aula

- O front-end roda em `localhost:5173`, a API em `localhost:3000`, e o navegador recusa a chamada com uma mensagem sobre CORS.
- Esta aula explica por que isso acontece: e por que o bloqueio é uma proteção, não um defeito.

---

## A política de mesma origem

- Por padrão, o navegador impede que uma página leia a resposta de outra origem.
- Origem é a tripla protocolo + host + porta: e basta um dos três diferir:
- Sem ela, um site malicioso aberto em outra aba faria requisições ao seu banco usando os seus cookies e leria a resposta.
- A política de mesma origem é o que impede que qualquer página leia dados de qualquer serviço em que você esteja autenticado.

---

## O que o CORS realmente faz?

- CORS não é uma restrição imposta pelo servidor: é um mecanismo pelo qual o servidor afrouxa a política do navegador, autorizando origens específicas.
- Duas consequências que costumam surpreender:
- A requisição chegou ao servidor. Um `POST` sem CORS pode ter criado o registro: o
- navegador apenas impediu o JavaScript de ler a resposta.
- Liberar uma origem não protege nada: qualquer cliente que não seja um navegador ignora a política inteira.

---

## Requisição simples e preflight

- Nem toda requisição entre origens é enviada direto.
- Quando ela sai do conjunto "simples", o navegador manda antes um `OPTIONS` para perguntar se pode:
- Ou seja: praticamente toda requisição de uma API JSON dispara preflight: o `Content-Type: application/json` já basta, e o `Authorization` também.
- Se a aplicação não trata `OPTIONS`, o preflight falha e a requisição real nunca é enviada: o console mostra o erro de CORS, e o log do servidor mostra...

---

## Requisição simples e preflight: Tabela

- Simples: `GET`, `HEAD` ou `POST` e `Content-Type` de formulário ou texto puro | não
- Com preflight: qualquer outro método, `Content-Type: application/json`, ou cabeçalho customizado | sim

---

## Os cabeçalhos

- Os cabeçalhos aparece como ponto central da aula, não apenas como item de índice.
- Compartilhamento de recursos entre origens em uma API Express: política de mesma origem, requisição simples e preflight, cabeçalhos Access-Control,...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Implementando à mão

- Um middleware de trinta linhas cobre o caso completo: e deixa explícito o que cada cabeçalho faz:
- Sem ele, um cache intermediário pode guardar a resposta com `Access-Control-Allow-Origin: https://a.com` e entregá-la a uma página de `https://b.com`.
- Sempre que a resposta depende do cabeçalho `Origin`, declare-o em `Vary`.

---

## Implementando à mão: Exemplo 1

```ts
const ORIGENS_PERMITIDAS = ['http://localhost:5173', 'https://app.exemplo.com'];
export function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.get('origin');
  // Ecoa a origem apenas se ela estiver na lista.
  if (origin && ORIGENS_PERMITIDAS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    // Sem isso, um cache pode servir a resposta de uma origem para outra.
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') {
```

---

## Implementando à mão: Exemplo 2

```ts
// Antes de qualquer rota: o preflight precisa ser respondido primeiro.
app.use(cors);
app.use('/api', investmentRouter);
```

---

## Com o pacote `cors`

- O pacote faz o mesmo com configuração declarativa e cobre casos de borda:
- Sem dependências, e cada decisão fica visível no código.
- Trata `Vary`, preflight e variações de configuração por conta própria.

---

## Com o pacote `cors`: Exemplo 1

```ts
    import { cors } from '#middlewares/cors.ts';
    app.use(cors);
```

---

## Com o pacote `cors`: Exemplo 2

```ts
    import cors from 'cors';
    app.use(cors({
      origin: ['http://localhost:5173', 'https://app.exemplo.com'],
      credentials: true,
      maxAge: 86400,
    }));
```

---

## `origin: '*'` e credenciais

- O curinga parece resolver tudo: e tem duas consequências:
- O navegador recusa uma resposta que combine `Access-Control-Allow-Origin: *` com `Access-Control-Allow-Credentials: true`.
- Para enviar cookies ou `Authorization`, a origem precisa ser ecoada explicitamente: o que só é seguro com uma lista de permitidos.
- Do lado do cliente, cookies entre origens exigem uma escolha explícita:

---

## `origin: '*'` e credenciais: Exemplo 1

```ts
app.use(cors({ origin: '*' }));
// Qualquer página da internet pode chamar esta API pelo navegador.
```

---

## `origin: '*'` e credenciais: Exemplo 2

```js
fetch('https://api.exemplo.com/investments', {
  // Sem isso, o navegador não envia cookies para outra origem.
  credentials: 'include',
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Evitando o problema

- A forma mais simples de lidar com CORS é não ter o problema. Duas topologias eliminam a diferença de origem:
- Em produção, o front costuma ser servido por um CDN e a API por outro domínio: e o CORS volta.
- Configure a lista de origens por variável de ambiente para que desenvolvimento, homologação e produção tenham valores diferentes.

---

## Evitando o problema: Tabela

- Servir o front pelo Express: `express.static('public')`: mesma porta, mesma origem
- Proxy no servidor de desenvolvimento: o Vite encaminha `/api` para `localhost:3000`; o navegador vê uma origem só

---

## Evitando o problema: Exemplo

```js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
};
```

---

## Exercício

- Com o projeto `express-auth` rodando em `localhost:3000`:
- Sirva um `index.html` por outro servidor (`npx serve -p 5173`) que faça
- Confirme no log do servidor que a requisição chegou.
- Implemente o middleware de CORS liberando apenas `http://localhost:5173`.
- Verifique no DevTools que o `OPTIONS` aparece antes do `POST`.

---

## Exercício: Exemplo

```txt
  OPTIONS /auth/signin 204 0.8ms
  POST /auth/signin 200 61.4ms
```

---

## Desafio

- Faça a lista de origens permitidas vir de `process.env.CORS_ORIGINS` (separadas por vírgula) e aceite qualquer `localhost` em desenvolvimento.
- Escreva um teste que confirme que, com `NODE_ENV=production` e a variável vazia, nenhuma origem é liberada.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Compartilhamento de recursos entre origens em uma API Express: política de mesma origem, requisição simples e preflight, cabeçalhos Access-Control,...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Conceito

- Quem bloqueia a requisição: o servidor ou o navegador?
- O navegador.
- A requisição chega ao servidor e é processada; o que o navegador impede é o JavaScript da página ler a resposta quando faltam os cabeçalhos de permissão.
- Por que `curl` nunca dá erro de CORS?
- Porque a política de mesma origem é um mecanismo do navegador para proteger sessões de usuários.

---

## Configuração

- Por que `origin: '*'` não funciona com credenciais?
- Porque a especificação proíbe a combinação: uma resposta com `*` e `Allow-Credentials: true` é rejeitada pelo navegador.
- Enviar credenciais exige ecoar a origem específica.
- Para que serve `Vary: Origin`?
- Para que caches não sirvam a resposta de uma origem para outra.

---

## Próxima aula

- Endurecimento: cabeçalhos de segurança, limite de requisições e as injeções que sobram.

---

## Resumo da Aula

- **Express.js: CORS** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
