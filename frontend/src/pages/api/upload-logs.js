export const config = {
    api: {
        bodyParser: {
            sizeLimit: "100mb", // Increase limit for large files
        },
    },
};

export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
        // Handle CORS preflight requests
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.status(200).end();
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        console.log("Received request:", req.method);

        // Set CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (!req.body) {
            return res.status(400).json({ error: "No log data provided" });
        }

        console.log("Received Log Data:", req.body);

        res.status(200).json({ message: "Logs uploaded successfully" });
    } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ error: "Error uploading logs", details: error.message });
    }
}
