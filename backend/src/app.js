const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = [
  'https://instantcafe-production.up.railway.app',
  'http://localhost:5173',
];

app.use(cors({
  origin(origin, callback) {
    // Permite requests sin origin (curl, health checks, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Instante Café backend OK' });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/reports', require('./routes/reports.routes'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

module.exports = app;