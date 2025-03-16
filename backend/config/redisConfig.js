import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
    console.error("❌ REDIS_URL is missing in environment variables.");
    process.exit(1);
}

console.log("🟢 Connecting to Redis:", process.env.REDIS_URL); // Debug log

const client = new IORedis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false }, // Required for Upstash
});

// Periodic PING to prevent disconnections
setInterval(async () => {
    try {
        await client.ping();
        console.log("🔄 Redis PING successful");
    } catch (err) {
        console.error("⚠️ Redis PING failed:", err);
    }
}, 10000); // Every 10 seconds

client.on("error", async (err) => {
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

export { client, connectRedis };
