import { Queue } from 'bullmq';
import { client } from '../config/redisConfig.js';

export const logQueue = new Queue('log-processing-queue', {
    connection: client,
    defaultJobOptions: {
        attempts: 3, // Retry failed jobs 3 times
        priority: 1, // Lower number = higher priority
    },
});
logQueue.on("failed", async (job, err) => {
    console.error(`Job ${job.id} failed:`, err);

    if (job.attemptsMade < job.opts.attempts) {
        console.log(`Retrying job ${job.id} (Attempt ${job.attemptsMade + 1})`);
        await job.retry();
    } else {
        console.error(`Job ${job.id} permanently failed after max attempts.`);
    }
});
