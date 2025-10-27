import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token necessário' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Rota protegida de exemplo
router.get('/protegida', authenticate, (req, res) => {
  res.json({ message: `Olá usuário ${req.user.id}, você acessou uma rota protegida!` });
});

export default router;
