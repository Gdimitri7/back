// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Função auxiliar para buscar usuário
export async function getUserByUsername(username) {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
}

// Rota de registro
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('REQ BODY /register:', req.body);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e senha obrigatórios' });
  }

  try {
    // Verifica se usuário já existe
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Criptografa senha e insere
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    res.json({ success: true, message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário', details: err.message });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('REQ BODY /login:', req.body);

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e senha obrigatórios' });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Senha incorreta' });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET não definido no .env' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao fazer login', details: err.message });
  }
});

export default router;
