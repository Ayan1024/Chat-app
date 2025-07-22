import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()
const app = express();

const PORT = process.env.PORT

app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});


app.use(express.json())
app.use(express.urlencoded({ extended: true })); // Optional: for parsing form data

app.use(cookieParser());

app.use(cors({
origin: "http://localhost:5173",
credentials: true,
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  });
});


