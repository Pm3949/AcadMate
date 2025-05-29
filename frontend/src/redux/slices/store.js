// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage
import authReducer from './authSlice.js';
import { combineReducers } from 'redux';

// Combine reducers if you have more slices later
const rootReducer = combineReducers({
  auth: authReducer,
});

// persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // persist only auth slice
};

// wrap rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist requires this
    }),
});

// Create persistor
export const persistor = persistStore(store);
