import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import router from './routes.js';

const server = express();

server.use(morgan('tiny'));

// O front do MonitorApp roda em outra origem (o Vite, na porta 5173). Sem esta
// liberacao o navegador bloqueia a resposta antes que ela chegue ao `fetch`.
server.use(
  cors({
    origin: process.env.FRONTEND_URL ?? '*',
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

server.use(express.json());

server.use('/api', router);

server.listen(3000, () => {
  console.log('Monitor API listening on port 3000');
});
