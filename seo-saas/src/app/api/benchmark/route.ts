import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCache, setCache } from '@/lib/cache';

// Must run at request time (reads the DB) — otherwise Next prerenders it static
// at build with an empty dataset and serves count:0 forever.
export const dynamic = 'force-dynamic';

// Public: the honest "global average" score, computed from our internal
// benchmark dataset. Cached 30 min. Consumed by the report's benchmark badge.
export async function GET() {
  try {
    const cached = await getCache<{ avgScore: number; count: number }>('benchmark-avg');
    if (cached) return NextResponse.json(cached);

    const agg = await prisma.benchmark.aggregate({ _avg: { score: true }, _count: true });
    const data = { avgScore: Math.round(agg._avg.score || 60), count: agg._count };
    await setCache('benchmark-avg', data, 1800);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ avgScore: 60, count: 0 });
  }
}
