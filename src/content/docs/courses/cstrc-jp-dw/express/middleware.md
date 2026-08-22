---
title: "Express.js: Middleware"
description: A cadeia de middlewares do Express, incluindo o tratamento de erros.
course: cstrc-jp-dw
---

Um middleware é uma função que recebe `(req, res, next)` e roda **entre** a chegada da
requisição e a resposta. Todo o Express é construído sobre essa ideia — inclusive as
próprias rotas.

## A assinatura

```js title="middleware.js" showLineNumbers {1,4}
function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);

  next();
}

app.use(logger);
```

`next()` passa a requisição adiante. **Sem ele, a requisição trava**: o cliente fica
esperando até o timeout.

## A ordem importa

Middlewares executam na ordem em que são registrados:

```js title="src/app.js" showLineNumbers {3,5,8}
const app = express();

app.use(express.json()); // 1. lê o corpo
app.use(logger); // 2. registra a requisição
app.use('/users', userRouter); // 3. tenta responder
app.use(notFound); // 4. nenhuma rota respondeu
app.use(errorHandler); // 5. algo lançou erro
```

Registrar `express.json()` **depois** do router é um erro clássico: `req.body` chega
`undefined` nos controllers.

## Middleware de rota

Também dá para aplicar a uma única rota, entre o caminho e o handler:

```js title="src/routes/user-router.js" {3}
router.post('/', validarUsuario, userController.store);

function validarUsuario(req, res, next) {
  if (!req.body?.email) {
    return res.status(400).json({ message: 'E-mail é obrigatório' });
  }

  next();
}
```

## Middleware de erro

É reconhecido pelo Express por ter **quatro** parâmetros. Deve ser o último a ser
registrado:

```js title="src/middlewares/error-handler.js" showLineNumbers {1}
export function errorHandler(error, req, res, next) {
  const status = error.status ?? 500;

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    error: {
      status,
      message: status >= 500 ? 'Erro interno do servidor' : error.message,
    },
  });
}
```

Para chegar até ele, um middleware ou controller lança o erro (ou chama
`next(erro)`):

```js
throw new HttpError(404, 'Usuário não encontrado');
```

:::note[Express 5 e funções async]
No Express 4, um erro lançado dentro de uma função `async` **não** chegava ao
middleware de erro — era preciso `try`/`catch` em cada rota. O Express 5 encaminha
esses erros automaticamente.
:::

## Rota não encontrada

Registrado logo antes do handler de erro, um middleware sem caminho captura tudo que
sobrou:

```js title="src/middlewares/error-handler.js"
export function notFound(req, res, next) {
  next(
    new HttpError(404, `Rota não encontrada: ${req.method} ${req.originalUrl}`),
  );
}
```

## Middlewares embutidos e de terceiros

| Middleware                 | Para que serve                       |
| -------------------------- | ------------------------------------ |
| `express.json()`           | Interpreta corpo JSON                |
| `express.urlencoded()`     | Interpreta formulários HTML          |
| `express.static('public')` | Serve arquivos estáticos             |
| `cors()`                   | Libera requisições de outras origens |
| `helmet()`                 | Cabeçalhos de segurança              |

## Exercício

Escreva um middleware que meça o tempo de resposta e adicione o cabeçalho
`X-Response-Time` antes de a resposta ser enviada. Dica: use o evento
`res.on('finish', ...)`.

## Próxima aula

[MVC](../mvc/) — juntando rotas, controllers, models e middlewares.
