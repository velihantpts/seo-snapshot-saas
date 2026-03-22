import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { url: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const decodedUrl = decodeURIComponent(params.url);

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id, url: decodedUrl },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: { id: true, score: true, createdAt: true },
  });

  if (analyses.length < 2) {
    return NextResponse.json({ history: analyses, comparison: null });
  }

  const latest = analyses[0];
  const previous = analyses[1];
  const diff = latest.score - previous.score;

  return NextResponse.json({
    history: analyses.reverse(),
    comparison: {
      latest: { score: latest.score, date: latest.createdAt },
      previous: { score: previous.score, date: previous.createdAt },
      diff,
      direction: diff > 0 ? 'improved' : diff < 0 ? 'dropped' : 'unchanged',
    },
  });
}
