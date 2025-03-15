import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import redisClient from "./config/redisConfig.js";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
const server = createServer(app);

// Allow frontend access via CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Rate limiter to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: "Too many requests, please try again later."
});

app.use("/api/", limiter); // Apply rate-limiting to API routes

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// WebSocket Connection Handling
io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Ensure Redis is connected before starting the server
redisClient.on("connect", () => {
    console.log("Connected to Redis");

    const PORT = process.env.PORT || 4000;
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
});

// Ensure Redis is connected (doesn't block the server start)
redisClient.on("connect", () => {
    console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});
