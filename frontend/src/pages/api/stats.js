import supabase from "../config/supabaseClient";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("Auth Error:", authError);
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { data, error } = await supabase
            .from("log_stats")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            console.warn("⚠️ No logs found in log_stats table.");
            return res.status(404).json({ message: "No logs found" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching stats:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
