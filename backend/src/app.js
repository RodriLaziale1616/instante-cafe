const express = require('express');
const cors = require('cors');

const auth = require('./middlewares/auth');
const authController = require('./controllers/auth.controller');

const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req, res) => {
  res.json({ message: 'Instante Café backend OK' });
});

/**
 * Rutas auth explícitas para evitar cualquier problema de mounting/router
 */
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', auth, authController.me);

/**
 * Otras rutas
 */
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/reports', require('./routes/reports.routes'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

module.exports = app;