import { chatActions } from "./chat-slice";
import { socket } from "../components/socket";
import api from "./api";


export const fetchChatHistory = (userId, itemId) => {
  return async (dispatch) => {
    try {
      dispatch(chatActions.setLoading(true));

      const res = await api.get(`/chats/${userId}`);

      const chat = res.data.find(
        (c) => c.itemId?._id?.toString() === itemId
      );

      if (chat) {
        const normalized = chat.messages.map((m) => ({
          sender: m.sender?._id?.toString() || m.sender?.toString(),
          text: m.text,
          createdAt: m.createdAt,
        }));
        dispatch(chatActions.setMessages(normalized));
      } else {
        dispatch(chatActions.setMessages([]));
      }
    } catch (err) {
      dispatch(chatActions.setError(err.message));
      console.error("Error fetching chat:", err);
    } finally {
      dispatch(chatActions.setLoading(false));
    }
  };
};

export const sendChatMessage = (payload) => {
  return async (dispatch) => {
    if (!payload.text || !payload.text.trim()) return;
    socket.emit("send_message", payload);
  };
};

export const setupChatSocketListener = (dispatch) => {
  socket.off("receive_message");
  socket.on("receive_message", (data) => {
    dispatch(
      chatActions.addMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: data.createdAt || new Date(),
        itemId: data.itemId?.toString?.() || null,
      })
    );
  });
};
