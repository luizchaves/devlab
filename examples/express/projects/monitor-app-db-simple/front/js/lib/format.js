/** Latencia em milissegundos, ou um travessao quando o host nao respondeu. */
export function formatLatency(latency) {
  return typeof latency === 'number' ? `${latency} ms` : '—';
}

/** A barra de latencia vai de 0 a 100; acima de 200 ms ela satura. */
export function latencyRatio(latency) {
  return typeof latency === 'number' ? Math.min(100, Math.round((latency / 200) * 100)) : 0;
}

export function formatDateTime(value) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
