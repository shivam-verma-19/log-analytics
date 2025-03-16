import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
    console.error("❌ REDIS_URL is missing in environment variables.");
    process.exit(1);
}

console.log("🟢 Connecting to Redis:", process.env.REDIS_URL);

// Create Redis client (auto-connects)
const client = new IORedis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false }, // Required for Upstash
});

// Event Listeners (No Manual Connection)
client.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

client.on("connect", () => {
    console.log("✅ Redis connected successfully!");
});

export default client;  // No need to export `connectRedis`
