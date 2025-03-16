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
});

client.on("connect", () => {
    console.log("✅ Redis connected successfully!");
});

export default client;
