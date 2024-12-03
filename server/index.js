import express from "express";
import AuthRoute from "./routes/auth.js";
import TodoRoute from "./routes/todo.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

// CORS Configuration
const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // รองรับ Header ที่จำเป็น
};

// Middlewares
app.use(cors(corsOption));
app.use(express.json()); // ใช้ express.json() แทน bodyParser.json()
app.use(cookieParser());

// Routes
app.use("/api/user", AuthRoute);
app.use("/api/todos", TodoRoute);

app.get("/", (req, res) => {
    res.send("To Do List Challenge");
});

// Handle 404 - Not Found
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.message}`); // Log error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({ error: message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
