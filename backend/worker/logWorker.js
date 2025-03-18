import { parentPort } from "worker_threads";
import fs from "fs";
import readline from "readline";

parentPort.on("message", async (filePath) => {
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream });

    const logStats = { errors: 0, keywords: {}, ips: new Set() };

    for await (const line of rl) {
        if (line.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)) {
            logStats.ips.add(line.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)[0]);
        }
    }

    logStats.ips = Array.from(logStats.ips);
    parentPort.postMessage(logStats);
    logStats.ips.add(ip);
});
