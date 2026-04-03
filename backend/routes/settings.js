const express = require('express');
const router = express.Router();
const { get, upsert, remove, seedDefaults } = require('../controllers/settingsController');
const { auth, admin } = require('../middleware/auth');

router.get('/', get);
router.post('/seed-defaults', auth, admin, seedDefaults);
router.post('/', auth, admin, upsert);
router.delete('/:key', auth, admin, remove);

module.exports = router;
