import { prisma } from '../prisma';
import { analyzeURL } from '../seo-analyzer';
import { deepCrawl } from './deep-crawl';
import { logger } from '../logger';

// Orchestrates a deep crawl: walk the link graph for structural insights, then
// score a representative sample of pages. Designed to run as a fire-and-forget
// background task on the long-lived server (the BullMQ worker isn't deployed).
export async function runCrawlJob(crawlJobId: string, startUrl: string, userId: string): Promise<void> {
  try {
    logger.info('crawl.deep.start', { crawlJobId, startUrl });
    const result = await deepCrawl(startUrl, { maxUrls: 250, maxDepth: 6, concurrency: 3 });

    await prisma.crawlJob.update({
      where: { id: crawlJobId },
      data: { insights: JSON.stringify(result), totalUrls: result.pagesScanned },
    });

    // Score a small, varied sample so the crawl still surfaces on-page scores
    // without re-analyzing every page (which would hammer a small box).
    const sample = new Set<string>([startUrl]);
    for (const p of result.topLinkedPages.slice(0, 4)) sample.add(p.url);
    for (const p of result.deepPages.slice(0, 3)) sample.add(p.url);
    const sampleUrls = Array.from(sample).slice(0, 8);

    let totalScore = 0, done = 0;
    for (const url of sampleUrls) {
      try {
        const a = await analyzeURL(url);
        await prisma.analysis.create({
          data: { userId, crawlJobId, url, score: a.score, data: JSON.stringify(a), issues: JSON.stringify(a.issues), public: false },
        });
        totalScore += a.score; done++;
        await prisma.crawlJob.update({ where: { id: crawlJobId }, data: { completedUrls: done, avgScore: Math.round(totalScore / done) } });
      } catch (e) { /* skip failed sample page */ }
    }

    await prisma.crawlJob.update({
      where: { id: crawlJobId },
      data: { status: 'completed', completedUrls: done, avgScore: done ? Math.round(totalScore / done) : null },
    });
    logger.info('crawl.deep.done', { crawlJobId, pagesScanned: result.pagesScanned, orphans: result.orphanPages.length, broken: result.brokenInternalLinks.length });
  } catch (err) {
    logger.error('crawl.deep.failed', { crawlJobId, error: (err as Error)?.message });
    await prisma.crawlJob.update({ where: { id: crawlJobId }, data: { status: 'failed' } }).catch(() => {});
  }
}
