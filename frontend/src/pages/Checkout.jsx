
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { placeOrder, setOrderDetails } from '../utility/orderSlice';
import { clearCart } from '../utility/cartSlice';
import { clearOrderDetails, clearCartFromCheckout } from '../utility/checkoutSlice';
import { SquareX } from 'lucide-react';
import AddressForm from '../components/AddressForm';
import { IoWalletOutline } from "react-icons/io5";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const AddressSection = ({
  token,
  savedAddresses,
  setSavedAddresses,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedAddresses(res.data.addresses || []);
      } catch {
        toast.error('Failed to fetch saved addresses.');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [token, setSavedAddresses]);

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Address deleted successfully');
      const updatedAddresses = savedAddresses.filter((addr) => addr._id !== addressId);
      setSavedAddresses(updatedAddresses);
      if (selectedAddress?._id === addressId) {
        setSelectedAddress(null);
      }
    } catch (err) {
      toast.error('Failed to delete address');
      console.error('Delete address error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className=" font-heading text-2xl text-green-600 font-semibold mb-4">Delivery Address</h2>
      {loading ? (
        <p>Loading addresses...</p>
      ) : (
        <>
          <ul className="space-y-2">
            {savedAddresses.map((addr) => (
              addr && (
                <li
                  key={addr._id}
                  className={`p-3 border rounded-md cursor-pointer flex justify-between items-start ${selectedAddress && selectedAddress._id === addr._id
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300'
                    }`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <div>
                    <div className="font-semibold">{addr.fullName}</div>
                    <div>
                      {addr.streetAddress}
                      {addr.apartment ? `, ${addr.apartment}` : ''}, {addr.townCity},{addr.zipcode}
                    </div>
                    <div>
                      {addr.phoneNumber} | {addr.emailAddress}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(addr._id);
                    }}
                    className="text-red-500 hover:text-red-700 ml-4 order rounded px-2"
                  >
                    <SquareX />
                  </button>
                </li>
              )
            ))}
          </ul>
          <button
            className="mt-4 text-green-600 hover:underline"
            onClick={() => setShowForm((s) => !s)}
            type="button"
          >
            {showForm ? 'Cancel' : '+ Add New Address'}
          </button>
          {showForm && (
            <AddressForm
              token={token}
              setShowForm={setShowForm}
              setSavedAddresses={setSavedAddresses}
              setSelectedAddress={setSelectedAddress}
            />
          )}
        </>
      )}
    </div>
  );
};

