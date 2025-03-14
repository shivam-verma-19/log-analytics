import { logQueue } from "../../../backend/queues/logQueue";

export default async function handler(req, res) {
    const { jobId } = req.query;
    const job = await logQueue.getJob(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const state = await job.getState();
    res.json({ status: state });
}
