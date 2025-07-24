
// src/utility/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(sessionStorage.getItem("user")) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;

      // ✅ Save to sessionStorage instead of localStorage
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      sessionStorage.setItem("token", action.payload.token); 
    },
    logout(state) {
      state.user = null;

      // ✅ Remove from sessionStorage
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    },
  },
});

// Export actions
export const { login, logout } = authSlice.actions;

// Add selector here
export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;
