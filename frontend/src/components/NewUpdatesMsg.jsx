import React from 'react';

const NewUpdatesMsg = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center font-sans text-gray-800">
      <div className="w-full ">
        <div className="relative text-[#111111] overflow-hidden p-2 flex items-center">
          <div className="relative flex-grow pl-4 overflow-hidden">
            <span className="marquee-content text-sm md:text-base tracking-wide">
              👋✨ Special Offer: Get 10% off all products this week only! &nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>
      </div>

      <style jsx="true">
        {`
          /* Define the keyframes for the scrolling animation */
          @keyframes marquee-scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }

          /* Apply the animation to the marquee text container */
          .marquee-content {
            white-space: nowrap;
            animation: marquee-scroll 14s linear infinite;
            display: inline-block;
          }

          /* Pause animation on hover */
          .marquee-content:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  );
};

export default NewUpdatesMsg;
