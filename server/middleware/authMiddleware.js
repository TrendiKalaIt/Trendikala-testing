const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id || verified._id);
    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Warning:', error.message);
    req.user = null;
    next();
  }
};

module.exports = protect;
