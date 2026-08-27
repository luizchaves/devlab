---
title: 'TypeScript: tsconfig.json'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: tsconfig.json

## Ideia Central

- Responde três perguntas: **o que** compilar, **como** verificar, **para qual** JavaScript emitir
- São mais de cem opções, mas o dia a dia usa uma dúzia

## Estrutura

- **`compilerOptions`**: como verificar e como emitir
- **`include` / `exclude` / `files`**: quais arquivos entram
- **`extends`**: herda outra configuração
- **`references`**: divide o projeto em partes compiláveis

## strict

### O que liga
- `noImplicitAny` e `noImplicitThis`
- `strictNullChecks` — a mais impactante
- `strictFunctionTypes` e `strictBindCallApply`
- `strictPropertyInitialization`
- `useUnknownInCatchVariables` e `alwaysStrict`

### Além dele
- `noUncheckedIndexedAccess`: `array[0]` vira `T | undefined`
- `noImplicitOverride`, `noUnusedLocals`
- `exactOptionalPropertyTypes`

## Alvo e Módulos

- **`target`**: qual sintaxe emitir (não adiciona APIs)
- **`lib`**: quais APIs assumir presentes
- **`module`**: formato do módulo emitido
- **`moduleResolution`**: como localizar os imports
- Node moderno usa `NodeNext`; bundlers usam `Bundler`

## Arquivos

- `include` aceita padrões glob; `exclude` remove do conjunto
- `exclude` **não** impede a compilação de arquivo importado
- `files` lista fechada, ignorando `include`
- `tsc --listFiles` mostra o que realmente entrou

## paths

- `baseUrl` + `paths` eliminam `../../../` nos imports
- O compilador entende, mas **não reescreve** o caminho emitido
- Quem executa precisa do mesmo mapeamento
- Bundler, `imports` do `package.json` ou `tsconfig-paths`

## Composição

- `extends` herda opções de outra configuração
- Padrão comum: base + app + testes
- Bases prontas por ambiente em `@tsconfig/*`
- `tsc --showConfig` imprime a configuração final resolvida

## Emissão

- `noEmit`: só verifica, quando o bundler gera o JS
- `declaration` e `declarationMap`: publicar biblioteca
- `sourceMap`: depurar o TypeScript original
- `isolatedModules`: compatibilidade com transpiladores
- `incremental`: cache entre builds

## Boas Práticas

- **`strict` sempre ligado** em projeto novo
- **`noUncheckedIndexedAccess`** reflete o JavaScript real
- **`tsc --showConfig`** quando a configuração parecer misteriosa
- **`skipLibCheck`** acelera muito e raramente esconde problema
