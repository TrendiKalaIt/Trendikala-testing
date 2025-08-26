import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HeroSection from '../components/HeroSection';
import NewArrivals from '../components/NewArrivals';
import Outfit from '../components/Outfit';
import ProductCard from '../components/ProductCard';
import PosterComponent from '../components/PosterComponent';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import Spinner from '../components/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../utility/loaderSlice';


const Home = () => {
  const loading = useSelector((state) => state.loader.loading);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [error, setError] = useState(null);

  const [showHero, setShowHero] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showOutfit, setShowOutfit] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);

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

    const hasLoadedSequentially = sessionStorage.getItem('homeSequentialLoaded');

    if (!hasLoadedSequentially) {
     
      const timers = [];
      timers.push(setTimeout(() => setShowHero(true), 0));
      timers.push(setTimeout(() => setShowNewArrivals(true), 1000));
      timers.push(setTimeout(() => setShowOutfit(true), 2000));
      timers.push(setTimeout(() => setShowPoster(true), 3000));
      timers.push(setTimeout(() => setShowFeatured(true), 4000));

      sessionStorage.setItem('homeSequentialLoaded', 'true');
      return () => timers.forEach((t) => clearTimeout(t));
    } else {
      
      setShowHero(true);
      setShowNewArrivals(true);
      setShowOutfit(true);
      setShowPoster(true);
      setShowFeatured(true);
    }
  }, [dispatch]);

  const handleSeeMore = () => setVisibleCount((prev) => prev + 4);

  return (
    <>
    
      {/* Hero Section */}
      {showHero ? <HeroSection /> : <Spinner />}

      {/* New Arrivals Section */}
      {showNewArrivals ? <NewArrivals /> : showHero && <Spinner />}

      {/* Outfit Section */}
      {showOutfit ? <Outfit /> : showNewArrivals && <Spinner />}

      {/* Poster Section */}
      {showPoster ? <PosterComponent /> : showOutfit && <Spinner />}

      {/* Featured Products */}
      {showFeatured ? (
        <div className="px-4 py-2 mb-3">
          <h2 className=" font-home text-lg font-bold text-[#9CAF88] uppercase mb-6">
            Featured Products
          </h2>

          {error && <p className="text-red-600">{error}</p>}

          {!error && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
                  {[...Array(4)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
                  {products.slice(0, visibleCount).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {visibleCount < products.length && !loading && (
                <div className="text-center my-8">
                  <button
                    onClick={handleSeeMore}
                    className="bg-[#9CAF88] font-home text-white px-8 py-2 rounded-full hover:bg-[#93a87ea4] transition"
                  >
                    See More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : showPoster && <Spinner />}
    </>
  );
};

export default Home;
