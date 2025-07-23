const Enquiry = require('../models/enquiryModel');

// @desc    Save enquiry to DB
// @route   POST /api/enquiries/send-enquiry
// @access  Public
exports.sendEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (error) {
    console.error('Error saving enquiry:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
