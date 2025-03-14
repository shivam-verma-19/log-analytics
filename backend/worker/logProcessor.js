import { Worker as ThreadWorker } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processLargeFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const worker = new ThreadWorker(join(__dirname, "logWorker.js"));

        worker.on("message", (logStats) => resolve(logStats));
        worker.on("error", reject);
        worker.postMessage(filePath);
    });
};
