const express = require('express');
const {
  registerUser,
  loginUser,
  verifyEmail,
  // getUserProfile,
  // updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyEmail);
// router.get('/profile', protect, getUserProfile);
// router.put('/profile', protect, updateUserProfile);

module.exports = router;
