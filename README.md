Here's the **README.md** file with **environment (.env) configuration** and **SQL setup instructions** included:  

---![Screenshot (394)](https://github.com/user-attachments/assets/fa427812-fcf8-48b5-9983-a7fe12dc2c53)

![Screenshot (396)](https://github.com/user-attachments/assets/6385d4d3-e32a-40e7-af3c-53551cdc8247)

```md
# Real-Time Chat Application

A real-time chat application built using **Node.js**, **Express.js**, **Socket.io**, **React.js**, and **MySQL** for chat storage.

## Features
- **Real-time messaging** with WebSockets (Socket.io)
- **Global chatroom** where all users can send and receive messages
- **User join and leave notifications**
- **Chat history stored in MySQL**
- **Responsive UI built with React.js and Tailwind CSS**

---

## 📌 Setup Instructions

### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version)
- **MySQL** (Installed & Running)
- **Git** (For cloning the repository)

---

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/Real_Time_Chat-Application.git
cd Real_Time_Chat-Application
```

---

### 3️⃣ Backend Setup (Node.js + Express)
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `backend` directory:
   ```
   PORT=5000

   # MySQL Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=chat_app
   OPENAI_API_KEY=
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

---

### 4️⃣ Database Configuration (MySQL)
1. Open MySQL and create a database:
   ```sql
   CREATE DATABASE chat_app;
   ```
2. Use the database:
   ```sql
   USE chat_app;
   ```
3. Create a `messages` table:
   ```sql
   CREATE TABLE messages (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL,
       message TEXT NOT NULL,
       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

---

### 5️⃣ Frontend Setup (React + Tailwind CSS)
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm start
   ```

---

## 🚀 Running the Application
1. Start the **backend**:  
   ```sh
   cd backend
   npm start
   ```
2. Start the **frontend**:  
   ```sh
   cd frontend
   node server.ts
   ```
3. Open the application in your browser:  
   ```
   http://localhost:3000
   ```

---

## 🛠 Technologies Used
- **Backend:** Node.js, Express.js, Socket.io, MySQL
- **Frontend:** React.js, Tailwind CSS
- **Database:** MySQL


---

## 📞 Contact
For any questions, reach out to **sy966051@gmail.com**.

```

This includes **SQL configuration**, **.env setup**, and **detailed installation steps**. Let me know if you need further modifications! 🚀
