import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Change this if your backend URL is different

export default socket;
