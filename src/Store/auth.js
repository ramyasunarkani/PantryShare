import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  userLogged: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
  name: '',
  email: '',
  photo: '',
  userId: '',
  location: { lat: null, lng: null },
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.userLogged = true;
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.photo = action.payload.photo;
      state.userId = action.payload.userId;
      state.location = action.payload.location || { lat: null, lng: null };

      // Only store token in localStorage
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.userLogged = false;
      state.token = null;
      state.name = '';
      state.email = '';
      state.photo = '';
      state.userId = '';
      state.location = { lat: null, lng: null };

      localStorage.removeItem('token');
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
