---
title: 'TypeScript: Desenvolvimento com IA'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Desenvolvimento com IA

## Ideia Central

- O gargalo se desloca da produção para a **revisão**
- "Compila" não é "está correto": o `tsc` é um revisor **parcial**

## O Que o Compilador Cobre?

### Pega
- Argumento de tipo incompatível
- Propriedade inexistente em tipo conhecido
- Retorno fora do contrato declarado
- Caso faltante em união discriminada exaustiva
- Nulo usado sem checagem

### Não pega
- Tipo que descreve mal o dado real
- `as` que silencia a verificação
- Lógica de negócio invertida
- `any` implícito vindo de biblioteca sem tipos
- Efeito colateral que ninguém pediu

## Contexto do Projeto

- **Rigor ativo**: `strict`, `noUncheckedIndexedAccess`
- **Versão**: `satisfies` (5.0), `using` (5.2), predicados inferidos (5.5)
- **Resolução de módulos**: `nodenext`, `bundler`, apelidos de `paths`
- **Forma de execução**: `tsc`, `tsx`, `erasableSyntaxOnly`
- **Convenção do projeto**: união literal, `interface` ou `type`, validador adotado
- Colar o `tsconfig.json` resolve a maior parte numa mensagem

## Instrução Não é Garantia

- Modelos perdem instruções antigas conforme o diálogo cresce
- **Transforme regra em configuração**: `noImplicitAny`, lint que proíbe `as`
- **Verifique em vez de confiar**: segundos de comando contra minutos de leitura
- O `any` mais perigoso chega por `JSON.parse`, `catch` e biblioteca sem tipos

## Pedido com Contrato

### O que declarar?
- Assinatura e arquivo de destino
- Comportamento de sucesso
- Comportamento de cada falha
- Restrições explícitas (sem `as`, sem `any`)
- O que **não** deve mudar

### O que não fazer?
- Descrever a implementação em vez do comportamento
- Deixar o formato de erro implícito

## Spec Antes de Gerar

- Um pedido resolve uma tarefa; uma spec atravessa arquivos e sessões
- Método detalhado no Guia de ECMAScript
- **Fora do escopo** é a seção mais importante com assistentes
- Ampliação típica em TS: trocar `interface` por `type` no arquivo inteiro, genérico desnecessário, utilitários reescritos

## Verificação

1. `npx tsc --noEmit`
2. Procurar `as`, `@ts-ignore` e `: any` no diff
3. `npx tsc --noEmit --noImplicitAny`
4. Lint e testes
5. **Executar com dado fora do formato esperado**

- Só o passo 5 revela um tipo que mente sobre a realidade
- O compilador confirma coerência com os tipos, não com o mundo

## Armadilhas por Tópico

- **Tipos**: `any` como escape; `enum` onde união literal bastaria
- **Narrowing**: `as` no lugar do estreitamento
- **Uniões**: união sem discriminante, forçando asserção em cada uso
- **Generics**: parâmetro de tipo que nunca varia
- **Utility Types**: `DeepPartial` e `Mutable` apresentados como nativos
- **Classes**: `private` tratado como privacidade de runtime
- **Módulos**: `import` sem `type`, arrastando módulo para o runtime
- **Node.js**: corpo de requisição asserido, sem validação

## Limites do Modelo

- **Data de corte**: desconhece o que saiu depois do treinamento
- **Contexto limitado**: reinventa tipo que já existe em outro arquivo
- **Concordância**: concorda com a afirmação errada e reescreve o código
- A defesa contra os três é verificar com o compilador, não com a conversa

## Segurança

- Não colar chave, token, string de conexão ou `.env` no prompt
- Conferir dependência sugerida, inclusive `@types/*` já descontinuados
- Revisar esquema de validação como código de segurança

## Boas Práticas

- **Informe o contexto de projeto** logo no início
- **Peça o contrato**, não a implementação
- **Transforme regra em configuração**
- **Verifique** com `tsc --noEmit`, lint e testes
- **Procure o que o compilador não pega** no diff
