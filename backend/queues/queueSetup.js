import { QueueScheduler } from "bullmq";
import client from "../config/redisConfig.js";

const scheduler = new QueueScheduler("log-processing-queue", { connection: client });

scheduler.on("failed", (jobId, error) => {
    console.error(`Job ${jobId} failed:`, error);
});

console.log("QueueScheduler initialized successfully!");

export default scheduler;
