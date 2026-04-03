const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, remove } = require('../controllers/productController');
const { auth, admin } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', auth, admin, create);
router.put('/:id', auth, admin, update);
router.delete('/:id', auth, admin, remove);

module.exports = router;
