const express = require('express');
const { sendMessage } = require('../controllers/contactController');

const router = express.Router();

// Contact form submission
router.post('/', sendMessage);

// Optional: Test route
router.get('/test', (req, res) => {
  res.send('Contact route test successful');
});

module.exports = router;
