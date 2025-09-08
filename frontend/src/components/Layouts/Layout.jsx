// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Spinner from '../Spinner';
import { useSelector } from 'react-redux';


const navLinks = [
  { name: 'home', path: '/' },
  { name: 'products', path: '/all-products' },
  { name: 'about Us', path: '/about-us' },
  { name: 'manufacturing', path: '/manufacturing' },
];

const Layout = () => {
  const loading = useSelector((state) => state.loader.loading);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar links={navLinks} />
      {loading && <Spinner />}

      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
