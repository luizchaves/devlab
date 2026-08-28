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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "TypeScript: tsconfig.json"
description: "Slides da aula de configuração: strict e suas verificações, target, module, include e exclude, paths e composição com extends."


---



<!-- _class: lead -->

# TypeScript: tsconfig.json

O que compilar, como verificar e para qual JavaScript emitir.



---



## Objetivo

Dominar a dúzia de opções que muda o comportamento do projeto:

- Interpretar a estrutura do `tsconfig.json`.
- Entender o que **`strict`** liga.
- Escolher `target`, `module` e `moduleResolution` por ambiente.
- Delimitar arquivos com `include` e `exclude`.
- Compor configurações com **`extends`**.



---



## Anatomia

| Bloco | Papel |
| --- | --- |
| `compilerOptions` | Como verificar e como emitir |
| `include` / `exclude` / `files` | Quais arquivos entram |
| `extends` | Herda outra configuração |
| `references` | Divide o projeto em partes |

```bash
pnpm exec tsc --showConfig    # configuração final resolvida
pnpm exec tsc --listFiles     # arquivos do programa
```



---



## O Que `strict` Liga

| Opção | Passa a ser erro |
| --- | --- |
| `noImplicitAny` | Tipo `any` implícito |
| `strictNullChecks` | Usar valor possivelmente nulo |
| `strictFunctionTypes` | Função com parâmetros incompatíveis |
| `strictPropertyInitialization` | Propriedade sem inicialização |
| `noImplicitThis` | `this` implícito |
| `useUnknownInCatchVariables` | Erro do `catch` como `any` |



---



## Além do `strict`

| Opção | Efeito |
| --- | --- |
| `noUncheckedIndexedAccess` | `array[0]` vira `T \| undefined` |
| `noImplicitOverride` | Sobrescrita exige `override` |
| `noUnusedLocals` | Variável não usada vira erro |
| `exactOptionalPropertyTypes` | `campo?` não aceita `undefined` explícito |

*`noUncheckedIndexedAccess` incomoda — e está certo.*



---



## target, lib e module

| Opção | Responde |
| --- | --- |
| `target` | Qual **sintaxe** emitir |
| `lib` | Quais **APIs** existem |
| `module` | Qual formato de módulo |
| `moduleResolution` | Como localizar imports |

*`target` converte sintaxe, **não** adiciona APIs: isso é polyfill.*



---



## Por Ambiente

| Ambiente | module | moduleResolution | lib |
| --- | --- | --- | --- |
| Node moderno | `NodeNext` | `NodeNext` | `ES2022` |
| Web com bundler | `ESNext` | `Bundler` | `ES2022`, `DOM` |
| Biblioteca npm | `ESNext` | `Bundler` | conforme o alvo |
| Legado CJS | `CommonJS` | `Node10` | `ES2020` |



---



## include e exclude

```json
{
  "include": ["src/**/*", "types/**/*.d.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

*`exclude` remove pontos de entrada — mas um arquivo excluído **importado** por um incluído entra assim mesmo.*



---



## paths

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@lib/*": ["src/lib/*"] }
  }
}
```

- Elimina `../../../` nos imports.
- **Não** reescreve o caminho emitido: quem executa precisa conhecer o apelido.



---


## Composição com extends (Parte 1)

```json
// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": { "rootDir": "src", "outDir": "dist" },
  "include": ["src/**/*"]
}

```


---


## Composição com extends (Parte 2)

```json
// tsconfig.test.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": { "noEmit": true },
  "include": ["src/**/*", "tests/**/*"]
}
```


---



## Emissão

| Opção | Quando |
| --- | --- |
| `noEmit` | O bundler gera o JS |
| `declaration` | Publicar biblioteca |
| `declarationMap` | "Ir para definição" leva ao `.ts` |
| `sourceMap` | Depurar o original |
| `isolatedModules` | Compatibilidade com transpiladores |
| `incremental` | Cache entre builds |



---



## Exercício

Configure `api-ts/` com três configurações:

1. `tsconfig.base.json` com `strict` e `noUncheckedIndexedAccess`;
2. `tsconfig.json` com `rootDir`, `outDir`, `declaration` e `sourceMap`;
3. `tsconfig.test.json` com `noEmit`, incluindo `tests/`;
4. `paths` com `@app/*` para `src/*`;
5. Compare a saída de `tsc --showConfig` nas duas.



---

## Solução do Exercício (Parte 1)

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
```

---

## Solução do Exercício (Parte 2)

```json
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": { "@app/*": ["src/*"] }
  }
}
```

---


## Solução do Exercício (Parte 2)

```bash
pnpm exec tsc --showConfig
pnpm exec tsc --project tsconfig.test.json --showConfig
```


---


## Resumo da Aula (Parte 1)

- `strict` liga oito verificações e é o padrão de qualquer projeto novo.
- `noUncheckedIndexedAccess` reflete o comportamento real do JavaScript.
- `target` é sintaxe; `lib` é API; `module` é formato de módulo.


---


## Resumo da Aula (Parte 2)

- `exclude` não impede a compilação de arquivo importado.
- `paths` vale na compilação, não no runtime.
- `extends` evita duplicar configuração entre app, testes e build.