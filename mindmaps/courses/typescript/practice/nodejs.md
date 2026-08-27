---
title: 'TypeScript no Node.js'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript no Node.js

## Ideia Central

- API é onde os limites do TypeScript ficam visíveis
- Tudo que entra vem do mundo externo: o tipo só vale depois de verificar

## Estrutura em Camadas

- **`domain/`**: tipos e regras, sem framework
- **`repositories/`**: persistência
- **`services/`**: casos de uso
- **`http/`**: Express, rotas e middlewares
- **`shared/`**: validação e utilitários
- Dependências apontam para o domínio, nunca o contrário

## Configuração

- `"type": "module"` e `module: NodeNext`
- `tsx watch` no desenvolvimento
- `tsup` ou `tsc` no build, com `typecheck` antes
- `@types/node` e `@types/express` como dev dependencies

## Variáveis de Ambiente

- `process.env.X` é sempre `string | undefined`
- Validar **uma vez**, na inicialização, em um módulo `env.ts`
- Falhar cedo evita descobrir a falta em produção
- Zod ou validação manual produzem o mesmo resultado

## Validação em Runtime

- Corpo, params e query chegam como dados não confiáveis
- Anotar `request.body` é promessa que ninguém verifica
- Guards com `value is T` conectam checagem e tipo
- Bibliotecas de esquema geram tipo e validação de uma vez

## Erros Tipados

- União discriminada por `kind`: `not_found`, `conflict`, `validation`
- Mapeamento exaustivo para status HTTP
- Classe `AppError` carrega o detalhe tipado
- Middleware de erro traduz para a resposta

## Express Tipado

- `Request<Params, ResBody, ReqBody, Query>` nesta ordem
- `RequestHandler` e `ErrorRequestHandler` para middlewares
- Middleware de erro é reconhecido pela **aridade** de quatro
- Estender `Request` exige *declaration merging*

## Testes

- Objetos de exemplo tipados quebram quando o domínio muda
- Mocks precisam satisfazer a interface do repositório
- Serviço testável sem subir o servidor HTTP
- `vitest` com os mesmos tipos do projeto

## Boas Práticas

- **Valide toda entrada externa** em runtime
- **Isole o domínio** do framework
- **Modele erros por união**, não por strings soltas
- **Rode `typecheck` antes do build**, sempre
