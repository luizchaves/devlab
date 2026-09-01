import { Router } from 'express';

import { isAuthenticated } from '@/middlewares/isAuthenticated.ts';
import { monitorEvents, type PingEvent } from '@/services/events.ts';

const router = Router();

/** Intervalo do comentario que mantem a conexao viva, em milissegundos. */
const HEARTBEAT_MS = 30_000;

/**
 * Server-Sent Events: uma resposta HTTP que nunca termina.
 *
 * O corpo fica aberto e o servidor escreve blocos `event:` / `data:` conforme
 * as medicoes acontecem. Diferente do WebSocket, e HTTP puro e so trafega do
 * servidor para o cliente — que e exatamente a forma deste problema.
 */
router.get('/events', isAuthenticated, (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    // Desliga o buffer de proxies como o Nginx, que segurariam os blocos.
    'X-Accel-Buffering': 'no',
  });

  // Linha iniciada por `:` e comentario no protocolo: abre o fluxo sem evento.
  res.write(': conectado\n\n');

  const userId = req.userId;

  const send = (event: PingEvent) => {
    if (event.userId !== userId) return;

    res.write(`event: ping\ndata: ${JSON.stringify(event)}\n\n`);
  };

  monitorEvents.on('ping', send);

  const heartbeat = setInterval(() => res.write(': keep-alive\n\n'), HEARTBEAT_MS);

  // Sem esta limpeza cada aba fechada deixaria um ouvinte preso na memoria.
  req.on('close', () => {
    clearInterval(heartbeat);
    monitorEvents.off('ping', send);
  });
});

export default router;
