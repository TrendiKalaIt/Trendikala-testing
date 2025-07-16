import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const createReview = createAsyncThunk(
  'review/createReview',
  async ({ productId, rating, comment }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${BASE_URL}/api/products/${productId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: { loading: false, success: false, error: null },
  reducers: {
    resetReview: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;
