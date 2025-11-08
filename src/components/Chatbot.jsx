import React, { useState } from "react";
import api from "../Store/api";
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
      const res = await api.post("/chatbot/message", { message: input });
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
      {/* Chatbot Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            backgroundColor: "#4F46E5",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        >
          <BsRobot size={30} />
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)} // Close when clicking outside
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          {/* Modal Box */}
          <div
            onClick={(e) => e.stopPropagation()} // Prevent closing when inside
            style={{
              width: "90%",
              maxWidth: "400px",
              height: "75vh",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
              }}
            >
              <div className="flex items-center gap-2">
                <BsRobot size={22} color="#4F46E5" />
                <h2 className="text-lg font-bold text-indigo-600">PantryBot</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "#555",
                }}
              >
                ✕
              </button>
            </div>

            {/* Messages Section */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign: msg.sender === "user" ? "right" : "left",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      backgroundColor:
                        msg.sender === "user" ? "#4F46E5" : "#E5E7EB",
                      color: msg.sender === "user" ? "#fff" : "#111",
                      maxWidth: "75%",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              {loading && (
                <p style={{ fontSize: "12px", color: "#888" }}>
                  PantryBot is typing...
                </p>
              )}
            </div>

            {/* Input Box */}
            <div style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{
                  color: "black",
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  marginLeft: "8px",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
