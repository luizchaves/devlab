import express from 'express';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from '@/middlewares/errorHandlers.ts';
import investmentRoutes from '@/routes/investments.routes.ts';

const app = express();

app.use(morgan('dev'));

// Em producao o front vem compilado de `dist/`; `public/` fica atras dele para
// servir o que nao passa pelo build, como os avatares enviados no upload.
if (process.env.NODE_ENV === 'production') app.use(express.static('dist'));
app.use(express.static('public'));

app.use(express.json());

app.use('/api', investmentRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

app.listen(3000, () => console.log('Investment API listening on port 3000'));
