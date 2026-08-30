import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from '@/middlewares/errorHandlers.ts';
import hostRoutes from '@/routes/hosts.routes.ts';

const app = express();

app.use(morgan('dev'));

app.use(cors({ origin: process.env.FRONTEND_URL ?? '*' }));

app.use(express.json());

app.use('/api', hostRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(3000, () => console.log('Monitor API listening on port 3000'));
