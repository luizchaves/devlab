import express from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

// Interpreta o corpo das requisicoes com Content-Type: application/json.
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.get('/hello/:name', (req, res) => {
  res.json({ message: `Hello ${req.params.name}` });
});

app.post('/echo', (req, res) => {
  res.status(201).json({ received: req.body });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
