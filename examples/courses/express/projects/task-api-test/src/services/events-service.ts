import type { Response } from 'express';

// #region clients
/**
 * Os clientes conectados, agrupados por dono.
 *
 * Nao ha broadcast para todo mundo: cada pessoa recebe eventos das proprias
 * tarefas. Autorizacao vale para SSE tanto quanto para uma rota comum.
 */
const clients = new Map<string, Set<Response>>();

export function subscribe(userId: string, res: Response) {
  const set = clients.get(userId) ?? new Set<Response>();

  set.add(res);
  clients.set(userId, set);

  // Sem isto, cada desconexao deixa um Response pendurado para sempre.
  res.on('close', () => {
    set.delete(res);

    if (set.size === 0) clients.delete(userId);
  });
}
// #endregion

// #region publish
/**
 * O formato do SSE e texto puro: `event:`, `data:` e uma linha em branco.
 *
 * A linha em branco e o que encerra a mensagem — sem ela o navegador continua
 * esperando e nada e entregue.
 */
export function publish(userId: string, event: string, payload: unknown) {
  const message = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;

  for (const res of clients.get(userId) ?? []) {
    res.write(message);
  }
}
// #endregion

/** Usado pelo `/metrics` e pelos testes. */
export function connectionCount(): number {
  let total = 0;

  for (const set of clients.values()) total += set.size;

  return total;
}
