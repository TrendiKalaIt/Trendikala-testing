import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HeroSection from '../components/HeroSection';
import NewArrivals from '../components/NewArrivals';
import Outfit from '../components/Outfit';
import ProductCard from '../components/ProductCard';
import PosterComponent from '../components/PosterComponent';
import Categories from '../components/CategoriesComponent';

import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../utility/loaderSlice';

const Home = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [error, setError] = useState(null);

  const gradientStyle = {
    background: '#bdc3c7', // fallback for old browsers
    backgroundImage: 'linear-gradient(to right, #2c3e50, #bdc3c7)',
    height: '100vh', // example height
  };


  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(showLoader());
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts(data);
        dispatch(hideLoader());
      } catch (err) {
        setError('Failed to load products');
        dispatch(hideLoader());
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <>
      <HeroSection />
      <NewArrivals />
      <Outfit />
      <PosterComponent />
      <Categories />

      <div className="px-10 py-2">
        <h2 className="text-2xl font-bold text-[#93A87E] mb-6">Featured Products</h2>

        {error && <p className="text-red-600">{error}</p>}

        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
              {Array.isArray(products) && products.slice(0, visibleCount).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {visibleCount < products.length && (
              <div className="text-center my-8">
                <button
                  onClick={handleSeeMore}
                  className="bg-[#93A87E] text-white px-8 py-2 rounded-full hover:bg-[#93a87ea4] transition"
                >
                  See More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
