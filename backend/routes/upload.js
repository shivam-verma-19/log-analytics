import express from "express";
import multer from "multer";
import { logQueue } from "../queues/logQueue.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// API route to upload logs and enqueue them for processing
router.post("/upload-logs", authenticateUser, upload.single("file"), async (req, res) => {
    try {
        const job = await logQueue.add("processLog", { file: req.file.path, userId: req.user.id });
        res.json({ success: true, jobId: job.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload log file" });
    }
});

export default router;
