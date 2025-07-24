const express = require('express');
const upload = require('../middleware/multer'); 
const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyEmail);

//for reset Password
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

//  Profile Routes
router.get('/profile', protect, getUserProfile);
// For profile update with image upload, use multer middleware `upload.single('profileImage')`
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);


module.exports = router;
