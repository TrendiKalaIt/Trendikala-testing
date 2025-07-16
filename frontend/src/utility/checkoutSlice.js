
// src/utility/checkoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderDetails: null,      // for Buy Now (single product)
  cartFromCheckout: [],    // for full cart checkout
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
    setCartFromCheckout: (state, action) => {
      state.cartFromCheckout = action.payload;
    },
    clearCartFromCheckout: (state) => {
      state.cartFromCheckout = [];
    },
    resetCheckoutState: (state) => {
      state.orderDetails = null;
      state.cartFromCheckout = [];
    },
  },
});

export const {
  setOrderDetails,
  clearOrderDetails,
  setCartFromCheckout,
  clearCartFromCheckout,
  resetCheckoutState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
