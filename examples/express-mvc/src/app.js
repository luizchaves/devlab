import express from 'express';
import { errorHandler, notFound } from './middlewares/error-handler.js';
import userRouter from './routes/user-router.js';

const app = express();

// #region middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
// #endregion

app.use('/users', userRouter);

// Middlewares finais: 404 primeiro, tratamento de erro por ultimo.
app.use(notFound);
app.use(errorHandler);

export default app;
