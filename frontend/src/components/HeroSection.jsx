// import React, { useState, useEffect } from "react";
// import { carouselSlides } from "../assets/assets";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const HeroSection = () => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const navigate = useNavigate();

//   const handleViewDetails = () => {
//     navigate("/allproducts");
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % carouselSlides.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const { image, title, description } = carouselSlides[currentImageIndex];

import React, { useState, useEffect } from "react";
import { carouselSlides } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ onLoad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Notify parent that HeroSection has loaded
    onLoad?.();
  }, [onLoad]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

    const handleViewDetails = () => {
    // navigate to products page (change path if needed)
    navigate("/products");
  };

  const { image, title, description } = carouselSlides[currentImageIndex];

  return (
     <section className="relative text-gray-800 overflow-hidden">
      {/* Background image as <img> with lazy loading */}
      <img
        src="/OutfitImg1.webp"
        alt="Outfit Background"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="bg-black/10 ">
        <div className="flex flex-col md:flex-row overflow-hidden">
          {/* Left */}
          <div className="w-full md:w-1/2 flex flex-col h-full lg:ms-7">
            <div className="relative h-full flex justify-center md:justify-end xl:pe-20">
              <img
                src="/madubala.webp"
                alt="madubala"
                className="rounded-b-full object-cover md:h-[340px] w-[250px] sm:w-[300px] hidden md:block"
                loading="lazy"
              />
            </div>

            <div className="hidden md:flex h-full w-3/4 p-4 md:p-8 flex-col text-right ml-auto">
              <p className="font-home leading-relaxed text-lg font-bold text-[#a5e665c8] mb-6 text-justify tracking-[1px]">
                Trendi Kala brings you elegant ethnic fashion that blends
                tradition with trend, offering timeless pieces designed for the
                bold, modern Indian.
              </p>

              <button
                onClick={handleViewDetails}
                className="font-heading bg-[#93A87E] hover:bg-[#93a87ec6] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 m-auto"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="w-full  md:w-1/2 flex flex-col">
            <div className="hidden md:flex h-[250px] w-full justify-center items-center text-center mb-2">
              <h1 className="font-heading text-2xl w-2/3 md:text-2xl font-semibold leading-tight mt-20 md:mt-5 text-[#a5e665c8]">
                "{title.toUpperCase()}"
              </h1>
            </div>

            <div className="w-full h-auto md:h-[340px] flex justify-center items-center lg:p-4 pb-2 md:p-8">
              <div className="relative w-screen md:max-w-[300px] mx-auto min-h-[400px] overflow-hidden">
                {/* Simple fade without AnimatePresence */}
                <img
                  key={image}
                  src={image}
                  alt={`Slide ${currentImageIndex + 1}`}
                  className="relative w-full h-auto object-fill rounded-b-full md:rounded-b-none md:rounded-t-full 
    opacity-0 animate-fadeIn"
                  style={{ aspectRatio: "3/4" }}
                  loading="lazy"
                />

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-1">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`w-3 h-3 rounded-full ${
                        currentImageIndex === index ? "bg-white" : "bg-gray-400"
                      } transition-colors duration-300`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Text */}
            <div className="flex flex-col items-center text-[#a5e665c8] text-center px-4 pb-6 md:hidden">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-[#93A87E] text-sm mb-4">{description}</p>
              <button
                onClick={handleViewDetails}
                className="bg-[#93A87E] hover:bg-[#93a87ec6] text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
