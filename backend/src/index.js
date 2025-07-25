import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";


dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();
// ✅ Always put cors before any route/middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Handle large base64 payloads if needed
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Cookies (after cors)
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))


  app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "dist" , "index.html"))
    
  })
}

// ✅ Health check route (can be at top or bottom)
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// ✅ Start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  });
});
