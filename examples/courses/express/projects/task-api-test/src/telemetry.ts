// #region metrics
/**
 * Metricas em memoria, no formato de exposicao do Prometheus.
 *
 * Log responde "o que aconteceu nesta requisicao"; metrica responde "como o
 * servico esta se comportando agora". Sao perguntas diferentes, e nenhuma das
 * duas substitui a outra.
 */
const counters = new Map<string, number>();
const durations: number[] = [];

export function countRequest(method: string, status: number) {
  const key = `${method}:${status}`;

  counters.set(key, (counters.get(key) ?? 0) + 1);
}

export function observeDuration(ms: number) {
  durations.push(ms);

  // Uma janela deslizante evita o vazamento de memoria de um array infinito.
  if (durations.length > 1000) durations.shift();
}
// #endregion

// #region percentile
/**
 * A media esconde o problema: se 99 requisicoes levam 10 ms e uma leva 5 s, a
 * media diz 60 ms e ninguem investiga. O p95 e o p99 mostram a cauda.
 */
function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));

  return sorted[index] ?? 0;
}

export function render(): string {
  const lines = [
    '# HELP http_requests_total Requisicoes atendidas, por metodo e status.',
    '# TYPE http_requests_total counter',
  ];

  for (const [key, total] of counters) {
    const [method, status] = key.split(':');

    lines.push(`http_requests_total{method="${method}",status="${status}"} ${total}`);
  }

  lines.push(
    '# HELP http_request_duration_ms Duracao das requisicoes em milissegundos.',
    '# TYPE http_request_duration_ms summary',
    `http_request_duration_ms{quantile="0.5"} ${percentile(durations, 50)}`,
    `http_request_duration_ms{quantile="0.95"} ${percentile(durations, 95)}`,
    `http_request_duration_ms{quantile="0.99"} ${percentile(durations, 99)}`
  );

  return `${lines.join('\n')}\n`;
}
// #endregion
