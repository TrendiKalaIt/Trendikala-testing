// src/components/Outfit.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { outfitGridItems } from '../assets/assets';
import { Link } from 'react-router-dom';
import OutfitImg from '../../public/OutfitImg.png'

function Outfit() {
  const { mainItem, otherItems } = outfitGridItems;

  return (
    <>
      {/* Desktop Grid */}
      <div className="md:grid grid-cols-3 grid-rows-3 gap-4 p-4">
        {/* Main block */}
        <div className="col-span-2 row-span-2 bg-blue-200 h-20 min-h-[300px] w-full p-4 rounded-2xl relative overflow-hidden">
          <img
            src={OutfitImg}
            alt={mainItem.title}
            className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl"
          />
          <div className="absolute bottom-4 left-4 text-white z-">
            <h2 className="text-3xl font-bold mb-2">{mainItem.title}</h2>
            <Link to="/allproducts">
              <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                {mainItem.buttonText} <ChevronRight size={16} className="ml-1" />
              </button>
            </Link>
          </div>
        </div>

        {/* Other blocks - Desktop */}
        {otherItems.slice(0, 5).map((item) => (
          <div key={item.id} className="hidden md:block relative bg-green-200 rounded-2xl overflow-hidden ">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="relative z- p-4 text-white font-semibold text-lg">
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="block md:hidden w-full p-4">
        <div className="flex overflow-x-auto gap-4 pb-2">
          {otherItems.map((item) => (
            <div
              key={item.id}
              className="relative min-w-[150px] h-40 bg-green-200 rounded-2xl overflow-hidden shrink-0"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="relative z-10 p-2 text-white font-semibold text-sm">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Outfit;



