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
title: "Express.js: Autorização"
description: "Controle de acesso em uma API Express: 401 versus 403, autorização por posse do recurso, papéis (RBAC), middlewares de autorização, referência direta insegura a objeto e filtro por dono no model."
---

<!-- _class: lead -->

# Express.js: Autorização

Controle de acesso em uma API Express: 401 versus 403, autorização por posse do recurso, papéis (RBAC), middlewares de autorização, referência direta insegura a objeto e filtro por dono no model.

---

## Objetivo

- Ao final você saberá distinguir `401` de `403`, escrever middlewares de autorização por papel e por posse do recurso, e reconhecer a falha de...

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **A falha número um em APIs**
- **`401` ou `403`?**
- **Os dois modelos de autorização**
- **Autorização por posse**
- **Autorização por papel**
- **Onde a verificação deve ficar**
- **Exercício**

---

## Contexto da Aula

- Saber quem está chamando resolve metade do problema.
- A outra metade: o que essa pessoa pode fazer: é onde mora a falha de segurança mais comum em APIs.

---

## A falha número um em APIs

- Uma API bem autenticada e mal autorizada é uma API aberta. O padrão é sempre o mesmo:
- Qualquer pessoa com uma conta válida troca o `:id` e lê o investimento de outra.
- Esse é o BOLA: *Broken Object Level Authorization*: o primeiro item da OWASP API Security Top 10.
- Toda rota que recebe um `:id` precisa responder à pergunta "este recurso é desta pessoa?".

---

## A falha número um em APIs: Exemplo

```ts
router.get('/investments/:id', authenticate, async (req, res) => {
  const investment = await Investment.findById(req.params.id);
  // Autenticado, sim. Mas é o investimento DELE?
  res.json(investment);
});
```

---

## `401` ou `403`?

- Os dois status significam coisas diferentes, e trocá-los confunde o cliente:
- Um front-end costuma tratar `401` fazendo logout e redirecionando para a tela de login.
- Devolver `401` quando o problema é permissão faz o usuário refazer o login para receber o mesmo erro: sem nunca entender o motivo.

---

## `401` ou `403`?: Tabela

- Sem cabeçalho `Authorization`: `401` | identifique-se
- Token inválido ou expirado: `401` | identifique-se de novo
- Autenticado, mas sem o papel exigido: `403` | você não pode fazer isso
- Autenticado, mas o recurso é de outra pessoa: `403` ou `404` | ver adiante

---

## Os dois modelos de autorização

- Quase toda API precisa dos dois, e eles respondem a perguntas diferentes:

---

## Os dois modelos de autorização: Tabela

- Por posse: este recurso pertence a quem está chamando? | meu investimento, meu perfil
- Por papel (RBAC): esta pessoa tem o papel exigido? | só `admin` lista todos os usuários
- Por atributo (ABAC): as condições do contexto permitem? | editar só antes do vencimento

---

## Autorização por posse

- A defesa mais robusta não é verificar depois: é nunca buscar o que não é da pessoa. O filtro entra no model, junto da consulta:
- O recurso de outra pessoa nem entra na memória do processo. É a forma preferida para listagens.
- Necessária quando a operação age sobre um `:id` específico. Vira middleware para não ser esquecida.
- O detalhe mais importante desse middleware é o status: ele responde `404`, não `403`.
- O id do dono vem sempre do token, nunca do corpo ou da query:

---

## Autorização por posse: Exemplo 1

```ts
    export function findAllByUser(userId: string): Investment[] {
      return investments.filter((investment) => investment.userId === userId);
    }
```

---

## Autorização por posse: Exemplo 2

```ts
    export function requireInvestmentOwner(req, _res, next) {
      const investment = Investment.findById(req.params.id);
      if (!investment || investment.userId !== req.auth?.sub) {
        throw new HttpError(404, 'Investimento nao encontrado');
      }
      next();
    }
```

---

## Autorização por papel

