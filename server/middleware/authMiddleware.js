// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const protect = async (req, res, next) => {
//   const authHeader = req.header('Authorization');

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     req.user = null;
//     return next();
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(verified.id || verified._id);
//     if (!user) {
//       req.user = null;
//       return next();
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Auth Middleware Warning:', error.message);
//     req.user = null;
//     next();
//   }
// };

// module.exports = protect;


const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or malformed authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id || verified._id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Warning:', error.message);
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

module.exports = protect;
