
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AddressForm = ({
  token,
  setShowForm,
  setSavedAddresses,
  guestMode = false,          // naya prop, default false
  address = null,             // guest ke liye initial address (optional)
  onAddressChange = () => { }, // guest ke liye address change notify karne ke liye
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    streetAddress: '',
    apartment: '',
    townCity: '',
    state: '',
    zipcode: '',
    phoneNumber: '',
    emailAddress: '',
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    }
  }, [address]);

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim())
      errors.fullName = 'Full Name is required';

    if (!formData.streetAddress.trim())
      errors.streetAddress = 'House No. / Building Name is required';

    if (!formData.apartment.trim())
      errors.apartment = 'Road Name / Area / Colony is required';

    if (!formData.townCity.trim())
      errors.townCity = 'Nearby Landmark is required';

    if (!formData.state.trim())
      errors.state = 'State is required';
    
    if (!formData.zipcode.trim())
      errors.zipcode = 'ZIP / PIN Code is required';

    else if (!/^\d{6}$/.test(formData.zipcode))
      errors.zipcode = 'Enter a valid 6-digit PIN Code';

    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber))
      errors.phoneNumber = 'Enter a valid 10-digit Indian phone number';

    if (!/\S+@\S+\.\S+/.test(formData.emailAddress))
      errors.emailAddress = 'Enter a valid email address';

    return errors;
  };

  // Guest mode: har input change pe parent ko notify karo
  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    if (guestMode) {
      onAddressChange(newFormData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guestMode) {
      // Guest mode me save nahi karenge, sirf validation karenge aur parent ko notify karenge
      const errors = validateForm();
      setFormErrors(errors);

      if (Object.keys(errors).length > 0) {
        Object.values(errors).forEach((err) => toast.error(err));
        return;
      }

      toast.success('Address filled!');
      // Agar aap chahte ho toh yahan kuch aur kar sakte hain, lekin save nahi hoga
      return;
    }

    // Logged in user logic: save address API call
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((err) => toast.error(err));
      return;
    }

    try {
      const axios = await import('axios');
       const response = await axios.default.post(
    `${import.meta.env.VITE_API_URL}/api/addresses/save`,
    formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Address saved!');
      setShowForm(false);
      setFormData({
        fullName: '',
        streetAddress: '',
        apartment: '',
        townCity: '',
        state: '',
        zipcode: '',
        phoneNumber: '',
        emailAddress: '',
      });

      // Refresh address list
      const res = await axios.default.get('/api/addresses/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(res.data.addresses || []);
    } catch {
      toast.error('Failed to save address.');
    }
  };

  return (
    <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
      {[
        ['fullName', 'Full Name*'],
        ['streetAddress', 'House No., Building Name*'],
        ['apartment', 'Road Name, Area, Colony*'],
        ['townCity', 'Nearby Landmark (Shop/Mall/etc.)*'],
        ['state', 'State*'],
        ['zipcode', 'ZIP / PIN Code*'],
        ['phoneNumber', 'Phone Number*'],
        ['emailAddress', 'Email Address*'],
      ].map(([id, label]) => (
        <div key={id}>
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input
            type={id === 'emailAddress' ? 'email' : 'text'}
            id={id}
            value={formData[id]}
            onChange={(e) => handleInputChange(id, e.target.value)}
            className={`w-full px-3 py-2 border ${formErrors[id] ? 'border-red-500' : 'border-gray-300'} rounded-md bg-green-50`}
          />
          {formErrors[id] && <p className="text-sm text-red-500 mt-1">{formErrors[id]}</p>}
        </div>
      ))}
      {!guestMode && (
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Save Address
        </button>
      )}
    </form>
  );
};

export default AddressForm;
