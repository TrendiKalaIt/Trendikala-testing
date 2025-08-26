// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { SiRazorpay, SiFacebook, SiInstagram, SiYoutube, SiGooglepay, SiPaypal, SiAmazonpay, } from 'react-icons/si';
import { FaCcMastercard } from 'react-icons/fa6';
import { FaCcVisa, FaCcApplePay } from 'react-icons/fa';


const Footer = () => {
  return (
   <>
    <footer className="bg-[#bedaa4] text-gray-800 py-10 px-6">
      <div className=" container mx-auto grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 sm:grid-cols-2 gap-8 text-start ">

        {/* Customer Care */}
        <div className=''>
          <h3 className=" font-home font-bold text-lg mb-4">CUSTOMER CARE</h3>
          <ul className="space-y-2 ">
            <li><Link to="/contact" className="font-body hover:text-lime-700 transition duration-300">Contact Us</Link></li>
            <li><Link to="/faq" className="font-body hover:text-lime-700 transition duration-300">FAQs</Link></li>
            <li><Link to="/enquiry" className="font-body hover:text-lime-700 transition duration-300">Enquiry</Link></li>

          </ul>
        </div>

        {/* Shop Navigation */}
        <div>
          <h3 className="font-home font-bold text-lg mb-4">SHOP</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="font-body hover:text-lime-700 transition duration-300">Home</Link></li>
            <li><Link to="/allproducts" className="font-body hover:text-lime-700 transition duration-300">All Products</Link></li>
            <li><Link to="/about" className="font-body hover:text-lime-700 transition duration-300">About</Link></li>
            <li><Link to="/manufacturing" className="font-body hover:text-lime-700 transition duration-300">Manufacturing</Link></li>
          </ul>
        </div>

        {/* User & Policy */}
        <div>
          <h3 className="font-home font-bold text-lg mb-4">ACCOUNT / POLICIES</h3>
          <ul className="space-y-2">
            <li><Link to="/signup" className="font-body hover:text-lime-700 transition duration-300">Create Account</Link></li>
            <li><Link to="/cancellation-return" className="font-body hover:text-lime-700 transition duration-300">Cancellation & Return</Link></li>
            <li><Link to="/privacy-policy" className="font-body hover:text-lime-700 transition duration-300">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions" className="font-body hover:text-lime-700 transition duration-300">Terms & Conditions</Link></li>
          </ul>

        </div>

        {/* Socials & Payment */}
        <div>
          <h3 className=" font-home font-bold text-lg mb-2">SOCIALS</h3>
          <div className='flex flex-wrap md:justify-start gap-4 text-2xl text-gray-700 mb-2'>

            <div><a href="https://www.facebook.com/share/14JLn8svZCB/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="text-blue-600 transition duration-300 "><SiFacebook /></a></div>
            <div><a href="https://www.instagram.com/trendikalaofficial?igsh=MXdidTA0YmY2Ymd3YQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="text-red-400 transition duration-300 "><SiInstagram /></a></div>
            <div><a href="https://www.youtube.com/@trendikala" target="_blank" rel="noreferrer" className="text-red-600 transition duration-300 "><SiYoutube /></a></div>

          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-home">TRENDI KALA ACCEPTS</h3>
            <div className="flex flex-wrap md:justify-start gap-4 text-2xl text-gray-700">
              <SiRazorpay title="Razorpay" className="hover:text-blue-600 cursor-pointer transition-colors" />
              <SiGooglepay title="Google Pay" className="hover:text-green-600 cursor-pointer transition-colors" />
              <SiPaypal title="Paypal" className="hover:text-blue-500 cursor-pointer transition-colors" />
              <FaCcMastercard title="Mastercard" className="hover:text-red-600 cursor-pointer transition-colors" />
              <FaCcVisa title="Visa" className="hover:text-blue-700 cursor-pointer transition-colors" />
              <SiAmazonpay title="Amazon Pay" className="hover:text-orange-500 cursor-pointer transition-colors" />
              <FaCcApplePay title="Apple Pay" className="hover:text-black cursor-pointer transition-colors" />
            </div>

          </div>
        </div>
      </div>
      

    </footer>
    <p className=" bg-[#bedaa4d4] text-center text-xs sm:text-sm text-[#0000006c] py-2 font-body ">
        © {new Date().getFullYear()}  <a
      href="https://trendikala.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-900 font-bold hover:text-green-600 transition"
    >
      Trendi Kala
    </a>. All rights reserved.
      </p></>

  );
};

export default Footer;
