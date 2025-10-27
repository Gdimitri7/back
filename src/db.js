// src/db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Cria o pool de conexões com SSL habilitado (necessário para Supabase)
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,           // IPv4 do Supabase
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT, 10),
  ssl: {
    rejectUnauthorized: false          // obrigatório
  },
  family: 4                         // força IPv4   
});

// Teste de conexão inicial
pool.connect()
  .then(client => {
    console.log('Conectado ao banco Supabase com sucesso!');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco Supabase:', err.message);
  });

export default pool;
