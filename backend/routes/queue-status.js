import express from "express";
import * as BullMQ from "bullmq";
import client from "../config/redisConfig.js";

const { Queue } = BullMQ; // ✅ Only import Queue, NOT QueueScheduler

const router = express.Router();

// Initialize Queue
const queue = new Queue("log-processing-queue", { connection: client });

// API route to check queue status
router.get("/queue-status", async (req, res) => {
    try {
        const jobCounts = await queue.getJobCounts();
        res.json({ success: true, jobCounts });
    } catch (error) {
        console.error("❌ Failed to get queue status:", error);
        res.status(500).json({ error: "Failed to get queue status" });
    }
});

export default router;
