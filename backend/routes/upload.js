import express from "express";
import multer from "multer";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { logQueue } from "../queues/logQueue.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authenticateUser, upload.single("file"), async (req, res) => {
    try {
        const job = await logQueue.add("processLog", { file: req.file.path, userId: req.user.id });
        res.json({ success: true, jobId: job.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to upload log file" });
    }
});

export default router;
