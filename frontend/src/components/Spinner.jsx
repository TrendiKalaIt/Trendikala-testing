import React from 'react';
import {Logo} from '../assets/assets'

const Spinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen border">
       <div>
         <img src={Logo} className='h-24 animate-pulse' alt="" />
       </div>
      <div className="w-10 h-10 border-[5px] border-green-500 border-dashed rounded-full animate-spin duration-[5000ms]"></div>
      <p className=" animate-pulse">loading...</p>
    </div>
  );
};

export default Spinner;
