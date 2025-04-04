import queue from "../../lib/logQueue"; //frontend\src\lib\logQueue.js


export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const jobCounts = await queue.getJobCounts();
        console.log("✅ Queue Status:", jobCounts);
        return res.status(200).json(jobCounts);
    } catch (error) {
        console.error("Error fetching queue status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
