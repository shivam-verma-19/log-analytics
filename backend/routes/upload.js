import express from "express";
import multer from "multer";
import { logQueue } from "../queues/logQueue.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-logs", authenticateUser, upload.single("file"), async (req, res) => {
    try {
        const fileId = `${Date.now()}-${req.file.filename}`;

        const job = await logQueue.add("processLog", {
            filePath: req.file.path,
            fileId,
            userId: req.user.id
        });

        res.json({ success: true, jobId: job.id });

    } catch (error) {
        res.status(500).json({ error: "Failed to upload log file" });
    }
});

export default router;
