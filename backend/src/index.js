require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const saborRoutes = require('./routes/saborRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const tamanhoRoutes = require('./routes/tamanhoRoutes');

const app = express();

// Configuração completa do CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requests sem origin (como mobile apps) + origens permitidas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilita preflight para todas as rotas

app.use(express.json());

// Health check
app.get('/healthz', (req, res) => res.sendStatus(200));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sabores', saborRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/pedidos/:pedidoId/pizzas', pizzaRoutes);
app.use('/api/tamanhos', tamanhoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));