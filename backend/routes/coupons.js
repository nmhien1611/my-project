const express = require('express');
const router = express.Router();
const { create, getAll, getById, apply, update, remove } = require('../controllers/couponController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, getAll);
router.get('/:id', auth, admin, getById);
router.post('/', auth, admin, create);
router.post('/apply', auth, apply);      // user dùng để kiểm tra mã
router.put('/:id', auth, admin, update);
router.delete('/:id', auth, admin, remove);

module.exports = router;
