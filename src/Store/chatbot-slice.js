import { createSlice } from "@reduxjs/toolkit";

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: { isOpen: false },
  reducers: {
    openChatbot(state) {
      state.isOpen = true;
    },
    closeChatbot(state) {
      state.isOpen = false;
    },
  },
});

export const { openChatbot, closeChatbot } = chatbotSlice.actions;
export default chatbotSlice.reducer;
