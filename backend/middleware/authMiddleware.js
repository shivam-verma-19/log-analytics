// middleware/authMiddleware.js
import supabase from "../config/supabaseClient.js";

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        console.error("❌ Auth error:", error?.message);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next();
};
