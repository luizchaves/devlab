import express from 'express';
import { errorHandler, notFound } from './middlewares/error-handler.js';
import { logger } from './middlewares/logger.js';
import taskRouter from './routes/task-router.js';

const app = express();

// #region chain
// A ordem e o comportamento: cada middleware so ve o que os anteriores deixaram passar.
app.use(express.json());
app.use(logger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/tasks', taskRouter);

// Middlewares finais: 404 primeiro, tratamento de erro por ultimo.
app.use(notFound);
app.use(errorHandler);
// #endregion

export default app;
