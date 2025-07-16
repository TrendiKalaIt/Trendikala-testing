// src/redux/productSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [], // This must match the key used in your selectors
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
