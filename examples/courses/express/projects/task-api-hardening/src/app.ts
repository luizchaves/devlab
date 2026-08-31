import express from 'express';

import { cors } from '#middlewares/cors.ts';
import { errorHandler, notFound } from '#middlewares/error-handler.ts';
import { requestLogger } from '#middlewares/logger.ts';
import { rateLimit } from '#middlewares/rate-limit.ts';
import { requestId } from '#middlewares/request-id.ts';
import { securityHeaders } from '#middlewares/security-headers.ts';
import authRouter from '#routes/auth-router.ts';
import docsRouter from '#routes/docs-router.ts';
import healthRouter from '#routes/health-router.ts';
import taskRouter from '#routes/task-router.ts';
import { render } from '#telemetry.ts';

const app = express();

// #region trust-proxy
// Atras de um proxy, `req.ip` seria sempre o do proxy — e o rate limit
// contaria o mundo inteiro como um unico cliente.
app.set('trust proxy', 1);
// #endregion

// #region chain
// A ordem e a arquitetura. Cada middleware so ve o que os anteriores deixaram passar.
app.use(requestId); //       1. todo log daqui em diante tem o id
app.use(securityHeaders); // 2. vale ate para as respostas de erro
app.use(cors); //            3. responde o preflight antes de tudo
app.use(requestLogger); //   4. mede a requisicao inteira
app.use(express.json({ limit: '100kb' })); // 5. corpo, com teto

app.use(healthRouter);

// Um teto global; as rotas caras apertam o proprio.
app.use(rateLimit());

app.use('/auth', authRouter);
app.use('/tasks', taskRouter);
app.use(docsRouter);

app.get('/metrics', (_req, res) => {
  res.type('text/plain').send(render());
});

app.use(notFound);
app.use(errorHandler);
// #endregion

export default app;
