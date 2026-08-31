---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Requisição e Resposta"
description: "Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos."
---

<!-- _class: lead -->

# Express.js: Requisição e Resposta

Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos.

---

## Objetivo

- Ao final você saberá ler cabeçalhos e metadados da requisição, escolher o formato da resposta por negociação de conteúdo, usar corretamente cada método...

---

## Mapa da Aula

- **Objetivo**
- **Anatomia de uma mensagem HTTP**
- **Lendo a requisição**
- **Negociação de conteúdo**
- **Escrevendo a resposta**
- **Redirecionamento**
- **Arquivos estáticos e download**
- **Cabeçalhos de cache**

---

## Contexto da Aula

- Uma requisição HTTP é mais do que caminho e corpo: ela traz cabeçalhos que dizem quem chama, o que aceita receber e em que formato enviou os dados.
- Esta aula percorre `req` e `res` além do trio `params`/`query`/`body`.

---

## Anatomia de uma mensagem HTTP

- Requisição e resposta têm a mesma estrutura: uma linha inicial, cabeçalhos e um corpo opcional.
- O Express expõe cada parte em uma propriedade diferente.

---

## Lendo a requisição

- Além de `params`, `query` e `body`, o objeto `req` descreve o contexto da chamada:
- Na prática, esses membros aparecem em middlewares de log e de controle de acesso:
- Logar antes do handler não sabe o status final.
- O evento `finish` dispara depois que a resposta foi escrita, então `res.statusCode` já reflete o que o cliente recebeu.

---

## Lendo a requisição: Exemplo

```js
export function logger(req, res, next) {
  const agent = req.get('user-agent') ?? 'desconhecido';
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} — ${agent}`);
  });
  next();
}
```

---

## Negociação de conteúdo

- O cliente diz o que aceita no cabeçalho `Accept`; o servidor escolhe o formato.
- Do outro lado, `req.is()` protege o handler de um corpo em formato inesperado:
- Trocar um pelo outro faz o cliente procurar o erro no lugar errado.

---

## Negociação de conteúdo: Exemplo 1

```js
app.get('/users/:id', (req, res) => {
  const user = { id: 1, name: 'Ana' };
  res.format({
    'application/json': () => res.json(user),
    'text/html': () => res.send(`<h1>${user.name}</h1>`),
    'text/csv': () => {
      res.type('text/csv');
      res.send(`id,name\n${user.id},${user.name}`);
    },
  });
});
```

---

## Negociação de conteúdo: Exemplo 2

```js
export function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({ message: 'Content-Type precisa ser application/json' });
  }
  next();
}
```

---

## Escrevendo a resposta

- Os métodos de `res` se dividem em dois grupos: os que configuram e devolvem o próprio `res` (encadeáveis) e os que encerram o ciclo.
- Encadear é o padrão mais comum, porque os métodos de configuração devolvem `res`:
- Chamar dois métodos que encerram na mesma requisição lança `ERR_HTTP_HEADERS_SENT`. A causa quase sempre é um `if` sem `return`:

---

## Escrevendo a resposta: Exemplo 1

```js
res
  .status(201)
  .set('Location', `/users/${user.id}`)
  .json(user);
```

---

## Escrevendo a resposta: Exemplo 2

```js
  app.get('/users/:id', (req, res) => {
    if (!user) {
      res.status(404).json({ message: 'Não encontrado' });
      return res.status(404).json({ message: 'Não encontrado' });
    }
    res.json(user);
  });
```

---

## Redirecionamento

- Redirecionamento aparece como ponto central da aula, não apenas como item de índice.
- Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Redirecionamento: Exemplo

```js
app.post('/users', (req, res) => {
  const user = createUser(req.body);
  res.redirect(303, `/users/${user.id}`);
});
```

---

## Arquivos estáticos e download

- É um middleware, então a ordem de registro importa: o que ele encontra no disco é respondido antes de qualquer rota abaixo dele.
- Para um arquivo específico, `res.sendFile()` envia inline e `res.download()` força o salvamento:
- Valide o nome contra uma lista conhecida ou resolva o caminho e confirme que ele continua dentro do diretório permitido.

---

## Arquivos estáticos e download: Exemplo 1

```js
// public/index.html passa a responder em GET /
app.use(express.static('public'));
// Sob um prefixo: public/logo.png -> GET /assets/logo.png
app.use('/assets', express.static('public'));
```

---

## Arquivos estáticos e download: Exemplo 2

```js
app.get('/relatorio', (req, res) => {
  res.sendFile('/caminho/absoluto/relatorio.pdf');
});
app.get('/relatorio/baixar', (req, res) => {
  // Define Content-Disposition: attachment; filename="relatorio-2026.pdf"
  res.download('/caminho/absoluto/relatorio.pdf', 'relatorio-2026.pdf');
});
```

---

## Cabeçalhos de cache

- Respostas de leitura ganham desempenho com dois cabeçalhos.
- O Express já envia `ETag` automaticamente para `res.json()` e `res.send()`; `Cache-Control` é escolha da aplicação:
- Com o `ETag` guardado, o cliente reenvia `If-None-Match` e o Express responde `304 Not Modified` sem corpo: a rede transporta apenas os cabeçalhos.

---

## Cabeçalhos de cache: Exemplo

```js
app.get('/categories', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json(categories);
});
```

---

## Exercício

- Escreva um middleware `responseTime` que:
- registre o instante em que a requisição chegou;
- no evento `finish`, calcule a duração;
- escreva a duração no log junto com método, caminho e status.
- Depois explique por que o cabeçalho `X-Response-Time` não pode ser definido dentro do `finish`.

---

## Exercício: Exemplo

```js
  export function responseTime(req, res, next) {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} — ${ms.toFixed(1)}ms`);
    });
    next();
  }
```

---

## Desafio

- Implemente `GET /users/:id` respondendo em JSON, HTML e CSV por negociação de conteúdo, e devolvendo `406` quando o cliente pedir um formato não suportado.
- Teste com `curl -H "Accept: text/csv"` e `curl -H "Accept: application/xml"`.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Os objetos req e res do Express: cabeçalhos, negociação de conteúdo, métodos que encerram a resposta, redirecionamento, download e arquivos estáticos.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Requisição

- Qual a diferença entre `req.path` e `req.originalUrl`?
- Por que `req.get('Content-Type')` é melhor que `req.headers['Content-Type']`?
- Porque `req.headers` guarda os nomes em minúsculas: `req.headers['Content-Type']` é sempre `undefined`.

---

## Resposta

- O que causa `ERR_HTTP_HEADERS_SENT`?
- Tentar responder duas vezes. O caso típico é um `if` de erro sem `return`, que responde e deixa o fluxo continuar até o `res.json()` final.
- Quando usar `303` em vez de `302` em um redirecionamento?
- Depois de um `POST`, quando se quer que o cliente busque o recurso criado com `GET`.
- O `302` não garante a troca de método e pode reenviar o `POST` para a nova URL.

---

## Próxima aula

- Middleware: a cadeia de funções que atravessa toda requisição, incluindo o tratamento de erros.

---

## Resumo da Aula

- **Express.js: Requisição e Resposta** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