- Um papel é apenas um campo do usuário, incluído no token no momento do login. O middleware de fábrica torna a exigência declarativa:
- O uso fica legível na própria definição da rota:
- { "error": { "status": 403, "message": "Sem permissao para esta operacao" } }
- Colocar `role` no payload do token evita uma consulta ao banco por requisição: e cria um atraso: promover ou rebaixar alguém só tem efeito no próximo...
- Se `role` está no token, quem foi rebaixado continua com poderes de administrador até o `exp`.

---

## Autorização por papel: Tabela

- Do payload do token: zero | no próximo login
- Do banco, a cada chamada: uma consulta | imediato

---

## Onde a verificação deve ficar?

- A mesma checagem pode morar em três lugares, com garantias diferentes:
- A combinação que funciona: filtro por dono no model para listagens, middleware para operações sobre um `:id`, e `router.use(authenticate)` no topo para...

---

## Onde a verificação deve ficar?: Tabela

- Middleware: declarativo, visível na definição da rota | esquecer de aplicar em uma rota nova
- Controller: acesso ao contexto completo | repetição em cada função
- Model: vale para toda origem | menos explícito na leitura da rota

---

## Onde a verificação deve ficar?: Exemplo

```ts
// Autenticação para o router inteiro: rota nova já nasce protegida.
router.use(authenticate);
router.get('/', investmentController.index);
router.post('/', investmentController.store);
router.delete('/:id', requireInvestmentOwner, investmentController.destroy);
```

---

## Exercício

- No projeto `express-auth`:
- Faça login como `ana@example.com` e crie um investimento.
- Cadastre um segundo usuário, faça login com ele e tente apagar o investimento da Ana.
- Confirme que a resposta é `404` e explique por quê.
- Acrescente `PUT /investments/:id` protegido por `requireInvestmentOwner`.

---

## Exercício: Exemplo

```ts
  router.get('/', authenticate, requireRole('admin'), userController.index);
  router.delete(
    '/:id',
    authenticate,
    requireRole('admin'),
    userController.destroy,
  );
```

---

## Desafio

- Implemente autorização por atributo: um investimento só pode ser editado antes da data de vencimento.
- Escreva `requireEditableInvestment` combinando posse e condição temporal, e decida qual status devolver quando a posse está correta mas o prazo passou:...

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Controle de acesso em uma API Express: 401 versus 403, autorização por posse do recurso, papéis (RBAC), middlewares de autorização, referência direta...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Status e semântica

- Quando usar `403` e quando usar `401`?
- Trocar os dois faz o front-end deslogar o usuário por um problema que não é de identidade.
- Por que responder `404` em vez de `403` para um recurso de outra pessoa?
- Porque `403` confirma que o id existe, permitindo enumerar recursos alheios pelos status das respostas.

---

## Implementação

- O que é BOLA e como se evita?
- É acessar o objeto de outro usuário trocando o `:id` em uma rota autenticada.
- Evita-se filtrando por dono na própria consulta e exigindo um middleware de posse nas rotas que agem sobre um id.
- Por que o `userId` deve vir do token e não do corpo?
- Porque o corpo é controlado pelo cliente: com `userId` no corpo, qualquer pessoa cria ou altera registros em nome de outra.

---

## Na prática

- O projeto executável desta aula é Express Auth.

---

## Próxima aula

- CORS: por que o navegador bloqueia a chamada da sua própria API.

---

## Arquivos-Chave da Aula

- **src/middlewares/authorize.ts**: `examples/courses/expressjs/projects/auth/src/middlewares/authorize.ts` (linhas marcadas `39-41`)
- **src/controllers/investment-controller.ts**: `examples/courses/expressjs/projects/auth/src/controllers/investment-controller.ts`
- **src/middlewares/authorize.ts**: `examples/courses/expressjs/projects/auth/src/middlewares/authorize.ts` (linhas marcadas `12,18-20`)
- **src/routes/user-router.ts**: `examples/courses/expressjs/projects/auth/src/routes/user-router.ts` (linhas marcadas `9`)

---

## Resumo da Aula

- **Express.js: Autorização** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
