---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Execução e Build"
description: "Slides da aula de execução: tsc, tsx, type stripping no Node, bundlers, source maps e verificação de tipos em CI."

---


<!-- _class: lead -->

# TypeScript: Execução e Build

Quem remove os tipos, quando, e onde a verificação entra nesse fluxo.


---


## Objetivo

Escolher o fluxo certo para cada tipo de projeto:

- Executar TypeScript em **desenvolvimento**.
- Escolher entre `tsc`, `tsx` e o Node nativo.
- **Empacotar** para produção com um bundler.
- Configurar **source maps**.
- Garantir a verificação de tipos na **CI**.


---


## Duas Etapas, Não Uma

```txt
código .ts ──┬──▶ tsc --noEmit ──▶ verificação (editor e CI)
             └──▶ esbuild/swc/Node ──▶ JavaScript executado
```

| Ferramenta | Verifica | Emite | Velocidade |
| --- | --- | --- | --- |
| `tsc` | Sim | Sim | Lenta |
| esbuild / swc / tsx | **Não** | Sim | Muito rápida |
| Node (type stripping) | **Não** | Sim | Nativa |


---


## Transpilar Não É Verificar

- Ferramentas rápidas apenas **apagam** os tipos.
- Um erro de tipo **não impede** o build.
- Por isso `tsc --noEmit` precisa existir no fluxo.
- Lugar natural: editor (contínuo) e CI (bloqueante).


---


## Em Desenvolvimento

```bash
pnpm exec tsx src/main.ts        # executa direto
pnpm exec tsx watch src/main.ts  # reinicia ao salvar

node src/main.ts                 # type stripping nativo
deno run src/main.ts             # verifica por padrão
bun run src/main.ts              # só remove os tipos
```


---


## Scripts Típicos

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc --noEmit && tsup src/main.ts --format esm --dts",
    "start": "node --enable-source-maps dist/main.js"
  }
}
```

*O `build` roda a verificação **antes** de empacotar.*


---


## Empacotando

| Ferramenta | Papel | Verifica tipos |
| --- | --- | --- |
| **Vite** | App web: dev server e build | Não |
| **esbuild** | Transpilação ultrarrápida | Não |
| **tsup** | Bibliotecas (sobre esbuild) | Só com `--dts` |
| **tsc** | Emissão simples | Sim |

*Biblioteca sem `.d.ts` publicado entrega `any` a quem consome.*


---


## Source Maps

```json
{ "compilerOptions": { "sourceMap": true, "declarationMap": true } }
```

```bash
node --enable-source-maps dist/main.js
```

- Sem eles, o *stack trace* aponta para o bundle minificado.
- `declarationMap` faz "ir para definição" chegar ao `.ts`.


---


## Verificação em CI

```yaml
- run: pnpm install --frozen-lockfile
- run: pnpm typecheck     # tsc --noEmit
- run: pnpm test
- run: pnpm build
```

*Editor verde não é build verde: ele só analisa os arquivos abertos.*


---


## Estratégias por Cenário

| Cenário | Dev | Build | Verificação |
| --- | --- | --- | --- |
| CLI simples | `tsx` | `tsc` | `tsc --noEmit` |
| API Node | `tsx watch` | `tsup` | CI |
| App web | `vite dev` | `vite build` | CI |
| Biblioteca | `tsx` + `vitest` | `tsup --dts` | CI |


---


## Exercício

Configure `cli-ts/`:

1. Instale `typescript`, `tsx`, `tsup` e `@types/node`;
2. `tsconfig.json` com `strict`, `noEmit` e `sourceMap`;
3. `src/main.ts` lendo `process.argv`;
4. Scripts `dev`, `typecheck`, `build` e `start`;
5. Faça o `build` rodar a verificação antes de empacotar.


---


## Solução do Exercício

```json
{
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "typecheck": "tsc --noEmit",
    "build": "pnpm typecheck && tsup src/main.ts --format esm --sourcemap --clean",
    "start": "node --enable-source-maps dist/main.js"
  }
}
```

*Com um erro de tipo: `typecheck` e `build` falham; `tsx` e `tsup` sozinhos executam.*


---

## Resumo da Aula (Parte 1)

- Nenhum runtime executa TypeScript: alguém sempre remove os tipos.
- Transpiladores rápidos **não verificam** — `tsc --noEmit` é obrigatório no fluxo.
- `tsx` executa direto; `tsc && node` verifica, mas é mais lento.

---

## Resumo da Aula (Parte 2)

- Node, Deno e Bun executam `.ts`, com graus diferentes de verificação.
- Biblioteca precisa publicar `.d.ts` além do JavaScript.
- Source maps trazem o *stack trace* de volta ao código original.