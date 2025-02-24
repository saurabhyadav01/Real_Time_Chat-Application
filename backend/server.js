const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { db } = require("./config"); // Import database config
const axios = require("axios"); // OpenAI API calls

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors()); // Enable CORS
app.use(express.json()); // Allow JSON requests

let activeUsers = new Map(); // Track active users (username -> socket ID)

// ** Ensure database connection **
async function connectDB() {
  try {
    global.db = await db;
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

connectDB();

// ** Fetch previous messages **
app.get("/messages", async (req, res) => {
  try {
    const [rows] = await global.db.execute(
      "SELECT * FROM messages ORDER BY timestamp ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ** OpenAI Chatbot Function **
async function getChatbotResponse(userMessage) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chatbot response:", error.response?.data || error.message);
    return "I'm sorry, but I couldn't process your request.";
  }
}

// ** Socket.io Real-Time Chat Logic **
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // ** User joins chat **
  socket.on("joinChat", async (username) => {
    if (activeUsers.has(username)) {
      socket.emit("joinError", "Username already taken. Try another.");
    } else {
      activeUsers.set(username, socket.id);
      socket.username = username;

      // Notify all users
      io.emit("message", {
        username: "System",
        message: `${username} joined the chat`,
        system: true,
      });

      socket.emit("joinSuccess", username);
    }
  });

  // ** Handle user messages **
  socket.on("chatMessage", async (msg) => {
    if (!socket.username) return;

    const messageData = {
      username: socket.username,
      message: msg,
      timestamp: new Date().toISOString(),
    };

    try {
      // Store message in database
      await global.db.execute(
        "INSERT INTO messages (username, message, timestamp) VALUES (?, ?, ?)",
        [messageData.username, messageData.message, messageData.timestamp]
      );

      // Broadcast message to all users
      io.emit("message", messageData);

      // If the message contains "@Chatbot" OR it's a direct question, get chatbot response
      if (msg.toLowerCase().includes("@chatbot") || msg.endsWith("?")) {
        io.emit("typing", { username: "Chatbot", typing: true });

        const botResponse = await getChatbotResponse(msg);

        io.emit("message", {
          username: "Chatbot",
          message: botResponse,
          timestamp: new Date().toISOString(),
        });

        io.emit("typing", { username: "Chatbot", typing: false });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // ** Handle user disconnect **
  socket.on("disconnect", () => {
    if (socket.username) {
      activeUsers.delete(socket.username);
      io.emit("message", {
        username: "System",
        message: `${socket.username} left the chat`,
        system: true,
      });
      console.log(`User disconnected: ${socket.username}`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
