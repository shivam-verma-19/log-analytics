import { Worker } from "bullmq"; // ✅ Import Worker from BullMQ
import fs from "fs";
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

            const stats = { errors: 0, keywords: {}, uniqueIps: new Set() };
            const keywordList = process.env.KEYWORDS?.split(",") || [];

            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

            for await (const line of rl) {
                if (line.includes("ERROR")) stats.errors++;
                keywordList.forEach((keyword) => {
                    if (line.includes(keyword)) stats.keywords[keyword] = (stats.keywords[keyword] || 0) + 1;
                });
                const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
                if (ipMatch) stats.uniqueIps.add(ipMatch[0]);
            }

            console.log(`📤 Storing stats for Job ID: ${job.id}`);

            const { error } = await supabase.from("log_stats").insert({
                job_id: job.id,
                user_id: userId, // ✅ Store user_id
                error_count: stats.errors,
                keyword_count: stats.keywords,
                unique_ips: Array.from(stats.uniqueIps),
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
