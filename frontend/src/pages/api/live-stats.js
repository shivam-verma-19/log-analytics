import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        console.log("🚀 Setting up WebSocket Server...");
        const io = new Server(res.socket.server);

        io.on("connection", (socket) => {
            console.log("✅ WebSocket Connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("❌ WebSocket Disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
}
