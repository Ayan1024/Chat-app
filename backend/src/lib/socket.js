// backend/src/lib/socket.js
import { Server } from "socket.io";

const userSocketMap = {};

let io;

export function getReciverSocketId(userId) {
  return userSocketMap[userId];
}

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
}

export { io };
