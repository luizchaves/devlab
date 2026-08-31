---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: TypeScript"
description: "Migração de uma API Express de JavaScript para TypeScript: execução nativa de .ts no Node, tsconfig, tipagem de req e res, tipos do domínio e extensão do Request."
---

<!-- _class: lead -->

# Express.js: TypeScript

Migração de uma API Express de JavaScript para TypeScript: execução nativa de .ts no Node, tsconfig, tipagem de req e res, tipos do domínio e extensão do Request.

---

## Objetivo

- Ao final você terá migrado a API de usuários para TypeScript sem introduzir passo de build, sabendo tipar `req` e `res`, declarar os tipos do domínio e...

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/typescript`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **Por que migrar cedo**
- **O Node executa `.ts` direto**
- **Instalação**
- **Imports por `#` em vez de `../../..`**
- **Tipando `req` e `res`**
- **Tipos do domínio**
- **Estendendo o `Request`**

---

## Contexto da Aula

- Até aqui a aplicação foi escrita em JavaScript, para que nada tirasse o foco do HTTP.
- A partir desta aula o guia passa a TypeScript: e o momento certo de migrar é agora, antes de existirem camadas, banco e autenticação para reescrever.

---

## Por que migrar cedo

- Em uma API, quase todo erro de execução vem de dado com o formato inesperado: um `id` que chegou como string, um `req.body` sem o campo obrigatório, um...
- O TypeScript transforma essa classe de erro em erro de compilação.
- Tipos, interfaces, `strict` e `tsconfig` estão no Guia de TypeScript. Aqui tratamos apenas do que é específico do Express e do Node.

---

## Por que migrar cedo: Tabela

- Assinatura do model muda e um controller fica para trás: acusa em todos os pontos de chamada

---

## O Node executa `.ts` direto

- Desde o Node 22.6 (e sem flag a partir do 23.6), o Node executa arquivos `.ts` removendo as anotações de tipo: *type stripping*.
- Não há transpilação: o que o Node faz é apagar os tipos e rodar o JavaScript que sobrou.
- A consequência prática é importante: o Node não verifica tipos. Um erro de tipagem não impede a execução.
- Quem verifica é o `tsc --noEmit`, rodado à parte: no editor, num script `typecheck` e na integração contínua.
- Como o Node só apaga anotações, a sintaxe que gera código não é aceita:

---

## O Node executa `.ts` direto: Tabela

- Anotações de tipo, `interface`, `type`: sim
- Parâmetros de propriedade (`constructor(private x: number)`): não

---

## Instalação

- Nenhuma dependência de execução é adicionada: só ferramentas de desenvolvimento:
- Instale o compilador e os tipos do Node e do Express:
- Crie o `tsconfig.json`:
- Ajuste os scripts do `package.json`: o `dev` continua sendo `node --watch`, agora
- apontando para um `.ts`:

---

## Imports por `#` em vez de `../../..`

- Com as camadas separadas, os caminhos relativos ficam longos.
- O Node resolve isso com *subpath imports*, declarados no próprio `package.json`:
- O `paths` do `tsconfig.json` é conhecido apenas pelo compilador: em execução, o Node não sabe o que é `@/models` e o import quebra: por isso projetos...
- O `imports` do `package.json` é um recurso do Node, e o TypeScript também o entende. Um alias, duas ferramentas satisfeitas.

---

## Imports por `#` em vez de `../../..`: Exemplo 1

```json
    {
      "type": "module",
      "imports": {
        "#*": "./src/*"
      }
    }
```

---

## Imports por `#` em vez de `../../..`: Exemplo 2

```ts
    import * as User from '../models/user-model.ts';
    import * as User from '#models/user-model.ts';
```

---

## Tipando `req` e `res`

- Os tipos vêm de `@types/express`.
- Como são apenas tipos, importe-os com `import type`: o type stripping apaga a linha inteira e nada é exigido em execução:
- Na prática, tipar `Params` e `ReqBody` já cobre a maior parte dos casos:
- O tipo é uma promessa de compilação; o corpo continua vindo de fora e pode chegar com qualquer coisa.
- Por isso `UserInput` declara todos os campos como opcionais e a validação em execução continua obrigatória: é o assunto da aula de Validação.

---

## Tipando `req` e `res`: Exemplo 1

```ts
export function index(req: Request, res: Response) {
  res.json(User.findAll());
}
```

---

## Tipando `req` e `res`: Exemplo 2

```ts
Request<Params, ResBody, ReqBody, ReqQuery>
```

---

## Tipos do domínio

- Os tipos das entidades ficam em `src/types/`, importados por model e controller.
- Repare na diferença entre o que sai do model e o que entra pela requisição:
- O model passa a declarar o que devolve: inclusive o `undefined` de uma busca sem resultado, que é justamente o caso que o JavaScript deixava passar:
- Com `strict`, o controller não compila enquanto não tratar o `undefined`:

---

## Tipos do domínio: Exemplo

