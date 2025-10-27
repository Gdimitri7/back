import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,           // Supabase host
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT, 10),
  ssl: { rejectUnauthorized: false },
  family: 4                             // força IPv4
});

pool.connect()
  .then(client => {
    console.log('Conectado ao banco Supabase com sucesso!');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco Supabase:', err.message);
  });

export default pool;
