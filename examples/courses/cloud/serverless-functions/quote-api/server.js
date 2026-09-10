// #region local-server
// Servidor local que executa a mesma função da nuvem, para desenvolver e testar
// sem publicar. A plataforma faz esta tradução sozinha; aqui ela fica visível.
import { createServer } from 'node:http';
import handler from './handler.js';

const port = Number(process.env.PORT ?? 3000);

createServer(async (req, res) => {
  const request = new Request(new URL(req.url, `http://localhost:${port}`), {
    method: req.method,
    headers: req.headers,
  });

  const response = await handler(request);

  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
}).listen(port, () => {
  console.log(`Função disponível em http://localhost:${port}/api/quote?symbol=PETR4`);
});
// #endregion local-server
