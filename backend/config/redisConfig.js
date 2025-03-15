import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
    console.error("❌ REDIS_URL is missing in environment variables.");
    process.exit(1);
}

console.log("🟢 Connecting to Redis:", process.env.REDIS_URL.trim());

const client = createClient({
    url: process.env.REDIS_URL.trim(),
    socket: {
        tls: true,
        rejectUnauthorized: false, // For self-signed certificates
        keepAlive: 5000,
    },
});

// Handle errors and auto-reconnect
let reconnecting = false;

client.on("error", async (err) => {
    console.error("❌ Redis connection error:", err);

    if (!reconnecting) {
        reconnecting = true;
        console.log("🔄 Attempting to reconnect to Redis...");

        setTimeout(async () => {
            try {
                await client.connect();
                console.log("✅ Reconnected to Redis!");
            } catch (error) {
                console.error("❌ Redis reconnection failed:", error);
            } finally {
                reconnecting = false;
            }
        }, 5000); // Retry every 5 seconds
    }
});

client.on("connect", () => {
    console.log("✅ Redis connected successfully!");
    reconnecting = false; // Reset flag on successful connection
});

client.on("end", () => {
    console.warn("⚠️ Redis connection closed.");
});

// Export both client and connection function
const connectRedis = async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
    }
};

export { client, connectRedis };
