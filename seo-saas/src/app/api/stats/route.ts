import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public stats for social proof
export async function GET() {
  const totalAnalyses = await prisma.analysis.count();
  const avgScore = await prisma.analysis.aggregate({ _avg: { score: true } });

  return NextResponse.json({
    totalAnalyses,
    avgScore: Math.round(avgScore._avg.score || 58),
  });
}
