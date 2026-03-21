import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET — crawl job status + results
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = session.user.id;
  const crawlJob = await prisma.crawlJob.findUnique({
    where: { id: params.id },
    include: {
      analyses: {
        select: { id: true, url: true, score: true, createdAt: true },
        orderBy: { score: 'asc' },
      },
    },
  });

  if (!crawlJob || crawlJob.userId !== userId) {
    return NextResponse.json({ error: 'Crawl job not found' }, { status: 404 });
  }

  // Aggregate site-level stats
  const analyses = crawlJob.analyses;
  const scores = analyses.map(a => a.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const minScore = scores.length > 0 ? Math.min(...scores) : null;
  const maxScore = scores.length > 0 ? Math.max(...scores) : null;

  // Cross-page issue aggregation
  let crossPageIssues: { problem: string; count: number; pages: string[] }[] = [];
  if (analyses.length > 0) {
    const issueMap = new Map<string, string[]>();
    for (const a of analyses) {
      // Load full analysis data to get issues
      const full = await prisma.analysis.findUnique({ where: { id: a.id }, select: { issues: true } });
      if (full) {
        const issues = JSON.parse(full.issues || '[]');
        for (const issue of issues) {
          const key = issue.problem;
          if (!issueMap.has(key)) issueMap.set(key, []);
          issueMap.get(key)!.push(a.url);
        }
      }
    }
    crossPageIssues = Array.from(issueMap.entries())
      .map(([problem, pages]) => ({ problem, count: pages.length, pages: pages.slice(0, 5) }))
      .filter(i => i.count > 1) // Only show issues affecting 2+ pages
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  return NextResponse.json({
    ...crawlJob,
    urls: JSON.parse(crawlJob.urls),
    analyses,
    siteHealth: {
      avgScore,
      minScore,
      maxScore,
      totalPages: crawlJob.totalUrls,
      analyzedPages: analyses.length,
      crossPageIssues,
    },
  });
}

// PATCH — update crawl job (mark URL as completed)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { completedUrls, avgScore, status } = await req.json();

  const data: any = {};
  if (completedUrls !== undefined) data.completedUrls = completedUrls;
  if (avgScore !== undefined) data.avgScore = avgScore;
  if (status) data.status = status;

  await prisma.crawlJob.update({ where: { id: params.id }, data });

  return NextResponse.json({ updated: true });
}
