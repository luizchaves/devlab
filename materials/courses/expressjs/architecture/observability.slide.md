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
title: "Express.js: Observabilidade e OpenTelemetry"
description: "Os três sinais da observabilidade em uma API Express (logs, métricas e rastros), instrumentação com OpenTelemetry, spans e atributos, exportação por OTLP, correlação entre trace e log e métricas RED."
---

<!-- _class: lead -->

# Express.js: Observabilidade e OpenTelemetry

Os três sinais da observabilidade em uma API Express (logs, métricas e rastros), instrumentação com OpenTelemetry, spans e atributos, exportação por OTLP, correlação entre trace e log e métricas RED.

---

## Objetivo

- Ao final você saberá distinguir logs, métricas e rastros, instrumentar uma API Express com o SDK do OpenTelemetry, criar spans com atributos próprios,...

---

## Mapa da Aula

- **Objetivo**
- **Monitoramento e observabilidade**
- **Os três sinais**
- **O que é o OpenTelemetry**
- **Instrumentação automática**
- **Spans manuais**
- **Correlacionando rastro e log**
- **Métricas**

---

## Contexto da Aula

- Log responde "o que aconteceu nesta requisição".
- Não responde "a API está mais lenta que ontem?" nem "onde exatamente esses 3 segundos foram gastos?".
- Esta aula acrescenta os dois sinais que faltam.

---

## Monitoramento e observabilidade

- Não são sinônimos, e a diferença é prática:
- Observabilidade é a propriedade de conseguir entender o que o sistema está fazendo por dentro sem publicar código novo para investigar.
- Ela se apoia em três sinais.

---

## Monitoramento e observabilidade: Tabela

- Monitoramento: perguntas previstas | "a CPU passou de 80%?"
- Observabilidade: perguntas não previstas | "por que só os usuários do plano X estão lentos desde as 14h?"

---

## Os três sinais

- A métrica avisa que algo piorou; o rastro mostra em qual etapa; o log explica o motivo daquela requisição específica.
- Ter só um dos três deixa uma parte da investigação cega.

---

## Os três sinais: Tabela

- Log: um evento | alto (texto por evento) | o que aconteceu aqui
- Métrica: agregado por tempo | baixo (números) | está pior que antes?
- Rastro: uma requisição inteira | médio (amostrado) | onde o tempo foi gasto

---

## O que é o OpenTelemetry

- O OpenTelemetry (OTel) é um padrão aberto: sob a CNCF: que define como produzir e transportar os três sinais.
- Ele não é um servidor de monitoramento: é a camada neutra entre a sua aplicação e a ferramenta que exibe os dados.
- O ganho é a ausência de amarração: trocar de ferramenta de visualização não exige tocar no código instrumentado.

---

## O que é o OpenTelemetry: Tabela

- Trace: o percurso completo de uma requisição pelo sistema
- Span: uma etapa do percurso, com início, fim e atributos
- Trace ID: identificador do percurso, propagado entre serviços
- Atributo: par chave-valor anexado ao span (`http.route`, `db.system`)
- Instrumentação: o código que cria spans: automática ou manual
- Exporter: quem envia os dados para fora do processo

---

## Instrumentação automática

- A instrumentação automática cobre Express, HTTP, Prisma e o driver de banco sem nenhuma alteração no código da aplicação:
- Instale o SDK e as instrumentações:
- Crie o arquivo de inicialização: ele precisa rodar antes de qualquer outro import:
- Carregue-o antes da aplicação:
- Suba um Jaeger local para visualizar:

---

## Instrumentação automática: Exemplo 1

```ts
   import { NodeSDK } from '@opentelemetry/sdk-node';
   import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
   const sdk = new NodeSDK({
     serviceName: 'investment-api',
     traceExporter: new OTLPTraceExporter({
       // Endpoint do Collector; em desenvolvimento, do Jaeger local.
       url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces',
     }),
     instrumentations: [getNodeAutoInstrumentations()],
   });
   sdk.start();
```

---

## Instrumentação automática: Exemplo 2

```json
   {
     "scripts": {
       "start": "node --import ./src/telemetry.ts src/server.ts"
     }
   }
```

---

## Spans manuais

- A instrumentação automática cobre bordas: HTTP, banco, fila. O que ela não conhece é a sua lógica.
- Um span manual dá nome a um trecho relevante:
- Atributos de span vão para a ferramenta de observabilidade, com retenção e acesso próprios. Senha, token, CPF e e-mail completo não entram.
- Use identificadores, não conteúdo.

---

## Spans manuais: Exemplo

```ts
const tracer = trace.getTracer('investment-service');
export async function calcularRentabilidade(userId: string) {
  return tracer.startActiveSpan('calcular-rentabilidade', async (span) => {
    try {
      const investimentos = await Investment.findAllByUser(userId);
      // Atributos tornam o span filtrável: "só os que tinham mais de 100 itens".
      span.setAttribute('investimentos.total', investimentos.length);
      span.setAttribute('app.user_id', userId);
      return agregar(investimentos);
    } catch (error) {
```

---

## Correlacionando rastro e log

