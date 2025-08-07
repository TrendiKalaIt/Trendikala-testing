import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategoriCommingSoon from '../components/CategoriesComingSoon'

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?category=${categoryId}`);
        setProducts(res.data.data || []);
      } catch (err) {
        setError('Failed to load products for this category');
      }
    };
    fetchProducts();
  }, [categoryId]);

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  return (
    <div className=" sm:p-8 max-w-7xl mx-auto p-8 ">


      {products.length === 0 ? (


        <CategoriCommingSoon />

      ) : (<>

        <h1 className="text-3xl font-semibold text-green-700 mb-4 text-center">
          Products in this Category
        </h1>
        <div className="border w-[150px] m-auto mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14 mb-10">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <a
            href="/allproducts"
            className="inline-block py-3 px-6 bg-[#93A87E] text-white text-sm sm:text-base font-medium rounded-full 
                   shadow-md hover:bg-green-700 transition-transform transform hover:scale-105 duration-200"
          >
            View All Products
          </a>
        </div> </>)}


    </div>
  );
};

export default CategoryProducts;
