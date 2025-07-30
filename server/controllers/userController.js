const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Utility to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// REGISTER USER with OTP
exports.registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

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

    // --- HTML for OTP Verification Email - Matching the image design ---
    const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff;">
                <div style="background-color: #5bbd72; padding: 15px 30px; text-align: start; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Verify Your Email</h1>
                    <p style="font-size: 16px; margin-top: 15px; line-height: 1.5;">Welcome to Trendikala, ${name.split(' ')[0]}!</p>
                    <p style="font-size: 16px; margin-top: 5px; line-height: 1.5;">Please use the OTP below to verify your email address and complete your registration.</p>
                </div>

                <div style="padding: 30px; text-align: center;">
                    <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px; color: #333;">Your One-Time Password (OTP)</h2>
                    <p style="font-size: 32px; font-weight: bold; color: #5bbd72; margin-bottom: 25px; letter-spacing: 5px;">
                        ${otp}
                    </p>
                    <p style="font-size: 14px; color: #555; line-height: 1.6;">
                        This OTP is valid for <strong>10 minutes</strong>. Please enter it on the verification page to activate your account.
                    </p>
                    
                

                    <p style="font-size: 13px; color: #777; margin-top: 30px; line-height: 1.5;">
                        If you did not attempt to register, please ignore this email.
                    </p>
                </div>

                <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #999; background-color: #f8f8f8; border-top: 1px solid #eee;">
                    &copy; ${new Date().getFullYear()} Trendikala.
                </div>
            </div>
        `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: email,
      subject: 'Verify Your Email for Trendikala',
      html: emailHtml
    });

    res.status(201).json({ message: "OTP sent to email. Please verify your account." });

  } catch (error) {
    console.error('Register user error:', error); // Added error logging
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
        profileImage: user.profileImage || null,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//forgot password 
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // --- HTML for Password Reset Email - Matching the image design ---
    const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff;">
              

                <div style="padding: 30px; text-align: center;">
                    <h2 style="font-size: 20px; margin-top: 0; margin-bottom: 20px; color: #333;">Reset Your Password</h2>
                    <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 25px;">
                        If you've lost your password or wish to reset it, click the button below to get started. This link is valid for <strong>15 minutes</strong>.
                    </p>
                    <a href="${resetUrl}" style="display: inline-block; background-color: #5bbd72; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold;">
                        Reset Your Password
                    </a>

                    <p style="font-size: 13px; color: #777; margin-top: 30px; line-height: 1.5;">
                        If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.
                    </p>
                </div>

                <div style="padding: 20px 30px; text-align: center; font-size: 12px; color: #999; background-color: #f8f8f8; border-top: 1px solid #eee;">
                    &copy; ${new Date().getFullYear()} Trendikala.
                </div>
            </div>
        `;

    await sendEmail(user.email, 'Password Reset Request', emailHtml);

    res.status(200).json({ message: 'Reset password link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check if new password is the same as old one
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password must be different from the old one' });
    }

    //  Hash and update new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('getUserProfile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, mobile, addresses } = req.body;

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;

    // Addresses come as string if sent via form-data, so parse if needed
    if (addresses) {
      if (typeof addresses === 'string') {
        user.addresses = JSON.parse(addresses);
      } else {
        user.addresses = addresses;
      }
    }

    // multer saves file info in req.file
    if (req.file && req.file.path) {
      user.profileImage = req.file.path; 
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};


//GET TOTAL USERS
exports.getTotalRegisteredUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    res.status(200).json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};






