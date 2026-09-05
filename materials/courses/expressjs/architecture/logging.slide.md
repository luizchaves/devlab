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
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Express.js: Log"
description: "Log de requisições em uma API Express: middleware nativo, morgan e pino, níveis de log, log estruturado em JSON, correlação por request id e health check."
---

<!-- _class: lead -->

# Express.js: Log

Log de requisições em uma API Express: middleware nativo, morgan e pino, níveis de log, log estruturado em JSON, correlação por request id e health check.

---

## Objetivo

- Ao final você saberá registrar requisições com um middleware próprio, escolher entre log legível e log estruturado, correlacionar as linhas de uma...

---

## Mapa da Aula

- **Objetivo**
- **O que registrar**
- **Um middleware de log**
- **Correlacionando com um request id**
- **Log legível e log estruturado**
- **Níveis**
- **Pacotes prontos**
- **Health check**

---

## Contexto da Aula

- Enquanto a aplicação roda na sua máquina, o depurador resolve. Depois do deploy, a única janela para dentro dela é o que ela mesma escreve.
- Esta aula trata de escrever isso de forma útil.

---

## O que registrar?

- Um log de requisição só é útil se responder três perguntas: o que foi pedido, o que foi respondido e quanto tempo levou.
- E há o que nunca deve ser registrado:
- É a forma mais comum de vazar senha em produção.
- Se precisar depurar o corpo, registre apenas as chaves (`Object.keys(req.body)`), nunca os valores.

---

## O que registrar?: Tabela

- Senha, mesmo errada: vaza credencial em texto puro no arquivo de log
- Token, cookie de sessão: permite personificar o usuário
- Dado pessoal desnecessário: o log costuma ter retenção e acesso mais amplos que o banco

---

## Um middleware de log

- O middleware precisa medir o tempo até o fim da resposta, e só o evento `finish` sabe qual foi o status final:

---

## Um middleware de log: Exemplo 1

