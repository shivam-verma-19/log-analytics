import express from "express";
import { Queue, QueueScheduler } from "bullmq";
import { client } from "../config/redisConfig.js";

const router = express.Router();
const queue = new Queue("log-processing-queue", { connection: client });
const queueScheduler = new QueueScheduler("log-processing-queue", { connection: client });

// API route to check queue status
router.get("/queue-status", async (req, res) => {
    try {
        const jobCounts = await queue.getJobCounts();
        res.json({ success: true, jobCounts });
    } catch (error) {
        res.status(500).json({ error: "Failed to get queue status" });
    }
});

export default router;
