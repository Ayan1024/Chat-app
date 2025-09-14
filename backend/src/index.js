// backend/src/index.js
import express from "express";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app); // Express + HTTP server for Socket.IO
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Static frontend for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Health check route
// app.get("/", (req, res) => {
//   res.send("✅ Server is running...");
// });

// Connect DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);

    
    initSocket(server); // 🔌 Start Socket.IO on the same server
  });
});
