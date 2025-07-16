// src/components/ComingSoon.jsx

import React from 'react';

const ComingSoon = ({ title = 'Page' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
      <h1 className="text-5xl font-bold mb-4 text-green-600">{title} Page</h1>
      <p className="text-lg text-gray-600">
        This page is under construction.<br />
        We're working hard to bring you this content soon. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
