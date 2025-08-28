

import { createSlice } from '@reduxjs/toolkit';

const savedState = localStorage.getItem('checkoutState');
const initialState = savedState
  ? JSON.parse(savedState)
  : {
      orderDetails: null,
      cartFromCheckout: [],
    };

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
      localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    setCartFromCheckout: (state, action) => {
      state.cartFromCheckout = action.payload;
      localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    clearCartFromCheckout: (state) => {
      state.cartFromCheckout = [];
      localStorage.setItem('checkoutState', JSON.stringify(state));
    },
    resetCheckoutState: (state) => {
      state.orderDetails = null;
      state.cartFromCheckout = [];
      localStorage.removeItem('checkoutState');
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
