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
title: "TypeScript no Node.js"
description: "Slides da aula de TypeScript no back-end: estrutura em camadas, Express tipado, variáveis de ambiente, validação em runtime e erros tipados."


---



<!-- _class: lead -->

# TypeScript no Node.js

Uma API tipada de ponta a ponta — e os limites onde o compilador não alcança.



---



## Objetivo

Aplicar tudo em um projeto real:

- Estruturar o projeto em **camadas**.
- Tipar **rotas e middlewares** do Express.
- Validar **entrada externa** em runtime.
- Tipar **variáveis de ambiente**.
- Modelar **erros** com união discriminada.



---



## Estrutura

```txt
src/
├── main.ts              ponto de entrada
├── env.ts               ambiente validado
├── domain/              tipos e regras
├── repositories/        persistência
├── services/            casos de uso
├── http/                Express: rotas e middlewares
└── shared/              validação
```

*Dependências apontam para o domínio, nunca o contrário.*



---


## Configuração (Parte 1)

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "typecheck": "tsc --noEmit",
    "build": "pnpm typecheck && tsup src/main.ts --format esm",
    "test": "vitest run"
  }
}
```


---


## Configuração (Parte 2)

```bash
pnpm add express
pnpm add -D typescript tsx tsup vitest @types/node @types/express
```


---

## Variáveis de Ambiente (Parte 1)

```ts
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`variável obrigatória ausente: ${name}`);
  return value;
}

```

---

## Variáveis de Ambiente (Parte 2)

```ts
export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required("DATABASE_URL"),
};
```

*`process.env.X` é `string | undefined`. Falhe na inicialização, não na requisição.*

---


## Erros Tipados (Parte 1)

```ts
export type DomainError =
  | { kind: "not_found"; resource: string; id: string }
  | { kind: "conflict"; field: string; value: string }
  | { kind: "validation"; issues: string[] };

```


---


## Erros Tipados (Parte 2)

```ts
get status(): number {
  switch (this.detail.kind) {
    case "not_found": return 404;
    case "conflict":  return 409;
    case "validation": return 400;
  }
}
```


---



## Validação em Runtime

```ts
export function parseCreateCourse(body: unknown): CreateCourseInput {
  if (!isRecord(body)) throw new TypeError("corpo deve ser objeto");

  const issues: string[] = [];
  if (typeof body.title !== "string") issues.push("título obrigatório");
  if (typeof body.hours !== "number") issues.push("hours deve ser número");
  if (issues.length) throw new AggregateError(issues.map(Error), "validação falhou");

  return { title: body.title as string, hours: body.hours as number };
}
```

*Anotar `request.body` é uma promessa que ninguém verifica.*



---



## Express Tipado

```ts
type SlugParams = { slug: string };

router.get("/:slug", async (request: Request<SlugParams>, response, next) => {
  try {
    response.json(await service.getBySlug(request.params.slug));
  } catch (error) {
    next(error);
  }
});
```

*`Request<Params, ResBody, ReqBody, Query>` — nesta ordem.*



---



## Middleware de Erro

```ts
export const errorHandler: ErrorRequestHandler = (error, _req, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.status).json({ error: error.message });
    return;
  }
  response.status(500).json({ error: "erro interno" });
};
```

*O Express identifica pelo número de parâmetros: **quatro**.*



---


## Testes Tipados (Parte 1)

```ts
const input: CreateCourseInput = {
  slug: "guia-typescript",
  title: "Guia de TypeScript",
  hours: 28,
  level: "intermediário",
};

```


---


## Testes Tipados (Parte 2)

```ts
it("recusa slug duplicado", async () => {
  await service.create(input);
  await expect(service.create(input)).rejects.toThrowError(AppError);
});
```

*Objeto de exemplo tipado deixa de compilar quando o domínio muda.*


---



## Exercício

Estenda a API com o recurso `Lesson`:

1. Domínio com `courseSlug`, `title`, `minutes` e `order`;
2. Repositório (interface + memória) e serviço;
3. Rotas `GET` e `POST /courses/:slug/lessons`;
4. `404` quando o curso não existir, reaproveitando `AppError`;
5. Derive `CreateLessonInput` com utility types.



---


## Solução do Exercício (Parte 1)

```ts
export type CreateLessonInput = Omit<Lesson, "id">;

export class LessonService {
  constructor(
    private readonly repository: LessonRepository,
    private readonly courses: CourseService,
  ) {}

```


---


## Solução do Exercício (Parte 2)

```ts
  async listByCourse(slug: string): Promise<Lesson[]> {
    await this.courses.getBySlug(slug);   // lança AppError se não existir
    return this.repository.listByCourse(slug);
  }
}
```


---


## Resumo da Aula (Parte 1)

- Camadas mantêm o domínio livre do framework — e testável sem subir o Express.
- Toda entrada externa chega como `unknown`: valide em **runtime**.
- `process.env` é `string | undefined`: valide uma vez, na inicialização.


---


## Resumo da Aula (Parte 2)

- Genéricos de `Request` descrevem params, corpo e query.
- Middleware de erro é identificado pela **aridade** de quatro parâmetros.
- Erros como união discriminada dão mapeamento exaustivo para status HTTP.