const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Utility to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// REGISTER USER with OTP
exports.registerUser = async (req, res) => {
  const { name, email,mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });

    await newUser.save();

    // Send email with OTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: email,
      subject: 'Verify your Email',
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>It is valid for 10 minutes.</p>`
    });

    res.status(201).json({ message: "OTP sent to email. Please verify your account." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VERIFY EMAIL (OTP)
exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(401).json({ message: 'Email not verified' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// // controllers/userController.js
// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateUserProfile = async (req, res) => {
//   try {
//     const { name, mobile } = req.body;
//     const user = await User.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.name = name || user.name;
//     user.mobile = mobile || user.mobile;

//     await user.save();

//     res.status(200).json({ message: 'Profile updated successfully', user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

