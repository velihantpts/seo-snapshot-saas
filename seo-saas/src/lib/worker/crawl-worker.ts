import { Job } from 'bullmq';
import { prisma } from '../prisma';
import { analyzeURL } from '../seo-analyzer';
import { logger } from '../logger';

export interface CrawlJobData {
  crawlJobId: string;
  urls: string[];
  userId: string;
}

export async function processCrawlJob(job: Job<CrawlJobData>) {
  const { crawlJobId, urls, userId } = job.data;

  logger.info('crawl.worker.start', { crawlJobId, totalUrls: urls.length });

  let completedUrls = 0;
  let totalScore = 0;

  for (const url of urls) {
    try {
      const result = await analyzeURL(url);

      await prisma.analysis.create({
        data: {
          userId,
          crawlJobId,
          url,
          score: result.score,
          data: JSON.stringify(result),
          issues: JSON.stringify(result.issues),
          public: true,
        },
      });

      completedUrls++;
      totalScore += result.score;

      // Update crawl job progress
      await prisma.crawlJob.update({
        where: { id: crawlJobId },
        data: {
          completedUrls,
          avgScore: Math.round(totalScore / completedUrls),
        },
      });

      // Report progress to BullMQ
      await job.updateProgress(Math.round((completedUrls / urls.length) * 100));

      logger.info('crawl.worker.page', { crawlJobId, url, score: result.score, progress: `${completedUrls}/${urls.length}` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error('crawl.worker.page_failed', { crawlJobId, url, error: message });
    }
  }

  // Mark crawl job as completed
  await prisma.crawlJob.update({
    where: { id: crawlJobId },
    data: {
      status: completedUrls > 0 ? 'completed' : 'failed',
      completedUrls,
      avgScore: completedUrls > 0 ? Math.round(totalScore / completedUrls) : null,
    },
  });

  logger.info('crawl.worker.done', { crawlJobId, completedUrls, avgScore: completedUrls > 0 ? Math.round(totalScore / completedUrls) : 0 });
}
