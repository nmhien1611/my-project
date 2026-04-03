const express = require('express');
const router = express.Router();
const { uploadFile, uploadMultiple } = require('../controllers/uploadController');
const { auth, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/single', auth, upload.single('file'), uploadFile);
router.post('/multiple', auth, upload.array('files', 10), uploadMultiple);

module.exports = router;
