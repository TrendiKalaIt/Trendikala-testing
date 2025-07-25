// src/redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

// Fetch wishlist products from backend
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token found. Please login.');
      }

      const res = await axios.get(`${BASE_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //  Filter only valid products with _id
      const products = res.data.data
        .map((item) => item.product)
        .filter((p) => p && p._id); // Prevent errors with null/missing products

      return products;
    } catch (error) {
      if (error.response?.data?.error === 'jwt expired') {
        return thunkAPI.rejectWithValue('Session expired. Please login again.');
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Add product to wishlist backend
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, thunkAPI) => {
    try {
      await axios.post(
        `${BASE_URL}/api/wishlist`,
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return product;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// Remove product from wishlist backend
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],    // wishlist products array
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: Add non-async actions if needed
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addToWishlist
      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const exists = state.items.find((item) => item._id === action.payload._id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // removeFromWishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;

export const selectWishlistCount = (state) => state.wishlist.items.length;
