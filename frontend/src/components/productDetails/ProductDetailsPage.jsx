
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../utility/cartSlice';
import toast from 'react-hot-toast';

import { Star, Check } from 'lucide-react';
import TabsNavigation from '../productDetails/ProductTabsNavigation';
import ProductDetails from './ProductDetails';
import ProductReviews from './ProductReviews';
import ProductReviewForm from './ProductReviewForm';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const dispatch = useDispatch();


  const handleAddToCart = () => {
    const cartItem = {
      product: product._id,
      productName: product.productName,
      price: product.discountPrice,
      selectedColor,
      selectedSize,
      quantity,
      thumbnail: product.media?.[0]?.url || '',
    };

    console.log('Cart item to add:', cartItem);

    dispatch(addToCart([cartItem]))
      .unwrap()
      .then(() => {
        toast.success('Item added to cart!');
      })
      .catch((err) => {
        toast.error(`Error: ${err}`);
      });
  };

  const getAvgRating = (reviews) => {
    if (!reviews?.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const data = res.data?.data;
        setProduct(data);

        const firstMedia = data?.media?.[0] || null;
        setThumbnail(firstMedia);
        setSelectedColor(data.colors?.[0]?.name || '');
        setSelectedSize(data.sizes?.[0] || '');
      } catch (err) {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantity = (type) => {
    setQuantity((prev) =>
      type === 'increase' ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  const tabs = [
    { id: 'description', name: 'Description & Details' },
    { id: 'reviews', name: 'Reviews' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <ProductDetails productData={product} />;
      case 'reviews':
        return (
          <>
            <ProductReviews reviews={product.reviews} />
            <ProductReviewForm productId={product._id} /> {/* ✅ Add Review Form */}
          </>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center mt-10">Loading product...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product) return <div className="text-center text-red-500 mt-10">Product not found.</div>;

  const avgRating = getAvgRating(product.reviews);

  return (
    <>
      <div className="bg-white flex flex-col lg:flex-row gap-8 p-4 lg:px-16 w-full mt-8">
        {/* Left Side: Media Thumbnails */}
        <div className="flex flex-col lg:flex-row w-full lg:w-5/12 gap-4 lg:items-start h-full">
          <div className="w-full lg:w-4/12 overflow-x-auto lg:overflow-y-auto pr-2 order-2 lg:order-1 lg:h-[350px]">
            <div className="flex gap-4 lg:flex-col">
              {product.media?.map((media, i) => (
                <div
                  key={i}
                  onClick={() => setThumbnail(media)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${thumbnail?.url === media.url ? 'border-green-700' : 'border-gray-300'
                    }`}
                >
                  {media.type === 'image' ? (
                    <img src={media.url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  ) : (
                    <video src={media.url} muted className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Media Display */}
          <div className="w-full lg:w-6/6 h-[350px] rounded-lg overflow-hidden border border-green-700/50 order-1 lg:order-2">
            {thumbnail ? (
              thumbnail.type === 'image' ? (
                <img
                  src={thumbnail.url}
                  alt={product.productName}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <video
                  src={thumbnail.url}
                  controls
                  className="w-full h-full object-cover object-top"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Media
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full lg:w-2/6 space-y-2">
          <h1 className="text-2xl font-bold text-[#35894E]">{product.productName}</h1>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={i < Math.round(avgRating) ? '#FFC107' : '#ffffff'}
                stroke={i < Math.round(avgRating) ? '#FFC107' : '#A0A0A0'}
              />
            ))}
            <span className="text-gray-600 font-semibold">{avgRating}/5</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-lg font-semibold text-[#35894E]">₹{product.discountPrice}</span>
            <span className=" text-gray-500 line-through">₹{product.price}</span>
            {product.price && product.discountPrice && (
              <span className="bg-[#93a87e4b] text-black text-sm px-3 py-1 rounded-full">
                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[#35894E] border-b border-gray-200 pb-4">{product.description}</p>

          {/* Colors */}
          <div>
            <h3 className="text-[#35894E] mb-2">Select Colors</h3>
            <div className="flex gap-3">
              {product.colors?.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${selectedColor === color.name ? 'border-green-700 scale-110' : 'border-gray-300'
                    }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColor === color.name && <Check size={18} color="white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-[#35894E] mb-2">Choose Size</h3>
            <div className="overflow-x-auto sm:overflow-visible">
              <div className="flex gap-3 whitespace-nowrap sm:flex-wrap">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 rounded-3xl border text-[12px] font-medium transition ${selectedSize === size
                      ? 'bg-[#93A87E] text-white border-[#93A87E]'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-row sm:flex-row items-center gap-4 pt-1">
            <div className="flex items-center p-0 border border-gray-300 rounded-full lg:w-32 justify-between">
              <button
                className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-l-full py-1"
                onClick={() => handleQuantity('decrease')}
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-r-full py-1"
                onClick={() => handleQuantity('increase')}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#93A87E] hover:bg-[#80996D] text-white font-medium py-1 md:px-6 text-xl rounded-full shadow-lg transition"
            >
              Add to Cart
            </button>

          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto p-4 mt-2">
        <TabsNavigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="pt-6">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default ProductDetailPage;
