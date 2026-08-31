---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "InvestApp: Validação com Zod"
description: "Quarta etapa do InvestApp: validação de body, query string e parâmetros de rota com Zod, e como ela se relaciona com a validação no front-end e as restrições do banco."
---

<!-- _class: lead -->

# InvestApp — Etapa 4: Validação

Quarta etapa da trilha prática InvestApp: validação estrita de requisições com Zod e a arquitetura das três camadas de proteção.

---

## Visão Geral da Etapa 4

- **Objetivo**: Proteger a API criando uma barreira explícita na entrada de cada requisição.
- **Escopo**:
  - Instalação e integração da biblioteca **Zod**.
  - Criação do middleware genérico `validate.ts`.
  - Definição de schemas em `investment.schema.ts` para `body`, `query` e `params`.
  - Limpeza total de verificações manuais de dados dentro dos controllers.
- **Stack**: Node.js, Express.js 5, TypeScript, Zod.

---

## História de Usuário & Critérios (US04)

- **Como** investidor,
- **Quero** receber mensagens claras indicando qual campo está errado e a razão da falha,
- **Para** que eu possa corrigir a requisição sem adivinhar.

### Critérios de Aceite Destacados:
- **CA04.1**: Corpo inválido retorna HTTP `400 Bad Request` com array de problemas (`issues`).
- **CA04.3**: Parâmetro `:id` que não seja UUID válido é rejeitado antes de consultar o armazenamento.
- **CA04.6**: Controllers zerados de instruções `if` para checagem de tipos ou formato.

---

## As Três Camadas de Validação

Confundir o papel do front-end, da API e do banco de dados é a causa principal de falhas de segurança e integridade.

| Camada | Onde Roda | Propósito Principal | O atacante contorna? |
| :--- | :--- | :--- | :--- |
| **Front-end** | Navegador | Retorno visual imediato ao usuário | **Sim** (Trivialmente) |
| **API (Zod)** | Servidor | Barreira de contrato antes da regra | **Não** |
| **Banco** | SGBD | Garantia de integridade persistida | **Não** |

---

## Camada 1: Front-end (Experiência do Usuário)

- **Validação Nativa HTML5**: Atributos como `required`, `minlength="3"`, `type="number"`.
- **Validação com DOM API**: Uso de `checkValidity()`, `validity.tooShort` e `setCustomValidity()`.
- **Vantagem**: Feedback em tempo real sem ida ao servidor (latency zero).
- **Alerta de Segurança**: Qualquer cliente HTTP (`curl`, Postman, DevTools) pode ignorar o HTML e enviar payloads maliciosos diretamente para a API.

---

## Camada 2: API (A Barreira do Servidor)

- **Onde atua**: Entre o protocolo HTTP e a regra de negócio da aplicação.
- **Responsabilidade**: Recusar dados malformados, tipos incorretos ou campos excedentes.
- **Implementação nesta etapa**: Middleware `validate` + Zod schemas.
- **Padronização de Erro**: Retorno HTTP 400 estruturado com detalhes técnicos amigáveis:
  ```json
  {
    "error": "Dados de requisição inválidos",
    "issues": [{ "path": ["body", "name"], "message": "String must contain at least 3 character(s)" }]
  }
  ```

---

## Arquitetura da Validação na API

```txt
 ┌────────────────┐     ┌──────────────────┐     ┌───────────────────────┐
 │ Cliente / HTTP │ ──> │ Roteador Express │ ──> │ Middleware validate() │
 └────────────────┘     └──────────────────┘     └───────────┬───────────┘
                                                             │
                              ┌──────────────────────────────┴──────────────────────────────┐
                              ▼ (Dado Válido)                                               ▼ (Dado Inválido)
                   ┌──────────────────────┐                                      ┌──────────────────────┐
                   │ InvestmentController │                                      │ HttpError 400 (Zod)  │
                   └──────────┬───────────┘                                      └──────────┬───────────┘
                              ▼                                                             ▼
                   ┌──────────────────────┐                                      ┌──────────────────────┐
                   │ Model / Persistência │                                      │ errorHandler         │
                   └──────────────────────┘                                      └──────────────────────┘
```

- A validação ocorre **na fronteira** da aplicação.
- Se o contrato for violado, o handler principal do controller **nunca é executado**.

---

## O Middleware Genérico (`src/middlewares/validate.ts`)

- **Padrão Higher-Order Function**: `validate(schema)` retorna uma função middleware com a assinatura nativa do Express `(req, res, next)`.
- **Validação Unificada**: Agrupa `body`, `query` e `params` em um único objeto testado com `schema.safeParseAsync(...)`.

```typescript
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      return next(new HttpError(400, 'Dados de requisição inválidos', result.error.issues));
    }
    return next();
  };
};
```

---

## Schemas com Zod (`src/schemas/investment.schema.ts`)

