const router = require('express').Router();
const auth = require('../middlewares/auth');
const requireRole = require('../middlewares/roles');
const controller = require('../controllers/export.controller');

router.get('/excel', auth, requireRole('admin'), controller.excel);

module.exports = router;