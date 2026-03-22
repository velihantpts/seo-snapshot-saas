import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'csv';
  const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: { url: true, score: true, issues: true, createdAt: true },
  });

  if (format === 'json') {
    return NextResponse.json(analyses.map(a => ({
      url: a.url,
      score: a.score,
      issues: JSON.parse(a.issues).length,
      date: a.createdAt.toISOString(),
    })));
  }

  // CSV format
  const header = 'URL,Score,Issues,Date\n';
  const rows = analyses.map(a => {
    const issueCount = JSON.parse(a.issues).length;
    const date = a.createdAt.toISOString().split('T')[0];
    return `"${a.url}",${a.score},${issueCount},${date}`;
  }).join('\n');

  return new Response(header + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="seo-analyses-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
