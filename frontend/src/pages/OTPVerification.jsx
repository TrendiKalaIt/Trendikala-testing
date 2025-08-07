import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../utility/loaderSlice'; // adjust the path if needed
import { login } from '../utility/auth/authSlice';
import { setOrderDetails } from '../utility/checkoutSlice';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [email] = useState(() => localStorage.getItem('emailForOTP') || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get redirect path from query, default to '/checkout'
  const params = new URLSearchParams(location.search);
  const redirectPath = params.get('redirect') || '/';
 
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError('');
    dispatch(showLoader());

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email,
        otp,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Token or user info missing from server response.");
      }

      const { id, name, email: userEmail, profileImage } = user;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id,
          name,
          email: userEmail,
          profileImage: profileImage || null,
          token,
        })
      );
      localStorage.removeItem('emailForOTP');

      dispatch(
        login({
          id,
          name,
          email: userEmail,
          profileImage: profileImage || null,
          token,
        })
      );

      toast.success('Email verified successfully!');

      // DEBUGGING - check localStorage
      const savedCheckoutState = sessionStorage.getItem('checkoutState');

      if (savedCheckoutState) {
        const parsedCheckoutState = JSON.parse(savedCheckoutState);
        dispatch(setOrderDetails(parsedCheckoutState.orderDetails));
        console.log("Restored checkout details:", parsedCheckoutState.orderDetails);

        // Navigate to checkout after slight delay
        setTimeout(() => {
          navigate('/checkout');
        }, 100);
      } else {
        // No checkoutState - navigate to redirectPath or home
        console.log('No checkoutState found, redirecting to:', redirectPath);
        navigate(redirectPath);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'OTP verification failed';
      setError(message);
      toast.error(message);
      console.error('OTP verification failed:', error);
    } finally {
      dispatch(hideLoader());
    }
  };



  return (
    <div className="h-full bg-gray-50 flex flex-col items-center pt-8 px-4 mb-2">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col items-center justify-between px-4 mb-10">
        <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-[100px] sm:w-[120px]">
              <img
                src="/trendikala_logo_bg.png"
                alt="Trendi Kala Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden md:block border-l-2 border-green-700 h-20 px-2" />
            <div className="hidden md:block">
              <span className="block text-green-700 tracking-[1.2rem] text-xl sm:text-2xl">
                TRENDI <br /> KALA
              </span>
              <span className="block text-sm text-gray-500 mt-1">
                TRENDS & KALA BY EVERY DESIGN
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center md:justify-start space-x-4 text-gray-700 text-sm sm:text-base pt-5">
          <a href="#" className="hover:text-green-700">Women</a>
          <a href="#" className="hover:text-green-700">New In</a>
          <a href="#" className="hover:text-green-700">Clothing</a>
          <a href="#" className="hover:text-green-700">Custom Request</a>
          <a href="#" className="hover:text-green-700">Personal Shopper</a>
        </nav>
      </header>

      <div className="border w-full max-w-6xl mb-2"></div>

      {/* Form Container */}
      <div className="w-full max-w-xl bg-white p-4 md:p-10 rounded-lg shadow-sm">
        <h2 className="text-2xl pt-2 font-semibold text-[#93A87E] mb-6 border-b-2 border-[#93A87E] pb-2 inline-block">
          VERIFY YOUR EMAIL
        </h2>

        <form onSubmit={handleOTPSubmit}>
          {email && (
            <div className="mb-4">
              <label className="block text-[#35894E] text-sm font-medium mb-2">Email</label>
              <div className="w-full border-2 border-[#35894e75] rounded py-2 px-3 text-gray-700 bg-gray-100">
                {email}
              </div>
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <label htmlFor="otp" className="block text-[#35894E] text-sm font-medium mb-2">
              OTP (One-Time Password)
            </label>
            <input
              type="text"
              id="otp"
              className="w-full border-2 border-[#35894e75] rounded py-2 px-3 text-gray-700 focus:outline-none focus:border-[#35894E]"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#93A87E] hover:bg-[#93a87eae] text-white font-bold py-2 px-6 rounded-full transition"
            >
              VERIFY OTP
            </button>
          </div>
        </form>

        <div className="border mt-8"></div>

        {/* Optional: Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-[#35894E] mb-4">Already verified?</p>
          <button
            type="button"
            className="w-full border border-[#35894E] text-[#35894E] font-bold py-2 px-6 rounded-full hover:bg-green-50 transition"
            onClick={() => navigate('/signin')}
          >
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
