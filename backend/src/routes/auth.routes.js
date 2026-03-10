const router = require('express').Router();
const cors = require('cors');
const auth = require('../middlewares/auth');
const controller = require('../controllers/auth.controller');

const corsOptions = {
  origin: [
    'https://instantcafe-production.up.railway.app',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Preflight explícito para login
router.options('/login', cors(corsOptions), (_req, res) => {
  res.sendStatus(204);
});

router.post('/login', cors(corsOptions), controller.login);
router.get('/me', cors(corsOptions), auth, controller.me);

module.exports = router;