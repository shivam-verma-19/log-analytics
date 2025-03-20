import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

router.get("/stats", authenticateUser, async (req, res) => {
    try {
        console.log("✅ Fetching log stats for user:", req.user); // Log full user object

        if (!req.user || !req.user.id) {
            console.error("❌ Missing user ID in request.");
            return res.status(401).json({ error: "Unauthorized: Missing user ID" });
        }

        const { data, error } = await supabase
            .from("log_stats")
            .select("*")
            .eq("user_id", req.user.id);

        if (error) {
            console.error("❌ Supabase Query Error:", error.message);
            throw error;
        }

        console.log("📊 Retrieved Data:", data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching stats:", error.message);
        res.status(500).json({ error: "Error fetching stats", details: error.message });
    }
});

export default router;
