import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const crawlJob = await prisma.crawlJob.findUnique({
    where: { id: params.id },
    include: { analyses: { select: { url: true, score: true, issues: true, createdAt: true } } },
  });

  if (!crawlJob || crawlJob.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const header = 'URL,Score,Issues,Critical,Warnings,Date\n';
  const rows = crawlJob.analyses.map(a => {
    const issues = JSON.parse(a.issues);
    const critical = issues.filter((i: any) => i.severity === 'critical').length;
    const warnings = issues.filter((i: any) => i.severity === 'warning').length;
    const date = a.createdAt.toISOString().split('T')[0];
    return `"${a.url}",${a.score},${issues.length},${critical},${warnings},${date}`;
  }).join('\n');

  return new Response(header + rows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="crawl-${crawlJob.domain}-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
