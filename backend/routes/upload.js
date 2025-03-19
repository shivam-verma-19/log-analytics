import { authenticateUser } from "../middleware/authMiddleware.js";
import express from "express";
import { logQueue } from "../queues/logQueue.js";
import multer from "multer";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload-logs", authenticateUser, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`📤 Received file upload: ${req.file.filename} by user ${req.user.id}`);

        const fileId = `${Date.now()}-${req.file.filename}`;
        const job = await logQueue.add("processLog", {
            file: req.file.path,
            fileId,
            userId: req.user.id, // ✅ Include userId
        });

        console.log(`✅ Job submitted successfully: ${job.id}`);
        res.json({ success: true, jobId: job.id });
    } catch (error) {
        console.error("❌ Upload error:", error.message);
        res.status(500).json({ error: "Failed to upload log file" });
    }
});

export default router;