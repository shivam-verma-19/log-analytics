// frontend/src/lib/logQueue.js
import { Queue, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL);

export const logQueue = new Queue('log-processing-queue', { connection });
export const scheduler = new QueueScheduler('log-processing-queue', { connection });
