import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { newArrivalsItems } from '../assets/assets';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const [idx, setIdx] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prevIdx) => (prevIdx + 1) % newArrivalsItems.length);
    }, 2000); // change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const next = () => setIdx((i) => (i + 1) % newArrivalsItems.length);
  const prev = () => setIdx((i) => (i - 1 + newArrivalsItems.length) % newArrivalsItems.length);
  const current = newArrivalsItems[idx];

  return (
    <section className="relative w-full mx-auto p-4 ">
      <div
        className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg aspect-[2/1]"
        style={{ backgroundColor: current.bgColor }}
      >
        <img
          src={current.imageUrl}
          alt={`Collection ${idx + 1}`}
          className="absolute  w-full h-[385px] object-contain object-center lg:object-[top_10px_center]"
          loading="lazy"
        />


        <div className="absolute bottom-2 md:bottom-6 left-6 text-white max-w-md border-5 border-black">
          <h2 className="text-2xl sm:text-5xl font-bold drop-shadow hidden md:block">
            {current.discount}
          </h2>
          <p className="text-base sm:text-lg mb-4 drop-shadow hidden md:block">
            {current.description}
          </p>
          <Link to="/allproducts">
            <button className="bg-white text-gray-800 p-3 rounded-full text-sm font-semibold items-center">
              VIEW COLLECTIONS
            </button>
          </Link>
        </div>

        <button
          onClick={prev}
          className="absolute top-1/2 left-4 -translate-y-1/2 
         bg-white bg-opacity-70 p-2 rounded-full shadow 
         transition-opacity duration-300 z-1 focus:outline-none
         opacity-10 md:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        <button
          onClick={next}
          className="absolute top-1/2 right-4 -translate-y-1/2 
         bg-white bg-opacity-70 p-2 rounded-full shadow 
         transition-opacity duration-300 z-1 focus:outline-none
         opacity-10 md:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default NewArrivals;
