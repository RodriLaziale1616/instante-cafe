const router = require('express').Router();
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/roles');
const controller = require('../controllers/users.controller');

router.get('/', auth, requireRole('admin'), controller.list);
router.post('/', auth, requireRole('admin'), controller.create);
router.put('/:id', auth, requireRole('admin'), controller.update);

module.exports = router