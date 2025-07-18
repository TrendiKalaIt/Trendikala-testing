import React from 'react';
const PosterComponent = () => {
  return (
    <div className="relative flex justify-center items-centern  bg-white py-4">
      {/* Container for the poster content */}
      <div className="relative w-full mx-4 bg-[#A9C19D] rounded-2xl shadow-xl overflow-hidden pt-2 px-8 lg:px-2 flex flex-col h-[400px] ">
        {/* Image positioned to overlap the top */}
        <div className="absolute bottom-0  right-0 w-1/2  max-w-lg md:w-1/2 lg:w-2/5 xl:w-1/3  ">
          <img
            src='https://res.cloudinary.com/dq70cmqwb/image/upload/v1752702805/imageC4_pyvg3z.jpg'
            alt="Woman shopping with bags and phone"
            className="w-full h-[400px] object-cover "
          />
        </div>

        {/* Text content */}
        <div className="relative  text-gray-800    rounded-3xl md:border-0 p-2 h-full m-1 z-0">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif mt-12 md:m-10 ">
            KALA <span className="text-xl md:text-2xl font-sans uppercase tracking-wider">IN EVERY </span> <span className='text-5xl md:text-5xl font-serif '>THREAD</span>
          </h1>
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-serif mt-6 text-white lg:ms-36">
            TREND <span className="text-xl md:text-2xl font-sans uppercase tracking-wider">IN EVERY </span> <span className='text-5xl md:text-5xl font-serif leading-tight mt-6'>LOOK</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PosterComponent;