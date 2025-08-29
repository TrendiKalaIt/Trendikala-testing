// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });


// module.exports = transporter;




// config/email.js
const nodemailer = require("nodemailer");

const otpTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OTP_EMAIL,
    pass: process.env.OTP_EMAIL_PASS,
  },
});

const orderTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ORDER_EMAIL,
    pass: process.env.ORDER_EMAIL_PASS,
  },
});

module.exports = { otpTransporter, orderTransporter };
