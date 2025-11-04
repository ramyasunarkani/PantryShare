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
    const payload = {
      itemId: itemId?.toString(),
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
    <div className="modal modal-open">
      <div className="modal-box w-96 max-w-full flex flex-col bg-base-100 shadow-xl rounded-xl p-0">
        <div className="bg-primary text-primary-content px-4 py-3 flex justify-between items-center rounded-t-xl">
          <h2 className="font-semibold text-sm truncate">
            {item.title || item.itemId?.title || "Chat"}
          </h2>
          <button onClick={closeModal} className="btn btn-ghost btn-sm text-gray-700">
            ✖
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 bg-base-200 space-y-3 h-[350px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
        >
          {loading ? (
            <div className="text-center text-gray-400 mt-6">Loading chat...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-6">No messages yet. Start chatting 👋</div>
          ) : (
            messages.map((m, i) => {
              const isMine = m.sender?.toString() === currentUser._id?.toString();
              return (
                <div key={i} className={`chat ${isMine ? "chat-end" : "chat-start"}`}>
                  <div
                    className={`chat-bubble ${
                      isMine
                        ? "chat-bubble-primary text-white"
                        : "chat-bubble-secondary text-black"
                    }`}
                  >
                    {m.text}
                    <div className="text-[10px] mt-1 opacity-75 text-right">
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

        <div className="p-3 border-t flex items-center gap-2 bg-base-100 rounded-b-xl">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="input input-bordered input-sm flex-1"
          />
          <button onClick={handleSend} className="btn btn-primary btn-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
