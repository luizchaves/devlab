import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import router from './routes.js';

const server = express();

server.use(morgan('tiny'));

server.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
  })
);

server.use(express.json());

// Em producao o front vem compilado de `dist/`; `public/` fica atras dele para
// servir o que nao passa pelo build, como os avatares enviados no upload.
if (process.env.NODE_ENV === 'production') server.use(express.static('dist'));
server.use(express.static('public'));

server.use('/api', router);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
