import Auth from './auth.js';

/**
 * Assina o fluxo de medicoes do servidor.
 *
 * O `EventSource` do navegador seria mais curto, mas nao aceita cabecalhos —
 * e o token teria que viajar na URL, onde fica registrado em log de servidor e
 * no historico. Com `fetch` o `Authorization` continua no lugar certo, e o
 * corpo da resposta e lido como um fluxo enquanto a conexao vive.
 */
export async function subscribe(onPing) {
  const res = await fetch('/api/events', {
    headers: { Authorization: `Bearer ${Auth.getToken()}` },
  });

  if (!res.ok) {
    Auth.signout();

    return;
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();

  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += value;

    // Um bloco do protocolo SSE termina em linha em branco.
    const blocks = buffer.split('\n\n');

    buffer = blocks.pop() ?? '';

    for (const block of blocks) {
      const data = block
        .split('\n')
        .find((line) => line.startsWith('data:'))
        ?.slice(5)
        .trim();

      if (data) onPing(JSON.parse(data));
    }
  }
}
