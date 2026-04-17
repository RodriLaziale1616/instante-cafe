const router = require('express').Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/expenses.controller');

router.get('/', auth, controller.list);
router.post('/', auth, controller.create);
router.get('/summary', auth, controller.summary);

module.exports = router;
