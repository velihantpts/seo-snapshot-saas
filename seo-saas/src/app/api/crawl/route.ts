import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validatePublicURL } from '@/lib/ssrf-protection';
import { logger } from '@/lib/logger';
import { runCrawlJob } from '@/lib/crawler/run-crawl-job';

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

  // DNS-aware validation (catches rebinding on the submitted domain too)
  const validation = await validatePublicURL(url);
  if (!validation.valid || !validation.url) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }
  const parsedUrl = validation.url;
  const domain = parsedUrl.hostname;

  // Daily crawl limit (5/day). Allowlisted test users get a high cap via env
  // (CRAWL_UNLIMITED_EMAILS=a@x.com,b@y.com) so QA/benchmark runs aren't blocked.
  const DEFAULT_CRAWL_LIMIT = 5;
  const HIGH_CRAWL_LIMIT = 1000;
  const allowlist = (process.env.CRAWL_UNLIMITED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const userEmail = (session.user.email || '').toLowerCase();
  const dailyLimit = userEmail && allowlist.includes(userEmail) ? HIGH_CRAWL_LIMIT : DEFAULT_CRAWL_LIMIT;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCrawls = await prisma.crawlJob.count({ where: { userId, createdAt: { gte: today } } });
  if (todayCrawls >= dailyLimit) {
    return NextResponse.json({ error: `Daily crawl limit reached (${dailyLimit}/day). Try again tomorrow.` }, { status: 429 });
  }

  // Create the job, then run a link-following deep crawl in the background.
  const crawlJob = await prisma.crawlJob.create({
    data: { userId, domain, status: 'running', totalUrls: 0, completedUrls: 0, urls: '[]' },
  });

  // Fire-and-forget: respond immediately; the crawl continues in the long-lived
  // server process (the BullMQ worker isn't deployed). /crawl/[id] polls status.
  runCrawlJob(crawlJob.id, parsedUrl.toString(), userId).catch((e) =>
    logger.error('crawl.dispatch_failed', { crawlJobId: crawlJob.id, error: (e as Error)?.message })
  );

  logger.info('crawl.started', { userId, domain, crawlJobId: crawlJob.id });
  return NextResponse.json({ id: crawlJob.id, domain, status: 'running' });
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
