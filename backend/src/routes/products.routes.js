const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/products.controller');

router.get('/', auth, controller.list);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);

module.exports = router;