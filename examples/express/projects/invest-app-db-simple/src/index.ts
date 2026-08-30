import express from 'express';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from '@/middlewares/errorHandlers.ts';
import docsRoutes from '@/routes/docs.routes.ts';
import investmentRoutes from '@/routes/investments.routes.ts';

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use('/api', docsRoutes);
app.use('/api', investmentRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(3000, () => console.log('Investment API listening on port 3000'));
