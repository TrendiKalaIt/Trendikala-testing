import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../utility/loaderSlice';

const Products = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [error, setError] = useState(null);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
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
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-green-700 mb-4 text-center">All Products</h1>
      <div className="border w-[150px] m-auto"></div>
      <div className="px-4">
        <h2 className="text-2xl text-[#93A87E] mb-6">Featured Products</h2>


        {error && <p className="text-red-600">{error}</p>}

        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
              {products.slice(0, visibleCount).map((product) => (
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
    </div>
  );
};

export default Products;
