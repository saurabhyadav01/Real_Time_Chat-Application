const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { db } = require("./config"); // Import database config

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

// Ensure database connection is established
async function connectDB() {
  try {
    global.db = await db;
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

connectDB();

// Fetch previous messages from the database
app.get("/messages", async (req, res) => {
  try {
    const [rows] = await global.db.execute(
      "SELECT * FROM messages ORDER BY timestamp ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ** Socket.io Real-Time Chat Logic **
io.on("connection", (socket) => {
  console.log("🔵 New user connected:", socket.id);

  socket.on("joinChat", async (username) => {
    if (activeUsers.has(username)) {
      // Username already exists
      socket.emit("joinError", "Username is already taken. Try another.");
    } else {
      // Add user to active list
      activeUsers.set(username, socket.id);
      socket.username = username;

      // Notify everyone
      io.emit("message", {
        username: "System",
        message: `${username} joined the chat`,
        system: true,
      });

      // Send success message to user
      socket.emit("joinSuccess", username);
    }
  });

  socket.on("chatMessage", async (msg) => {
    if (!socket.username) return;

    const messageData = {
      username: socket.username,
      message: msg,
      timestamp: new Date().toISOString(),
    };

    try {
      // Insert message into database
      await global.db.execute(
        "INSERT INTO messages (username, message, timestamp) VALUES (?, ?, ?)",
        [messageData.username, messageData.message, messageData.timestamp]
      );

      // Broadcast message to all users
      io.emit("message", messageData);
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      activeUsers.delete(socket.username);
      io.emit("message", {
        username: "System",
        message: `${socket.username} left the chat`,
        system: true,
      });
      console.log(`🔴 User disconnected: ${socket.username}`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
