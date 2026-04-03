const express = require('express');
const router = express.Router();
const { create, getAll, getById, updateStatus, cancel, remove, getMyOrders } = require('../controllers/orderController');
const { auth, admin } = require('../middleware/auth');

router.get('/my-orders', auth, getMyOrders);
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.post('/', auth, create);
router.put('/:id/status', auth, admin, updateStatus);
router.put('/:id/cancel', auth, cancel);
router.delete('/:id', auth, admin, remove);

module.exports = router;
