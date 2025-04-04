const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const response = await fetch(`${API_URL}/api/upload-logs`, {
                method: "POST",
                body: req.body,
                headers: {
                    "Content-Type": req.headers["content-type"]
                }
            });

            const data = await response.json();
            return res.status(response.status).json(data);
        } catch (error) {
            return res.status(500).json({ error: "Error uploading logs", details: error.message });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
