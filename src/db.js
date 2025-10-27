// src/db.js
import pkg from 'pg';
const { Pool } = pkg;

// Cria o pool de conexões com SSL habilitado (necessário para Supabase)
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }
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
