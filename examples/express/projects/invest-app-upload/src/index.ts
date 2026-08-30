import express from 'express';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from '@/middlewares/errorHandlers.ts';
import authRoutes from '@/routes/auth.routes.ts';
import brokerRoutes from '@/routes/brokers.routes.ts';
import categoryRoutes from '@/routes/categories.routes.ts';
import imageRoutes from '@/routes/images.routes.ts';
import docsRoutes from '@/routes/docs.routes.ts';
import investmentRoutes from '@/routes/investments.routes.ts';
import userRoutes from '@/routes/users.routes.ts';

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api', docsRoutes);
app.use('/api', investmentRoutes);
app.use('/api', categoryRoutes);
app.use('/api', brokerRoutes);
app.use('/api', userRoutes);
app.use('/api', imageRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(3000, () => console.log('Investment API listening on port 3000'));
