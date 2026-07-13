import { prisma } from './prisma';
import { getCache, setCache } from './cache';

// Full aggregate of the internal benchmark dataset (real sites we bulk-analyzed).
// Powers the public /data report. Cached 6h so the page never full-scans the
// table on every request. The numbers are real — do not hardcode them.

export interface BenchmarkReport {
  count: number;
  avgScore: number;            // 1 decimal
  avgTtfb: number | null;      // ms
  categoryAverages: Record<string, number>; // 1 decimal per category
  gradeDistribution: Record<string, number>;
  buckets: { label: string; count: number }[]; // score histogram, 10-wide
}

const CACHE_KEY = 'benchmark-report';
const CACHE_TTL = 21600; // 6 hours

export async function getBenchmarkReport(): Promise<BenchmarkReport | null> {
  const cached = await getCache<BenchmarkReport>(CACHE_KEY);
  if (cached) return cached;

  const rows = await prisma.benchmark.findMany({
    select: { score: true, categories: true, ttfb: true, secGrade: true },
  });
  const count = rows.length;
  if (count === 0) return null;

  const catTotals: Record<string, { sum: number; n: number }> = {};
  const grades: Record<string, number> = {};
  const bucketCounts = new Array(10).fill(0); // 0-9 .. 90-100
  let scoreSum = 0;
  let ttfbSum = 0;
  let ttfbN = 0;

  for (const r of rows) {
    scoreSum += r.score;
    bucketCounts[Math.min(9, Math.max(0, Math.floor(r.score / 10)))]++;
    if (r.secGrade) grades[r.secGrade] = (grades[r.secGrade] || 0) + 1;
    if (typeof r.ttfb === 'number') { ttfbSum += r.ttfb; ttfbN++; }
    if (r.categories) {
      try {
        const c = JSON.parse(r.categories);
        for (const [k, v] of Object.entries(c)) {
          if (typeof v === 'number') {
            catTotals[k] = catTotals[k] || { sum: 0, n: 0 };
            catTotals[k].sum += v;
            catTotals[k].n++;
          }
        }
      } catch { /* skip malformed row */ }
    }
  }

  const round1 = (n: number) => Math.round(n * 10) / 10;

  const report: BenchmarkReport = {
    count,
    avgScore: round1(scoreSum / count),
    avgTtfb: ttfbN ? Math.round(ttfbSum / ttfbN) : null,
    categoryAverages: Object.fromEntries(
      Object.entries(catTotals).map(([k, v]) => [k, round1(v.sum / v.n)])
    ),
    gradeDistribution: grades,
    buckets: bucketCounts.map((c, i) => ({
      label: i === 9 ? '90–100' : `${i * 10}–${i * 10 + 9}`,
      count: c,
    })),
  };

  await setCache(CACHE_KEY, report, CACHE_TTL);
  return report;
}
