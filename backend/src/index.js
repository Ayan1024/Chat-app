// backend/src/index.js
import express from "express";
import dotenv from "dotenv";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
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

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");

  app.use(express.static(frontendPath));

  // Catch-all → send index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Health check (optional, for Render logs)
app.get("/health", (req, res) => {
  res.send("✅ Server is healthy");
});

// Connect DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
  if (process.env.NODE_ENV === "production") {
    console.log(`✅ Server running in production on port ${PORT}`);
  } else {
    console.log(`✅ Server running locally at http://localhost:${PORT}`);
  }
  initSocket(server);
});

});
