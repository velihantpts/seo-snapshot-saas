import { createCrawlWorker } from '../queue';
import { processCrawlJob } from './crawl-worker';
import { logger } from '../logger';

const worker = createCrawlWorker(processCrawlJob);

worker.on('completed', (job) => {
  logger.info('worker.job.completed', { jobId: job.id, name: job.name });
});

worker.on('failed', (job, err) => {
  logger.error('worker.job.failed', { jobId: job?.id, name: job?.name, error: err.message });
});

worker.on('ready', () => {
  logger.info('worker.ready', { queue: 'crawl' });
});

process.on('SIGTERM', async () => {
  logger.info('worker.shutdown', { reason: 'SIGTERM' });
  await worker.close();
  process.exit(0);
});

console.log('Crawl worker started, waiting for jobs...');
