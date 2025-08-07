const Enquiry = require('../models/enquiryModel');

exports.sendEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (error) {
    console.error('Error saving enquiry:', error.message);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};
