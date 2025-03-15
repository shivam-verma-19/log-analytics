import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL, // Use the Upstash URL with TLS and password
    socket: {
        tls: true, // Enable TLS
        rejectUnauthorized: false, // Ignore self-signed certificate issues
    },
});

client.on("error", (err) => console.error("Redis connection error:", err));

await client.connect();

