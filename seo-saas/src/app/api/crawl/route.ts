import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateTargetURL } from '@/lib/ssrf-protection';
import { logger } from '@/lib/logger';
import { crawlQueue } from '@/lib/queue';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Sign in required for site crawl' }, { status: 401 });

  const userId = session.user.id;
  const plan = session.user.plan || 'free';
  const isPro = plan === 'pro_monthly' || plan === 'pro_lifetime' || plan === 'pro';

  if (!isPro) {
    return NextResponse.json({ error: 'Site crawl requires a Pro plan. Upgrade to analyze entire sites.' }, { status: 403 });
  }

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

  const validation = validateTargetURL(url);
  if (!validation.valid || !validation.url) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const parsedUrl = validation.url;
  const domain = parsedUrl.hostname;

  // Check daily crawl limit (5 per day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCrawls = await prisma.crawlJob.count({
    where: { userId, createdAt: { gte: today } },
  });
  if (todayCrawls >= 5) {
    return NextResponse.json({ error: 'Daily crawl limit reached (5/day). Try again tomorrow.' }, { status: 429 });
  }

  // Fetch sitemap.xml to get URL list
  let urls: string[] = [];
  try {
    // Try sitemap.xml first
    const smRes = await fetch(`${parsedUrl.origin}/sitemap.xml`, { signal: AbortSignal.timeout(8000) });
    if (smRes.ok) {
      const smXml = await smRes.text();
      const $ = cheerio.load(smXml, { xmlMode: true });

      // Check if it's a sitemap index
      const sitemapLocs = $('sitemap > loc').map((_, el) => $(el).text().trim()).get();
      if (sitemapLocs.length > 0) {
        // Sitemap index — fetch first child sitemap
        try {
          const childRes = await fetch(sitemapLocs[0], { signal: AbortSignal.timeout(8000) });
          if (childRes.ok) {
            const childXml = await childRes.text();
            const child$ = cheerio.load(childXml, { xmlMode: true });
            child$('url > loc').each((_, el) => { urls.push(child$(el).text().trim()); });
          }
        } catch (e) { if (typeof console !== "undefined") console.error(e); }
      } else {
        // Regular sitemap
        $('url > loc').each((_, el) => { urls.push($(el).text().trim()); });
      }
    }
  } catch (e) { if (typeof console !== "undefined") console.error(e); }

  // If no sitemap, use the homepage as the only URL
  if (urls.length === 0) {
    urls = [parsedUrl.toString()];
  }

  // Cap at 100 URLs for Pro
  const maxUrls = 100;
  urls = urls.slice(0, maxUrls);

  // Filter to same domain only
  urls = urls.filter(u => {
    try { return new URL(u).hostname === domain; } catch { return false; }
  });

  if (urls.length === 0) {
    urls = [parsedUrl.toString()];
  }

  // Create crawl job
  const crawlJob = await prisma.crawlJob.create({
    data: {
      userId,
      domain,
      status: 'running',
      totalUrls: urls.length,
      completedUrls: 0,
      urls: JSON.stringify(urls),
    },
  });

  // Add to BullMQ queue instead of processing synchronously
  await crawlQueue.add('crawl-site', {
    crawlJobId: crawlJob.id,
    urls,
    userId,
  }, {
    attempts: 2,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 86400 },
    removeOnFail: { age: 604800 },
  });

  logger.info('crawl.queued', { userId, domain, totalUrls: urls.length, crawlJobId: crawlJob.id });

  return NextResponse.json({
    id: crawlJob.id,
    domain,
    totalUrls: urls.length,
    status: 'queued',
  });
}

// GET — list user's crawl jobs
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const userId = session.user.id;
  const crawlJobs = await prisma.crawlJob.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true, domain: true, status: true,
      totalUrls: true, completedUrls: true, avgScore: true,
      createdAt: true,
    },
  });

  return NextResponse.json(crawlJobs);
}
