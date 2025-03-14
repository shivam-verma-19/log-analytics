import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import redisClient from "./config/redisConfig.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(4000, () => console.log("Server running on port 4000"));
