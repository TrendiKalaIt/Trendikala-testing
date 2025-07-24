const express = require('express');
const {
  registerUser,
  loginUser,
  verifyEmail,
  // getUserProfile,
  // updateUserProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyEmail);
// router.get('/profile', protect, getUserProfile);
// router.put('/profile', protect, updateUserProfile);
//for reset Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


module.exports = router;
