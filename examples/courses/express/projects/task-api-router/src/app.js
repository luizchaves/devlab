import express from 'express';
import taskRouter from './routes/task-router.js';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// #region mount
// Todo o router e montado sob o prefixo /tasks: os caminhos declarados
// dentro dele sao relativos a esse prefixo.
app.use('/tasks', taskRouter);
// #endregion

export default app;
