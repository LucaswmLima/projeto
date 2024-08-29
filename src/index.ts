import express from 'express';
import dotenv from 'dotenv';
import addRouter from '../routes/addRoute';
import confirmRouter from '../routes/confirmRoute';

dotenv.config();
require('../db/db');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Configuração das rotas
app.use('/pictures', addRouter);
app.use('/confirm', confirmRouter);

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({
    error_code: "SERVER_ERROR",
    error_description: "Ocorreu um erro interno no servidor",
  });
});

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
