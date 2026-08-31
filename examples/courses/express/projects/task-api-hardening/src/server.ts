import app from '#app.ts';
import { config } from '#config.ts';
import { prisma } from '#database/prisma.ts';
import { log } from '#middlewares/logger.ts';

const server = app.listen(config.PORT, () => {
  log('info', 'server_started', { port: config.PORT, env: config.NODE_ENV });
});

// #region shutdown
/**
 * Encerramento gracioso.
 *
 * Ao receber o sinal, o servidor para de aceitar conexoes novas e espera as
 * que ja estao em andamento terminarem. Sem isto, um deploy derruba no meio
 * requisicoes que estavam quase respondendo.
 */
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    log('info', 'shutdown_started', { signal });

    server.close(async () => {
      await prisma.$disconnect();

      log('info', 'shutdown_complete');
      process.exit(0);
    });

    // Rede de seguranca: se algo travar, nao fique preso para sempre.
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
// #endregion

// #region uncaught
/**
 * O `errorHandler` so alcanca o que acontece dentro de uma requisicao. Um erro
 * solto fora dela precisa ser registrado antes de o processo morrer — senao a
 * unica pista e um contêiner que reiniciou sem explicacao.
 */
process.on('unhandledRejection', (reason) => {
  log('error', 'unhandled_rejection', { reason: String(reason) });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log('error', 'uncaught_exception', { error: error.message, stack: error.stack });
  process.exit(1);
});
// #endregion
