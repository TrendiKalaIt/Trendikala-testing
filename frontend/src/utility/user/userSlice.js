import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch profile from backend
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { getState }) => {
    const token = getState().auth.user?.token;
    const res = await axios.get('/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;  // this will be the user object
  }
);

// Update profile on backend
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updatedData, { getState }) => {
    const token = getState().auth.user?.token;
    const res = await axios.put('/api/users/update-profile', updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.user;  // your backend returns { message, user } — take user
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = 'succeeded';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  }
});

export default userSlice.reducer;
