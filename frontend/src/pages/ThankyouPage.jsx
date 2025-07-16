import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

import { clearOrder, selectPlacedOrder } from '../utility/orderSlice'; // Adjust path if needed

const Thankyou = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderDetails = useSelector(selectPlacedOrder);

  // Show loading if orderDetails not available yet
  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading your order details...</p>
      </div>
    );
  }

  const calculateSubtotal = (items) =>
    items?.reduce((acc, item) => acc + item.discountPrice * item.quantity, 0).toFixed(2);

  const handleBackToShopping = () => {
    dispatch(clearOrder());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center lg:p-4 font-inter">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
        {/* Thank You Message Section */}
        <div className="bg-gradient-to-r from-[#D4F387] to-[#A8E6CF] text-green-900 p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center mb-8 shadow-lg">
          <div className="flex lg:flex-row flex-col items-center mb-4">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold lg:font-extrabold mr-3 leading-tight">
              {orderDetails?.shippingInfo?.fullName}, Thank You for Your Order!
            </h2>
            <CheckCircle className="lg:w-10 lg:h-10 h-8 w-10 mt-2 text-green-700 animate-bounce" />
          </div>
          <p className="lg:text-xl sm:text-2xl font-bold mb-3 text-green-800">
            Order ID: <span className="text-green-700">{orderDetails.orderId}</span>
          </p>
          <p className="text-gray-700 text-base sm:text-lg max-w-prose">
            We appreciate your order! It's now being packed, and you'll receive tracking information via email shortly at{' '}
            <span className="font-semibold">{orderDetails?.shippingInfo?.emailAddress}</span>.
          </p>
        </div>

        {/* Order Details Table */}
        <div className="mb-8 p-4 border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 text-center">Order Summary</h3>
          <div className="flex justify-between border-b-2 border-gray-300 pb-3 mb-4">
            <span className="font-semibold text-gray-700 text-lg sm:text-xl">Item</span>
            <span className="font-semibold text-gray-700 text-lg sm:text-xl">Total</span>
          </div>

          {orderDetails?.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded-lg mr-4 object-cover shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/60x60/cccccc/333333?text=N/A";
                  }}
                />
                <div >
                  <p className="text-gray-800 font-bold lg:text-2xl sm:text-lg">{item.productName}</p>
                  <p className="text-gray-500 font-semibold lg:text-lg">QTY: {item.quantity}</p>
                  <p className="text-gray-500 font-semibold lg:text-lg">Color: {item.color} | Size: {item.size}</p>
                </div>
              </div>
              <span className="text-gray-800 font-medium text-base sm:text-lg">₹{item.discountPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Delivery and Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-4 border border-gray-200 rounded-xl shadow-sm">
          {/* Delivery Address */}
          <div>
            <p className="text-gray-700 font-bold mb-3 text-lg sm:text-xl">Delivery Address</p>
            <p className="text-gray-800 text-base sm:text-lg">
              <span className="font-semibold">{orderDetails?.shippingInfo?.fullName}</span><br />
              {orderDetails?.shippingInfo?.streetAddress}, {orderDetails?.shippingInfo?.apartment}<br />
              {orderDetails?.shippingInfo?.townCity}<br />
              Phone: {orderDetails?.shippingInfo?.phoneNumber}
            </p>
          </div>

          {/* Subtotals and Total */}
          <div className="space-y-3 text-right">
            <div className="flex justify-between text-gray-700 text-base sm:text-lg">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{calculateSubtotal(orderDetails?.items)}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-base sm:text-lg">
              <span>Shipping:</span>
              <span className="font-semibold">₹{orderDetails?.shippingCost?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl sm:text-2xl font-bold text-gray-900 border-t-2 border-gray-200 pt-3">
              <span>Total:</span>
              <span>₹{orderDetails?.totalAmount?.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <p className="text-gray-700 font-bold mb-2 text-lg sm:text-xl">Payment Method</p>
            <p className="text-gray-800 text-base sm:text-lg">
              {orderDetails?.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Bank Transfer'}
            </p>
          </div>
        </div>

        {/* Back to Shopping Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBackToShopping}
            className="bg-green-600 text-white py-3 px-8 rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Back to Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Thankyou;
