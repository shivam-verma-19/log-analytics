import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import statsRoutes from "./routes/stats.js";
import queueStatusRoutes from "./routes/queue-status.js";
import { client, connectRedis } from "./config/redisConfig.js";

dotenv.config(); // Load environment variables

const app = express();
const server = createServer(app);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
};
app.use(errorHandler);

const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiter to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: "Too many requests, please try again later."
});
app.use("/api", uploadRoutes);
app.use("/api", statsRoutes);
app.use("/api", queueStatusRoutes);
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

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Start the server even if Redis is down
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

// Attempt to connect Redis asynchronously
connectRedis();
