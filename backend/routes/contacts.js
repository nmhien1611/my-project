const express = require('express');
const router = express.Router();
const { create, getAll, getById, markAsRead, reply, remove } = require('../controllers/contactController');
const { auth, admin } = require('../middleware/auth');

router.get('/', auth, admin, getAll);
router.get('/:id', auth, admin, getById);
router.post('/', create);
router.put('/:id/read', auth, admin, markAsRead);
router.put('/:id/reply', auth, admin, reply);
router.delete('/:id', auth, admin, remove);

module.exports = router;
