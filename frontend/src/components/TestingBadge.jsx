import React, { useState } from 'react';
import { Info } from 'lucide-react';

const FloatingBadge = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed top-[50%] right-4 z-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      <div className="bg-yellow-400 text-black px-3 py-1.5 rounded-full flex items-center text-sm shadow-md cursor-default  transition">
        Testing Mode
        <Info className="h-4 w-4 ml-2" />
      </div>

      {/* Hover  Box */}
      {hovered && (
        <div className="absolute top-full mt-2 right-0 w-56 bg-white text-[14px] text-gray-700 p-3 rounded shadow border">
          <strong className="block mb-1 text-gray-800">Testing</strong>
          <p>This website is in testing mode to verify functionality and performance.</p>
        </div>
      )}
    </div>
  );
};

export default FloatingBadge;
