---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Autenticação"
description: "Autenticação em uma API Express: sessão com estado versus token sem estado, anatomia de um JWT, assinatura HS256 com node:crypto, middleware de autenticação, expiração, logout e armazenamento no cliente."
---

<!-- _class: lead -->

# Express.js: Autenticação

Autenticação em uma API Express: sessão com estado versus token sem estado, anatomia de um JWT, assinatura HS256 com node:crypto, middleware de autenticação, expiração, logout e armazenamento no cliente.

---

## Objetivo

- Ao final você saberá diferenciar autenticação de autorização, explicar o que um JWT é e o que ele não é, assinar e verificar tokens sem bibliotecas,...

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **Autenticação não é autorização**
- **Sessão com estado ou token sem estado**
- **Anatomia de um JWT**
- **Assinando com `node:crypto`**
- **Verificando**
- **O login**
- **O middleware de autenticação**

---

## Contexto da Aula

- Com o usuário cadastrado, falta responder à pergunta que toda requisição seguinte carrega: quem está chamando?
- Esta aula constrói essa resposta com JSON Web Tokens assinados por `node:crypto`.

---

## Autenticação não é autorização

- São duas perguntas distintas, respondidas por middlewares distintos e com status HTTP distintos:
- Apesar do nome, `401` significa não autenticado: "identifique-se". Quem está identificado mas não tem permissão recebe `403`.
- A confusão vem da própria especificação do HTTP, não do Express.

---

## Autenticação não é autorização: Tabela

- Quem é você?: Autenticação | `401 Unauthorized` | `authenticate`
- O que você pode fazer?: Autorização | `403 Forbidden` | `authorize`

---

## Sessão com estado ou token sem estado

- Há duas formas de o servidor lembrar quem está do outro lado, e a escolha define a arquitetura:
- Para uma aplicação web com um único servidor, uma sessão em cookie é mais simples e permite logout de verdade.
- O JWT brilha quando há várias instâncias, clientes móveis ou serviços diferentes validando o mesmo token.

---

## Sessão com estado ou token sem estado: Tabela

- Onde o estado mora: servidor (memória, Redis) | no próprio token, com o cliente
- Consulta por requisição: sim | não
- Escalar para várias instâncias: exige armazenamento compartilhado | trivial
- Revogar imediatamente: apagar a sessão | difícil: o token é válido até expirar
- Tamanho por requisição: um id curto | o token inteiro
- Uso típico: aplicação web com servidor de páginas | API consumida por SPA e mobile

---

## Anatomia de um JWT

- Um JWT é apenas texto: três partes em Base64URL separadas por ponto.
- Base64 é codificação, não cifra: qualquer pessoa cola o token em jwt.io e lê o conteúdo.
- Nunca coloque senha, CPF ou qualquer dado sensível no payload.
- O que a assinatura garante é integridade: que ninguém alterou os dados —, não sigilo.
- As chaves curtas do payload são padronizadas pela RFC 7519:

---

## Anatomia de um JWT: Exemplo

```txt
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzY0NDAwMDAwLCJleHAiOjE3NjQ0MDM2MDB9.qk3Xr6…
└──────────── header ────────────┘ └──────────── payload ────────────┘ └── signature ──┘
header  (base64url) => {"alg":"HS256","typ":"JWT"}
payload (base64url) => {"sub":"1","iat":1764400000,"exp":1764403600}
signature           => HMAC-SHA256("header.payload", segredo)
```

---

## Assinando com `node:crypto`

- Assinar é calcular um HMAC-SHA256 de `header.payload` com o segredo do servidor. São poucas linhas:
- O `base64` comum usa `+`, `/` e `=`, que têm significado especial em URLs e cabeçalhos.
- O `base64url` troca por `-`, `_` e remove o preenchimento. O Node aceita `'base64url'` diretamente em `Buffer.toString()`.

---

## Verificando

- A verificação é o inverso: e é onde moram as decisões de segurança:
- Três checagens, três ataques evitados:
- Bibliotecas antigas confiavam no campo `alg` do próprio token para escolher como verificar.
- Um atacante trocava `"alg":"none"`, removia a assinatura e era aceito.
- A regra é fixar o algoritmo no servidor e recusar qualquer outro: nunca perguntar ao token.

---

## O login

