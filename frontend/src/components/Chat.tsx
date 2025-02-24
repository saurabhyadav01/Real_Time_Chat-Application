"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, User, LogOut } from "lucide-react";

interface Message {
  id?: number;
  username?: string;
  message: string;
  timestamp?: string;
  system?: boolean;
}

export default function Chat() {
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      fetch("http://localhost:5000/messages")
        .then((res) => res.json())
        .then((data) => setMessages(Array.isArray(data) ? data : []))
        .catch(() => setMessages([]));

      newSocket.on("message", (data: Message) => {
        setMessages((prev) => [...prev, data]);
      });

      newSocket.on("joinError", (errorMsg: string) => {
        setError(errorMsg);
      });

      newSocket.on("joinSuccess", (username: string) => {
        setJoined(true);
        setError(null);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinChat = () => {
    if (username.trim() && socket) {
      socket.emit("joinChat", username);
    }
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit("chatMessage", message);
      setMessage("");
    }
  };

  const leaveChat = () => {
    setJoined(false);
    setUsername("");
    setMessages([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      {!joined ? (
        <div className="p-6 bg-white rounded-md shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-black">
            <User className="mr-2 text-black" /> Enter Your Name
          </h2>
          <input
            type="text"
            placeholder="Your name..."
            className="p-3 border rounded-md w-full mb-4 text-black bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={joinChat}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition duration-300"
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white p-5 rounded-md shadow-lg flex flex-col h-[80vh]">
          {/* Chat Header */}
          <div className="flex justify-between items-center pb-3 border-b mb-3">
            <h2 className="text-xl font-semibold text-gray-700">Chat Room</h2>
            <button onClick={leaveChat} className="text-red-500 hover:text-red-600">
              <LogOut size={22} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50 rounded-md">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex mb-3 ${msg.username === username ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 max-w-xs rounded-md text-white shadow-lg ${
                      msg.system
                        ? "bg-gray-400 text-gray-900"
                        : msg.username === username
                        ? "bg-green-500"
                        : "bg-gray-700"
                    }`}
                  >
                    {!msg.system && (
                      <strong className="block text-xs text-gray-300">{msg.username}</strong>
                    )}
                    <p className="text-base">{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No messages yet.</p>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Message Input */}
          <div className="flex items-center border rounded-md overflow-hidden bg-white shadow mt-3">
            <input
              type="text"
              className="flex-grow p-3 text-black bg-white border-none focus:ring-2 focus:ring-green-400 focus:outline-none"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-green-500 text-white hover:bg-green-600 transition duration-300 rounded-r-md"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
