import express from "express";
import * as BullMQ from "bullmq";  // ✅ Correct way to import a CommonJS module in ESM
import client from "../config/redisConfig.js";

const { Queue, QueueScheduler } = BullMQ;

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
