import { Worker as ThreadWorker } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { queue } from "../queues/logQueue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processLargeFile = async (filePath, fileId) => {
    const stats = await fs.statSync(filePath);
    const fileSize = stats.size;

    const priority = fileSize < 10 * 1024 * 1024 ? 1 : 5;

    try {
        const job = await queue.add(
            "log-processing-queue",
            { filePath, fileId },
            {
                priority,
                attempts: 3,
                removeOnComplete: true,
                removeOnFail: false,
            }
        );

        if (!job) throw new Error("Failed to enqueue job!");

        console.log(`📨 Job ${job.id} added successfully`);
        return job.id;
    } catch (error) {
        console.error("❌ Error adding job to queue:", error.message);
        return null; // Handle undefined Job ID
    }
};

