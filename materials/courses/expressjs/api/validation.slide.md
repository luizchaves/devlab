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
title: "Express.js: Validação"
description: "Validação de entrada em uma API Express: as camadas de validação, middleware nativo de fábrica, schemas com Zod, restrições no banco de dados e o formato da resposta de erro de validação."
---

<!-- _class: lead -->

# Express.js: Validação

Validação de entrada em uma API Express: as camadas de validação, middleware nativo de fábrica, schemas com Zod, restrições no banco de dados e o formato da resposta de erro de validação.

---

## Objetivo

- Ao final você saberá em quais camadas a validação precisa existir, escrever um middleware de validação sem dependências, descrever regras com um schema...

---

## Mapa da Aula

- **Objetivo**
- **Validação em camadas**
- **Middleware de validação nativo**
- **Schemas com Zod**
- **O formato do erro de validação**
- **Restrições no banco**
- **Exercício**
- **Desafio**

---

## Contexto da Aula

- Todo dado que chega pela rede é hostil até prova em contrário: pode faltar, vir com o tipo errado, com o tamanho errado ou com conteúdo malicioso.
- Esta aula trata de barrar isso antes que chegue ao controller.

---

## Validação em camadas

- Validar em um lugar só é insuficiente: cada camada protege de uma coisa diferente:
- O HTML `required` melhora a experiência e nada mais: qualquer pessoa envia a requisição direto para a API.
- Toda regra que importa precisa existir também no servidor.

---

## Validação em camadas: Tabela

- Formulário: erro de digitação, ida desnecessária ao servidor | sim: basta usar `curl`
- Middleware: formato, tipo, tamanho, campo ausente | não, se registrado antes da rota
- Regra de negócio: estado inválido no domínio | não
- Banco: dado inconsistente vindo de qualquer origem | não: vale até para seed e migração

---

## Middleware de validação nativo

- O padrão de fábrica da aula de Middleware resolve o caso mais comum: campos obrigatórios: sem nenhuma dependência:
- Regras de formato também cabem em funções pequenas e testáveis:
- Validar e-mail por expressão regular só filtra erros grosseiros: a gramática real de um endereço válido é longa demais.
- Para o que importa (o endereço existe e é do usuário?), a única prova é enviar um e-mail de confirmação, assunto da aula de Envio de E-mail.

---

## Middleware de validação nativo: Exemplo 1

```ts
export function requireFields(...campos: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const faltando = campos.filter((campo) => body[campo] === undefined || body[campo] === '');
    if (faltando.length > 0) {
      throw new HttpError(422, `Campos obrigatórios: ${faltando.join(', ')}`);
    }
    next();
  };
}
```

---

## Middleware de validação nativo: Exemplo 2

```ts
router.post('/', requireJson, requireFields('name', 'email', 'password'), userController.store);
```

---

## Schemas com Zod

- Quando as regras crescem, descrevê-las declarativamente evita dezenas de `if`.
- O Zod define o formato uma vez e ainda infere o tipo TypeScript a partir dele.
- Antes de chegar ao schema, porém, falta uma peça: um erro capaz de carregar o mapa de campos, já que o `HttpError` leva apenas uma mensagem.
- O `errorHandler` passa a incluir `issues` quando ele existir:
- Com isso resolvido, o schema descreve as regras e o middleware apenas o executa:

---

## Schemas com Zod: Tabela

- Dependência: nenhuma | uma dependência de produção
- Regras simples: curto e claro | curto e claro
- Objetos aninhados e arrays: verboso e repetitivo | declarativo
- Tipo TypeScript: escrito à mão, separado | inferido do schema
- Conversão (`"3"` → `3`): manual | `z.coerce.number()`
- Mensagem por campo: montada à mão | vem pronta em `error.issues`

---

## Schemas com Zod: Exemplo 1

```ts
export class ValidationError extends HttpError {
  issues: Record<string, string>;
  constructor(issues: Record<string, string>) {
    super(422, 'Dados inválidos');
    this.name = 'ValidationError';
    this.issues = issues;
  }
}
```

---

## Schemas com Zod: Exemplo 2

