
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import itemReducer from './item-slice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemReducer,
  },
});

export default store;
