import express from 'express';

import { errorHandler, notFound } from '#middlewares/error-handler.ts';
import docsRouter from '#routes/docs-router.ts';
import taskRouter from '#routes/task-router.ts';

const app = express();

// #region middleware
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
// #endregion

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/tasks', taskRouter);

// #region docs
// Montado depois das rotas da API e antes do notFound: /docs e /openapi.json.
app.use(docsRouter);
// #endregion

// #region final
// Middlewares finais: 404 primeiro, tratamento de erro por ultimo.
app.use(notFound);
app.use(errorHandler);
// #endregion

export default app;
