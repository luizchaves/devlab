---
title: Express.js: Controllers
description: Separando a lógica das rotas em controllers.
course: cstrc-jp-dw
sidebar:
  label: Controllers
  order: 3
---

Um **controller** é a função que responde a uma requisição. Tirá-la de dentro do
router deixa o arquivo de rotas com uma única responsabilidade: dizer _quais
caminhos existem_.

## O problema

Quando o handler cresce, o arquivo de rotas passa a misturar caminho, validação,
acesso a dados e formatação da resposta:

```js title="src/routes/user-router.js" {3-12}
router.post('/', (req, res) => {
  const { name, email } = req.body ?? {};

  if (!name || !email) {
    return res.status(400).json({ message: 'Campos obrigatórios' });
  }

  const user = { id: nextId, name, email };
  nextId += 1;
  users.push(user);

  res.status(201).json(user);
});
```

## A separação

O router passa a apontar para funções nomeadas:

```js title="src/routes/user-router.js" ins={1,5-7}
import * as userController from '../controllers/user-controller.js';

const router = Router();

router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', userController.store);
```

E o controller fica com a lógica:

```js title="src/controllers/user-controller.js" showLineNumbers
export function index(req, res) {
  res.json(User.findAll());
}

export function show(req, res) {
  const user = User.findById(Number(req.params.id));

  if (!user) {
    throw new HttpError(404, 'Usuário não encontrado');
  }

  res.json(user);
}
```

## Nomes convencionais

Usar sempre os mesmos nomes torna qualquer controller previsível:

| Função    | Método HTTP | Caminho      | Ação        |
| --------- | ----------- | ------------ | ----------- |
| `index`   | GET         | `/users`     | Lista todos |
| `show`    | GET         | `/users/:id` | Busca um    |
| `store`   | POST        | `/users`     | Cria        |
| `update`  | PUT         | `/users/:id` | Atualiza    |
| `destroy` | DELETE      | `/users/:id` | Remove      |

## O que um controller deve (e não deve) fazer

Deve:

- ler `req.params`, `req.query` e `req.body`;
- validar a entrada;
- chamar o model;
- escolher o status e enviar a resposta.

Não deve:

- conhecer detalhes de SQL ou do ORM — isso é papel do model;
- montar HTML;
- saber em qual caminho está montado.

:::tip[Um controller por recurso]
`user-controller.js`, `product-controller.js`, `order-controller.js`. Se um controller
precisa importar outro, normalmente falta um model ou um serviço.
:::

## Exercício

Refatore o `product-router.js` do exercício anterior extraindo um
`product-controller.js` com as funções `index` e `show`.

## Próxima aula

[Middleware](../middleware/) — comportamentos que valem para várias rotas.
