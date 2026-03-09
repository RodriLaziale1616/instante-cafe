const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/products.controller');
router.get('/', auth, controller.list);
module.exports = router;
