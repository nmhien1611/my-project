const express = require('express');
const router = express.Router();
const { create, getByProduct, getAll, updateApproval, remove } = require('../controllers/reviewController');
const { auth, admin } = require('../middleware/auth');

router.get('/product/:productId', getByProduct);
router.get('/', auth, admin, getAll);
router.post('/', auth, create);
router.put('/:id/approval', auth, admin, updateApproval);
router.delete('/:id', auth, admin, remove);

module.exports = router;
