import React, { useState } from 'react';

// --- Assuming your JSON data is imported or defined here ---
// If it's a separate file, you'd do:
// import carouselSlidesData from './slidesData.json';
// For this example, we'll define it inline as a JS array of objects.
const carouselSlidesData = [
  {
    "id": "slide1",
    "image": "image_a1ac6a.jpg", // Make sure this path is correct or use a direct import
    "textLines": [
      "ROOTROOTED IN HERITAGE,",
      "STYLED FOR TODAY ROOTED IN",
      "HERITAGE, STYLED FOR",
      "TODAY.ED IN HERITAGE, STYLED",
      "FOR TODAY."
    ]
  },
  {
    "id": "slide2",
    "image": "https://via.placeholder.com/600x800?text=Another+Slide",
    "textLines": [
      "INSPIRED BY TRADITION,",
      "CRAFTED FOR MODERN ELEGANCE.",
      "EMBRACE THE ART OF DRAPING."
    ]
  },
  {
    "id": "slide3",
    "image": "https://via.placeholder.com/600x800?text=Third+Slide",
    "textLines": [
      "TIMELESS BEAUTY,",
      "CONTEMPORARY FLAIR.",
      "YOUR JOURNEY INTO STYLE."
    ]
  }
];



const ProductCarousel = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Get the current slide's data from the JSON-like array
  const currentSlide = carouselSlidesData[currentSlideIndex];

  return (
    <div className="w-full h-auto md:h-[400px] flex justify-center items-center lg:p-4 pb-2 md:p-8 bg-gray-50">
      <div className="relative w-full max-w-[350px] mx-auto min-h-[400px] overflow-hidden rounded-b-full md:rounded-b-none md:rounded-t-full shadow-lg">
        {/* Carousel Image */}
        <img
          src={currentSlide.image} // Use the image from the current slide object
          alt={`Slide ${currentSlideIndex + 1}`}
          loading="lazy"
          className="bg-slate-500 relative w-full h-auto object-cover object-top transition-opacity duration-500 z-0"
          style={{
            aspectRatio: '16/9',
          }}
        />

        {/* Overlay Content: Text and Button */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between items-center p-6 text-white text-center">
          {/* Top part, potentially for a logo or title if needed */}
          <div></div>

          {/* Main Text Content */}
          <div className="flex flex-col items-center justify-center flex-grow">
            <p className="text-xl md:text-2xl font-bold leading-tight drop-shadow-md tracking-wide">
              {/* Map over textLines to render each line with a <br /> */}
              {currentSlide.textLines.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < currentSlide.textLines.length - 1 && <br />} {/* Add <br /> after each line except the last */}
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Button at the bottom */}
          <button
            className="relative px-8 py-3 bg-[#8C9F7E] text-white font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-colors duration-300 transform -translate-y-4"
          >
            View Details
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {carouselSlidesData.map((_, index) => ( // Iterate over carouselSlidesData to create dots
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full ${currentSlideIndex === index ? 'bg-white' : 'bg-gray-400'
                } transition-colors duration-300`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;



