import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatHistory,
  sendChatMessage,
} from "../Store/chat-actions";
import { chatActions } from "../Store/chat-slice";
import { socket } from "../components/socket";

const ChatModal = ({ item, currentUser, closeModal }) => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  const itemId = (item && (item._id || item.itemId?._id))?.toString();
  const sharerId = (item && (item.sharerId?._id || item.itemId?.sharerId?._id))?.toString();
  const reservedBy = (item && (item.reservedBy?._id || item.itemId?.reservedBy?._id))?.toString();
  const receiverId = currentUser._id === sharerId ? reservedBy : sharerId;

  useEffect(() => {
    if (!itemId) return;
    socket.emit("join_room", itemId);
    dispatch(fetchChatHistory(currentUser._id, itemId));
    return () => {
      dispatch(chatActions.clearChat());
    };
  }, [itemId, currentUser._id, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    const payload = {
      itemId,
      senderId: currentUser._id?.toString(),
      receiverId:
        currentUser._id?.toString() === sharerId?.toString()
          ? reservedBy?.toString()
          : sharerId?.toString(),
      text: text.trim(),
    };
    dispatch(sendChatMessage(payload));
    setText("");
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-gray-200">

      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 text-sm truncate">
          {item.title || item.itemId?.title || "Chat"}
        </h2>
        <button
          onClick={closeModal}
          className="text-gray-600 hover:text-black text-lg"
        >
          X
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 h-[350px]"
      >
        {loading ? (
          <div className="text-center text-gray-400 mt-6">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-6">
            No messages yet. Start chatting 👋
          </div>
        ) : (
          messages.map((m, i) => {
            const isMine = m.sender?.toString() === currentUser._id?.toString();
            return (
              <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-xl text-sm shadow-sm max-w-[70%] ${
                    isMine
                      ? "bg-gray-800 text-white rounded-br-none"
                      : "bg-white border border-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  {m.text}
                  <div className="text-[10px] mt-1 opacity-70 text-right">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="w-full px-3 text-black py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring focus:ring-gray-300"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-black"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
