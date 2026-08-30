import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from '@/middlewares/errorHandlers.ts';
import docsRoutes from '@/routes/docs.routes.ts';
import hostRoutes from '@/routes/hosts.routes.ts';
import pingRoutes from '@/routes/pings.routes.ts';
import tagRoutes from '@/routes/tags.routes.ts';
import { startMonitor } from '@/services/monitor.ts';

const app = express();

app.use(morgan('dev'));

app.use(cors({ origin: process.env.FRONTEND_URL ?? '*' }));

app.use(express.json());

app.use('/api', docsRoutes);
app.use('/api', hostRoutes);
app.use('/api', pingRoutes);
app.use('/api', tagRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Monitor API listening on port 3000');

  // O agendador so comeca depois que o servidor esta de pe.
  startMonitor();
});
