import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../utility/cartSlice';
import { addToWishlist, removeFromWishlist } from '../utility/wishlistSlice';
import { setOrderDetails  } from '../utility/checkoutSlice';

import { Dialog } from '@headlessui/react';

const ProductCard = ({ product = {} }) => {
  const {
    media = [],
    category = 'Category',
    productName = 'Product Name',
    description = 'Product description',
    discountPrice = 0,
    price = 0,
    colors = [],
    sizes = [],
    _id,
  } = product;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const wishlist = useSelector((state) => state.wishlist.items);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('cart'); // 'cart' or 'buy'
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleNavigate = () => {
    if (_id) {
      navigate(`/productdetails/${_id}`);
    }
  };

  const handleAddToCartClick = () => {
    setModalType('cart');
    setIsModalOpen(true);
  };

  const handleBuyNowClick = () => {
    setModalType('buy');
    setIsModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select size and color');
      return;
    }

    const cartItem = {
      product: _id,
      productName,
      discountPrice,
      color: selectedColor,
      size: selectedSize,
      quantity,
      image: media?.[0]?.url || '',
    };

    dispatch(addToCart([cartItem]))
      .unwrap()
      .then(() => {
        toast.success('Added to cart');
        setIsModalOpen(false);
        setSelectedColor('');
        setSelectedSize('');
        setQuantity(1);
      })
      .catch(() => toast.error('Failed to add to cart'));
  };

//   const handleCheckout = () => {
//     if (!selectedColor || !selectedSize) {
//       toast.error('Please select size and color before checkout');
//       return;
//     }

//     const productToBuy = {
//       product: _id,
//       productName,
//       discountPrice,
//       color: selectedColor,
//       size: selectedSize,
//       quantity,
//       image: media?.[0]?.url || '',
//     };

//     dispatch(setOrderDetails(productToBuy));
//     navigate('/checkout');

//   };


const handleCheckout = () => {
  if (!selectedColor || !selectedSize) {
    toast.error('Please select size and color before checkout');
    return;
  }

  const productToBuy = {
    product: _id,
    productName,
    discountPrice,
    color: selectedColor,
    size: selectedSize,
    quantity,
    image: media?.[0]?.url || '',
  };

  // Save to localStorage before redirect
  localStorage.setItem('checkoutState', JSON.stringify({
    orderDetails: productToBuy,
    cartFromCheckout: [],
  }));

  setIsModalOpen(false);

if (!user) {
  navigate('/signup?redirect=/checkout');
}


  dispatch(setOrderDetails(productToBuy));
  navigate('/checkout');
};



  const isWishlisted = wishlist.some((item) => item._id === _id);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(_id)).unwrap();
        toast.success('Removed from Wishlist!');
      } else {
        await dispatch(addToWishlist(product)).unwrap();
        toast.success('Added to Wishlist');
      }
    } catch (error) {
      toast.error(error || 'Wishlist update failed');
    }
  };

  return (
    <>
      <div className="relative w-full max-w-xs mx-auto bg-white border-2 rounded-3xl shadow-md overflow-hidden border-[#35894e] h-96 flex flex-col
        transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
        {/* Image Section */}
        <div
          className="relative w-full h-3/5 overflow-hidden rounded-t-2xl cursor-pointer"
          onClick={handleNavigate}
        >
          <img
            src={media?.[0]?.url || 'https://placehold.co/300x320/FFD368/333?text=Product+Image'}
            alt={productName}
            className="w-full h-full object-cover object-top
                transition-transform duration-300 ease-in-out hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/300x320/FFD368/333?text=Image+Not+Found';
            }}
          />

          {/* Wishlist */}
          {user && (
            <button
              className="absolute top-4 right-4 p-2 rounded-full text-gray-700
                transition-colors duration-200 ease-in-out hover:text-red-500 hover:scale-110"
              aria-label="Add to favorites"
              onClick={toggleWishlist}
            >
              <Heart
                size={24}
                strokeWidth={1.5}
                color={isWishlisted ? '#22c55e' : 'gray'}
                fill={isWishlisted ? '#22c55e' : 'white'}
              />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="h-2/5 p-3 flex flex-col justify-between bg-white rounded-b-3xl">
          <div>
            <p className="text-sm text-[#93a87e86] font-semibold"> { category?.name || 'Category'}</p>
            <h3
              onClick={handleNavigate}
              className="text-md font-bold text-[#93A87E] truncate cursor-pointer hover:underline"
            >
              {productName}
            </h3>
            <p className="text-sm text-[#93a87eba] truncate">{description}</p>
            <div className="flex gap-3 pt-1">
              <p className="text-md text-[#93A87E]">₹{discountPrice}</p>
              <p className="text-md text-gray-500 line-through">₹{price}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddToCartClick}
              className="flex-1 py-2 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full hover:bg-gray-300
                transition-all duration-200 ease-in-out hover:scale-105"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNowClick}
              className="flex-1 py-2 bg-[#93A87E] text-white text-xs font-semibold rounded-full hover:bg-green-700
                transition-all duration-200 ease-in-out hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal (no changes needed for modal animation via direct hover) */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
            <Dialog.Title className="text-lg font-bold text-[#35894E]">
              Select Size & Color
            </Dialog.Title>

            {/* Colors */}
            <div>
              <h4 className="text-sm text-gray-600 mb-1">Colors:</h4>
              <div className="flex gap-3">
                {colors?.map((color) => (
                  <button
                    key={color.name}
                    className={`w-6 h-6 rounded-full border-2 transition flex items-center justify-center ${selectedColor === color.name
                      ? 'border-green-600 scale-110'
                      : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    {selectedColor === color.name && <Check size={16} color="white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-sm text-gray-600 mb-1">Sizes:</h4>
              <div className="flex flex-wrap gap-2">
                {sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 text-sm rounded-full border ${selectedSize === size
                      ? 'bg-[#93A87E] text-white border-[#93A87E]'
                      : 'border-gray-300 text-gray-700'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 text-lg"
                >
                  -
                </button>
                <span className="px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              {modalType === 'cart' ? (
                <button
                  className="px-4 py-2 text-sm bg-[#93A87E] text-white rounded-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  className="px-4 py-2 text-sm bg-[#93A87E] text-white rounded-full"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ProductCard;