---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Middleware"
description: "A cadeia de middlewares do Express: assinatura, ordem de execução, escopo, middlewares de fábrica, tratamento de erros e os middlewares embutidos e de terceiros."
---

<!-- _class: lead -->

# Express.js: Middleware

A cadeia de middlewares do Express: assinatura, ordem de execução, escopo, middlewares de fábrica, tratamento de erros e os middlewares embutidos e de terceiros.

---

## Objetivo

- Ao final você saberá escrever middlewares de aplicação, de rota e de erro, entender por que a ordem de registro define o comportamento da aplicação e...

---

## Mapa da Aula

- **Objetivo**
- **A assinatura**
- **A cadeia de responsabilidade**
- **Os cinco tipos**
- **Middleware de fábrica**
- **Middleware de erro**
- **Embutidos e de terceiros**
- **Exercício**

---

## Contexto da Aula

- Um middleware é uma função que recebe `(req, res, next)` e roda entre a chegada da requisição e a resposta.
- Todo o Express é construído sobre essa ideia: inclusive as próprias rotas, que são middlewares com método e caminho.

---

## A assinatura

- Um middleware tem três parâmetros e uma obrigação: responder ou chamar `next()`.
- Sem ele, a requisição trava: nenhum middleware seguinte executa e o cliente fica esperando até o timeout.

---

## A assinatura: Exemplo 1

```js
export function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}
```

---

## A assinatura: Exemplo 2

```js
  if (!req.body.email) {
    return next(new HttpError(400, 'E-mail obrigatório'));
    next(new HttpError(400, 'E-mail obrigatório'));
  }
```

---

## A cadeia de responsabilidade

- Cada requisição atravessa os middlewares na ordem de registro.
- Qualquer um pode responder e encerrar o ciclo; quem não responde delega ao próximo.
- Em código, a mesma cadeia é apenas a sequência de `app.use()`:
- Registrar `express.json()` depois do router é o erro clássico: `req.body` chega `undefined` nos controllers, porque o router já respondeu antes de o...

---

## A cadeia de responsabilidade: Exemplo

```js
const app = express();
app.use(express.json()); // 1. lê o corpo
app.use(logger); //          2. registra a requisição
app.use('/users', userRouter); // 3. tenta responder
app.use(notFound); //        4. nenhuma rota respondeu
app.use(errorHandler); //    5. algo lançou erro
```

---

## Os cinco tipos

- O Express classifica os middlewares pelo escopo em que são registrados:
- O middleware de rota entra entre o caminho e o handler final, e é a forma mais barata de não repetir validação:

---

## Os cinco tipos: Tabela

- De aplicação: `app.use(fn)` | todas as requisições
- Com caminho: `app.use('/api', fn)` | requisições que começam com `/api`
- De rota: `router.post('/', fn, handler)` | apenas aquela rota
- De erro: `app.use((err, req, res, next) => …)` | quando alguém lança ou chama `next(err)`
- Embutido/terceiro: `express.json()`, `cors()`, `helmet()` | conforme o registro

---

## Os cinco tipos: Exemplo

```js
router.post('/', requireJson, validarUsuario, userController.store);
function validarUsuario(req, res, next) {
  if (!req.body?.email) {
    return res.status(400).json({ message: 'E-mail é obrigatório' });
  }
  next();
}
```

---

## Middleware de fábrica

- Um middleware que precisa de configuração é escrito como função que devolve um middleware.
- É o padrão usado por `express.json()`, `cors()` e por qualquer validação parametrizada:
- O uso fica declarativo e o controller perde os `if` de validação:
- O Express chama o middleware com `(req, res, next)`: não há como passar mais nada.
- A fábrica fecha sobre a configuração no momento do registro e devolve a função com a assinatura que o Express espera.

---

## Middleware de fábrica: Exemplo 1

```js
export function validate(camposObrigatorios) {
  // Executa uma vez, no registro da rota.
  return (req, res, next) => {
    // Executa a cada requisição.
    const faltando = camposObrigatorios.filter((campo) => !req.body?.[campo]);
    if (faltando.length > 0) {
      return res.status(400).json({
        message: `Campos obrigatórios: ${faltando.join(', ')}`,
      });
    }
    next();
  };
```

---

## Middleware de fábrica: Exemplo 2

```js
router.post('/', validate(['name', 'email']), userController.store);
```

---

## Middleware de erro

- É reconhecido pelo Express por ter quatro parâmetros, e precisa ser o último registrado.
- Ele é o único lugar da aplicação que decide como um erro vira resposta:
- Para chegar até ele, um middleware ou controller lança o erro: ou chama `next(erro)`:
- No Express 4, um erro lançado dentro de uma função `async` não chegava ao middleware de erro: virava uma rejeição não tratada e a requisição travava.
- Era preciso `try`/`catch` em cada rota, ou o pacote `express-async-errors`.

---

## Middleware de erro: Exemplo 1

```js
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

---

## Middleware de erro: Exemplo 2

```js
throw new HttpError(404, 'Usuário não encontrado');
```

---

## Embutidos e de terceiros

- Alguns middlewares vêm com o Express; outros resolvem preocupações que toda API tem:
- Nenhum deles faz nada que você não possa escrever: `morgan` é o `logger` desta aula com formatos prontos, e `cors` monta três cabeçalhos.
- As aulas de CORS e Endurecimento mostram as duas versões: a nativa e a com pacote: para que a escolha seja informada.

---

## Exercício

- Escreva os middlewares abaixo e registre-os no projeto MVC:
- sem ter sido respondida.

---

## Exercício: Exemplo 1

```js
  import { randomUUID } from 'node:crypto';
  export function requestId(req, res, next) {
    req.id = randomUUID();
    // Definido antes do handler: os cabeçalhos ainda não foram enviados.
    res.set('X-Request-Id', req.id);
    next();
  }
```

---

## Desafio

- Implemente um middleware de cache em memória para requisições `GET`: na primeira chamada guarda o corpo da resposta por chave `req.originalUrl`; nas...
- Dica: substitua `res.json` por uma função que guarda o valor antes de chamar a original.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- A cadeia de middlewares do Express: assinatura, ordem de execução, escopo, middlewares de fábrica, tratamento de erros e os middlewares embutidos e de...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Cadeia

- O que acontece se um middleware não chamar `next()` nem responder?
- A requisição fica pendurada: nenhum middleware seguinte executa e o cliente espera até o timeout.
- Não há erro no servidor: é o sintoma mais difícil de diagnosticar.
- Por que a ordem de `app.use()` é considerada parte da arquitetura?
- Porque ela define o que cada camada enxerga.

---

## Erros

- Como o Express distingue um middleware de erro de um comum?
- Pela aridade da função: quatro parâmetros declarados.
- Omitir o `next` final faz o Express tratá-lo como middleware comum, e ele nunca recebe o erro.
- Por que os controllers deste guia não têm `try`/`catch`?
- Porque o Express 5 encaminha automaticamente ao `errorHandler` os erros lançados dentro de funções `async`.

---

## Próxima aula

- Controllers: tirando a lógica de dentro das rotas.

---

## Resumo da Aula

- **Express.js: Middleware** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
