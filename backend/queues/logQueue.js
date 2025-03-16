import { Queue } from 'bullmq';
import redis from '../config/redisConfig.js';

export const logQueue = new Queue('log-processing-queue', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3, // Retry failed jobs 3 times
        priority: 1, // Lower number = higher priority
    },
});
