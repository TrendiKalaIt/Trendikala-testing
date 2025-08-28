import React, { useState, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Outfit = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReel, setSelectedReel] = useState(null);

  const sideImages = [
    { id: 1, url: "/cro1.webp" },
    { id: 2, url: "/cro2.webp" },
    { id: 3, url: "/cro3.webp" },
  ];

  const reels = [
    { id: 1, url: "/dress1.mp4" },
    { id: 2, url: "/dress2.mp4" },
    { id: 3, url: "/dress3.mp4" },
    { id: 4, url: "/dress4.mp4" },
    { id: 5, url: "/dress5.mp4" },
    { id: 6, url: "/dress6.mp4" },
    { id: 7, url: "/dress1.mp4" },
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
    <div className="w-full mx-auto p-4">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-4 mb-6">
        {/* Main Poster */}
        <div className="col-span-2 h-[250px] md:h-[350px] rounded-2xl overflow-hidden relative">
          <img
            src="/new-collection-launched.jpg"
            alt="Main Poster"
            className="w-full h-full object-cover bg-red-50"
            loading="lazy"
          />
        </div>

        {/* Side Carousel */}
        <div className="h-[350px] w-full">
          <Swiper
            direction="horizontal"
            modules={[Autoplay, Navigation]}
            autoplay={{ delay: 2000 }}
            loop
            navigation={false}
            className="h-full rounded-2xl"
          >
            {sideImages.map((img) => (
              <SwiperSlide key={img.id}>
                <img
                  src={img.url}
                  alt={`Side ${img.id}`}
                  className="w-full h-full object-contain bg-blue-50 rounded-2xl"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Reels Section */}
      <div className="mt-6">
        <h3 className="font-home text-[#9CAF88] uppercase text-lg font-semibold mb-2">
          Reels for you
        </h3>

        <div className="overflow-hidden bg-gray-200 mb-4">
          <div className="animate-marquee flex">
            <p className="text-lg font-body text-[#9CAF88] mr-8">
              Not just new outfits — we also customize and recycle your old favourites into Pinterest-worthy looks. DM us on Instagram to create yours 💌
            </p>
            <p className="text-lg font-body text-[#9CAF88] mr-8">
              Not just new outfits — we also customize and recycle your old favourites into Pinterest-worthy looks. DM us on Instagram to create yours 💌
            </p>
          </div>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={16}
          modules={[Autoplay]}
          autoplay={{ delay: 2500 }}
          loop
          className="pb-2"
        >
          {reels.map((reel) => (
            <SwiperSlide
              key={reel.id}
              className="!w-[328px] md:!w-[180px] h-[240px] rounded-2xl overflow-hidden shadow relative bg-gradient-to-tr from-blue-800 to-gray-500 cursor-pointer"
              onClick={() => openModal(reel)}
            >
              <video
                src={reel.url}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal */}
      {isModalOpen && selectedReel && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl aspect-video overflow-hidden">
            <video
              src={selectedReel.url}
              className="w-full h-full object-contain bg-black"
              autoPlay
              controls
              loop
              playsInline
              preload="metadata"
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
};

export default memo(Outfit);
