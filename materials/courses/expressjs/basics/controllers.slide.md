---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Controllers"
description: "Separação da lógica das rotas em controllers: nomes convencionais, responsabilidades de cada camada, controllers magros e quando extrair uma camada de serviço."
---

<!-- _class: lead -->

# Express.js: Controllers

Separação da lógica das rotas em controllers: nomes convencionais, responsabilidades de cada camada, controllers magros e quando extrair uma camada de serviço.

---

## Objetivo

- Ao final você saberá extrair handlers para um controller por recurso, nomear as funções segundo a convenção usada em qualquer framework MVC e...

---

## Mapa da Aula

- **Objetivo**
- **O problema**
- **A separação**
- **Nomes convencionais**
- **Quem faz o quê**
- **Controllers magros**
- **Exercício**
- **Desafio**

---

## Contexto da Aula

- Um controller é a função que responde a uma requisição.
- Tirá-la de dentro do router deixa o arquivo de rotas com uma única responsabilidade: dizer *quais caminhos existem*.

---

## O problema

- Quando o handler cresce, o arquivo de rotas passa a misturar caminho, validação, acesso a dados e formatação da resposta: quatro motivos diferentes...
- Ler esse arquivo para descobrir quais rotas existem exige atravessar a implementação de todas elas.

---

## O problema: Exemplo

```js
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

---

## A separação

- O router passa a apontar para funções nomeadas, e volta a caber em uma tela:
- O controller fica com a lógica: e com a decisão de qual status responder:

---

## A separação: Exemplo 1

```js
const router = Router();
router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', userController.store);
```

---

## A separação: Exemplo 2

```js
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

---

## Nomes convencionais

- Usar sempre os mesmos nomes torna qualquer controller previsível: quem abre `product-controller.js` pela primeira vez já sabe o que vai encontrar.
- Rails usa `index/show/create/update/destroy`; Laravel, `index/show/store/update/destroy`; o material de LP2 usa `create/read/readById/update/remove`.
- O nome exato importa menos do que a consistência dentro do projeto: o que não vale é `listarUsuarios` ao lado de `show`.

---

## Quem faz o quê

- A separação só funciona se cada camada respeitar o próprio limite. O controller é a fronteira entre o mundo HTTP e o resto da aplicação:
- O controller deve:
- ler `req.params`, `req.query` e `req.body`;
- validar e converter a entrada (`Number(req.params.id)`);
- chamar o model;

---

## Controllers magros

- O sinal de que o controller engordou demais é ele conter regra de negócio: algo que continuaria valendo se a aplicação virasse um script de linha de...
- A mesma rota com a regra extraída para um serviço fica assim: e a regra passa a ser testável sem subir servidor:
- Em um CRUD sem regra própria, um `service` que só repassa a chamada para o model é cerimônia sem ganho.
- Extraia quando a regra existir: não antes.

---

## Controllers magros: Exemplo 1

```js
export async function store(req, res) {
  const { amount, categoryId } = req.body;
  // Regra de negócio dentro do controller: não é sobre HTTP.
  const category = await Category.findById(categoryId);
  const limite = category.limitePorAporte;
  const total = await Investment.sumByCategory(categoryId);
  if (total + amount > limite) {
    throw new HttpError(409, 'Limite da categoria excedido');
  }
  res.status(201).json(await Investment.create(req.body));
}
```

---

## Controllers magros: Exemplo 2

```js
export async function store(req, res) {
  const investment = await InvestmentService.criarRespeitandoLimite(req.body);
  res.status(201).json(investment);
}
```

---

## Exercício

- Partindo do projeto `router`:
- Crie `src/controllers/product-controller.js` com `index`, `show`, `store` e `destroy`.
- Deixe `product-router.js` apenas com os cinco `router.` apontando para o controller.
- Faça `store` responder `201` com o produto criado e `400` quando `price` for negativo.
- Faça `destroy` responder `204` sem corpo.

---

## Exercício: Exemplo

```js
  import * as Product from '../models/product-model.js';
  export function index(req, res) {
    res.json(Product.findAll());
  }
  export function show(req, res) {
    const product = Product.findById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
```

---

## Desafio

- Reescreva `store` de forma que o controller não tenha nenhum `if` de validação: mova a checagem para um middleware de fábrica `validate(['name',...
- Compare os dois controllers.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Separação da lógica das rotas em controllers: nomes convencionais, responsabilidades de cada camada, controllers magros e quando extrair uma camada de...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Responsabilidades

- Por que o controller não deve conhecer SQL?
- Porque isso amarra a camada HTTP ao mecanismo de armazenamento: trocar array por SQLite ou por Prisma passaria a exigir mudanças em todos os controllers.
- Com o model no meio, muda um arquivo só.
- Por que o controller não deve saber em qual caminho está montado?
- Porque o prefixo é decidido no `app.use()`.

---

## Organização

- Quando extrair uma camada de serviço?
- Quando existir regra de negócio que continuaria valendo fora do HTTP, ou quando duas rotas precisarem da mesma regra.
- Em CRUD puro, o serviço vira repasse sem ganho.
- Qual o problema de um controller importar outro?
- Controllers falam HTTP; um chamando o outro cria dependência entre recursos por um motivo que não é HTTP.

---

## Próxima aula

- TypeScript no Express: tipando `req`, `res` e as camadas que acabamos de separar.

---

## Resumo da Aula

- **Express.js: Controllers** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
