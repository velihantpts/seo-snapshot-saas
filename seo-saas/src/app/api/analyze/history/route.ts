import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  const analyses = await prisma.analysis.findMany({
    where: { url: { contains: url } },
    orderBy: { createdAt: 'asc' },
    take: 20,
    select: { score: true, createdAt: true, id: true },
  });

  const history = analyses.map(a => ({
    id: a.id,
    score: a.score,
    date: a.createdAt.toISOString().slice(5, 10), // MM-DD
  }));

  return NextResponse.json({ history, count: analyses.length });
}
