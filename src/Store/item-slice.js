import { createSlice } from '@reduxjs/toolkit';

const itemSlice = createSlice({
  name: 'items',
  initialState: { allItems: {} },
  reducers: {
    setItems(state, action) {
      state.allItems = action.payload;
    },
  },
});

export const itemActions = itemSlice.actions;
export default itemSlice.reducer;
