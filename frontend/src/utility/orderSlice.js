// redux/features/orderSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

//  Place order (logged-in or guest)
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async ({ orderPayload, token }, { rejectWithValue }) => {
    try {
      const isLoggedIn = Boolean(token);
      const url = isLoggedIn
        ? `${BASE_URL}/api/orders/place`
        : `${BASE_URL}/api/orders/guest-place-order`;
      const config = isLoggedIn
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        : {
            headers: {
              'Content-Type': 'application/json',
            },
          };

      const res = await axios.post(url, orderPayload, config);
      return res.data.order;
    } catch (err) {
      console.error('Place order error:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

//  Fetch my orders
export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    error: null,
    currentOrder: null,
    buyNowProduct: null,
    myOrders: [],
    showOrderHistory: false, // control showing order history
  },
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
    setBuyNowProduct: (state, action) => {
      state.buyNowProduct = action.payload;
    },
    clearBuyNowProduct: (state) => {
      state.buyNowProduct = null;
    },
    toggleOrderHistory: (state, action) => {
      state.showOrderHistory = action.payload;
    },
    // New reducer to manually set order details (for Razorpay flow)
    setOrderDetails: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearOrder,
  setBuyNowProduct,
  clearBuyNowProduct,
  toggleOrderHistory,
  setOrderDetails, // export the new action here
} = orderSlice.actions;

export default orderSlice.reducer;

//  Selectors
export const selectPlacedOrder = (state) => state.order.currentOrder;
export const selectMyOrders = (state) => state.order.myOrders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderHistoryVisibility = (state) => state.order.showOrderHistory;
