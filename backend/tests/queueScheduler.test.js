import { QueueScheduler } from "bullmq";
import client from './config/redisConfig.js';

const scheduler = new QueueScheduler('log-processing-queue', { connection: client });
console.log("QueueScheduler for 'log-processing-queue' initialized successfully!");

// Export it if needed elsewhere in the app
export default scheduler;
