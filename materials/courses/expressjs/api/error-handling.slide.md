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
title: "Express.js: Tratamento de Erros"
description: "Centralização do tratamento de erros em uma API Express: classe HttpError, erros operacionais e de programação, tradução de erros do banco, formato de resposta e falhas fora do ciclo de requisição."
---

<!-- _class: lead -->

# Express.js: Tratamento de Erros

Centralização do tratamento de erros em uma API Express: classe HttpError, erros operacionais e de programação, tradução de erros do banco, formato de resposta e falhas fora do ciclo de requisição.

---

## Objetivo

- Ao final você saberá distinguir erro operacional de defeito de programação, lançar erros com status a partir de qualquer camada, traduzir erros de...

---

## Mapa da Aula

- **Objetivo**
- **Duas naturezas de erro**
- **O caminho de um erro**
- **A classe `HttpError`**
- **O middleware de erro**
- **Erros `async` no Express 5**
- **Traduzindo erros de bibliotecas**
- **O formato da resposta de erro**

---

## Contexto da Aula

- Em uma API, erro não é exceção: é uma das saídas normais de qualquer rota.
- Esta aula transforma o tratamento de erros de "um `try`/`catch` em cada controller" em uma decisão tomada em um único arquivo.

---

## Duas naturezas de erro

- Antes de escrever qualquer `catch`, é preciso separar dois tipos que exigem tratamentos opostos:
- O erro operacional é previsto: ele faz parte do contrato da API e merece uma mensagem clara.
- O defeito é imprevisto: a mensagem não ajuda o cliente e pode entregar detalhes internos.
- Um `catch` que devolve `400` para qualquer falha transforma um `TypeError` em "requisição inválida".
- O cliente conserta o que não estava quebrado, e o defeito permanece.

---

## Duas naturezas de erro: Tabela

- Operacional: recurso inexistente, e-mail duplicado, token expirado | `4xx` específico | responder e seguir
- Defeito de programação: `undefined.map()`, variável não declarada, tipo errado | `500` genérico | logar e corrigir

---

## O caminho de um erro

- Independentemente da camada em que nasce, todo erro converge para o mesmo middleware:

---

## A classe `HttpError`

- Um erro que já carrega o status permite ao controller decidir a resposta sem chamar `res`:
- O uso é uma linha, de qualquer profundidade da pilha:
- Dentro de um handler síncrono ou `async`, `throw` basta: o Express 5 captura os dois.

---

## A classe `HttpError`: Exemplo

```ts
const user = User.findById(id);
if (!user) {
  throw new HttpError(404, 'Usuário não encontrado');
}
res.json(user);
```

---

## O middleware de erro

- É o único lugar da aplicação que sabe como um erro vira resposta. Ele decide o status, o que o cliente lê e o que fica no log:
- Três decisões estão condensadas nele:
- Status: `HttpError` traz o seu; qualquer outra coisa é `500`.
- Log: só `5xx` é registrado: `4xx` é comportamento esperado do cliente.
- Mensagem: `4xx` devolve a mensagem original; `5xx` devolve texto genérico.

---

## O middleware de erro: Exemplo

```ts
app.use('/users', userRouter);
// notFound antes: cria o erro. errorHandler depois: responde.
app.use(notFound);
app.use(errorHandler);
```

---

## Erros `async` no Express 5

- No Express 4, um erro lançado dentro de uma função `async` virava uma *promise* rejeitada que o framework não observava: a requisição travava até o...
- A solução era repetir `try`/`catch` em cada rota ou instalar `express-async-errors`.
- Não para repassar o erro: para traduzi-lo.
- Se o erro do banco precisa virar `404` antes de subir, o `catch` faz a tradução e relança um `HttpError`.

---

## Erros `async` no Express 5: Exemplo 1

