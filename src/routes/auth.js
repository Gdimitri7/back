// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Rota para registrar usuário
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Preencha username e password' });

  try {
    // Verifica se usuário já existe
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length > 0) return res.status(400).json({ error: 'Usuário já existe' });

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere no banco
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
      [username, hashedPassword]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário', details: err.message });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Preencha username e password' });

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(400).json({ error: 'Usuário não encontrado' });

    const user = rows[0];

    // Compara senha
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Senha incorreta' });

    // Gera token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ success: true, token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro ao fazer login', details: err.message });
  }
  // Rota para listar usuários
router.get('/list', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username, created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).json({ error: 'Erro ao listar usuários', details: err.message });
  }
});

});

export default router;
