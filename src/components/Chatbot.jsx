import React, { useState } from "react";
import axios from "axios";
import Modal from "./UI/Modal";
import { BsRobot } from "react-icons/bs";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋! I'm PantryBot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/chatbot/message", {
        message: input,
      });
      const botReply = res.data.reply;
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops 😅 I couldn’t connect right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
        {!isOpen && (
          <div className="mb-2 bg-white shadow-md px-3 py-1 text-sm text-gray-700 rounded-full animate-bounce">
            Need help? 💬
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:scale-110 transition-transform duration-300 rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <BsRobot size={26} className="text-white" />
        </button>
      </div>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <h2 className="text-xl font-bold text-primary">PantryBot 🤖</h2>
              <button
                className="btn btn-sm btn-ghost text-xl"
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="border rounded-lg p-3 bg-gray-50 h-80 overflow-y-auto mb-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[75%] ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <p className="text-sm text-gray-400 italic">
                  PantryBot is typing...
                </p>
              )}
            </div>

            <div className="flex">
              <input
                type="text"
                placeholder="Type a message..."
                className="input input-bordered input-sm flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="btn btn-sm btn-primary ml-2"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Chatbot;
