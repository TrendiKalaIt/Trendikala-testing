
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../utility/orderSlice"; // adjust path if needed
import { selectCurrentUser } from "../utility/auth/authSlice";
import {Shirt } from 'lucide-react' 
const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser); // assumes you're storing user with token
  const { myOrders: orders, loading } = useSelector((state) => state.order);


  useEffect(() => {
    if (user?.token) {
      dispatch(fetchMyOrders(user.token));
    }
  }, [dispatch, user]);

  return (
    <div className="md:p-10 p-4 space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl text-green-500 font-semibold mb-6">My Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders?.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-5 p-6 rounded-md border border-green-300 bg-white text-gray-800 shadow-sm"
          >
            {/* Products */}
            <div className="flex gap-4">
             
              <Shirt className="w-12 h-12 object-contain opacity-70 text-green-500 " />
              <div className="flex flex-col justify-center">
                {order.items.map((item, idx) => (
                  <p key={idx} className="font-medium text-green-500">
                    {item.productName}{" "}
                    {item.quantity > 1 && (
                      <span className="text-indigo-600">x {item.quantity}</span>
                    )}
                    <span className="text-sm text-gray-500 ml-2">
                      ({item.color}, {item.size})
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="text-sm">
              <p className="font-medium mb-1  text-green-500">{order.shippingInfo.fullName}</p>
              <p>
                {order.shippingInfo.streetAddress}
                {order.shippingInfo.apartment && `, ${order.shippingInfo.apartment}`},{" "}
                {order.shippingInfo.townCity}
              </p>
              <p>{order.shippingInfo.phoneNumber}</p>
            </div>

            {/* Total Amount */}
            <p className="font-semibold text-lg text-green-500">
              ₹{order.totalAmount}
            </p>

            {/* Payment Info */}
            <div className="flex flex-col text-sm">
              <p>
                <span className="font-medium text-green-500">Method:</span>{" "}
                {order.paymentMethod === "cashOnDelivery"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
              </p>
              <p>
                <span className="font-medium text-green-500">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-green-500">Status:</span>{" "}
                <span className="text-blue-600 font-semibold">{order.orderStatus}</span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;
