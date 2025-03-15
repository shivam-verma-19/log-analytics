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
        tls: true,
        rejectUnauthorized: false, // For self-signed certificates
    },
});

client.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log("✅ Redis connected successfully!");
    } catch (err) {
        console.error("❌ Redis connection failed:", err);
    }
};

// Export both client and connection function
export { client, connectRedis };
