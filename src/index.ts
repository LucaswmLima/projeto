import express from 'express';
import dotenv from 'dotenv';
import addRouter from './api/routes/addRoute';
import confirmRouter from './api/routes/confirmRoute';
import listRouter from './api/routes/listRoute';
import path from 'path';

dotenv.config();

require('./config/dbConfig');

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
