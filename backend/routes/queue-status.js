import express from "express";
import { Queue } from "bullmq"; // Import Queue
import client from "../config/redisConfig.js"; // Redis connection
import scheduler from "../queues/queueSetup.js"; // Import QueueScheduler (already set up)

const router = express.Router();

// Initialize Queue (specific to queue-status.js)
const queue = new Queue("log-processing-queue", { connection: client });

// API route to check queue status
router.get("/queue-status", async (req, res) => {
    try {
        const jobCounts = await queue.getJobCounts(); // Fetch job counts using the Queue instance
        res.json({ success: true, jobCounts });
    } catch (error) {
        console.error("❌ Failed to get queue status:", error);
        res.status(500).json({ error: "Failed to get queue status" });
    }
});

export default router;
