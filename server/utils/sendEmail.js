// utils/sendEmail.js
const transporter = require('../config/email');

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"TrendiKala" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(' Failed to send email:', error);
  }
};

module.exports = sendEmail;
