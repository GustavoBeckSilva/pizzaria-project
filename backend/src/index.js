require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes    = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const saborRoutes   = require('./routes/saborRoutes');
const pedidoRoutes  = require('./routes/pedidoRoutes');
const pizzaRoutes   = require('./routes/pizzaRoutes');
const tamanhoRoutes = require('./routes/tamanhoRoutes');

const app = express();

// CORS configurado via env var CORS_ORIGIN (comma‑separated)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [];
app.use(cors({
  origin: (origin, cb) => {
    // permitir requests sem origin (ex: curl) ou dentro da lista
    if (!origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

// Health check
app.get('/healthz', (req, res) => res.sendStatus(200));

// Rotas
app.use('/api/auth',       authRoutes);
app.use('/api/usuarios',   usuarioRoutes);
app.use('/api/sabores',    saborRoutes);
app.use('/api/pedidos',    pedidoRoutes);
app.use('/api/pedidos/:pedidoId/pizzas', pizzaRoutes);
app.use('/api/tamanhos',   tamanhoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
