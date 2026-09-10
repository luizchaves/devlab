// #region handler
// A função recebe uma Request e devolve uma Response, ambas padrão da plataforma web.
// É esse contrato, e não um formato proprietário, que permite ao mesmo arquivo rodar
// na Vercel, no Netlify, no Cloudflare Workers e no servidor local deste projeto.
export default async function handler(request) {
  if (request.method !== 'GET') {
    return json({ error: 'Método não suportado' }, 405);
  }

  const symbol = new URL(request.url).searchParams.get('symbol');

  if (!symbol) {
    return json({ error: 'Informe o parâmetro symbol' }, 400);
  }

  // A chave é lida do ambiente do servidor. Ela nunca chega ao navegador:
  // o cliente recebe apenas a cotação já calculada.
  const apiKey = readEnv('QUOTE_API_KEY');

  if (!apiKey) {
    return json({ error: 'Serviço indisponível' }, 503);
  }

  const quote = await fetchQuote(symbol, apiKey);

  return json(quote, 200, { 'Cache-Control': 'public, max-age=60' });
}
// #endregion handler

// #region json
function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });
}
// #endregion json

// #region env
// Cada plataforma expõe o ambiente de um jeito: process.env no Node,
// e um objeto env passado à função no Cloudflare Workers.
function readEnv(name, env = globalThis.process?.env ?? {}) {
  return env[name];
}
// #endregion env

// #region fetch-quote
// Em produção, esta função chamaria o provedor de cotações com a chave contratada.
// Aqui ela devolve um valor determinístico, para que o exemplo rode sem contratar nada.
async function fetchQuote(symbol, apiKey) {
  const price = 100 + (hash(symbol) % 10000) / 100;

  return {
    symbol: symbol.toUpperCase(),
    price: Number(price.toFixed(2)),
    currency: 'BRL',
    provider: `demo:${apiKey.slice(0, 3)}***`,
    fetchedAt: new Date().toISOString(),
  };
}

function hash(value) {
  let result = 0;

  for (const char of value) {
    result = (result * 31 + char.codePointAt(0)) % 1_000_003;
  }

  return result;
}
// #endregion fetch-quote
