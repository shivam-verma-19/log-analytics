import supabase from "../config/supabaseClient.js";

export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = data.user; // Attach user data to request
    next();
};
