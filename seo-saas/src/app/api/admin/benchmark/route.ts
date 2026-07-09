import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/admin-auth';
import { analyzeURL } from '@/lib/seo-analyzer';
import { validatePublicURL } from '@/lib/ssrf-protection';
import { logger } from '@/lib/logger';

export const maxDuration = 300;

async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  return verifyAdminToken(token, process.env.NEXTAUTH_SECRET || '');
}

// Run tasks with a concurrency cap so we never hammer our box or the targets.
async function pool<T>(items: T[], limit: number, fn: (item: T) => Promise<void>) {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      await fn(items[idx]);
    }
  });
  await Promise.all(workers);
}

// POST — analyze a chunk of URLs (light mode) and store them as private
// benchmark rows. Call repeatedly with batches of ~20-40 URLs.
export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const urls: string[] = Array.isArray(body.urls) ? body.urls.slice(0, 50) : [];
  if (urls.length === 0) return NextResponse.json({ error: 'urls[] required' }, { status: 400 });

  let done = 0, failed = 0, skipped = 0;

  await pool(urls, 4, async (raw) => {
    const check = await validatePublicURL(raw);
    if (!check.valid || !check.url) { skipped++; return; }
    const url = check.url.toString();
    try {
      const r: any = await analyzeURL(url, { light: true });
      await prisma.benchmark.upsert({
        where: { url },
        create: { url, score: r.score, categories: JSON.stringify(r.categoryScores || {}), ttfb: r.fetchTime ?? null, secGrade: r.security?.grade ?? null },
        update: { score: r.score, categories: JSON.stringify(r.categoryScores || {}), ttfb: r.fetchTime ?? null, secGrade: r.security?.grade ?? null, createdAt: new Date() },
      });
      done++;
    } catch (e) {
      failed++;
    }
  });

  logger.info('benchmark.batch', { requested: urls.length, done, failed, skipped });
  const total = await prisma.benchmark.count();
  return NextResponse.json({ done, failed, skipped, total });
}

// GET — aggregate the benchmark dataset into honest averages.
export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await prisma.benchmark.findMany({ select: { score: true, categories: true, ttfb: true, secGrade: true } });
  const count = rows.length;
  if (count === 0) return NextResponse.json({ count: 0 });

  const avgScore = Math.round(rows.reduce((s, r) => s + r.score, 0) / count);

  const catTotals: Record<string, { sum: number; n: number }> = {};
  const grades: Record<string, number> = {};
  let ttfbSum = 0, ttfbN = 0;
  for (const r of rows) {
    if (r.secGrade) grades[r.secGrade] = (grades[r.secGrade] || 0) + 1;
    if (typeof r.ttfb === 'number') { ttfbSum += r.ttfb; ttfbN++; }
    if (r.categories) {
      try {
        const c = JSON.parse(r.categories);
        for (const [k, v] of Object.entries(c)) {
          if (typeof v === 'number') {
            catTotals[k] = catTotals[k] || { sum: 0, n: 0 };
            catTotals[k].sum += v; catTotals[k].n++;
          }
        }
      } catch { /* ignore */ }
    }
  }
  const categoryAverages = Object.fromEntries(
    Object.entries(catTotals).map(([k, v]) => [k, Math.round(v.sum / v.n)])
  );

  return NextResponse.json({
    count,
    avgScore,
    avgTtfb: ttfbN ? Math.round(ttfbSum / ttfbN) : null,
    categoryAverages,
    gradeDistribution: grades,
  });
}