const CheckoutSection = ({
  cart,
  subtotal,
  shipping,
  total,
  paymentMethod,
  setPaymentMethod,
  loadingSubmit,
  handlePlaceOrder,
  selectedAddress,
}) => (
  <div>
    <h2 className=" font-heading text-2xl text-green-600 font-semibold mb-4">Order Summary</h2>
    <div className="space-y-6">
      {cart.length === 0 ? (
        <p className="font-body text-gray-500 text-center py-4">No items to display.</p>
      ) : (
        cart.map((item, index) => (
          <div
            key={item._id || item.id || index}
            className="flex items-center justify-between py-2 border-b border-gray-200"
          >
            <div className="flex items-center">
              <img
                src={item.image || 'https://placehold.co/40x40'}
                alt={item.productName}
                className="w-10 h-10 rounded-full mr-4"
              />
              <span className="font-home text-gray-800">{item.productName}</span>
            </div>
            <span className="text-gray-800 font-medium">
              ₹{(item.quantity || 1) * item.discountPrice}
            </span>
          </div>
        ))
      )}
      <div className="flex justify-between text-gray-700 pt-4">
        <span>Subtotal</span>
        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Delivery Charge</span>
        <span className="text-sm text-green-600">₹{shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold text-gray-900 border-t-2 border-gray-200 pt-4">
        <span className='font-home'>Total:</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>

    <div className="mt-8 space-y-4">
      <h3 className="font-home text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
      {[
        { id: 'bank', label: 'Bank / UPI / Wallets', icons: [IoWalletOutline] },
        { id: 'cashOnDelivery', label: 'Cash on Delivery' },
      ].map(({ id, label, icons }) => (
        <div
          key={id}
          className={`flex items-center p-4 rounded-lg border cursor-pointer transition duration-200 ${paymentMethod === id ? 'border-green-500 bg-green-50' : 'border-gray-300'
            }`}
          onClick={() => setPaymentMethod(id)}
        >
          <input
            type="radio"
            id={id}
            name="paymentMethod"
            value={id}
            checked={paymentMethod === id}
            onChange={() => setPaymentMethod(id)}
            className="h-5 w-5 text-green-600 focus:ring-green-500 cursor-pointer"
          />
          <label htmlFor={id} className="ml-3 text-gray-700 flex items-center flex-grow">
            {label}
            {icons && (
              <div className="ml-auto flex space-x-2">
                {icons.map((Icon, i) => (
                  <Icon key={i} size={20} className="text-green-600" />
                ))}
              </div>
            )}
          </label>
        </div>
      ))}
    </div>

    <button
      onClick={handlePlaceOrder}
      disabled={loadingSubmit || !selectedAddress}
      className={` font-home mt-8 w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-lg shadow-md transition duration-300 ease-in-out ${loadingSubmit || !selectedAddress ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
    >
      {loadingSubmit ? 'Placing Order...' : 'Place Order'}
    </button>
    {!selectedAddress && <p className="text-red-500 mt-2">Please select a delivery address to continue.</p>}
  </div>
);

const CheckoutDetails = () => {
  const orderDetails = useSelector((state) => state.checkout.orderDetails);
  const cartFromCheckout = useSelector((state) => state.checkout.cartFromCheckout || []);
  const tokenFromStore = useSelector((state) => state.auth.token);
  const tokenFromStorage = localStorage.getItem('token');
  const token = tokenFromStore || (tokenFromStorage && tokenFromStorage !== 'null' ? tokenFromStorage : null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);

  // Addresses states
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Payment and loading states
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/signup?redirect=/checkout')
    } else {
      setCheckingAuth(false);
    }
  }, [token, navigate]);

  if (checkingAuth) {

    return null;
  }

  const cart = orderDetails ? [orderDetails] : cartFromCheckout;

  const subtotal = cart.reduce((sum, p) => sum + (p.quantity || 1) * p.discountPrice, 0);
  const DELIVERY_CHARGE = 100;
  const shipping = DELIVERY_CHARGE;
  const total = subtotal + shipping;

  const finalSelectedAddress = selectedAddress;

  const handlePlaceOrder = async () => {
    if (!finalSelectedAddress) {
      toast.error('Please provide a delivery address.');
      return;
    }

    if (paymentMethod === 'bank') {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your connection.');
        return;
      }

      setLoadingSubmit(true);

      try {
        const orderPayload = {


          shippingInfo: finalSelectedAddress,
          paymentMethod,
          items: cart,
          shippingCost: shipping,
          totalAmount: total,

        };
        console.log("Order payload:", orderPayload);



        const amountInPaisa = Math.round(total * 100);
        const { data: razorpayOrder } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
          { amount: amountInPaisa },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!razorpayOrder?.id) {
          toast.error('Failed to initiate payment. Please try again.');
          setLoadingSubmit(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Your Store Name',
          description: 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              const paymentResult = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/payment/verify-payment`,
                {
                  razorpay_order_id: razorpayOrder.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderPayload,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (paymentResult.data.success) {
                toast.success('Payment successful and order placed!');
                dispatch(setOrderDetails(paymentResult.data.order));
                dispatch(clearCart());
                dispatch(clearCartFromCheckout());
                navigate('/thankyou');
              } else {
                toast.error('Payment verification failed.');
              }
            } catch (err) {
              toast.error('Payment failed verification.');
              console.error(err);
            }
            setLoadingSubmit(false);
          },
          modal: {
            ondismiss: function () {
              toast.error('Payment cancelled.');
              setLoadingSubmit(false);
            },
          },
          theme: {
            color: '#22c55e',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        toast.error('Payment failed. Please try again.');
        setLoadingSubmit(false);
        console.error(error);
      }
    } else {
      if (!finalSelectedAddress) {
        toast.error('Please provide a delivery address.');
        return;
      }

      const orderPayload = {
        shippingInfo: finalSelectedAddress,
        paymentMethod,
        items: cart,
        shippingCost: shipping,
        totalAmount: total,
      };

      setLoadingSubmit(true);
      try {
        const result = await dispatch(placeOrder({ orderPayload, token }));

        if (placeOrder.fulfilled.match(result)) {
          toast.success('Order placed successfully!');
          if (orderDetails) {
            dispatch(clearOrderDetails());
          } else {
            dispatch(clearCart());
            dispatch(clearCartFromCheckout());
          }
          navigate('/thankyou');
        } else {
          toast.error(result.payload || 'Order failed');
        }
      } catch (err) {
        toast.error('Something went wrong during order submission.');
      } finally {
        setLoadingSubmit(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center lg:mx-28">
      <div className="w-full bg-white p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <AddressSection
            token={token}
            savedAddresses={savedAddresses}
            setSavedAddresses={setSavedAddresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </div>
        <div className="flex-1 lg:pl-12">
          <CheckoutSection
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            total={total}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            loadingSubmit={loadingSubmit}
            handlePlaceOrder={handlePlaceOrder}
            selectedAddress={finalSelectedAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetails;
