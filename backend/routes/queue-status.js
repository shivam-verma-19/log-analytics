import express from "express";
import { logQueue } from "../queues/logQueue.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
    try {
        const jobCounts = await logQueue.getJobCounts();
        res.json(jobCounts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch queue status" });
    }
});

export default router;
