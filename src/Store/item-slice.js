import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  userItems: [],
  loading: false,
  selectedItem: null,
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    setUserItems(state, action) {
      state.userItems = action.payload;
    },
    addItem(state, action) {
      state.items.push(action.payload);
      state.userItems.push(action.payload);
    },
    updateItem(state, action) {
      const index = state.items.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) state.items[index] = action.payload;

      const userIndex = state.userItems.findIndex((i) => i._id === action.payload._id);
      if (userIndex !== -1) state.userItems[userIndex] = action.payload;
    },
    deleteItem(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload);
      state.userItems = state.userItems.filter((i) => i._id !== action.payload);
    },
    setSingleItem(state, action) {
      state.selectedItem = action.payload; 
    },
  },
});

export const itemActions = itemSlice.actions;
export default itemSlice.reducer;
