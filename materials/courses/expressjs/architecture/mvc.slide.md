---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: MVC"
description: "Arquitetura em camadas de uma aplicação Express: model, controller, router e middleware, direção das dependências, o que cada arquivo pode conhecer e quando acrescentar uma camada de serviço."
---

<!-- _class: lead -->

# Express.js: MVC

Arquitetura em camadas de uma aplicação Express: model, controller, router e middleware, direção das dependências, o que cada arquivo pode conhecer e quando acrescentar uma camada de serviço.

---

## Objetivo

- Ao final você saberá organizar uma aplicação Express em camadas com responsabilidade única, justificar em qual arquivo cada linha de código deve morar...

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/mvc`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **As quatro peças**
- **A direção das dependências**
- **Estrutura de diretórios**
- **A cadeia montada em `app.ts`**
- **O controller nunca toca no armazenamento**
- **O que mudou desde a aula de Rotas**
- **Quando acrescentar uma camada**

---

## Contexto da Aula

- As aulas anteriores separaram rotas, controllers e middlewares por conveniência.
- Esta aula nomeia o resultado: MVC: e mostra por que a direção das dependências entre as camadas é o que dá valor à separação.

---

## As quatro peças

- Guarda e recupera os dados. É o único que sabe *onde* eles estão: array, SQLite ou Prisma.
- Traduz HTTP em chamadas de domínio: lê a requisição, chama o model e escolhe o status.
- Diz apenas quais caminhos existem e qual função responde a cada um.
- Comportamentos transversais: leitura do corpo, log, autenticação e tratamento de erros.
- No MVC clássico a View renderiza HTML. Numa API REST, a representação é o JSON: e quem a produz é o `res.json()` do controller.

---

## A direção das dependências

- O que torna a separação útil não é ter quatro pastas, e sim o fato de as dependências apontarem sempre no mesmo sentido:
- O router conhece o controller, o controller conhece o model e o model não conhece ninguém. Nenhuma seta sobe.
- É essa regra que permite trocar a camada de dados sem tocar nas outras: e é ela que a próxima aula, de Prisma, exercita.
- A tabela torna o limite de cada arquivo verificável em revisão de código:
- Um model que recebe `req` deixou de ser reaproveitável fora do HTTP: ele não pode ser chamado por um seed, por um script de importação ou por um teste...

---

## Estrutura de diretórios

- Cada pasta corresponde a uma camada, e o nome do arquivo diz de qual recurso ele trata:

---

## A cadeia montada em `app.ts`

- O `app.ts` é o único arquivo que enxerga a aplicação inteira. A ordem em que ele registra os middlewares é a arquitetura em execução:
- O `notFound` precisa vir depois de todas as rotas, senão bloqueia a API inteira.
- E o `errorHandler` precisa ser o último, senão nunca é alcançado.

---

## O controller nunca toca no armazenamento

- Ele conhece apenas as funções exportadas pelo model. Esta linha continua idêntica quando o array vira uma tabela:
- E o model é o único que sabe onde os dados estão:

---

## O que mudou desde a aula de Rotas

- A rota deixou de responder e passou a apenas apontar:

---

## O que mudou desde a aula de Rotas: Exemplo

```ts
// antes: o router respondia
router.get('/', (req, res) => {
  res.json(users);
});
router.get('/', userController.index);
```

---

## Quando acrescentar uma camada

- MVC não é o fim da linha. Duas camadas aparecem quando o projeto cresce:
- Em um CRUD sem regra própria, um `service` que apenas repassa a chamada ao model acrescenta um arquivo e nenhum significado.
- Crie a camada quando existir a regra.

---

## Executando

- Entre no projeto:
- Instale as dependências:
- Suba o servidor:
- Confirme que responde:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/typescript
```

---

## Executando: Exemplo 2

```bash
   curl http://localhost:3000/users
```

---

## Testando a API

- Nesta seção, testamos a API organizada sob a arquitetura MVC (Model-View-Controller) com tratamento centralizado de erros.
- A listagem de usuários sai da camada de Model através do Controller e responde com status `200 OK`:
- [ { "id": 1, "name": "Ana", "email": "ana@example.com" }, { "id": 2, "name": "Bruno", "email": "bruno@example.com" } ]
- A criação de um novo usuário envia dados JSON no corpo, passa pela validação e é persistida via Model, retornando status `201 Created`:
- { "name": "Carla", "email": "carla@example.com" }

---

## Testando a API: Exemplo 1

```txt
  ### Listar usuários (MVC)
  GET http://localhost:3000/users
```

---

## Testando a API: Exemplo 2

```txt
  ### Criar novo usuário (MVC)
  POST http://localhost:3000/users
  Content-Type: application/json
  {
    "name": "Carla",
    "email": "carla@example.com"
  }
```

---

## Exercício

- Acrescente o recurso produtos ao projeto, seguindo exatamente a mesma estrutura:
- registro em `app.ts` sob o prefixo `/products`.
- Um produto tem `id`, `name` e `price`. Rejeite com `400` a criação sem `name` ou com `price` negativo, e responda `204` no `DELETE`.
- Em `app.ts`: `app.use('/products', productRouter);`: registrado antes do `notFound`.

---

## Exercício: Exemplo 1

```ts
  export interface Product {
    id: number;
    name: string;
    price: number;
  }
  export interface ProductInput {
    name?: string;
    price?: number;
  }
```

---

## Desafio

- Extraia a validação para um middleware de fábrica reutilizável pelos dois recursos:
- Os controllers devem ficar sem nenhum `if` de validação.
- Pense: onde esse middleware precisa ser registrado para que o erro chegue ao `errorHandler`?

---

## Desafio: Exemplo 1

```ts
export function validate(camposObrigatorios: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // devolve um middleware que valida req.body
  };
}
```

---

## Desafio: Exemplo 2

```ts
router.post('/', validate(['name', 'email']), userController.store);
```

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Arquitetura em camadas de uma aplicação Express: model, controller, router e middleware, direção das dependências, o que cada arquivo pode conhecer e...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Camadas

- Por que nenhuma seta do diagrama sobe?
- Porque uma dependência de baixo para cima amarraria o model ao HTTP: ele deixaria de poder ser usado por um seed, um script ou um teste.
- A direção única é o que permite trocar a camada de dados sem tocar nas outras.
- Um model pode responder `404`?
- Não. `404` é um conceito HTTP e pertence ao controller.

---

## Evolução

- Quando criar a pasta `services/`?
- Quando existir regra de negócio que continuaria valendo fora do HTTP, ou que seja compartilhada por mais de uma rota.
- Antes disso, o serviço só repassa chamadas.
- Trocar array por Prisma exige mudar quais arquivos?
- Apenas os de `models/` (e a configuração do client).

---

## Na prática

- Os projetos executáveis desta aula são Express MVC (em JavaScript) e Express TypeScript.

---

## Próxima aula

- Configuração e Ambiente: variáveis de ambiente, segredos e log estruturado.

---

## Arquivos-Chave da Aula

- **src/app.ts**: `examples/courses/expressjs/projects/typescript/src/app.ts` (linhas marcadas `17,20-21`)
- **src/controllers/user-controller.ts**: `examples/courses/expressjs/projects/typescript/src/controllers/user-controller.ts`
- **src/models/user-model.ts**: `examples/courses/expressjs/projects/typescript/src/models/user-model.ts`

---

## Resumo da Aula

- **Express.js: MVC** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
