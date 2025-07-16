import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../utility/loaderSlice';

const SearchResults = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const [results, setResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(16);
  const [error, setError] = useState(null);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 16);
  };

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      try {
        dispatch(showLoader());
        setError(null);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/search?query=${encodeURIComponent(query)}`
        );
        setResults(res.data.data || []);
        dispatch(hideLoader());
      } catch (err) {
        setError('Failed to load search results');
        dispatch(hideLoader());
      }
    };

    fetchSearchResults();
  }, [query, dispatch]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-green-700 mb-4 text-center">
        Search Results for: "{query}"
      </h1>
      <div className="border w-[150px] m-auto mb-6"></div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {!error && results.length === 0 && (
        <p className="text-center text-gray-500">No results found.</p>
      )}

      {!error && results.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
            {results.slice(0, visibleCount).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {visibleCount < results.length && (
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
  );
};

export default SearchResults;
