import { Worker } from "bullmq"; // ✅ Import Worker from BullMQ
import fs from "fs";
import path from "path";
import readline from "readline";
import { supabase } from "../config/supabaseClient.js"; // ✅ Import supabase instance
import { redisConnection } from "../config/redisConfig.js"; // ✅ Import Redis connection

const worker = new Worker(
    "log-processing-queue",
    async (job) => {
        try {
            console.log(`📥 Processing job: ${job.id}, File Path: ${job.data.filePath}`);

            const { filePath, userId } = job.data;
            if (!filePath || !userId) {
                throw new Error("Missing filePath or userId in job data.");
            }

            const stats = {
                errors: 0,
                keywords: {},
                uniqueIps: new Set(),
                entries: []
            };
            const keywordList = process.env.KEYWORDS?.split(",") || [];
            const logPattern = /^\[(?<timestamp>.+?)\] (?<level>\w+) (?<message>.+?)(?:\s(?<json>\{.+?\}))?$/;

            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

            for await (const line of rl) {
                const match = line.match(logPattern);
                if (!match) continue;

                const { timestamp, level, message, json } = match.groups;

                // Validate timestamp format
                let validTimestamp;
                try {
                    validTimestamp = new Date(timestamp).toISOString();
                } catch (err) {
                    console.warn(`Invalid timestamp format: ${timestamp}`);
                    validTimestamp = null;
                }

                const entry = {
                    timestamp: validTimestamp,
                    level,
                    message
                };

                if (level === "ERROR") stats.errors++;

                // Parse JSON payload if present
                if (json) {
                    try {
                        entry.payload = JSON.parse(json);
                    } catch (err) {
                        console.warn(`Failed to parse JSON payload: ${json}`);
                    }
                }

                // Track keywords
                keywordList.forEach((keyword) => {
                    if (message.includes(keyword)) {
                        stats.keywords[keyword] = (stats.keywords[keyword] || 0) + 1;
                    }
                });

                // Track IPs from message and JSON payload
                const ipMatch = message.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
                if (ipMatch) stats.uniqueIps.add(ipMatch[0]);
                if (entry.payload?.ip) stats.uniqueIps.add(entry.payload.ip);

                stats.entries.push(entry);
            }

            console.log(`📤 Storing stats for Job ID: ${job.id}`);

            const { error } = await supabase.from("log_stats").insert({
                job_id: job.id,
                user_id: userId,
                file_name: path.basename(filePath),
                error_count: stats.errors,
                keyword_count: stats.keywords,
                unique_ips: Array.from(stats.uniqueIps),
                log_entries: stats.entries
            });

            if (error) {
                console.error("❌ Supabase Insert Error:", error.message);
                throw error;
            }

            console.log(`📥 Processing job: ${job.id}, File Path: ${job.data.filePath}`);
            if (!job.id) {
                console.error("❌ Job ID is undefined! Skipping...");
                return;
            }
        } catch (err) {
            console.error(`❌ Error processing job ${job.id}:`, err.message);
        }

    },
    { connection: redisConnection, concurrency: 4 }
);

export { worker }; // ✅ Ensure worker is exported if needed elsewhere
