import express from 'express';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/', protectedRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
