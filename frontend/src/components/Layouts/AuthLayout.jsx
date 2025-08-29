// src/components/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Spinner from '../Spinner';
import { useSelector } from 'react-redux';
import Badge from '../TestingBadge'



const AuthLayout = () => {
  const loading = useSelector((state) => state.loader.loading);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {loading && <Spinner />}
      <Outlet />
      <Badge/>
      <Footer />
    </div>
  );
};

export default AuthLayout;
