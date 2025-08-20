// // src/components/Outfit.jsx
// import React from 'react';
// import { ChevronRight } from 'lucide-react';
// import { outfitGridItems } from '../assets/assets';
// import { Link } from 'react-router-dom';
// import OutfitImg from '../../public/OutfitImg.webp'

// function Outfit() {
//   const { mainItem, otherItems } = outfitGridItems;

//   return (
//     <>
//       {/* Desktop Grid */}
//       <div className="md:grid grid-cols-3 grid-rows-3 gap-4 p-4">
//         {/* Main block */}
//         <div className="col-span-2 row-span-2 bg-blue-200 h-20 min-h-[300px] w-full p-4 rounded-2xl relative overflow-hidden">
//           <img
//             src={OutfitImg}
//             alt={mainItem.title}
//             className="absolute inset-0 w-full h-full object-cover object-center rounded-2xl"
//           />
//           <div className="absolute bottom-4 left-4 text-white z-">
//             <h2 className="text-3xl font-bold mb-2">{mainItem.title}</h2>
//             <Link to="/allproducts">
//               <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
//                 {mainItem.buttonText} <ChevronRight size={16} className="ml-1" />
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* Other blocks - Desktop */}
//         {otherItems.slice(0, 5).map((item) => (
//           <div key={item.id} className="hidden md:block relative bg-green-200 rounded-2xl overflow-hidden ">
//             <img
//               src={item.imageUrl}
//               alt={item.title}
//               className="absolute inset-0 w-full h-full object-cover object-center"
//             />
//             <div className="relative z- p-4 text-white font-semibold text-lg">
//               {item.title}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Mobile Horizontal Scroll */}
//       <div className="block md:hidden w-full p-4">
//         <div className="flex overflow-x-auto gap-4 pb-2">
//           {otherItems.map((item) => (
//             <div
//               key={item.id}
//               className="relative min-w-[150px] h-40 bg-green-200 rounded-2xl overflow-hidden shrink-0"
//             >
//               <img
//                 src={item.imageUrl}
//                 alt={item.title}
//                 className="absolute inset-0 w-full h-full object-cover object-center"
//               />
//               <div className="relative z-10 p-2 text-white font-semibold text-sm">
//                 {item.title}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Outfit;


import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Showcase() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedReel, setSelectedReel] = useState(null);

  const sideImages = [
    { id: 1, url: "/cro1.jpg", },
    { id: 2, url: "/cro2.jpg", },
    { id: 3, url: "/cro3.jpg", },
  ];

  const reels = [
     { id: 1, url: '/reel.mp4' },
  { id: 2, url: '/reel.mp4' },
  { id: 3, url: '/reel.mp4' },
  { id: 4, url: '/reel.mp4' },
  { id: 5, url: '/reel.mp4' },
  { id: 6, url: '/reel.mp4' },
  { id: 7, url: '/reel.mp4' },
  { id: 8, url: '/reel.mp4' },


  ];

  const openModal = (reel) => {
    setSelectedReel(reel);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReel(null);
    setIsModalOpen(false);
  };
  return (
    <div className="w-full  mx-auto p-4 ">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-4">
        {/* Main Poster */}
        <div className="col-span-2 h-[250px] md:h-[350px] rounded-2xl overflow-hidden relative mb-3">
          <img
            src="/cro1.jpg"
            alt="Main Poster"
            className="w-full h-full object-cover"
          />

        </div>

        {/* Side Carousel */}
        <div className="h-[350px] md:h-[350px] w-full">
          <Swiper
            direction="horizontal"
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 2000 }}
            loop={true}
            navigation={false}
            className="h-full rounded-2xl"
          >
            {sideImages.map((img) => (
              <SwiperSlide key={img.id}>
                <div className="w-full h-full relative">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Reels Section */}
     <div className="mt-6">
         <h3 className="text-lg font-semibold mb-3">Reels for you</h3>
         <Swiper
           slidesPerView={"auto"}
           spaceBetween={16}
           modules={[Autoplay]}
           autoplay={{ delay: 2500 }}
           loop={true}
           className="pb-2"
         >
           {reels.map((reel) => (
             <SwiperSlide
               key={reel.id}
               className="!w-[200px] md:!w-[180px] h-[240px] rounded-2xl overflow-hidden shadow relative bg-gradient-to-tr from-blue-800 to-gray-500 cursor-pointer"
               onClick={() => openModal(reel)}
             >
               <video
                 src={reel.url}
                 className="w-full h-full object-cover"
                 autoPlay
                 muted
                 loop
                 playsInline
               />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal */}
      {isModalOpen && selectedReel && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full h-full max-w-[600px] aspect-video overflow-hidden">
            <video
              src={selectedReel.url}
              className="w-full h-full object-contain bg-black"
              autoPlay
              controls
              loop
              playsInline
            />
          
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-black font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
