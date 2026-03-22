import { Queue, Worker, Job } from 'bullmq';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

function parseRedisUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname || '127.0.0.1',
    port: parseInt(parsed.port || '6379'),
    password: parsed.password || undefined,
  };
}

const connection = parseRedisUrl(redisUrl);

// Queues
export const crawlQueue = new Queue('crawl', { connection });
export const analysisQueue = new Queue('analysis', { connection });

// Worker factories
export function createCrawlWorker(
  processor: (job: Job) => Promise<void>
): Worker {
  return new Worker('crawl', processor, {
    connection,
    concurrency: 5,
    limiter: { max: 10, duration: 60_000 },
  });
}

export function createAnalysisWorker(
  processor: (job: Job) => Promise<void>
): Worker {
  return new Worker('analysis', processor, {
    connection,
    concurrency: 3,
  });
}
