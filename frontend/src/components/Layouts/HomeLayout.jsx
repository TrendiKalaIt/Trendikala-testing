// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarHome from '../NavbarHome';
import Footer from '../Footer';


import NewUpdatesMsg from '../NewUpdatesMsg';

const navLinks = [
  { name: 'home', path: '/' },
  { name: 'products', path: '/allproducts' },
  { name: 'about', path: '/about' },
  { name: 'manufacturing', path: '/manufacturing' },
];

const Layout = () => {
  

  return (
    <div className="flex flex-col min-h-screen relative">
      <NewUpdatesMsg className="absolute bottom-0 left-0 w-full" />


      <NavbarHome links={navLinks} />
      {/* {loading && <Spinner />} */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
