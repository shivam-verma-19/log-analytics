import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import redisClient from "./config/redisConfig.js";
import rateLimit from "express-rate-limit";

const app = express();
const server = createServer(app);
const io = new Server(server);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later."
});

app.use("/api/", limiter);

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(4000, () => console.log("Server running on port 4000"));

// Apply rate-limiting to all API routes
