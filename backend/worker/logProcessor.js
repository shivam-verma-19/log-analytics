import { Worker } from "bullmq";
import { redisConfig } from "../config/redisConfig.js";
import { supabase } from "../config/supabaseClient.js";
import fs from "fs";
import readline from "readline";
import { Worker as ThreadWorker, isMainThread, parentPort } from "worker_threads";
import pLimit from "p-limit";

const CONCURRENCY_LIMIT = 4; // Adjust based on available CPU
const limit = pLimit(CONCURRENCY_LIMIT);

// Function to process each log file
const processLogFile = async (filePath) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: stream });

        const logStats = { errors: 0, keywords: {}, ips: new Set() };
        const keywordList = process.env.KEYWORDS?.split(",") || [];

        stream.on("error", (err) => {
            console.error("Stream error:", err);
            reject(err);
        });

        rl.on("line", (line) => {
            try {
                const match = line.match(/^\[(.*?)\]\s(.*?)\s(.*)$/);
                if (match) {
                    const [_, timestamp, level, message] = match;

                    // Count errors
                    if (level === "ERROR") logStats.errors++;

                    // Count keywords
                    keywordList.forEach((keyword) => {
                        if (message.includes(keyword)) {
                            logStats.keywords[keyword] = (logStats.keywords[keyword] || 0) + 1;
                        }
                    });

                    // Extract IPs from JSON payload
                    const jsonMatch = message.match(/\{.*\}/);
                    if (jsonMatch) {
                        try {
                            const jsonData = JSON.parse(jsonMatch[0]);
                            if (jsonData.ip) logStats.ips.add(jsonData.ip);
                        } catch (err) {
                            console.error("JSON Parsing Error:", err);
                        }
                    }
                }
            } catch (error) {
                console.error("Error processing line:", error);
            }
        });

        rl.on("close", async () => {
            try {
                // Store results in Supabase
                await supabase.from("log_stats").insert({
                    errors: logStats.errors,
                    keywords: logStats.keywords,
                    ips: Array.from(logStats.ips),
                });

                resolve();
            } catch (err) {
                console.error("Database Insert Error:", err);
                reject(err);
            }
        });
    });
};

// Worker thread for processing large files
const processLargeFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const worker = new ThreadWorker(
            `
            const { parentPort } = require("worker_threads");
            const fs = require("fs");
            const readline = require("readline");

            parentPort.on("message", async (filePath) => {
                const stream = fs.createReadStream(filePath);
                const rl = readline.createInterface({ input: stream });

                const logStats = { errors: 0, keywords: {}, ips: new Set() };

                for await (const line of rl) {
                    if (line.includes("ERROR")) logStats.errors++;
                }

                parentPort.postMessage(logStats);
            });

            `,
            { eval: true }
        );

        worker.on("message", (logStats) => resolve(logStats));
        worker.on("error", reject);
        worker.postMessage(filePath);
    });
};

// BullMQ Worker with Error Handling & Retries
export const logWorker = new Worker(
    "log-processing-queue",
    async (job) => {
        try {
            const { filePath } = job.data;

            // Optimize large files using Worker Threads
            const fileSize = fs.statSync(filePath).size;
            if (fileSize > 500 * 1024 * 1024) {
                console.log("Large file detected, using Worker Thread:", filePath);
                await processLargeFile(filePath);
            } else {
                await limit(() => processLogFile(filePath));
            }

            console.log(`Job ${job.id} completed successfully.`);
        } catch (error) {
            console.error(`Job ${job.id} failed:`, error);
            throw error; // This allows BullMQ to retry failed jobs
        }
    },
    {
        connection: redisConfig,
        concurrency: CONCURRENCY_LIMIT,
        lockDuration: 60000, // Avoid duplicate processing
        attempts: 3, // Retry failed jobs up to 3 times
        backoff: { type: "exponential", delay: 1000 }, // Exponential backoff for retries
    }
);
