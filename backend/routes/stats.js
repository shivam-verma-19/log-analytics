import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

// API route to fetch aggregated log stats
router.get("/stats", authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase.from("log_stats").select("*");
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

export default router;