```js
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

---

## Erros `async` no Express 5: Exemplo 2

```ts
router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
```

---

## Traduzindo erros de bibliotecas

- O Prisma, o driver de banco e o parser de JSON lançam erros próprios, com códigos próprios.
- Cada um precisa de uma tradução para o vocabulário HTTP:
- A tradução pode ficar no `catch` da camada que conhece a biblioteca: o model: ou em um trecho do próprio `errorHandler`:
- Traduzir o status não autoriza repassar a mensagem. `Unique constraint failed on the fields: (email)` entrega o nome da coluna e do índice.
- Responda "E-mail já cadastrado".

---

## Traduzindo erros de bibliotecas: Tabela

- Prisma: `P2025`: registro não encontrado | `404`
- Prisma: `P2002`: violação de unicidade | `409`
- Prisma: `P2003`: violação de chave estrangeira | `400`

---

## Traduzindo erros de bibliotecas: Exemplo

```ts
const PRISMA_STATUS: Record<string, number> = { P2025: 404, P2002: 409, P2003: 400 };
function statusOf(error: Error): number {
  if (error instanceof HttpError) return error.status;
  if (error instanceof SyntaxError && 'body' in error) return 400;
  const code = (error as { code?: string }).code;
  return (code && PRISMA_STATUS[code]) ?? 500;
}
```

---

## O formato da resposta de erro

- O importante é que seja um só em toda a API. O formato usado neste guia é o mínimo suficiente:
- { "error": { "status": 404, "message": "Usuário não encontrado" } }
- Quando a API é pública ou consumida por times diferentes, vale adotar o formato padronizado da RFC 9457, com `Content-Type: application/problem+json`:
- { "type": "https://example.com/probs/validation", "title": "Dados inválidos", "status": 422, "detail": "O campo \\"email\\" não é um e-mail válido",...

---

## Falhas fora do ciclo de requisição

- O `errorHandler` só alcança o que acontece dentro de uma requisição.
- Um erro em um `setTimeout`, num evento ou numa *promise* solta escapa dele e derruba o processo:
- Depois de uma exceção não capturada, o processo pode estar com conexões meio abertas e estado inconsistente.
- O comportamento correto é registrar e sair: deixando o gerenciador de processos subir uma instância limpa. O assunto continua em Deploy.

---

## Falhas fora do ciclo de requisição: Exemplo

```ts
process.on('unhandledRejection', (motivo) => {
  console.error({ level: 'error', tipo: 'unhandledRejection', motivo });
  // Encerra: o estado do processo é desconhecido a partir daqui.
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error({ level: 'error', tipo: 'uncaughtException', stack: error.stack });
  process.exit(1);
});
```

---

## Exercício

- No projeto `express-typescript`:
- Faça `parseId` lançar `HttpError(400)` para um id não numérico e confirme a resposta.
- Acrescente ao `errorHandler` a tradução de `SyntaxError` de JSON malformado para `400`
- com a mensagem "Corpo JSON inválido".
- Inclua o `requestId` no corpo da resposta de erro.

---

## Exercício: Exemplo

```ts
  export function errorHandler(error: Error, req: Request, res: Response, _next: NextFunction) {
    let status = error instanceof HttpError ? error.status : 500;
    let message = error.message;
    // O SyntaxError de express.json() carrega a propriedade `body`.
    if (error instanceof SyntaxError && 'body' in error) {
      status = 400;
      message = 'Corpo JSON inválido';
    }
    if (status >= 500) {
      console.error({ level: 'error', requestId: req.id, stack: error.stack });
      message = 'Erro interno do servidor';
    }
```

---

## Desafio

- Converta as respostas de erro da aplicação para o formato da RFC 9457: crie `src/errors/problem.ts` com uma função que monte o objeto `{ type, title,...
- Discuta o que se ganha e o que se perde em relação ao formato simples.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Centralização do tratamento de erros em uma API Express: classe HttpError, erros operacionais e de programação, tradução de erros do banco, formato de...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Naturezas

- Qual a diferença entre erro operacional e defeito de programação?
- O operacional é previsto e faz parte do contrato: recurso inexistente, e-mail duplicado: e vira `4xx` com mensagem útil.
- O defeito é um bug: vira `500` genérico, com o detalhe apenas no log, e exige correção de código.
- Por que `4xx` não é registrado no log de erro?
- Porque é comportamento esperado do cliente. Registrá-lo como erro enche o log de ruído e esconde os `5xx`, que são os que exigem ação.

---

## Fluxo

- Por que o `notFound` precisa vir antes do `errorHandler`?
- Porque o `notFound` cria o erro 404 e o encaminha; quem responde é o `errorHandler`.
- Invertidos, o handler de erro seria alcançado antes de existir erro e o `notFound` jamais executaria.
- Em quais situações `next(erro)` ainda é necessário no Express 5?
- Quando o erro nasce fora do fluxo que o Express envolve: callbacks de API antiga (`fs.readFile`), listeners de evento e handlers de `stream`.

---

## Próxima aula

- Validação: impedir que a entrada inválida chegue ao controller.

---

## Arquivos-Chave da Aula

- **src/errors/HttpError.ts**: `examples/courses/expressjs/projects/typescript/src/errors/HttpError.ts`
- **src/middlewares/error-handler.ts**: `examples/courses/expressjs/projects/typescript/src/middlewares/error-handler.ts` (linhas marcadas `15,17-19,24`)
- **src/middlewares/error-handler.ts**: `examples/courses/expressjs/projects/typescript/src/middlewares/error-handler.ts`

---

## Resumo da Aula

- **Express.js: Tratamento de Erros** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
