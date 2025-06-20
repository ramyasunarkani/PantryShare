import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  userLogged: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
  name: localStorage.getItem('name') || '',
  email: localStorage.getItem('email') || '',
  photo: localStorage.getItem('photo') || '',
  uid: localStorage.getItem('uid') || '', 
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
      state.uid = action.payload.uid; 

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('photo', action.payload.photo);
      localStorage.setItem('uid', action.payload.uid); 
    },
    logout(state) {
      state.userLogged = false;
      state.token = null;
      state.name = '';
      state.email = '';
      state.photo = '';
      state.uid = ''; 

      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('photo');
      localStorage.removeItem('uid'); 
    },
  },
});


export const authActions = authSlice.actions;
export default authSlice.reducer;
