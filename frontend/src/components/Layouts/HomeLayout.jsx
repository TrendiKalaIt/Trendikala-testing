// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarHome from '../NavbarHome';
import Footer from '../Footer';
import Spinner from '../Spinner';
import { useSelector } from 'react-redux';
import Badge from '../TestingBadge'

const navLinks = [
  { name: 'home', path: '/' },
  { name: 'products', path: '/allproducts' },
  { name: 'about', path: '/about' },
  { name: 'manufacturing', path: '/manufacturing' },
];

const Layout = () => {
  const loading = useSelector((state) => state.loader.loading);

  return (
    <div className="flex flex-col min-h-screen relative">
      {loading && <Spinner />}
      <NavbarHome links={navLinks} />
      <main className="flex-grow">
        <Outlet />
        <Badge/>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
