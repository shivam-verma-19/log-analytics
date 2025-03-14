import { Worker } from 'bullmq';
import { redisConfig } from '../config/redisConfig.js';
import { supabase } from '../config/supabaseClient.js';
import fs from 'fs';
import readline from 'readline';

// Function to process each log file
const processLogFile = async (filePath) => {
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: stream });

    const logStats = { errors: 0, keywords: {}, ips: new Set() };
    const keywordList = process.env.KEYWORDS?.split(',') || [];

    for await (const line of rl) {
        const match = line.match(/^\[(.*?)\]\s(.*?)\s(.*)$/);
        if (match) {
            const [_, timestamp, level, message] = match;

            // Count errors
            if (level === 'ERROR') logStats.errors++;

            // Count keywords
            keywordList.forEach((keyword) => {
                if (message.includes(keyword)) logStats.keywords[keyword] = (logStats.keywords[keyword] || 0) + 1;
            });

            // Extract IPs from JSON payload
            const jsonMatch = message.match(/\{.*\}/);
            if (jsonMatch) {
                try {
                    const jsonData = JSON.parse(jsonMatch[0]);
                    if (jsonData.ip) logStats.ips.add(jsonData.ip);
                } catch (err) { }
            }
        }
    }

    // Store results in Supabase
    await supabase.from('log_stats').insert({
        errors: logStats.errors,
        keywords: logStats.keywords,
        ips: Array.from(logStats.ips),
    });
};

// BullMQ Worker
export const logWorker = new Worker(
    'log-processing-queue',
    async (job) => {
        await processLogFile(job.data.filePath);
    },
    { connection: redisConfig, concurrency: 4 }
);