- **O que é o Zod?**: Biblioteca TypeScript-first para declaração e validação de schemas com inferência automática de tipos estáticos (`z.infer<typeof schema>`).
- **Organização Didática**:
  1. **Definição por fonte de dados**: `body` (`name`, `value`), `params` (`id`), `query` (`name`).
  2. **Composição por rota**: `createInvestmentSchema`, `readInvestmentByIdSchema`, `updateInvestmentSchema`.

---

## Primitivos & Validadores do Zod (`z.object`, `z.string`, `z.number`)

- **`z.object({ ... })`**: Valida a estrutura de objetos e suas chaves (ex: `req.body`, `req.params`).
- **`z.string()`**: Valida textos com encadeamento de restrições:
  - `.min(3, 'mensagem')` / `.max(100)`: Limites de tamanho da string.
  - `.uuid('mensagem')` / `.email()` / `.url()`: Formatos predefinidos.
- **`z.number()`**: Valida tipo numérico (`.positive()`, `.int()`, `.min(0)`).
- **Modificadores de Opcionalidade**: `.optional()` (permite `undefined`) e `.partial()` (torna todas as chaves do objeto opcionais).
- **Enumerações e Listas**: `z.enum(['ativo', 'inativo'])` (valores restritos) e `z.array(...)` (listas de dados).

---

## Código dos Schemas de Investimento

```typescript
import { z } from 'zod';

export const createInvestmentSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    value: z.number().positive('Valor deve ser positivo'),
  }),
});

export const readInvestmentByIdSchema = z.object({
  params: z.object({ id: z.string().uuid('ID deve ser um UUID válido') }),
});

export const updateInvestmentSchema = z.object({
  params: readInvestmentByIdSchema.shape.params,
  body: createInvestmentSchema.shape.body.partial(),
});
```

---

## Injeção de Schemas no Roteador (`src/routes/investments.routes.ts`)

O roteador declara explicitamente o contrato de entrada de cada endpoint:

```typescript
import { validate } from '@/middlewares/validate.ts';
import { createInvestmentSchema, readInvestmentByIdSchema } from '@/schemas/investment.schema.ts';

router.post(
  '/investments',
  requireJson,
  validate(createInvestmentSchema),
  InvestmentController.create
);

router.get(
  '/investments/:id',
  validate(readInvestmentByIdSchema),
  InvestmentController.getById
);
```

---

## Camada 3: Banco de Dados (Última Linha de Defesa)

- **Por que é necessária?**: A API protege requisições HTTP, mas a base de dados pode ser alterada por scripts de migração, seeders, interfaces administrativas ou outros microserviços.
- **Restrições de Tabela**:
  - `NOT NULL`: Garante obrigatoriedade.
  - `CHECK (value > 0)`: Mesma regra do `z.number().positive()`.
  - `UNIQUE`: Impede duplicidade (ex: e-mail ou CPF), evitando *race conditions*.
  - `FOREIGN KEY`: Garante integridade referencial entre entidades.

---

## Paralelo: Schemas de Validação vs Prisma Schema

Comparativo entre a validação na borda (Zod) e a integridade declarada no banco (Prisma ORM):

```prisma
// prisma/schema.prisma
model Investment {
  id        String   @id @default(uuid())
  name      String   @db.VarChar(100)
  value     Float    // No banco: CHECK (value > 0)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@index([userId])
}
```

- **API (Zod)**: Bloqueia requisições HTTP malformadas antes da controller com HTTP 400.
- **Prisma/SQL**: Assegura integridade física no SGBD contra qualquer origem de dados.

---

## Race Conditions & A Ilusão do `if` na Aplicação

### Por que checar e-mail único via código pode falhar?

- Duas requisições simultâneas consultam o banco ao mesmo tempo: ambas leem que o e-mail não existe.
- Ambas prosseguem e realizam o `INSERT`, resultando em registros duplicados.
- **Solução**: Delegar a unicidade ao constraint `UNIQUE` da tabela no banco de dados e tratar a exceção na API como erro HTTP 409 Conflict.

---

## Executando & Testando com `requests.http`

Testes práticos para validar todos os cenários da etapa 4:

1. **Post com Nome Curto (Rejeição 400)**:
   - Payload: `{ "name": "Ab", "value": 100 }` -> HTTP 400 com issue `minlength`.
2. **GET por ID com formato inválido (Rejeição 400)**:
   - Endpoint: `GET /api/investments/123-invalido` -> HTTP 400 com issue `uuid`.
3. **GET por ID inexistente mas com UUID válido (Rejeição 404)**:
   - Endpoint: `GET /api/investments/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11` -> HTTP 404 Not Found.

---

## Síntese & Regra de Ouro

- **Valide cedo para a experiência do usuário, valide no fundo para a integridade do sistema.**
- O front-end avisa e orienta.
- A API intercepta e recusa contratos inválidos.
- O banco de dados garante que nenhum estado inconsistente persista.
- **Resultado da Etapa 4**: Controllers limpos, código coberto por contratos tipados e resiliência garantida.
