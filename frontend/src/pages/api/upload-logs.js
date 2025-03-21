import Cors from 'next-cors';
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "100mb", // Increase limit for large files
        },
    },
};

export default async function handler(req, res) {
    await Cors(req, res, {
        methods: ['POST', 'OPTIONS'],
        origin: '*',
        optionsSuccessStatus: 200
    });

    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        console.log("Received Log Data:", req.body);
        res.status(200).json({ message: "Logs uploaded successfully" });
    } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ error: "Error uploading logs", details: error.message });
    }
}