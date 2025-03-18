import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

router.get("/stats", authenticateUser, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("log_stats")
            .select("*")
            .eq("user_id", req.user.id); // ✅ Ensure filtering per user

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

export default router;
