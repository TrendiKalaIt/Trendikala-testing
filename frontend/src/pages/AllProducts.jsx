import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../utility/loaderSlice";
import Spinner from "../components/Spinner";
 
const Products = () => {
  const dispatch = useDispatch();
  const productSectionRef = useRef(null);
 
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const API_URL = import.meta.env.VITE_API_URL;
 
  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        const data = res.data?.data || [];
        if (data.length > 0) {
          setCategories(data);
        } else {
          navigate("/coming-soon");
        }
      } catch (err) {
        setError("Failed to fetch categories");
        navigate("/coming-soon");
      }
    };
    fetchCategories();
  }, [navigate]);
 
 
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      try {
        const res = await axios.get(
          `${API_URL}/api/subcategories?category=${selectedCategory}`
        );
        setSubcategories(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch subcategories", err);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);
 
  // Fetch products
  const fetchProducts = async (category = "", subcategory = "") => {
    setLoading(true);
    setError(null);
    try {
      dispatch(showLoader());
      let url = `${API_URL}/api/products`;
      const queryParams = [];
      if (category) queryParams.push(`category=${category}`);
      if (subcategory) queryParams.push(`subcategory=${subcategory}`);
      if (queryParams.length) url += `?${queryParams.join("&")}`;
 
      const res = await axios.get(url);
      const productsData = Array.isArray(res.data?.data) ? res.data.data : [];
 
      if (category && productsData.length === 0) {
        // If a category is selected but no products exist, redirect
        navigate("/coming-soon");
      } else {
        setProducts(productsData);
      }
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
      if (category) {
        navigate("/coming-soon"); // Redirect if error occurs for a specific category
      }
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };
 
 
  // Load all products initially
  useEffect(() => {
    fetchProducts();
  }, []);
 
  // Refetch when filters change
  useEffect(() => {
    if (selectedCategory || selectedSubcategory) {
      fetchProducts(selectedCategory, selectedSubcategory);
 
      setTimeout(() => {
        if (productSectionRef.current) {
          productSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [selectedCategory, selectedSubcategory]);
 
  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full aspect-[16/9] sm:h-[450px] h-[300px] overflow-hidden mb-6">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src='' type="video/mp4" />
          Your browser does not support the video tag.
        </video>
 
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-4 sm:px-6">
          <h1 className=" font-heading text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg tracking-wide animate-fade-in-up">
            <span className="text-[#a2ff00] font-home ">Explore</span> Our Categories
          </h1>
          <p className="font-body mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-[#d3f4b1] max-w-2xl drop-shadow-md animate-fade-in-up delay-200">
            Select a category and subcategory to find your perfect product.
          </p>
        </div>
      </div>
 
      {/* Category Grid */}
      <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <h2 className="font-home underline decoration-green-700 text-xl sm:text-2xl font-semibold mb-4 text-green-700">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-2 mb-6">
          {categories.map((cat) => {
            const hasImage = cat.icon && typeof cat.icon === "string";
            return (
              <div
                key={cat._id}
                className={`  cursor-pointer overflow-hidden transition  `}
                onClick={() => {
                  setSelectedCategory(cat._id);
                  setSelectedSubcategory("");
                }}
              >
                <div className="w-full aspect-square overflow-hidden py-1">
                  {hasImage ? (
                    <img
                      src={cat.icon}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-lg transform hover:-translate-y-1  "
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500 font-medium text-center px-2">
                      {cat.name}
                    </div>
                  )}
                </div>
                <div className="font-home p-2 sm:p-3 text-center text-gray-500 text-sm sm:text-base font-medium">
                  {cat.name}
                </div>
              </div>
            );
          })}
        </div>
 
 
      </div>
 
 
      {/* Products Section */}
      <div className="p-8" ref={productSectionRef}>
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-home underline decoration-green-700 text-xl sm:text-2xl font-semibold text-green-700 py-2">
            {selectedCategory
              ? categories.find((cat) => cat._id === selectedCategory)?.name || "Filtered Products"
              : "All Products"}
          </h1>
 
          {(selectedCategory || selectedSubcategory) && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedSubcategory("");
                fetchProducts();
              }}
              className="font-body text-sm bg-gray-200 px-4  py-2 rounded hover:bg-gray-300"
            >
              View All Products
            </button>
          )}
        </div>
 
 
        {/* <div className="border w-[180px] color-green-700 mb-5"></div> */}
        <div className="px-4">
 
 
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
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
                    className="bg-[#93A87E] font-home text-white px-8 py-2 rounded-full hover:bg-[#93a87ea4] transition"
                  >
                    See More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Products;
 