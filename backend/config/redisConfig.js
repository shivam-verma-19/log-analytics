import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
    console.error("❌ REDIS_URL is missing in environment variables.");
    process.exit(1);
}

console.log("🟢 Connecting to Redis:", process.env.REDIS_URL); // Debug log

const client = createClient({
    url: process.env.REDIS_URL.trim(),
    socket: {
        rejectUnauthorized: false, // Required for Upstash
        keepAlive: 5000, // Ensures connection stays open
        reconnectStrategy: (retries) => Math.min(retries * 100, 3000), // Exponential backoff
    },
});

// Test Redis connection
client.ping()
    .then((response) => {
        if (response === "PONG") {
            console.log("✅ Redis PING successful! Connection is healthy.");
        } else {
            console.error("❌ Redis PING failed. Unexpected response:", response);
        }
    })
    .catch((err) => {
        console.error("❌ Redis PING error:", err);
        process.exit(1); // Exit the process if the connection test fails
    });

// Event Listeners
client.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
    setTimeout(async () => {
        try {
            console.log("🔄 Attempting to reconnect to Redis...");
            await client.connect();
            console.log("✅ Reconnected to Redis!");
        } catch (error) {
            console.error("❌ Redis reconnection failed:", error);
        }
    }, 5000); // Retry every 5 seconds
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log("✅ Redis connected successfully!");
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
    }
};

export default client;
