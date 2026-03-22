import { prisma } from '../prisma';
import { analyzeURL } from '../seo-analyzer';
import { logger } from '../logger';

export async function runScheduledMonitors() {
  const now = new Date();

  const monitors = await prisma.scheduledMonitor.findMany({
    where: { active: true },
  });

  for (const monitor of monitors) {
    const shouldRun = shouldRunMonitor(monitor.frequency, monitor.lastRun);
    if (!shouldRun) continue;

    logger.info('monitor.check.start', { monitorId: monitor.id, url: monitor.url });

    try {
      const result = await analyzeURL(monitor.url);
      const previousScore = monitor.lastScore;

      await prisma.scheduledMonitor.update({
        where: { id: monitor.id },
        data: {
          lastRun: now,
          lastScore: result.score,
        },
      });

      // Save analysis for history tracking
      await prisma.analysis.create({
        data: {
          userId: monitor.userId,
          url: monitor.url,
          score: result.score,
          data: JSON.stringify(result),
          issues: JSON.stringify(result.issues),
          public: false,
        },
      });

      // Log score change
      if (previousScore !== null) {
        const diff = result.score - previousScore;
        if (diff !== 0) {
          logger.info('monitor.score.changed', {
            monitorId: monitor.id,
            url: monitor.url,
            previousScore,
            newScore: result.score,
            diff,
            direction: diff > 0 ? 'improved' : 'dropped',
          });
        }
      }

      logger.info('monitor.check.done', { monitorId: monitor.id, score: result.score });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error('monitor.check.failed', { monitorId: monitor.id, url: monitor.url, error: message });
    }
  }
}

function shouldRunMonitor(frequency: string, lastRun: Date | null): boolean {
  if (!lastRun) return true;

  const now = Date.now();
  const last = new Date(lastRun).getTime();
  const elapsed = now - last;

  switch (frequency) {
    case 'daily': return elapsed >= 23 * 60 * 60 * 1000; // 23h buffer
    case 'weekly': return elapsed >= 6.5 * 24 * 60 * 60 * 1000; // 6.5 days
    case 'monthly': return elapsed >= 29 * 24 * 60 * 60 * 1000; // 29 days
    default: return false;
  }
}
