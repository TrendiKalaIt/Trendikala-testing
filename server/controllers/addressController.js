const User = require('../models/user');

exports.saveAddress = async (req, res) => {
  try {
    const user = req.user;
    const {
      fullName,
      streetAddress,
      apartment,
      townCity,
      state,
      zipcode,
      phoneNumber,
      emailAddress,
    } = req.body;

    if (!fullName || !streetAddress || !townCity || !zipcode || !state || !phoneNumber || !emailAddress) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newAddress = {
      fullName,
      streetAddress,
      apartment,
      townCity,
      state,
      zipcode,
      phoneNumber,
      emailAddress,
    };

    // Prevent duplicate save (optional)
    const alreadyExists = user.addresses.some(
      (addr) =>
        addr.streetAddress === newAddress.streetAddress &&
        addr.townCity === newAddress.townCity
    );

    if (!alreadyExists) {
      user.addresses.push(newAddress);
      await user.save();
    }

    res.status(200).json({ message: 'Address saved successfully', addresses: user.addresses });
  } catch (err) {
    console.error('❌ Save address error:', err);
    res.status(500).json({ message: 'Failed to save address', error: err.message });
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ addresses: user.addresses || [] });
  } catch (err) {
    console.error('Get address error:', err);
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const user = req.user;
    const addressId = req.params.id;

    await user.updateOne({
      $pull: {
        addresses: { _id: addressId }
      }
    });

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error('Delete address error:', err);
    res.status(500).json({ message: 'Failed to delete address' });
  }
};
