export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;  // Ensure this is defined
            if (!backendUrl) {
                return res.status(500).json({ error: "Backend URL is not defined" });
            }

            const token = req.headers.authorization || "";  // Pass auth token if required
            const response = await fetch(`${backendUrl}/api/stats`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token, // Pass the token if needed
                },
            });

            if (!response.ok) {
                throw new Error(`Backend responded with ${response.status}`);
            }

            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            console.error("❌ API Fetch Error:", error.message);
            return res.status(500).json({ error: "Error fetching stats", details: error.message });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
