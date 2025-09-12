import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// The main App component contains all the logic and styling for the error page.
export default function App() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f0f8ff] text-[#2f4f4f] font-sans">

            {/* "SORRY" and "PAGE NOT FOUND" text */}
            <div className="text-center mb-8">
                <h1 className="text-6xl md:text-8xl font-bold text-[#1a384e] animate-pulse">
                    SORRY
                </h1>
                <p className="text-xl md:text-3xl text-[#FF8C00] tracking-widest mt-2">
                    PAGE NOT FOUND
                </p>
            </div>

            {/* Main illustration container */}
            <div className="relative flex flex-col items-center">
                {/* Penguin body */}
                <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#1a384e] flex items-center justify-center shadow-2xl">
                    {/* Penguin white belly */}
                    <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-white relative">
                        {/* Eyes */}
                        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex justify-between w-16 sm:w-20">
                            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-black"></div>
                            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-black"></div>
                        </div>
                        {/* Beak */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-4 sm:w-10 sm:h-5 rounded-full bg-[#FF8C00]"></div>
                    </div>
                </div>

                {/* Fishing pole and sign */}
                <div className="relative">
                    {/* Rod */}
                    <div className="absolute top-[-100px] left-[10px] w-2 h-24 sm:h-32 bg-[#FF8C00] transform -rotate-45 origin-top-left"></div>
                    {/* Sign with "Error 404" text */}
                    <div className="absolute top-[-25px] left-[-30px] w-32 sm:w-40 p-3 bg-[#5F9EA0] rounded-lg shadow-xl text-white text-lg sm:text-2xl font-bold transform -rotate-6">
                        <p className="text-center font-cursive tracking-wider">ERROR 404</p>
                    </div>
                </div>

                {/* Ice Patch */}
                <div className="w-64 sm:w-80 h-10 mt-10 rounded-t-full bg-white border-2 border-solid border-gray-300 shadow-md"></div>
                {/* Water below ice */}
             
                <Link to="/" className="px-4 py-2 bg-[#5F9EA0]  text-white rounded-lg shadow-md hover:bg-[#70b1b3] transition-colors">
                    Go back to Home
                </Link>

            </div>

        </div>
    );
}
