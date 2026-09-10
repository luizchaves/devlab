# Quote API — função serverless

Uma única função HTTP que consulta a cotação de um ativo usando uma chave que não
pode chegar ao navegador. O mesmo `handler.js` roda localmente e nas três
plataformas, porque recebe uma `Request` e devolve uma `Response`.

## Rotas e arquivos principais

- `handler.js`: a função, independente de plataforma.
- `server.js`: servidor local com `node:http` que executa a mesma função.
- `api/quote.js`: adaptação para a Vercel (rota vem do caminho do arquivo).
- `netlify/functions/quote.js`: adaptação para o Netlify Functions v2.
- `worker.js`: adaptação para o Cloudflare Workers.
- `requests.http`: requisições de teste.

## Como executar

Requer Node.js 22+. Não há dependências a instalar.

```bash
QUOTE_API_KEY=demo123 npm start
```

Depois, consulte a função:

```bash
curl 'http://localhost:3000/api/quote?symbol=PETR4'
```
