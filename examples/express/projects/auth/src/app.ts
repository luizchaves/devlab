import express from 'express';

import { errorHandler, notFound } from '#middlewares/error-handler.ts';
import authRouter from '#routes/auth-router.ts';
import investmentRouter from '#routes/investment-router.ts';
import userRouter from '#routes/user-router.ts';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/investments', investmentRouter);
app.use('/users', userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
