import prisma from '@/database/database.ts';
import Ping from '@/models/Ping.ts';

/** Intervalo entre rodadas, em segundos. */
const INTERVAL_SECONDS = Number(process.env.MONITOR_INTERVAL ?? 60);

/**
 * Mede todos os hosts de uma vez. `allSettled` — e nao `all` — porque um host
 * fora do ar nao pode interromper a rodada dos outros.
 */
async function runRound() {
  const hosts = await prisma.host.findMany({ select: { id: true } });

  await Promise.allSettled(hosts.map((host) => Ping.check(host.id)));
}

/**
 * Agendador simples: uma rodada agora e outra a cada intervalo.
 *
 * `unref()` desprende o timer do laco de eventos, entao um `Ctrl+C` encerra o
 * processo sem esperar a proxima rodada.
 */
export function startMonitor() {
  if (process.env.MONITOR_ENABLED === 'false') return;

  runRound().catch((error) => console.error('Falha na rodada inicial', error));

  const timer = setInterval(() => {
    runRound().catch((error) => console.error('Falha na rodada de monitoramento', error));
  }, INTERVAL_SECONDS * 1000);

  timer.unref();

  console.log(`Monitor rodando a cada ${INTERVAL_SECONDS}s`);
}
