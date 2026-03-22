import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCache, setCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

// Public stats for social proof
export async function GET() {
  // Cache for 5 minutes
  const cached = await getCache<Record<string, unknown>>('public-stats');
  if (cached) return NextResponse.json(cached);

  const [totalAnalyses, avgScoreResult, totalUsers, totalCrawls] = await Promise.all([
    prisma.analysis.count(),
    prisma.analysis.aggregate({ _avg: { score: true } }),
    prisma.user.count(),
    prisma.crawlJob.count(),
  ]);

  // Today's analyses
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = await prisma.analysis.count({ where: { createdAt: { gte: today } } });

  const stats = {
    totalAnalyses,
    avgScore: Math.round(avgScoreResult._avg.score || 58),
    totalUsers,
    totalCrawls,
    todayAnalyses: todayCount,
  };

  await setCache('public-stats', stats, 300); // 5 min cache

  return NextResponse.json(stats);
}
