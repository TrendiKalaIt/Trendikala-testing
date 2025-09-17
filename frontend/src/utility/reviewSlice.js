

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_URL || '';

// ✅ AsyncThunk
export const createReview = createAsyncThunk(
  'review/createReview',
  async ({ productId, formData }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${BASE_URL}/api/products/${productId}/reviews`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // axios FormData ke liye khud Content-Type set karega
          },
        }
      );
      return res.data; // <- backend se naya review
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    loading: false,
    success: false,
    error: null,
    reviews: [], // ✅ add this
  },
  reducers: {
    resetReview: (state) => {
      state.success = false;
      state.error = null;
    },
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        if (action.payload) {
          const review = {
            ...action.payload,
            name: action.payload.name || "Anonymous", // agar backend name nahi bheje
            rating: action.payload.rating || 0,
            verified: action.payload.verified ?? false,
            createdAt: action.payload.createdAt || new Date().toISOString(),
            media: action.payload.media || [],
          };

          state.reviews = [review, ...state.reviews]; // top pe add
        }
      })

      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReview, setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
