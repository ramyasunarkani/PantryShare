
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import itemReducer from './item-slice';
import reservationReducer from './reservation-slice';
import chatReducer from "./chat-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemReducer,
    reservation:reservationReducer,
      chat: chatReducer,

  },
});

export default store;