```ts
res.status(status).json({
  error: {
    status,
    ...(error instanceof ValidationError ? { issues: error.issues } : {}),
    message: status >= 500 ? 'Erro interno do servidor' : error.message,
  },
});
```

---

## O formato do erro de validação

- Um erro de validação precisa dizer qual campo falhou: senão o front-end não consegue destacar o input.
- Uma mensagem única em texto obriga a adivinhação:
- { "name": "A", "email": "nao-e-email", "password": "123" }
- { "error": { "status": 422, "message": "Dados inválidos", "issues": { "name": "informe ao menos 2 caracteres", "email": "formato inválido", "password":...
- A conversão das *issues* do Zod para esse mapa cabe em uma função:

---

## O formato do erro de validação: Exemplo

```ts
function formatIssues(error: ZodError): Record<string, string> {
  return Object.fromEntries(
    error.issues.map((issue) => [issue.path.join('.'), issue.message]),
  );
}
```

---

## Restrições no banco

- A última camada é a única que vale para toda origem: inclusive um seed, uma migração ou uma consulta manual.
- É por isso que ela não é opcional:
- A violação chega ao Express como erro da biblioteca e precisa de tradução: `UNIQUE` vira `409`, como visto em Tratamento de Erros.
- Só o índice `UNIQUE` impede de verdade: a checagem prévia serve para a mensagem bonita.

---

## Restrições no banco: Exemplo

```sql
CREATE TABLE "User" (
  "id"        TEXT     NOT NULL PRIMARY KEY,
  "name"      TEXT     NOT NULL,
  "email"     TEXT     NOT NULL,
  "password"  TEXT     NOT NULL CHECK (LENGTH(password) >= 8),
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

---

## Exercício

- No projeto `express-typescript`:
- Escreva `requireFields` conforme a aula e aplique-o em `POST /users`.
- Acrescente `validateUser` com as regras de nome, e-mail e senha.
- Faça a resposta de erro trazer o mapa `issues` com um campo por chave.
- Responda `422`, e não `400`, para a falha de validação.

---

## Exercício: Exemplo

```ts
  import type { NextFunction, Request, Response } from 'express';
  import { ValidationError } from '#errors/ValidationError.ts';
  import { validateUser } from '#validators/user.ts';
  export function validateUserBody(req: Request, _res: Response, next: NextFunction) {
    const erros = validateUser((req.body ?? {}) as UserInput);
    if (erros.length > 0) {
      const issues = Object.fromEntries(
        erros.map((erro) => erro.split(': ') as [string, string]),
      );
      throw new ValidationError(issues);
```

---

## Desafio

- Adapte o middleware `validate(schema)` para validar também `req.params` e `req.query`, recebendo um objeto `{ body?, params?, query? }` de schemas.
- Trate o caso de `?page=2`: a query chega como string e precisa virar número: compare fazer isso à mão com usar `z.coerce.number()`.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Validação de entrada em uma API Express: as camadas de validação, middleware nativo de fábrica, schemas com Zod, restrições no banco de dados e o...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Camadas

- Por que validar no front-end não dispensa validar no servidor?
- Porque o cliente é controlado por quem chama: qualquer pessoa envia a requisição direto com `curl`.
- A validação do formulário melhora a experiência; a do servidor é a que protege os dados.
- Por que manter restrições no banco se o middleware já validou?
- Porque o banco é a única camada que vale para toda origem: seed, migração, script, consulta manual: e a única que resolve corridas entre requisições...

---

## Implementação

- Por que `safeParse` e não `parse`?
- Qual a vantagem de substituir `req.body` pelo dado validado?
- O controller passa a trabalhar com o dado já convertido e com valores padrão aplicados, e o tipo inferido do schema corresponde ao que está lá de fato:...
- Por que reunir todos os erros antes de responder?
- Porque responder no primeiro erro obriga o usuário a submeter o formulário várias vezes para descobrir todos os problemas.

---

## Próxima aula

- Paginação, Filtros e Ordenação: parâmetros de consulta em coleções que crescem.

---

## Resumo da Aula

- **Express.js: Validação** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
