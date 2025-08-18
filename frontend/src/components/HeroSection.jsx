import React, { useState, useEffect } from 'react';
import { carouselSlides } from '../assets/assets';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate('/allproducts'); 
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const { image, title, description } = carouselSlides[currentImageIndex];

  return (
    <section
      className="bg-white text-gray-800"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/dq70cmqwb/image/upload/v1752702119/imageC7_rvcsg1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className=" backdrop-blur-[4px] ">
        <div className="flex flex-col md:flex-row overflow-hidden">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5 }}
            className="w-full md:w-1/2 flex flex-col h-full"
          >
            <div className="relative h-full flex justify-center md:justify-end  xl:pe-20 ">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="md:h-[360px] sm:w-[280px] rounded-br-full rounded-bl-full"
              >
                <img
                  src="https://res.cloudinary.com/dq70cmqwb/image/upload/v1752701290/image1_dceyix.jpg"
                  alt="Hero Left"
                  className="rounded-b-full object-cover md:h-[350px] w-[250px] sm:w-[300px] hidden md:block"
                />
              </motion.div>
            </div>

            <div className="hidden md:flex h-full w-3/4 p-4 md:p-8 flex-col text-right ml-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-home leading-relaxed text-lg font-bold text-[#a5e665c8] mb-6 text-justify"
              >
                Trendi Kala brings you elegant ethnic fashion that blends tradition with trend,
                offering timeless pieces designed for the bold, modern Indian.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleViewDetails}
                className="font-heading bg-[#93A87E] hover:bg-[#93a87ec6] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 m-auto"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5 }}
            className="w-full md:w-1/2 flex flex-col"
          >
            <div className="hidden md:flex h-[250px] w-full justify-center items-center text-center p-4">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className=" font-heading text-2xl w-2/3 md:text-2xl font-semibold leading-tight mt-10 md:mt-20 text-[#a5e665c8]"
              >
                "{title.toUpperCase()}"
              </motion.h1>
            </div>

            <div className="w-full h-auto md:h-[350px] flex justify-center items-center lg:p-4 pb-2 md:p-8">
              <div className="relative w-screen md:max-w-[300px] mx-auto min-h-[400px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={image}
                    src={image}
                    alt={`Slide ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-auto object-cover rounded-b-full md:rounded-b-none md:rounded-t-full"
                    style={{ aspectRatio: '3/4' }}
                  />
                </AnimatePresence>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-1">
                  {carouselSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`w-3 h-3 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-gray-400'} transition-colors duration-300`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Text */}
            <div className="flex flex-col items-center text-[#a5e665c8] text-center px-4 pb-6 md:hidden">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold mb-2"
              >
                {title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#93A87E] text-sm mb-4"
              >
                {description}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#93A87E] hover:bg-[#93a87ec6] text-white font-semibold py-2 px-6 rounded-full shadow-lg transition duration-300"
              >
                View Details
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
