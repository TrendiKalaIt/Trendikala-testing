const express = require('express');
const router = express.Router();
const { sendEnquiry } = require('../controllers/enquiryController');

// POST /api/enquiries/send-enquiry
router.post('/send-enquiry', sendEnquiry);

module.exports = router;
