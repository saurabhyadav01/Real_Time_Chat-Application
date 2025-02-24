const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// OpenAI API Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = { db, openai };
