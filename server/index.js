import express from "express";
import AuthRoute from "./routes/auth.js";
import TodoRoute from "./routes/todo.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();


const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", AuthRoute);
app.use("/api/todos", TodoRoute);

app.get("/", (req, res) => {
    res.send("To Do List Challenge");
});

app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// app.use((err, req, res, next) => {
//     console.error(`[Error]: ${err.message}`); // Log error
//     const statusCode = err.statusCode || 500;
//     const message = err.message || "Internal server error";
//     res.status(statusCode).json({ error: message });
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