```ts
export function logger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`,
    );
  });
  next();
}
```

---

## Um middleware de log: Exemplo 2

```txt
GET /users 200 3.4ms
POST /users 201 8.1ms
GET /users/99 404 1.2ms
```

---

## Correlacionando com um request id

- Em produção, dezenas de requisições escrevem no mesmo arquivo ao mesmo tempo.
- Sem um identificador, é impossível saber quais linhas pertencem à mesma chamada.
- Devolver o mesmo id no corpo do erro fecha o ciclo: o usuário informa o código e o desenvolvedor encontra a requisição exata no log.
- { "error": { "status": 500, "message": "Erro interno do servidor", "requestId": "9f1c0d2a-4c7e-4f2b-8f3f-2a6b8c1d0e55" } }

---

## Correlacionando com um request id: Exemplo

```ts
export function requestId(req: Request, res: Response, next: NextFunction) {
  // Respeita o id do proxy, quando existir: o rastro atravessa os serviços.
  req.id = req.get('x-request-id') ?? randomUUID();
  res.set('X-Request-Id', req.id);
  next();
}
```

---

## Log legível e log estruturado

- Texto é bom para ler no terminal; JSON é bom para uma ferramenta filtrar. Em produção, o agregador de logs precisa de campos, não de frases:
- A escolha entre um formato e outro costuma ser feita pela variável de ambiente: `config.isProduction ? logJson: logTexto`.

---

## Log legível e log estruturado: Exemplo 1

```ts
res.on('finish', () => {
  console.log(JSON.stringify({
    level: 'info',
    time: new Date().toISOString(),
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    durationMs: Number(process.hrtime.bigint() - start) / 1e6,
  }));
});
```

---

## Log legível e log estruturado: Exemplo 2

```txt
{"level":"info","time":"2026-08-29T13:04:22.114Z","requestId":"9f1c…","method":"GET","url":"/users","status":200,"durationMs":3.4}
```

---

## Níveis

- Nem toda linha tem a mesma importância. Quatro níveis dão conta de uma API de porte médio:
- A regra prática do `errorHandler`: `4xx` é comportamento esperado do cliente e vira `warn` (ou nada); `5xx` é defeito da aplicação e sempre vira `error`.

---

## Níveis: Exemplo

```ts
export function errorHandler(error, req, res, next) {
  const status = error instanceof HttpError ? error.status : 500;
  if (status >= 500) {
    // Só o log recebe o stack trace; o cliente recebe a mensagem genérica.
    console.error({ level: 'error', requestId: req.id, stack: error.stack });
  }
  res.status(status).json({
    error: {
      status,
      message: status >= 500 ? 'Erro interno do servidor' : error.message,
      requestId: req.id,
    },
```

---

## Pacotes prontos

- Os dois pacotes mais usados fazem exatamente o que os middlewares acima fazem, com mais opções e melhor desempenho:
- Depois de escrever o middleware desta aula, `morgan` deixa de ser mágica: ele é a mesma ideia com formatos parametrizados.
- Essa é a razão de o guia mostrar a versão nativa antes do pacote.

---

## Pacotes prontos: Exemplo

```ts
// 'dev' colore o status; 'combined' é o formato de log de servidor web.
app.use(morgan(config.isProduction ? 'combined' : 'dev'));
```

---

## Health check

- Um endpoint de saúde é o que o orquestrador consulta para decidir se a instância recebe tráfego.
- Ele precisa ser barato e não exigir autenticação:
- { "status": "ok", "uptime": 128.4 }
- Se o orquestrador chama `/health` a cada segundo, uma consulta ao banco ali vira carga constante.
- O padrão é ter dois: um *liveness* barato (o processo está vivo?) e um *readiness* mais completo, chamado com menos frequência.

---

## Health check: Exemplo

```ts
const router = Router();
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
  });
});
export default router;
```

---

## Exercício

- No projeto `express-typescript`:
- Crie `src/middlewares/request-id.ts` conforme a aula e registre-o como primeiro
- Substitua o `console.log` de `app.ts` por um middleware `logger` que meça a duração.
- Faça o `logger` emitir JSON quando `NODE_ENV === 'production'` e texto caso contrário.
- Inclua o `requestId` na resposta de erro do `errorHandler`.

---

## Exercício: Exemplo

```ts
  import type { NextFunction, Request, Response } from 'express';
  import { config } from '#config.ts';
  export function logger(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
      const entry = {
        level: 'info',
        time: new Date().toISOString(),
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
```

---

## Desafio

- Faça o `logger` omitir campos sensíveis: escreva uma função `redact(body)` que substitua por `'[REDACTED]'` os valores das chaves `password`, `token` e...
- Explique por que redigir por lista de chaves conhecidas é mais seguro do que tentar detectar segredos por formato.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Log de requisições em uma API Express: middleware nativo, morgan e pino, níveis de log, log estruturado em JSON, correlação por request id e health check.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Log de requisições

- Por que medir a duração dentro de `res.on('finish')`?
- Porque é o único momento em que a resposta já foi escrita: antes disso `res.statusCode` ainda vale o padrão e a duração seria a do agendamento, não a...
- Qual o problema de logar `req.body` no cadastro?
- O corpo carrega a senha em texto puro: e logs costumam ter retenção longa e acesso mais amplo que o banco.
- Logar apenas as chaves preserva a utilidade sem o vazamento.

---

## Operação

- Para que serve o request id?
- Para correlacionar todas as linhas de log de uma mesma requisição, mesmo com dezenas acontecendo em paralelo, e para ligar a reclamação do usuário à...
- Por que `4xx` não deve virar `error` no log?
- Porque `4xx` é comportamento esperado do cliente: um formulário incompleto não é defeito do servidor.
- Tratá-lo como erro enche o log de ruído e esconde os `5xx`, que são os que exigem ação.

---

## Próxima aula

- Observabilidade: métricas e rastros, além dos logs.

---

## Resumo da Aula

- **Express.js: Log** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
