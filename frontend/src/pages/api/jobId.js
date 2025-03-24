import supabase from "../config/supabaseClient";

export default async function handler(req, res) {
    const { jobId } = req.query;

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!jobId) {
        return res.status(400).json({ error: "Job ID is required" });
    }

    const { data, error } = await supabase
        .from("log_stats")
        .select("*")
        .eq("job_id", jobId);

    if (error) {
        return res.status(500).json({ error: "Failed to fetch stats" });
    }

    res.status(200).json(data);
}
