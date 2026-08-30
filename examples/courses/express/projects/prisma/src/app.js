import express from 'express';
import { errorHandler, notFound } from './middlewares/error-handler.js';
import userRouter from './routes/user-router.js';

const app = express();

app.use(express.json());

app.use('/users', userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
