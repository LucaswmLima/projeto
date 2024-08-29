import express from 'express';
import dotenv from 'dotenv';
import addRouter from '../routes/addRoute';
import confirmRouter from '../routes/confirmRoute';
import listRouter from '../routes/listRoute';
import path from 'path';

dotenv.config();
require('../db/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/add', addRouter);
app.use('/confirm', confirmRouter);
app.use('/', listRouter);
app.use('/uploads', express.static('public/uploads'));

app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});
