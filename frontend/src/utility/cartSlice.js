// src/utility/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for cart API
const API_URL = `${import.meta.env.VITE_API_URL}/api/cart`;


// Helper to get auth headers
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// Fetch user's cart  
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL, authHeaders());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add or update items in cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (items, thunkAPI) => {
    try {
      const response = await axios.post(API_URL, { items }, authHeaders());
      return response.data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Update quantity of one cart item
export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ id, quantity }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { quantity }, authHeaders());
      return response.data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove one item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, authHeaders());
      return response.data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Clear entire cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      await axios.delete(API_URL, authHeaders());
      return [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Optionally local only clear
    clearLocalCart: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(updateQuantity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
