const router = require('express').Router();
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/roles');
const controller = require('../controllers/reports.controller');

router.get('/orders', auth, requireRole('admin'), controller.orders);
router.get('/top-products', auth, requireRole('admin'), controller.topProducts);

module.exports = router;