- A rota de login é onde a senha aparece pela última vez. Ela verifica as credenciais e devolve o token:
- Responder "usuário não encontrado" e "senha incorreta" de formas diferentes entrega a lista de e-mails cadastrados a quem estiver sondando.
- { "email": "ana@example.com", "password": "senha-secreta" }
- { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYTAyIiwibmFtZSI6IkFuYSJ9.qk3Xr6…" }

---

## O middleware de autenticação

- Ele lê o cabeçalho `Authorization`, valida o token e guarda o payload em `req.auth` para quem vier depois:
- O esquema `Bearer` é o padrão da RFC 6750:
- Aplicá-lo a um router inteiro é mais seguro do que rota a rota: não há como esquecer uma:
- { "error": { "status": 401, "message": "Token de acesso ausente" } }

---

## O middleware de autenticação: Exemplo

```txt
GET /investments HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…
```

---

## O ciclo completo

- O ciclo completo aparece como ponto central da aula, não apenas como item de índice.
- Autenticação em uma API Express: sessão com estado versus token sem estado, anatomia de um JWT, assinatura HS256 com node:crypto, middleware de...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Onde o cliente guarda o token

- Não existe opção sem risco: existe a escolha do risco que se prefere:
- Simples e funciona com API em outro domínio. Vulnerável a XSS: qualquer script injetado na página lê o token.
- Inacessível ao JavaScript, logo imune a XSS na leitura.
- Em troca, exige cuidado com CSRF e configuração adicional quando a API está em outro domínio.
- Com XSS ativo, o atacante não precisa ler o cookie: ele faz as requisições a partir da própria página, e o navegador anexa o cookie sozinho.

---

## Onde o cliente guarda o token: Tabela

- XSS lê o token: sim | não
- CSRF: não | sim: mitigado por `SameSite`
- API em outro domínio: simples | exige `credentials` e CORS
- Enviado automaticamente: não | sim

---

## Onde o cliente guarda o token: Exemplo 1

```js
    export function setToken(token) {
      localStorage.setItem('@app:token', token);
    }
    export function getAuthHeaders() {
      const token = localStorage.getItem('@app:token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
```

---

## Onde o cliente guarda o token: Exemplo 2

```ts
    res.cookie('token', token, {
      httpOnly: true,   // JavaScript da página não lê
      secure: true,     // só trafega em HTTPS
      sameSite: 'lax',  // mitiga CSRF
      maxAge: 3600_000,
    });
```

---

## Expiração, renovação e logout

- Um token sem estado não pode ser cancelado: enquanto a assinatura for válida e `exp` não tiver passado, ele funciona.
- Isso tem três consequências práticas.
- Expiração curta. Quanto menor o `exp`, menor a janela de um token roubado. Uma hora é um ponto de partida razoável para um token de acesso.
- Para não obrigar o usuário a fazer login a cada hora, usa-se um par: um *access token* curto e um *refresh token* longo, guardado com mais cuidado e...
- Logout. No cliente, logout é apagar o token. No servidor, o token continua válido até expirar:

---

## Expiração, renovação e logout: Tabela

- Reduzir a janela de risco: `exp` curto (15 min a 1 h)
- Não pedir login o tempo todo: refresh token com estado no servidor
- Revogar um token específico: lista de revogação (`jti`) consultada a cada requisição
- Revogar todos de um usuário: campo `tokenVersion` no usuário, comparado no payload

---

## Expiração, renovação e logout: Exemplo

```js
export function signOut() {
  // Do lado do servidor, o token continua válido até o `exp`.
  localStorage.removeItem('@app:token');
  window.location.href = 'signin.html';
}
```

---

## Exercício

- No projeto `express-auth`:
- Faça login e cole o token em jwt.io: leia o payload sem o segredo.
- Altere um caractere do payload, reenvie e confirme que a API responde `401`.
- Gere um token com `signJwt({ sub: '1' }, -1)` e confirme a recusa por expiração.
- Acrescente `iss: 'investment-api'` ao payload e valide-o em `verifyJwt`.

---

## Exercício: Exemplo

```ts
  const ISSUER = 'investment-api';
  export function verifyJwt(token: string): JwtPayload {
    // … verificação da assinatura …
    if (payload.iss !== ISSUER) {
      throw new Error('Emissor inválido');
    }
    return payload;
  }
```

---

## Desafio

- Implemente a revogação por `tokenVersion`: acrescente o campo ao usuário, inclua-o no payload do token e faça o `authenticate` recusar quando o valor...
- Use isso para implementar "sair de todos os dispositivos". Meça o custo: quantas consultas a mais por requisição?

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Autenticação em uma API Express: sessão com estado versus token sem estado, anatomia de um JWT, assinatura HS256 com node:crypto, middleware de...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Conceitos

- Qual a diferença entre autenticação e autorização?
- Autenticação responde "quem é você" e falha com `401`. Autorização responde "o que você pode fazer" e falha com `403`.
- São middlewares distintos, e o segundo pressupõe o primeiro.
- Por que um JWT não deve conter dados sensíveis?
- Porque o payload é apenas Base64: qualquer pessoa com o token lê o conteúdo.

---

## Operação

- Por que logout não invalida um JWT no servidor?
- Porque o servidor não guarda nada sobre o token: ele apenas confere a assinatura e a expiração.
- Apagar o token no cliente impede o uso por aquele navegador, mas uma cópia roubada continua funcionando até `exp`.
- Qual o problema de um `exp` muito longo?
- A janela de exploração de um token roubado é a validade dele.

---

## Na prática

- O projeto executável desta aula é Express Auth; a etapa correspondente do InvestApp é InvestApp: Autenticação.

---

## Próxima aula

- Autorização: quem pode fazer o quê, depois de identificado.

---

## Arquivos-Chave da Aula

- **src/utils/jwt.ts**: `examples/courses/expressjs/projects/auth/src/utils/jwt.ts` (linhas marcadas `39-41,50-51,55`)
- **src/utils/jwt.ts**: `examples/courses/expressjs/projects/auth/src/utils/jwt.ts` (linhas marcadas `66-72,76-78,82-84`)
- **src/controllers/auth-controller.ts**: `examples/courses/expressjs/projects/auth/src/controllers/auth-controller.ts` (linhas marcadas `39-42,44-49`)
- **src/middlewares/authenticate.ts**: `examples/courses/expressjs/projects/auth/src/middlewares/authenticate.ts` (linhas marcadas `13,15-17,20`)
- **src/routes/investment-router.ts**: `examples/courses/expressjs/projects/auth/src/routes/investment-router.ts` (linhas marcadas `10`)

---

## Resumo da Aula

- **Express.js: Autenticação** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
