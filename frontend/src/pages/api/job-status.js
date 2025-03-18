export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/queue-status`);
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: "Error fetching queue status", details: error.message });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
