// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import loaderReducer from './loaderSlice.js';
import productReducer from './productSlice';
import wishlistReducer from './wishlistSlice.js';
import cartReducer from './cartSlice.js';
import checkoutReducer from './checkoutSlice.js';
import authReducer from '../utility/auth/authSlice.js';
import reviewReducer from '../utility/reviewSlice.js';
import orderReducer from '../utility/orderSlice.js';
import addressReducer from '../utility/addressSlice.js';

// 1. Combine reducers
const rootReducer = combineReducers({
  loader: loaderReducer,
  review: reviewReducer,
  auth: authReducer,
  wishlist: wishlistReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  product: productReducer,
  order: orderReducer,
  address: addressReducer,
});

// 2. Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'checkout'],
  
};

// 3. Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Store setup with middleware ignoring redux-persist non-serializable action warnings
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// 5. Persistor
export const persistor = persistStore(store);

// 6. Export store
export default store;
