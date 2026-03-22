import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = session.user.id;

  // Last 30 days of analyses grouped by day
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const analyses = await prisma.analysis.findMany({
    where: { userId, createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' },
    select: { score: true, createdAt: true, url: true },
  });

  // Group by day
  const dailyMap = new Map<string, { scores: number[]; count: number }>();
  for (const a of analyses) {
    const day = a.createdAt.toISOString().split('T')[0];
    const entry = dailyMap.get(day) || { scores: [], count: 0 };
    entry.scores.push(a.score);
    entry.count++;
    dailyMap.set(day, entry);
  }

  const daily = Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    count: data.count,
    minScore: Math.min(...data.scores),
    maxScore: Math.max(...data.scores),
  }));

  // Top 5 most analyzed URLs
  const urlCounts = new Map<string, number>();
  for (const a of analyses) {
    urlCounts.set(a.url, (urlCounts.get(a.url) || 0) + 1);
  }
  const topUrls = Array.from(urlCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([url, count]) => ({ url, count }));

  return NextResponse.json({ daily, topUrls, totalAnalyses: analyses.length });
}
