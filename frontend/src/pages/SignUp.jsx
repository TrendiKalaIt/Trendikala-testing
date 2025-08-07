
import axios from 'axios';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../utility/loaderSlice';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();



  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      dispatch(showLoader());

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name: fullName,
        email,
        mobile,
        password,
      });

      toast.success(response.data.message);
      localStorage.setItem('emailForOTP', email);

      const params = new URLSearchParams(location.search);
      const redirectPath = params.get('redirect') || '/';

      navigate(`/verify-otp?redirect=${encodeURIComponent(redirectPath)}`);


    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      console.error('Signup Error:', msg);
      toast(msg);
    } finally {
      dispatch(hideLoader());
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 px-4 mb-2">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col  items-center justify-between px-4 mb-10">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-[100px] md:w-[120px]">
              <img src="/trendikala_logo_bg.png" alt="Trendi Kala Logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden md:block border-l-2 border-green-700 h-20 px-2" />
            <div className="hidden md:block">
              <span className="block text-green-700 tracking-[1.2rem] text-xl md:text-2xl">TRENDI<br />KALA</span>
              <span className="block text-sm md:text-base text-gray-500 mt-1">TRENDS & KALA BY EVERY DESIGN</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start space-x-4 text-gray-700 text-sm sm:text-base pt-5 ">
          <span className="hover:text-green-700">Women</span>
          <span className="hover:text-green-700">New In</span>
          <span className="hover:text-green-700">Clothing</span>
          <span className="hover:text-green-700">Custom Request</span>
          <span className="hover:text-green-700">Personal Shopper</span>
        </div>
      </header>

      <div className="border w-full max-w-6xl mb-10"></div>

      {/* Form */}
      <div className="w-full max-w-xl bg-white p-4 md:p-10 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-[#93A87E] mb-6 border-b-2 border-[#93A87E] pb-2 inline-block">
          CREATE ACCOUNT
        </h2>

        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-[#35894E] text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              id="fullName"
              className="border-2 border-[#35894e75] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#35894E]"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-[#35894E] text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="border-2 border-[#35894e75] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#35894E]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block text-[#35894E] text-sm font-medium mb-2">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              className="border-2 border-[#35894e75] rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#35894E]"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit mobile number"
            />
          </div>


          <div className="mb-4">
            <label htmlFor="password" className="block text-[#35894E] text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="border-2 border-[#35894e75] rounded w-full py-2 px-3 pr-10 text-gray-700 focus:outline-none focus:border-[#35894E]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-[#35894E] text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="border-2 border-[#35894e75] rounded w-full py-2 px-3 pr-10 text-gray-700 focus:outline-none focus:border-[#35894E]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#93A87E] w-full hover:bg-[#93a87eae] text-white font-bold py-2 px-8 rounded-full transition duration-200"
          >
            SIGN UP
          </button>
        </form>

        <div className="border mt-8"></div>

        <div className="mt-8 text-center">
          <p className="text-[#35894E] mb-4">Already have an account?</p>
          <button
            type="button"
            className="border w-full border-[#35894E] text-[#35894E] font-bold py-2 px-6 rounded-full hover:bg-green-50 transition duration-200"
            onClick={() => navigate('/signin')}
          >
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
