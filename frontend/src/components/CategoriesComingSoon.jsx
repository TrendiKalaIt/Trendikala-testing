import React, { useEffect, useState } from "react";
import {  SiFacebook, SiInstagram, SiYoutube} from 'react-icons/si';



const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({});

  // Set the launch date to August 22, 2025, at midnight
  const launchDate = new Date("2025-09-01T00:00:00");

  useEffect(() => {

    const interval = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now; 

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000); 

    return () => clearInterval(interval);
  }, []); 

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-600 font-sans text-gray-800">

      <div className=" md:w-1/2 flex-1 p-8 md:p-20 flex flex-col justify-between">
        <div>
          <h1 className="text-6xl  font-semibold mb-4 mt-8 md:mt-0 tracking-tight text-white uppercase">
            Coming Soon <br /> <span className="text-5xl font-medium mb-4 mt-8 md:mt-0 tracking-tight"> The Style You Deserve</span>
          </h1>
          <p className="max-w-md text-lg text-black mb-8">
            We’re working on a fresh collection of fashionable and comfortable clothing. Stay connected for the big reveal.
          </p>

          <div className="flex justify-start space-x-4 md:space-x-6 ">
            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div key={unit} className="text-center">
                <div className="text-3xl md:text-5xl font-extrabold text-[#749d63]">
                  {String(timeLeft[unit] ?? 0).padStart(2, '0')}
                </div>
                <div className="uppercase text-sm mt-1 text-white">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-6  md:mt-0 ">
          <a href="https://www.facebook.com/people/Trendi-Kala/61576774982351/?mibextid=wwXIfr&rdid=6ghBVh03c1h4Yrsp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F14JLn8svZCB%2F%3Fmibextid%3DwwXIfr" className="hover:text-gray-700 text-blue-700 transition">
            <SiFacebook size={24} />
          </a>

          <a href="https://www.instagram.com/trendikalaofficial/?igsh=MXdidTA0YmY2Ymd3YQ%3D%3D&utm_source=qr#" className="hover:text-gray-700 text-red-300 transition">
            <SiInstagram size={24} />
          </a>
          <a href="https://www.youtube.com/@trendikala" className="hover:text-gray-700 text-red-700 transition">
            <SiYoutube size={24} />
          </a>
        </div>
      </div>

      
      <div className="flex-1 md:w-1/2 h-screen overflow-hidden flex items-center justify-center">
        <video
          src=''
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover border"
        >
          Your browser does not support the video tag.
        </video>

      </div>
    </div>
  );
};


const App = () => {
  return <ComingSoon />;
};

export default App;
