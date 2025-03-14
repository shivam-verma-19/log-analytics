import supabase from "../../../backend/config/supabaseClient.js";

export default async function handler(req, res) {
    const { data, error } = await supabase.from("log_stats").select("*");
    if (error) return res.status(500).json({ error });

    res.json(data);
}
