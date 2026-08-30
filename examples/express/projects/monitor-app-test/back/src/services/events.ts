import { EventEmitter } from 'node:events';

export interface PingEvent {
  hostId: string;
  /** O dono do host: o barramento e global, a entrega e por conta. */
  userId: string;
  success: boolean;
  latency: number | null;
  createdAt: string;
}

/**
 * Barramento em memoria entre quem mede (o agendador) e quem escuta (as
 * conexoes SSE abertas). Trocar isto por Redis ou por uma fila e o passo
 * seguinte quando a aplicacao roda em mais de um processo.
 */
export const monitorEvents = new EventEmitter();

// Cada navegador aberto e um ouvinte; o limite padrao de 10 avisaria a toa.
monitorEvents.setMaxListeners(0);

export function emitPing(event: PingEvent) {
  monitorEvents.emit('ping', event);
}
