import React from 'react';
import { ArrowLeft } from 'lucide-react'; // Importing icon from lucide-react

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-16 flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
        <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-2">
              <div className="w-[100px] h-[100px] ">
                <img
                  src="/trendikala_logo_bg.webp"
                  alt="Trendi Kala Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/120x40/E5E7EB/4B5563?text=Logo'; }}
                />
              </div>
            
            </div>
          </div>
        </div>

        <div className="hidden md:block border-l-2 border-green-700 h-48 mx-8"></div>
        <div className="block md:hidden border-b-2 border-green-700 w-full mb-8"></div>


        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-red-600 text-3xl md:text-4xl font-bold mb-4">
            Oops! This page is not available
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            You can head back to the homepage or browse our latest collections
          </p>
          <p className="text-red-700 text-6xl md:text-8xl font-extrabold mb-8">
            404
          </p>
          <button
            onClick={() => window.location.href = '/'} // Redirect to homepage
            className="bg-[#93A87E] hover:bg-[#80996D] text-white font-bold py-3 px-8 rounded-full flex items-center space-x-2 transition duration-200 ease-in-out shadow-lg"
          >
            <ArrowLeft size={20} />
            <span>Go back to home page</span>
          </button>
        </div>

        <div className="absolute bottom-8 text-sm text-gray-500 w-full text-center">
          &copy; 2025 Trendi kala. All rights reserved. Unauthorized use is prohibited.
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
