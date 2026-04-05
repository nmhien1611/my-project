const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/authController');
const { auth, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

// TEMP: chỉ dùng để test, xóa sau khi dùng xong
const User = require('../models/User');
router.post('/make-admin', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { role: 'admin' });
  res.json({ success: true, message: 'Đã nâng role lên admin' });
});
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.get('/users', auth, admin, getAllUsers);
router.get('/users/:id', auth, admin, getUserById);
router.put('/users/:id', auth, admin, updateUser);
router.delete('/users/:id', auth, admin, deleteUser);

module.exports = router;
