import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        if (res.data?.data?.length > 0) {
          setCategories(res.data.data);
        } else {
          setError('⚠️ No categories found from server.');
        }
      } catch (err) {
        setError('Something went wrong while loading categories.');
      }
    };
    fetchCategories();
  }, []);

  if (error) {
    return <p className="text-center text-red-600 font-semibold my-8">{error}</p>;
  }

  return (
    <section className="bg-white p-6 md:p-8 rounded-lg my-8 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#93A87E] text-center mb-8">
        Product Categories
      </h2>
      <div className="flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-8 ">
          {categories.map((category) => {
            const hasImage = category.icon && typeof category.icon === 'string';

            return (
              <div
                key={category._id}
                className="    flex flex-col items-center justify-center
                cursor-pointer transform transition-transform duration-200 hover:scale-105 
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                tabIndex="0"
                role="button"
                aria-label={`View ${category.name || 'Unknown'} category`}
                onClick={() => navigate(`/category/${category._id}`)}
              >
                {hasImage ? (
                  <img
                    src={category.icon}
                    alt={category.name || 'Category'}
                    className="w-32 h-32 sm:w-32 sm:h-32 object-cover rounded-md mb-3 hover:shadow-lg"
                    onError={(e) => {
                      // If image fails to load, fallback to showing name text
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className=" w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-blue-100 rounded-md mb-3
                             text-blue-700 font-semibold text-center text-sm px-2 select-none break-words"
                    title={category.name}
                  >
                    {category.name}
                  </div>
                )}

                <p className="text-sm sm:text-base  font-semibold text-[#93A87E] text-center">
                  {category.name || 'Unnamed'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