- O elo entre os dois sinais é o `traceId`.
- Incluí-lo em cada linha de log permite pular do rastro lento para as linhas exatas daquela requisição:
- O `traceId` também atravessa serviços: o cabeçalho `traceparent`, do padrão W3C Trace Context, é propagado automaticamente pelas instrumentações de HTTP.

---

## Correlacionando rastro e log: Exemplo 1

```ts
export function logger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  const span = trace.getActiveSpan();
  res.on('finish', () => {
    console.log(JSON.stringify({
      level: 'info',
      requestId: req.id,
      traceId: span?.spanContext().traceId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(process.hrtime.bigint() - start) / 1e6,
```

---

## Correlacionando rastro e log: Exemplo 2

```txt
GET /investments HTTP/1.1
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  └── trace id ──────────────────┘ └── span pai ──┘ └ flags
             └ versão
```

---

## Métricas

- Rastros mostram uma requisição; métricas mostram a tendência. Para uma API, o conjunto mínimo é conhecido como RED:
- Usar `req.originalUrl` como atributo cria uma série temporal por id: `/users/1`, `/users/2`, `/users/3`… Milhares de séries derrubam o backend de...
- Use sempre o padrão da rota (`req.route.path`), nunca a URL concreta.
- Com o histograma, a pergunta que importa deixa de ser a média:

---

## Métricas: Tabela 1

- Rate: requisições por segundo | `Counter`
- Errors: proporção de respostas `5xx` | `Counter` com atributo de status
- Duration: distribuição do tempo de resposta | `Histogram`

---

## Métricas: Tabela 2

- Média: pouco: uma requisição de 10 s se dilui em mil de 50 ms
- p50: a experiência típica
- p95 / p99: a experiência dos piores casos: onde as reclamações moram

---

## Métricas: Exemplo

```ts
const meter = metrics.getMeter('investment-api');
const duracao = meter.createHistogram('http.server.request.duration', {
  unit: 's',
  description: 'Duração das requisições HTTP',
});
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    duracao.record(Number(process.hrtime.bigint() - start) / 1e9, {
      // A rota, não a URL: /users/:id, e não /users/42.
```

---

## Amostragem

- Exportar 100% dos rastros de uma API com tráfego alto custa caro. A amostragem decide o que guardar:
- Simples e previsível. O problema: um erro raro tem 90% de chance de não ser guardado.
- Decidida no Collector, depois de o rastro terminar (*tail sampling*): guarda 100% dos que tiveram erro ou passaram de 1 s, e uma amostra dos demais.
- Mais caro de operar, e o que se usa em produção séria.
- Amostragem existe por causa de volume. Na sua máquina e em homologação, `AlwaysOnSampler`: o padrão: é o que você quer.

---

## Amostragem: Exemplo

```ts
    import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
    const sdk = new NodeSDK({
      sampler: new TraceIdRatioBasedSampler(0.1),   // guarda 10%
      // …
    });
```

---

## Exercício

- No projeto `express-auth`:
- Instale o SDK e configure `src/telemetry.ts` com o exportador OTLP.
- Suba o Jaeger em contêiner e faça login pela API.
- Encontre o rastro do `POST /auth/signin` e identifique quanto tempo ficou em
- Crie um span manual em torno de `verifyPassword` com o atributo `app.auth.result`.

---

## Exercício: Exemplo

```ts
  const tracer = trace.getTracer('auth');
  export function signIn(req: Request, res: Response) {
    return tracer.startActiveSpan('signin.verify-password', (span) => {
      try {
        const ok = verifyPassword(password, user.password);
        span.setAttribute('app.auth.result', ok ? 'success' : 'failure');
        // …
      } finally {
        span.end();
      }
    });
```

---

## Desafio

- Configure o OpenTelemetry Collector entre a aplicação e o Jaeger, com um processador que remova o atributo `app.user_id` antes da exportação.
- Explique por que fazer essa remoção no Collector é melhor do que confiar em cada desenvolvedor lembrar de não adicionar o atributo.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Os três sinais da observabilidade em uma API Express: logs, métricas e rastros —, instrumentação com OpenTelemetry, spans e atributos, exportação por...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Sinais

- Qual a diferença entre monitoramento e observabilidade?
- Monitoramento responde a perguntas previstas: alertas configurados de antemão.
- Observabilidade é conseguir responder a perguntas não previstas sobre o comportamento interno, sem publicar código novo para investigar.
- Por que log, métrica e rastro não se substituem?
- A métrica avisa que algo piorou, mas não diz onde; o rastro mostra em qual etapa o tempo foi gasto, mas não guarda detalhe de cada evento; o log...

---

## OpenTelemetry

- Por que o SDK precisa ser carregado com `--import`, antes da aplicação?
- Porque as instrumentações substituem os módulos no momento da importação.
- Se `express` já tiver sido carregado, ele não é instrumentado: e nenhum span é gerado, sem nenhum erro visível.
- O que liga um rastro às linhas de log da mesma requisição?
- O `traceId`, obtido de `trace.getActiveSpan()` e escrito em cada linha de log.

---

## Próxima aula

- REST API: as convenções que tornam a API previsível para quem a consome.

---

## Resumo da Aula

- **Express.js: Observabilidade e OpenTelemetry** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
