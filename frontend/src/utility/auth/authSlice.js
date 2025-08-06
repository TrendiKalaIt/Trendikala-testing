  // // src/redux/slices/authSlice.js
  // import { createSlice } from '@reduxjs/toolkit';

  // const initialState = {
  //   user: JSON.parse(sessionStorage.getItem("user")) || null,
  // };

  // const authSlice = createSlice({
  //   name: 'auth',
  //   initialState,
  //   reducers: {
  //     login(state, action) {
  //       state.user = action.payload;
  //       sessionStorage.setItem("user", JSON.stringify(action.payload));
  //       sessionStorage.setItem("token", action.payload.token);
  //     },
  //     logout(state) {
  //       state.user = null;
  //       sessionStorage.removeItem("user");
  //       sessionStorage.removeItem("token");
  //     },
  //     updateUser(state, action) {
  //       const updatedUser = { ...state.user, ...action.payload };
  //       sessionStorage.setItem("user", JSON.stringify(updatedUser));
  //       state.user = updatedUser;
  //     }
  //     ,
  //   },
  // });

  // export const { login, logout, updateUser } = authSlice.actions;
  // export const selectCurrentUser = (state) => state.auth.user;

  // export default authSlice.reducer;



  import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Redux Persist will rehydrate this from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      // No manual sessionStorage/localStorage handling here
    },
    logout(state) {
      state.user = null;
      // No manual sessionStorage/localStorage clearing
    },
    updateUser(state, action) {
      const updatedUser = { ...state.user, ...action.payload };
      state.user = updatedUser;
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;

export default authSlice.reducer;
