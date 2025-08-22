import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWishlist } from '../utility/wishlistSlice';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const loading = useSelector((state) => state.wishlist.loading);
  const error = useSelector((state) => state.wishlist.error);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); 
    } else {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-green-700 mb-4 text-center font-heading">Your Wishlist</h1>
      <div className="border w-[150px] m-auto mb-8"></div>

      {loading && <p className="text-center text-gray-600 font-home">Loading your wishlist...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && wishlist.length === 0 && (
        <p className="text-center font-home text-gray-600">Your wishlist is empty.</p>
      )}

      {!loading && !error && wishlist.length > 0 && (
        <div className="px-4">
          <h2 className="text-2xl text-[#93A87E] mb-6 font-heading">Your Favorite Picks</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
