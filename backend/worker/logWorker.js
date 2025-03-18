// logWorker.js - Processes log jobs and stores stats in Supabase
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import fs from 'fs';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const redisConnection = new Redis();

const worker = new Worker('log-processing-queue', async job => {
    const { filePath, fileId } = job.data;  // Include fileId for tracking
    const stats = { errors: 0, keywords: {}, uniqueIps: new Set() };
    const keywordList = process.env.KEYWORDS?.split(',') || [];

    try {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

        for await (const line of rl) {
            if (line.includes('ERROR')) stats.errors++;
            keywordList.forEach(keyword => { if (line.includes(keyword)) stats.keywords[keyword] = (stats.keywords[keyword] || 0) + 1; });

            const ipMatch = line.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
            if (ipMatch) stats.uniqueIps.add(ipMatch[0]);
        }

        const { error } = await supabase.from('log_stats').insert({
            job_id: job.id,
            user_id: job.data.userId,
            error_count: stats.errors,
            keyword_count: stats.keywords,
            unique_ips: Array.from(stats.uniqueIps)
        });


        if (error) throw new Error(`Supabase insert failed: ${error.message}`);

        console.log(`Job ${job.id} completed. Stats stored in Supabase.`);

    } catch (err) {
        console.error(`Error processing job ${job.id}: ${err.message}`);
        throw err; // Ensures BullMQ retries the job
    }
}, { connection: redisConnection, concurrency: 4 });

console.log("Log Worker is running...");
