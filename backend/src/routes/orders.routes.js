const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/orders.controller');

router.get('/', auth, controller.list);
router.post('/', auth, controller.create);

router.post('/:id/send-to-kitchen', auth, controller.sendToKitchen);
router.post('/:id/close', auth, controller.close);

// 🔴 NUEVA RUTA — ANULAR COMANDA
router.post('/:id/cancel', auth, controller.cancelOrder);

module.exports = router;

