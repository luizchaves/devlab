import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

// #region parse
/**
 * O `ping` responde em texto, e o formato varia entre sistemas. A extracao
 * fica isolada aqui, e e a unica parte que precisa de teste de unidade.
 */
export function parsePing(output: string): { latencyMs: number | null } {
  const match = output.match(/time[=<]([\d.]+)\s*ms/i);

  return { latencyMs: match?.[1] ? Number(match[1]) : null };
}
// #endregion

// #region exec
/**
 * `execFile`, nunca `exec`.
 *
 * `exec` passa a string por um shell: um host chamado `8.8.8.8; rm -rf /`
 * viraria dois comandos. `execFile` entrega os argumentos como um array, e o
 * shell nunca entra na história.
 */
export async function ping(host: string, timeoutMs = 5000) {
  try {
    const { stdout } = await run('ping', ['-c', '1', '-W', '2', host], {
      timeout: timeoutMs,
      // Um comando que devolve megabytes nao pode encher a memoria do processo.
      maxBuffer: 64 * 1024,
    });

    return { reachable: true, ...parsePing(stdout) };
  } catch {
    return { reachable: false, latencyMs: null };
  }
}
// #endregion
