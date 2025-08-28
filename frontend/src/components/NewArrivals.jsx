import React, { useState, useEffect, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { newArrivalsItems } from '../assets/assets';
import { Link } from 'react-router-dom';

const NewArrivals = () => {
  const [idx, setIdx] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prevIdx) => (prevIdx + 1) % newArrivalsItems.length);
    }, 5000); // change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const next = () => setIdx((i) => (i + 1) % newArrivalsItems.length);
  const prev = () =>
    setIdx((i) => (i - 1 + newArrivalsItems.length) % newArrivalsItems.length);

  const current = newArrivalsItems[idx];

  // Compute object-fit and position only once per render
  const objectFit = current.objectFit ? `object-${current.objectFit}` : 'object-cover object-[42%]';
  const objectPosition = current.objectPosition ? `object-[${current.objectPosition}]` : '';

  return (
    <section className="relative w-full mx-auto p-4">
      <div
        className="relative w-full md:h-96 rounded-2xl overflow-hidden shadow-lg aspect-[2/1]"
        style={{ backgroundColor: current.bgColor }}
      >
        <img
          src={current.imageUrl}
          alt={`Collection ${idx + 1}`}
          className={`absolute w-full md:h-[385px] h-full ${objectFit} ${objectPosition} md:object-fill`}
          loading="lazy"
        />

        {/* Desktop Text */}
        <div className="absolute bottom-2 md:bottom-6 left-6 text-white max-w-md">
          <h2 className="font-home text-2xl sm:text-5xl font-bold drop-shadow hidden md:block">
            {current.discount}
          </h2>
          <p className="font-body text-base sm:text-lg mb-4 drop-shadow hidden md:block">
            {current.description}
          </p>
          <Link to="/allproducts">
            <button className="font-heading hidden md:block bg-[#9CAF88] text-white p-3 rounded-full text-sm font-semibold">
              VIEW COLLECTIONS
            </button>
          </Link>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow transition-opacity duration-300 z-10 focus:outline-none opacity-10 md:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow transition-opacity duration-300 z-10 focus:outline-none opacity-10 md:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Button */}
      <Link to="/allproducts">
        <button className="font-heading font-semibold block sm:hidden mt-2 bg-[#9CAF88] text-white px-2 py-2 rounded-full text-sm">
          VIEW COLLECTIONS
        </button>
      </Link>
    </section>
  );
};

export default memo(NewArrivals);
