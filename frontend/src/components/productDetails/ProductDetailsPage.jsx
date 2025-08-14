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
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [thumbnail, setThumbnail] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedStock, setSelectedStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [tooltipVisible, setTooltipVisible] = useState({});
  const { description = "No description available" } = product || {};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const data = res.data?.data;

        if (!data) throw new Error('Product not found');

        setProduct(data);

        // Select first media and color
        const firstMedia = data.media?.[0] || null;
        setThumbnail(firstMedia);
        setSelectedColor(data.colors?.[0]?.name || '');

        // Select first available size automatically
        const firstAvailableSize = data.sizes?.find(s => s.stock > 0);
        if (firstAvailableSize) {
          setSelectedSize(firstAvailableSize.size);
          setSelectedPrice(firstAvailableSize.discountPrice || firstAvailableSize.price);
          setSelectedStock(firstAvailableSize.stock);
        }
      } catch (err) {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSizeSelect = (sizeObj) => {
    if (sizeObj.stock <= 0) return;
    setSelectedSize(sizeObj.size);
    setSelectedPrice(sizeObj.discountPrice || sizeObj.price);
    setSelectedStock(sizeObj.stock);
    setQuantity(1); // reset quantity
  };

  const handleQuantity = (type) => {
    setQuantity(prev =>
      type === 'increase' ? Math.min(prev + 1, selectedStock) : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = () => {
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (selectedStock <= 0) {
      toast.error('Selected size is out of stock');
      return;
    }

    // Find selected size object
    const currentSizeObj = product.sizes?.find(s => s.size === selectedSize);
    if (!currentSizeObj) {
      toast.error('Invalid size selected');
      return;
    }

    // Prepare cart item matching backend schema
    const cartItem = {
      product: product._id,
      quantity,
      color: selectedColor,
      size: selectedSize,
      discountPrice: currentSizeObj.discountPrice || currentSizeObj.price,
      productName: product.productName,
      image: thumbnail?.url || product.media?.[0]?.url || '',
    };

    // Dispatch to Redux
    dispatch(addToCart([cartItem]))
      .unwrap()
      .then(() => toast.success('Item added to cart!'))
      .catch(err => {
        console.error(err);
        toast.error(`Please login first`);
      });
  };


  const getAvgRating = (reviews) => {
    if (!reviews?.length) return 0;
    return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  };

  if (loading) return <div className="text-center mt-10">Loading product...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product) return <div className="text-center text-red-500 mt-10">Product not found.</div>;

  const avgRating = getAvgRating(product.reviews);
  const currentSizeObj = product.sizes?.find(s => s.size === selectedSize) || {};

  const discountPercent = currentSizeObj.discountPrice
    ? Math.round(((currentSizeObj.price - currentSizeObj.discountPrice) / currentSizeObj.price) * 100)
    : 0;

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
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${thumbnail?.url === media.url ? 'border-green-700' : 'border-gray-300'}`}
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

          <div className="w-full lg:w-6/6 h-[350px] rounded-lg overflow-hidden border border-green-700/50 order-1 lg:order-2">
            {thumbnail ? (
              thumbnail.type === 'image' ? (
                <img src={thumbnail.url} alt={product.productName} className="w-full h-full object-cover object-top" />
              ) : (
                <video src={thumbnail.url} controls className="w-full h-full object-cover object-top" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Media</div>
            )}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full lg:w-2/6 space-y-2">
          <h1 className="text-2xl font-bold text-[#35894E]">{product.productName}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill={i < Math.round(avgRating) ? '#FFC107' : '#ffffff'} stroke={i < Math.round(avgRating) ? '#FFC107' : '#A0A0A0'} />
            ))}
            <span className="text-gray-600 font-semibold">{avgRating}/5</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="text-lg font-semibold text-[#35894E]">₹{selectedPrice}</span>
            {discountPercent > 0 && (
              <>
                <span className="text-gray-500 line-through">₹{currentSizeObj.price}</span>
                <span className="text-sm bg-[#93A87E4B] px-2 py-0.5 rounded-full text-black">-{discountPercent}%</span>
              </>
            )}
          </div>

          {/* description */}
          <p className="text-sm text-[#93a87eba] truncate">{description}</p>


          {/* Colors */}
          <div>
            <h3 className="text-[#35894E] mb-2">Select Colors</h3>
            <div className="flex gap-3">
              {product.colors?.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${selectedColor === color.name ? 'border-green-700 scale-110' : 'border-gray-300'}`}
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
                {product.sizes?.map((sizeObj) => (


                  <div key={sizeObj.size} className="relative inline-block group">
                    <button
                      onClick={() => handleSizeSelect(sizeObj)}
                      disabled={sizeObj.stock <= 0}
                      className={`relative px-3 rounded-3xl lg:px-4 lg:py-2 lg:rounded-none border text-[12px] font-medium transition
    ${selectedSize === sizeObj.size ? 'bg-[#93A87E] text-white border-[#93A87E]' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
    ${sizeObj.stock <= 0 ? 'text-gray-400 cursor-not-allowed' : ''}`}
                    >
                      {sizeObj.size}
                      {/* The conditional div for the diagonal line */}
                      {sizeObj.stock <= 0 && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                          <div className="lg:w-full w-6 h-[1px] bg-red-600 transform -rotate-45"></div>
                        </div>
                      )}
                    </button>
                    {/* Tooltip */}

                    {sizeObj.stock <= 0 && (
                      <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 bg-red-500 w-20 text-white text-xs rounded text-centre px-1 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                        Out of Stock
                        <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-row sm:flex-row items-center gap-4 pt-1">
            <div className="flex items-center p-0 border border-gray-300 rounded-full lg:w-32 justify-between">
              <button className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-l-full py-1" onClick={() => handleQuantity('decrease')}>-</button>
              <span className="text-lg font-medium">{quantity}</span>
              <button className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-r-full py-1" onClick={() => handleQuantity('increase')}>+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={selectedStock <= 0}
              className={`w-full font-medium py-1 md:px-6 text-xl rounded-full shadow-lg transition ${selectedStock <= 0 ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#93A87E] hover:bg-[#80996D] text-white'}`}
            >
              {selectedStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-6xl mx-auto p-4 mt-2">
        <TabsNavigation
          tabs={[
            { id: 'description', name: 'Description & Details' },
            { id: 'reviews', name: 'Reviews' }
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="pt-6">
          {activeTab === 'description' ? (
            <ProductDetails productData={product} />
          ) : (
            <>
              <ProductReviews reviews={product.reviews} />
              <ProductReviewForm productId={product._id} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
