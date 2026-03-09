const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/reports.controller');
router.get('/orders', auth, controller.orders);
router.get('/top-products', auth, controller.topProducts);
module.exports = router;
