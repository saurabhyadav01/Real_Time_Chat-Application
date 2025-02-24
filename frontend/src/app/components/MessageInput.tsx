"use client";

import { useState } from "react";

export default function MessageInput({ sendMessage }: { sendMessage: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    sendMessage(text);
    setText("");
  };

  return (
    <div className="flex mt-4">
      <input
        type="text"
        className="flex-1 p-2 border rounded-md"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}
