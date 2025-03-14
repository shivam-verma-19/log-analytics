import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
    try {
        // Fetch and return stats
        res.json({ success: true, message: "Stats data fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

export default router;
