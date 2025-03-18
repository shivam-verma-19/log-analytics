import { Worker as ThreadWorker } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { queue } from "../queues/logQueue.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processLargeFile = async (filePath, fileId) => {
    const stats = await fs.statSync(filePath);  // 🔥 Get file size
    const fileSize = stats.size; // in bytes

    const priority = fileSize < 10 * 1024 * 1024 ? 1 : 5; // 🔥 Smaller files get higher priority

    const job = await queue.add("log-processing", { filePath, fileId }, {
        priority,
        attempts: 3,
        removeOnComplete: true, // 🔥 Clean up jobs after completion
        removeOnFail: false, // 🔥 Keep failed jobs for debugging
    });

    return job.id;
};
