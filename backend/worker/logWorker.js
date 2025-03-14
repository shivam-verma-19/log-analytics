import { parentPort } from "worker_threads";
import fs from "fs";
import readline from "readline";

parentPort.on("message", async (filePath) => {
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream });

    const logStats = { errors: 0, keywords: {}, ips: new Set() };

    for await (const line of rl) {
        if (line.includes("ERROR")) logStats.errors++;
    }

    parentPort.postMessage(logStats);
});
