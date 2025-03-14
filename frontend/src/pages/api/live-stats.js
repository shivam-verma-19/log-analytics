import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("Initializing WebSocket server...");
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("Client connected");

            socket.on("disconnect", () => {
                console.log("Client disconnected");
            });
        });
    }

    res.end();
}
