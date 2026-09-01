import { execFile } from 'node:child_process';
import { platform } from 'node:os';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface PingResult {
  success: boolean;
  /** Latencia em milissegundos, ou `null` quando o host nao respondeu. */
  latency: number | null;
}

/**
 * `-c` no Linux e no macOS, `-n` no Windows: numero de pacotes.
 * `-W` / `-w`: tempo maximo de espera pela resposta.
 */
function buildArgs(address: string, timeoutSeconds: number): string[] {
  return platform() === 'win32'
    ? ['-n', '1', '-w', String(timeoutSeconds * 1000), address]
    : ['-c', '1', '-W', String(timeoutSeconds), address];
}

/**
 * A latencia aparece na saida do comando como `time=12.3 ms`. A expressao
 * aceita `time=` e `tempo=`, ponto ou virgula decimal, porque o `ping` e
 * traduzido junto com o sistema.
 */
function parseLatency(output: string): number | null {
  const match = output.match(/t(?:ime|empo)[=<]\s*([\d.,]+)\s*ms/i);

  return match?.[1] ? Math.round(Number(match[1].replace(',', '.'))) : null;
}

/**
 * Executa um `ping` de verdade contra o endereco.
 *
 * `execFile` — e nao `exec` — recebe o comando e os argumentos separados: o
 * endereco nunca passa pelo shell, entao um valor como `8.8.8.8; rm -rf /`
 * chega ao `ping` como um argumento unico e falha ali, sem virar comando.
 */
export async function ping(address: string, timeoutSeconds = 2): Promise<PingResult> {
  try {
    const { stdout } = await execFileAsync('ping', buildArgs(address, timeoutSeconds), {
      timeout: (timeoutSeconds + 1) * 1000,
    });

    const latency = parseLatency(stdout);

    return { success: latency !== null, latency };
  } catch {
    // Host fora do ar, DNS que nao resolve, timeout: tudo e uma medicao com falha.
    return { success: false, latency: null };
  }
}
