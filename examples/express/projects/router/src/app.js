import express from 'express';
import userRouter from './routes/user-router.js';

const app = express();

app.use(express.json());

// Todo o router e montado sob o prefixo /users.
app.use('/users', userRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Express Router' });
});

export default app;