```ts
const user = User.findById(id); // User | undefined
if (!user) {
  throw new HttpError(404, 'Usuário não encontrado');
}
res.json(user); // aqui o tipo já é User
```

---

## Estendendo o `Request`

- Middlewares acrescentam campos a `req`: `req.auth`, `req.id`, `req.userId`.
- Esses campos não existem nos tipos do Express, e o TypeScript acusa erro ao lê-los.
- A solução é *declaration merging*: um arquivo `.d.ts` que reabre a interface `Request`.
- Sem ele, o arquivo é tratado como script global e o `declare global` deixa de valer.
- Com ele, o arquivo vira módulo e a declaração é aplicada ao projeto inteiro.

---

## Estendendo o `Request`: Exemplo

```ts
declare global {
  namespace Express {
    interface Request {
      /** Preenchido pelo middleware `authenticate`. */
      auth?: JwtPayload;
    }
  }
}
export {};
```

---

## A migração, arquivo por arquivo

- Renomeie os arquivos de `.js` para `.ts` e atualize as extensões nos imports.
- Rode `npx tsc --noEmit` e trate os erros de cima para baixo: a maioria é `req`/`res` sem
- tipo e retorno de model que pode ser `undefined`.
- Extraia para `src/types/` as interfaces que aparecerem repetidas nos controllers.
- Crie `src/types/express.d.ts` para os campos que os middlewares acrescentam.

---

## E o `tsx`?

- O `tsx` faz o mesmo que o type stripping nativo, e mais: aceita `enum`, entende `paths` do `tsconfig.json` e funciona em versões antigas do Node.
- Vale quando o projeto já depende desses recursos: ou quando a versão do Node é anterior à 22.6.
- Nenhum dos dois verifica tipos: `tsc --noEmit` continua sendo obrigatório.

---

## E o `tsx`?: Tabela

- Dependência extra: nenhuma | uma devDependency
- Versão mínima do Node: 22.6 | qualquer versão suportada
- Verificação de tipos: nenhuma (use `tsc`) | nenhuma (use `tsc`)

---

## Exercício

- Migre o projeto `router` para TypeScript:
- Renomeie os arquivos e ajuste as extensões dos imports.
- Declare `interface User` em `src/types/user.ts`.
- Tipe o handler de `/users/:id` com `Request`.
- Faça `findById` devolver `User | undefined` e trate o `undefined` no handler.

---

## Exercício: Exemplo

```ts
  import { Router, type Request, type Response } from 'express';
  import type { User } from '#types/user.ts';
  const router = Router();
  const users: User[] = [
    { id: 1, name: 'Ana' },
    { id: 2, name: 'Bruno' },
  ];
  router.get('/', (_req: Request, res: Response) => {
    res.json(users);
  });
```

---

## Desafio

- Crie um middleware `requestId` que gera um `crypto.randomUUID()` e o guarda em `req.id`.
- Declare o campo em `src/types/express.d.ts` e use-o no `errorHandler` para incluir o identificador na resposta de erro.
- Explique por que declarar `id?: string` (opcional) é mais honesto do que `id: string`.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Migração de uma API Express de JavaScript para TypeScript: execução nativa de.ts no Node, tsconfig, tipagem de req e res, tipos do domínio e extensão...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Execução

- O Node verifica os tipos ao executar um `.ts`?
- Não. Ele apenas apaga as anotações (*type stripping*) e executa o JavaScript restante.
- Um erro de tipo não impede a execução: quem verifica é `tsc --noEmit`.
- Por que `enum` não funciona no Node executando `.ts` direto?
- Porque `enum` gera código em tempo de execução (um objeto com os membros), e o type stripping só apaga anotações.

---

## Tipagem

- Por que `UserInput` tem todos os campos opcionais se `User` não tem?
- Porque `UserInput` descreve o que chega do cliente, e o cliente pode omitir qualquer coisa. `User` descreve o que sai do model, já validado.
- Declarar a entrada como obrigatória seria uma promessa que o tipo não pode cumprir.
- Por que estender `Express.Request` em vez de fazer `(req as any).auth`?
- Porque o `as any` some com a checagem no ponto de uso e não documenta nada.

---

## Na prática

- O projeto executável desta aula é Express TypeScript.

---

## Próxima aula

- MVC: as camadas que acabamos de tipar, vistas como arquitetura.

---

## Arquivos-Chave da Aula

- **tsconfig.json**: `examples/courses/express/projects/typescript/tsconfig.json` (linhas marcadas `4,10-13`)
- **package.json**: `examples/courses/express/projects/typescript/package.json` (linhas marcadas `7-14`)
- **src/types/user.ts**: `examples/courses/express/projects/typescript/src/types/user.ts`
- **src/models/user-model.ts**: `examples/courses/express/projects/typescript/src/models/user-model.ts` (linhas marcadas `20-22`)

---

## Resumo da Aula

- **Express.js: TypeScript** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
