"use client";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import MessageInput from "./MessageInput";

const socket: Socket = io("http://localhost:5000"); // Backend URL

interface Message {
  user: string;
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const name = prompt("Enter your username:") || "Anonymous";
    setUsername(name);

    socket.on("message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const message: Message = { user: username, text };
    socket.emit("message", message);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-96">
      <h2 className="text-xl font-semibold text-center mb-4">Real-Time Chat</h2>

      {/* Message List */}
      <div className="h-64 overflow-y-auto border p-3 rounded-md bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
}
