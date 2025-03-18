import { Worker as ThreadWorker } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processLargeFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const worker = new ThreadWorker(new URL("./logWorker.js", import.meta.url));

        worker.on("message", (logStats) => resolve(logStats));
        worker.on("error", reject);
        worker.postMessage(filePath);
        worker.on("exit", (code) => {
            if (code !== 0) {
                console.error(`Worker exited with code ${code}`);
            }
        });
    });
};
