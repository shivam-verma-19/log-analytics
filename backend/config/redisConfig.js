import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_HOST || "redis://localhost:6379"
});

redisClient.connect().catch(console.error);

export default redisClient;
